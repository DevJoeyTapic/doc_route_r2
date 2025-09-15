
from django.contrib import admin
from django.urls import path

from api.views import VerifyPinView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/verify-pin/',VerifyPinView.as_view(), name="verify-pin"),
    
]
