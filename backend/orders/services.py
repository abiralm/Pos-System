from backend.products.models import Product

from .models import  Order, OrderItem
from django.db import transaction

@transaction.atomic
def create_order_from_cart(cart,customer_name,email):
    order = Order.objects.create(
        customer_name =  customer_name,
        email= email,
        tax=0,
        discount =0
    )

    for item in cart:

        product = Product.objects.select_for_update().get(pk=item['product'].pk)
        quantity=item['quantity']

        if quantity>product.stock:
            raise ValueError(f"Not enough stock for {product.name}")
        
        product.stock -= quantity
        product.save()

        OrderItem.objects.create(
            order=order,
            product = product,
            price = product.price, #price = item['price'],
            quantity= quantity,
            product_name=item['product'].name 
        )
    
    return order