from django.urls import path
from .views import cart_detail, cart_items, cart_item_detail

app_name ='cart'

urlpatterns = [
    path('', cart_detail, name='cart_detail'),
    path('items/', cart_items, name='cart_items'),
    path('items/<int:pk>/', cart_item_detail, name='cart_item_detail'),
]