
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Pin, Invoice, Vessel
from .serializers import InvoiceUploadSerializer
from .authentication import JWTAuthentication 


# ---------------------------
# Verify PIN and issue tokens
# ---------------------------
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

# ---------------------------
# Invoice Upload Endpoint
# ---------------------------
class InvoiceUploadView(APIView):
    authentication_classes = [JWTAuthentication]   # ✅ now imported from authentication.py
    parser_classes = [MultiPartParser, FormParser] # ✅ handle file uploads

    def post(self, request):
        supplier = request.user   # ✅ supplier is set by JWTAuthentication
        data = request.data.copy()
        data["supplier"] = supplier.supplier_id     # link invoice to supplier

        serializer = InvoiceUploadSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Invoice uploaded successfully", "invoice": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ---------------------------
# Check Invoice Existence
# ---------------------------
class CheckInvoiceView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        invoice_number = request.query_params.get("invoice_number")

        if not invoice_number:
            return Response(
                {"error": "invoice_number is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        exists = Invoice.objects.filter(invoice_number=invoice_number).exists()

        if exists:
            return Response(
                {"exists": True, "message": "Invoice already exists"},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"exists": False, "message": "Invoice number is available"},
                status=status.HTTP_200_OK
            )
        
# ---------------------------
# Vessel List Endpoint
# ---------------------------
class VesselListView(APIView):
    authentication_classes = [JWTAuthentication]  

    def get(self, request):
        vessels = Vessel.objects.all().order_by("vessel_name")
        data = [
            {"vessel_id": v.vessel_id, "vessel_name": v.vessel_name}
            for v in vessels
        ]
        return Response(data, status=status.HTTP_200_OK)