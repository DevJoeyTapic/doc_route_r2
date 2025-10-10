from rest_framework import serializers
from .models import Pin, Supplier, Invoice, Vessel

# --------------------------
# Supplier Serializer
# --------------------------
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            'supplier_id', 
            'supplier_name', 
            'date_created'
        ]

# --------------------------
# PIN Serializer
# --------------------------
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

# --------------------------
# Invoice Upload Serializer
# --------------------------
class InvoiceUploadSerializer(serializers.ModelSerializer):
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())
    vessel = serializers.PrimaryKeyRelatedField(queryset=Vessel.objects.all(), write_only=True)
    # vessel_name = serializers.CharField(source='vessel.vessel_name', read_only=True)
    class Meta:
        model = Invoice
        fields = [
            "invoice_id",
            "supplier",
            "vessel",
            "invoice_number",
            "submitted_date",
            "amount_due",
            "description",
            "pdf_file",
            "date_created",
            "date_modified",
        ]
        read_only_fields = ["invoice_id", "date_created", "date_modified"]
    