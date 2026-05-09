from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from config import settings
from .serializers import PaymentSerializer
from .models import Payment
from orders.models import Order
import stripe
from django.shortcuts import get_object_or_404

#stripe instance
stripe.api_key = settings.STRIPE_SECRET_KEY
stripe.api_version = settings.STRIPE_API_VERSION


class PaymentView(APIView):
    def post(self,request):
        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_id = serializer.validated_data['order_id']
        method = serializer.validated_data['method']
        order = get_object_or_404(Order, id=order_id)

        if order.status == 'paid':
            return Response({"error": "Already paid"}, status=400)

        if order.payments.filter(status='pending').exists():
            return Response({"error": "A pending payment already exists for this order"}, status=400)            

        #stripe session data
        session_data = stripe.checkout.Session.create(
            mode='payment',
            client_reference_id=order_id,
            success_url='http://localhost:8000/api/payment/success/',
            cancel_url='http://localhost:8000/api/payment/cancel/',
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'unit_amount': int(order.get_grand_total() * 100),
                        'currency': 'usd',
                        'product_data': {
                            'name': f'Order {order.id}',
                        },
                    },
                    'quantity': 1,
                }
            ],
            metadata={'order_id': order.id}
        )
        
        payment = Payment.objects.create(
            order = order,
            method = method,
            amount = order.get_grand_total(),
            status = 'pending',
            stripe_id = session_data.id
        )

        return Response({
            "checkout_url": session_data.url
        })
        # payment.save()

        # order.status = 'paid'
        # order.save()

        # return Response({
        #     "message": "Payment successful",
        #     "payment_id": payment.id
        # },status=status.HTTP_200_OK)

def payment_success(request):
    return HttpResponse("Payment successful! You can close this page.")


def payment_cancel(request):
    return HttpResponse("Payment canceled.")