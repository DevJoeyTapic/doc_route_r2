from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Pin


class VerifyPinView(APIView):
    def post (self,request):
         raw_pin = request.data.get("pin_code")
                
         if not raw_pin:
            return Response(
               {"error":"pin_code is required"},
               status=status.HTTP_400_BAD_REQUEST
            )
        

         # PIN matach lookup 
         for pin in Pin.objects.all():
             if pin.check_pin(raw_pin, ignore_lock=True):
                 if pin.is_locked:
                      return Response(
                           {"error":"Account is locked"}, 
                           status=status.HTTP_403_FORBIDDEN
                     )
                 
                 try:
                     refresh = RefreshToken()
                     access_token = refresh.access_token

                     refresh["supplier_id"] = pin.supplier_id
                     access_token["supplier_id"] = pin.supplier_id
                 except Exception as e:
                     return Response(
                        {"error": f"Token generation failed: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                     )
                 return Response({
                     "message": "PIN verified successfully",
                     "supplier_id": pin.supplier_id,
                     "access_token": str(access_token),
                     "refresh_token": str(refresh),
                  },status=status.HTTP_200_OK)
          
         return Response(
               {"error":"Invalid PIN"}, 
               status=status.HTTP_401_UNAUTHORIZED
            )

          

         

         
        

