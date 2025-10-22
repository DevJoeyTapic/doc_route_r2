# app/authentication.py
import jwt
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import authentication, exceptions
from .models import Supplier


# ------------------------------------
#  Supplier JWT Authentication (PIN) -
# ----------------------------------=-
class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Access token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        supplier_id = payload.get("supplier_id")
        try:
            supplier = Supplier.objects.get(supplier_id=supplier_id)
        except Supplier.DoesNotExist:
            raise exceptions.AuthenticationFailed("No such supplier")

        return (supplier, None)


# -----------------------------------
#  Django User JWT Authentication   -
# -----------------------------------
class UserJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Access token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        user_id = payload.get("user_id")
        if not user_id:
            return None

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("No such user")

        if user.is_staff:
            raise exceptions.AuthenticationFailed("Staff users are not allowed here")

        return (user, None)

