from rest_framework import serializers
from .models import Pin, Supplier, Invoice

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            'supplier_id', 
            'supplier_name', 
            'date_created'
        ]
class PinSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(read_only=True)
    class Meta:
        model = Pin
        fields = [
            'supplier',
            'pin_code',
            'is_locked',
        ]
        extra_kwargs = {"pin_code":{"write_only": True}}


class InvoiceUploadSerializer(serializers.ModelSerializer):
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())

    class Meta:
        model = Invoice
        fields = [
            "invoice_id",
            "supplier",
            "invoice_number",
            "submitted_date",
            "amount_due",
            "description",
            "pdf_file",
            "date_created",
            "date_modified",
        ]
        read_only_fields = ["invoice_id", "date_created", "date_modified"]
    