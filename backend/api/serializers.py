from rest_framework import serializers

class PinverifySerializer(serializers.Serializer):
    user = serializers.CharField()

    
    