from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Pin
from django.contrib.auth.models import AnonymousUser

class VerifyPinView(APIView):
    def post (self,request):
        raw_pin = request.data.get("pin_code")
                
        if not raw_pin:
            return Response({"error":"pin_code is required"},status=status.HTTP_400_BAD_REQUEST)

        for pin in Pin.objects.all():
          if pin.is_locked:
             continue
          
          if pin.check_pin(raw_pin):
             pin.failed_attempts = 0
             pin.save() 

             dummy_user = AnonymousUser()
             refresh = RefreshToken.for_user(dummy_user)
             refresh["supplier_id"] = pin.supplier_id
             access_token = str(refresh.access_token)

             return Response({
                "message": "PIN verified successfully",
                "supplier_id": pin.supplier_id,
                "access_token": access_token,
                "refresh_token": str(refresh),
             },status=status.HTTP_200_OK)
          else:
             pin.failed_attempts +=1
             if pin.failed_attempts >=3:
                pin.is_locked = True
             pin.save()
        return Response({"error":"Invalid PIN or account is locked"}, status=status.HTTP_401_UNAUTHORIZED)


