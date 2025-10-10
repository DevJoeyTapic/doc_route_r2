from django.urls import path
from .views import VerifyPinView, InvoiceUploadView, CheckInvoiceView, VesselListView


urlpatterns = [
    path('verify-pin/',VerifyPinView.as_view(), name="verify-pin"),
    path("invoices/upload/", InvoiceUploadView.as_view(), name="invoice-upload"),
    path("invoices/check-invoice/", CheckInvoiceView.as_view(), name='check-invoice'),
    path("vessels/", VesselListView.as_view(), name='vessel-list'),
]