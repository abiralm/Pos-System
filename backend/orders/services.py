
from django.db.models import prefetch_related_objects

from products.models import Product
from .models import Order, OrderItem
from django.db import transaction

@transaction.atomic
def create_order_from_cart(cart, customer_name, email, user=None):
    order = Order.objects.create(
        user=user,
        customer_name=customer_name,
        email=email,
        tax=0,
        discount=0
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
            product=product,
            price=product.price,
            quantity=quantity,
            product_name=product.name
        )

    # Prefetch items so callers (checkout view, PDF, email) don't re-query
    prefetch_related_objects([order], 'items')

    return order