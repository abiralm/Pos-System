import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from orders.models import Order
from .tasks import notify_payment 

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(payload,sig_header,settings.STRIPE_WEBHOOK_SECRET)
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)


    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object'] 
        order_id = session['metadata']['order_id']
        order = Order.objects.get(id=order_id)
        
        payment = order.payments.get(stripe_id=session['id'])  # precise lookup
        payment.status = 'completed'
        #payment.stripe_id = session['id']
        payment.save()

        order.status= 'paid'
        order.save()

        #trigger async task
        notify_payment.delay(order_id)

    return HttpResponse(status=200)