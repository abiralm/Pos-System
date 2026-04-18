from rest_framework import serializers

class CheckoutSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=50)
    email = serializers.EmailField()
