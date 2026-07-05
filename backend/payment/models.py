from django.db import models
from orders.models import Order

PAYMENT_METHODS = [
    ('cash','Cash'),
    ('card','Card'),
    #('online','Online') further additions
]

PAYMENT_STATUS = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('failed', 'Failed'),
]

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE,related_name='payments')
    method  = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_id = models.CharField(max_length=255, null=True, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')

    def __str__(self):
        return f'Payment {self.id}-{self.status}'


