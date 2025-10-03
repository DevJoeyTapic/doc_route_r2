from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include

from api.views import VerifyPinView,InvoiceUploadView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/verify-pin/',VerifyPinView.as_view(), name="verify-pin"),
    path("invoices/upload/", InvoiceUploadView.as_view(), name="invoice-upload"),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)