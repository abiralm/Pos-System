from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination

from cart.cart import Cart
from .serializers import CheckoutSerializer, OrderSerializer
from .services import create_order_from_cart

from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from users.permissions import IsAdminOrCashier


class CheckoutView(APIView):
    def post(self,request):
        cart = Cart(request)

        if len(cart)==0:
            return Response({
                'message':'Cart is empty',
            },status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CheckoutSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)

        order = create_order_from_cart(
            cart,
            serializer.validated_data['customer_name'],
            serializer.validated_data['email'],
            user=request.user
        )

        return Response({
            "message": "Order created successfully",
            "order_id": order.id,
            "total": order.get_grand_total()
        },status=status.HTTP_200_OK)

class OrderPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100

class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = OrderPagination

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(user=user).prefetch_related('items')


@api_view(['GET'])
@permission_classes([IsAdminOrCashier])
def generate_order_pdf(request, order_id):
    if request.user.role == 'cashier':
        order = get_object_or_404(
            Order.objects.prefetch_related('items__product'),
            id=order_id,
            user=request.user
        )
    else:
        order = get_object_or_404(
            Order.objects.prefetch_related('items__product'),
            id=order_id
        )

    html = render_to_string('orders/order/pdf.html', {
        'order': order
    })

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename=order_{order.id}.pdf'

    pisa_status = pisa.CreatePDF(html, dest=response)

    if pisa_status.err:
        return HttpResponse('Error generating PDF', status=500)

    return response


