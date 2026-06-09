from products.models import Product
from django.conf import settings 
from decimal import Decimal #creates deciaml obj
from .models import Cart as CartModel, CartItem

class Cart:
    def __init__(self,request):
        #initialzes the cart
        self.user = request.user
        self.cart, created = CartModel.objects.get_or_create(user=self.user)
    
    def add(self, product, quantity=1, override_quantity=False):
        item, created = CartItem.objects.get_or_create(
            cart=self.cart,
            product=product,
            defaults={'quantity': 0}
        )
        if override_quantity:
            item.quantity = quantity
        else:
            item.quantity += quantity
        item.save()

    def remove(self, product, quantity):
        try:
            item = CartItem.objects.get(cart=self.cart, product=product)
            item.quantity -= quantity
            if item.quantity <= 0:
                item.delete()
            else:
                item.save()
        except CartItem.DoesNotExist:
            pass

    def __len__(self):
        return sum(item.quantity for item in self.cart.items.all())

    def get_total_price(self):
        return sum(
            Decimal(str(item.product.price)) * item.quantity
            for item in self.cart.items.select_related('product')
        )

    def __iter__(self):
        for item in self.cart.items.select_related('product'):
            yield {
                'product':     item.product,
                'quantity':    item.quantity,
                'price':       Decimal(str(item.product.price)),
                'total_price': item.total_price,
            }
