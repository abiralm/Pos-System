from django.shortcuts import get_object_or_404
from products.models import Product
from .cart import Cart
from .models import CartItem
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from users.permissions import IsAdmin

@api_view(['GET', 'DELETE'])
@permission_classes([IsAdmin])
def cart_detail(request):
    cart = Cart(request)
    
    if request.method == 'GET':
        cart_items = []
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
        
    elif request.method == 'DELETE':
        cart.clear_cart()
        return Response({
            'message': 'Cart cleared',
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAdmin])
def cart_items(request):
    cart = Cart(request)
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity',1))
    product = get_object_or_404(Product,id=product_id)

    if quantity > product.stock:
        return Response({'error': 'Not enough stock'}, status=400)

    cart.add(product,quantity)
    return Response({
        'message':'Added to cart',
        'cart_total': str(cart.get_total_price()),
        'cart_count': len(cart)
    }, status=status.HTTP_200_OK)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAdmin])
def cart_item_detail(request, pk):
    cart = Cart(request)
    product = get_object_or_404(Product, id=pk)

    if request.method == 'DELETE':
        try:
            item = CartItem.objects.get(cart=cart.cart, product=product)
            item.delete()
            cart._refresh_items()
        except CartItem.DoesNotExist:
            pass
        return Response({
            'message': 'Product removed from cart',
            'cart_total': str(cart.get_total_price()),
            'cart_count': len(cart)
        }, status=status.HTTP_200_OK)
        
    elif request.method == 'PATCH':
        quantity = request.data.get('quantity')
        
        if quantity is None:
            return Response({'error': 'quantity required'}, status=400)
            
        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response({'error': 'quantity must be an integer'}, status=400)
            
        if quantity < 0:
            return Response({'error': 'quantity cannot be negative'}, status=400)
            
        if quantity == 0:
            try:
                item = CartItem.objects.get(cart=cart.cart, product=product)
                item.delete()
                cart._refresh_items()
            except CartItem.DoesNotExist:
                pass
        else:
            if quantity > product.stock:
                return Response({'error': 'Not enough stock'}, status=400)
            cart.add(product, quantity=quantity, override_quantity=True)
            
        return Response({
            'message': 'Cart item updated',
            'cart_total': str(cart.get_total_price()),
            'cart_count': len(cart)
        }, status=status.HTTP_200_OK)
