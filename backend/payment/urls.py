from django.urls import path
from .views import PaymentView, payment_cancel, payment_success
from .webhooks import stripe_webhook

app_name ='payments'


urlpatterns = [
    path('', PaymentView.as_view(), name='payment'),
    path('webhook/',stripe_webhook, name='stripe-webhook'),
    path('success/', payment_success),
    path('cancel/', payment_cancel),
]