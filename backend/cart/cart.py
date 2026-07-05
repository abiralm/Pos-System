from products.models import Product
from django.conf import settings 
from decimal import Decimal
from .models import Cart as CartModel, CartItem

class Cart:
    def __init__(self, request):
        # Initializes the cart and eagerly fetches all items with their products
        self.user = request.user
        self.cart, created = CartModel.objects.get_or_create(user=self.user)
        self._refresh_items()

    def _refresh_items(self):
        """Fetch (or re-fetch) all cart items, joined with their product in one query."""
        self._items = list(self.cart.items.select_related('product').all())

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
        self._refresh_items()  

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
        self._refresh_items() 

    def __len__(self):
        return sum(item.quantity for item in self._items)

    def get_total_price(self):
        return sum(
            Decimal(str(item.product.price)) * item.quantity
            for item in self._items
        )

    def __iter__(self):
        for item in self._items:
            yield {
                'product':     item.product,
                'quantity':    item.quantity,
                'price':       Decimal(str(item.product.price)),
                'total_price': item.total_price,
            }

    def clear_cart(self):
        self.cart.items.all().delete()
        self._refresh_items()