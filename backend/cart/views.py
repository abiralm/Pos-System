from django.shortcuts import get_object_or_404
from products.models import Product
from .cart import Cart
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def add_to_cart(request):
    cart = Cart(request)
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity',1))
    product = get_object_or_404(Product,id=product_id)

    cart.add(product,quantity)
    return Response({
        'message':'Added to cart',
        'cart_total': str(cart.get_total_price()),
        'cart_count': len(cart)
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def remove_from_cart(request):
    cart = Cart(request)
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity'))
    product = get_object_or_404(Product,id=product_id)

    cart.remove(product,quantity)
    return Response({
        'message': 'Product removed from cart',
        'cart_total': str(cart.get_total_price()),
        'cart_count': len(cart)
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def clear_cart(request):
    cart = Cart(request)
    cart.clear_cart()
    return Response({
        'message': 'Cart cleared',
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def view_cart(request):
    cart = Cart(request)
    cart_items=[]
    for item in cart:
        cart_items.append({
            'product_id': item['product'].id,
            'name': item['product'].name,
            'price': str(item['price']),
            'quantity': item['quantity'],
            'total_price': str(item['total_price']),
        })
    return Response({
        'items': cart_items,
        'cart_total': str(cart.get_total_price()),
        'cart_count': len(cart)
    }, status=status.HTTP_200_OK)
