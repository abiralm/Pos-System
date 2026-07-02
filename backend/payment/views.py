from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
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

        if method == 'cash':
            payment = Payment.objects.create(
                order=order,
                method=method,
                amount=order.get_grand_total(),
                status='completed'
            )
            order.status = 'paid'
            order.save()
            return Response({
                "message": "Payment successful (Cash)",
                "payment_id": payment.id,
                "checkout_url": None
            })

        # Stripe session data for Card payment
        success_url = f"{settings.FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{settings.FRONTEND_URL}/payment/cancel"

        session_data = stripe.checkout.Session.create(
            mode='payment',
            client_reference_id=order_id,
            success_url=success_url,
            cancel_url=cancel_url,
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

        return Response({"checkout_url": session_data.url})
        # payment.save()

        # order.status = 'paid'
        # order.save()

        # return Response({
        #     "message": "Payment successful",
        #     "payment_id": payment.id
        # },status=status.HTTP_200_OK)

# def payment_success(request):
#     return HttpResponse("Payment successful! You can close this page.")
@csrf_exempt
def payment_success(request):
    session_id = request.GET.get("session_id")

    if not session_id:
        return JsonResponse({"verified": False, "error": "Missing session_id"}, status=400)

    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except stripe.error.InvalidRequestError:
        return JsonResponse({"verified": False, "error": "Invalid session ID"}, status=400)

    if session.payment_status != "paid":
        return JsonResponse({"verified": False, "error": "Payment not completed"}, status=402)

    try:
        order_id = session.metadata["order_id"]
        order = Order.objects.get(id=order_id)
        payment = order.payments.get(stripe_id=session_id, status="completed")
    except (Order.DoesNotExist, Payment.DoesNotExist):
        # Stripe confirms paid but webhook hasn't updated DB yet
        return JsonResponse({"verified": False, "error": "Payment record not confirmed yet"}, status=202)

    return JsonResponse({
        "verified": True,
        "status": payment.status,
        "order_id": order.id,
        "amount": str(payment.amount),
    })

def payment_cancel(request):
    return HttpResponse("Payment canceled.")