from rest_framework import serializers
from .models import Pin, Supplier

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



    