from rest_framework import serializers
from .models import Order, OrderItem

class CheckoutSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=50)
    email = serializers.EmailField()

class OrderItemSerializer(serializers.ModelSerializer):
    cost = serializers.DecimalField(source='get_cost', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'price', 'quantity', 'cost']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    grand_total = serializers.DecimalField(source='get_grand_total', max_digits=10, decimal_places=2, read_only=True)
    sub_total = serializers.DecimalField(source='get_sub_total', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'email', 'status', 'created', 'updated', 'discount', 'tax', 'items', 'sub_total', 'grand_total']
