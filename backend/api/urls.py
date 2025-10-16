from django.urls import path
from .views import (
    VerifyPinView, 
    InvoiceUploadView, 
    CheckInvoiceView, 
    VesselListView,
    SupplierInvoiceListView,
    UserLoginView
)

urlpatterns = [
    path('verify-pin/',VerifyPinView.as_view(), name="verify-pin"),
    path("invoices/upload/", InvoiceUploadView.as_view(), name="invoice-upload"),
    path("invoices/check-invoice/", CheckInvoiceView.as_view(), name='check-invoice'),
    path("invoices/", SupplierInvoiceListView.as_view(), name='supplier-invoices'),
    path("vessels/", VesselListView.as_view(), name='vessel-list'),

    path('user/login/', UserLoginView.as_view()),
]