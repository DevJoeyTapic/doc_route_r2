# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Pin
from django.contrib.auth.hashers import check_password
import jwt
from django.conf import settings
from datetime import datetime, timedelta, timezone

class VerifyPinView(APIView):
    def post(self, request):
        pin_code = request.data.get("pin_code")

        if not pin_code:
            return Response(
                {"error": "pin_code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            pin = Pin.objects.get()
        except Pin.DoesNotExist:
            pin = None

        # Check all pins
        for p in Pin.objects.all():
            if p.check_pin(pin_code):
                if p.is_locked:
                    return Response(
                        {"error": "Account is locked"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                # Generate JWT
                payload = {
                    "supplier_id": str(p.supplier.supplier_id),
                    "supplier_name": p.supplier.supplier_name,
                    "exp": datetime.now(timezone.utc) + timedelta(hours=1)
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

                return Response({"access_token": token}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid PIN"}, status=status.HTTP_401_UNAUTHORIZED)
