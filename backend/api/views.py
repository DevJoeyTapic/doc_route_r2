
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Pin
from .serializers import SupplierSerializer


class VerifyPinView(APIView):
    def post(self, request):
        raw_pin = request.data.get("pin_code")

        if not raw_pin:
            return Response(
                {"error": "pin_code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        for pin in Pin.objects.select_related('supplier').all(): 
            if pin.check_pin(raw_pin, ignore_lock=True):
                if pin.is_locked:
                    return Response(
                        {"message": "Account is locked"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                try:
                    supplier_id = str(pin.supplier.supplier_id)

                    payload = {
                        "supplier_id": supplier_id,
                        "pin_id": pin.pk,
                        "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
                        "iat": datetime.now(timezone.utc)
                    }
                    access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

                    refresh_payload = {
                        "supplier_id": supplier_id,
                        "pin_id": pin.pk,
                        "exp": datetime.now(timezone.utc) + timedelta(days=7),
                        "iat": datetime.now(timezone.utc)
                    }
                    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")
                except Exception as e:
                    return Response(
                        {"error": f"Token generation failed: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                return Response({
                    "message": "PIN verified successfully",
                    "supplier_id": pin.supplier.supplier_id,
                    "supplier_name": pin.supplier.supplier_name,
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                }, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid PIN"},
            status=status.HTTP_401_UNAUTHORIZED
        )
