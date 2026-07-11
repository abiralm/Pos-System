from django.urls import path
from .views import CheckoutView, generate_order_pdf, OrderListAPIView
app_name ='orders'

urlpatterns = [
    path('', OrderListAPIView.as_view(), name='order_list'),
    path('checkout/', CheckoutView.as_view(), name='cart_detail'),
    path('<int:order_id>/pdf/', generate_order_pdf, name='order_pdf')
]