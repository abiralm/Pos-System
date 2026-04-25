from django.urls import path
from .views import PaymentView
from .webhooks import stripe_webhook

app_name ='payments'


urlpatterns = [
    path('pay/', PaymentView.as_view(), name='payment'),
    path('webhook/',stripe_webhook, name='stripe-webhook')
]