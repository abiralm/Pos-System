import stripe
from django.conf import settings
from django.db import transaction
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from orders.models import Order
from .tasks import notify_payment 
from orders.services import complete_order

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(payload,sig_header,settings.STRIPE_WEBHOOK_SECRET)
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object'] 
        order_id = session['metadata']['order_id']

        with transaction.atomic():
            # Lock the row so a concurrent/duplicate delivery has to wait here
            order = Order.objects.select_for_update().get(id=order_id)

            # Idempotency guard: if we already handled this, ack and bail out
            if order.status == 'paid':
                return HttpResponse(status=200)

            payment = order.payments.get(stripe_id=session['id'])
            payment.status = 'completed'
            payment.save()

            order.status = 'paid'
            order.save()
            
            
            complete_order(order)

            # Only fires once, since the second delivery never reaches this point
            notify_payment.delay(order_id)

    return HttpResponse(status=200)