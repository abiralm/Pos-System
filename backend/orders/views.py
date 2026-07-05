from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status

from cart.cart import Cart
from .serializers import CheckoutSerializer
from .services import create_order_from_cart

from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem


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
        cart.clear_cart()

        return Response({
            "message": "Order created successfully",
            "order_id": order.id,
            "total": order.get_grand_total()
        },status=status.HTTP_200_OK)


def generate_order_pdf(request, order_id):
    order = get_object_or_404(Order.objects.prefetch_related('items__product'), id=order_id)

    html = render_to_string('orders/order/pdf.html', {
        'order': order
    })

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename=order_{order.id}.pdf'

    pisa_status = pisa.CreatePDF(html, dest=response)

    if pisa_status.err:
        return HttpResponse('Error generating PDF', status=500)

    return response

