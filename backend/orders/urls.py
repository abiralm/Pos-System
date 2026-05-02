from django.urls import path
from .views import CheckoutView, generate_order_pdf
app_name ='orders'

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='cart_detail'),
    path('<int:order_id>/pdf/', generate_order_pdf, name='order_pdf')
]