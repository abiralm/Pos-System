from django.db import models
from products.models import Product

STATUS_CHOICES = [
    ('paid','Paid'),
    ('pending','Pending'),
    ('cancelled','Cancelled')
]


class Order( models.Model):
    customer_name= models.CharField(max_length=50)
    email = models.EmailField()
    #may ned to add phone address fields
    status  = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True) 
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ['-created']
        indexes = [
            models.Index(fields=['created'])
        ]
    
    def get_sub_total(self):
        return sum(item.get_cost() for item in self.items.all())
    
    def get_grand_total(self):
        return self.get_sub_total() - self.discount + self.tax
    
    def __str__(self):
        return f'Order {self.id}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order,related_name='items',on_delete=models.CASCADE)
    product =models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    #product_name = models.CharField(max_length=255)  in case product is deleted
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return str(self.id)

    def get_cost(self):
        return self.price * self.quantity

