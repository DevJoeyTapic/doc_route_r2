from rest_framework import serializers
from .models import Pin

class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = [
            'supplier_id',
            'pin_code',
            'failed_attempts',
            'is_locked',
        ]
        extra_kwargs = {"pin_code":{"write_only": True}}



    