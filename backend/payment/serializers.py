from rest_framework import serializers

class PaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    method = serializers.ChoiceField(choices=['cash', 'card'])
