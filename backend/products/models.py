from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.utils import timezone
from django.core.exceptions import ValidationError


# Create your models here.
class Category (models.Model):
    name=models.CharField (max_length=200)
    slug = models.SlugField(max_length=200,unique=True)

    class Meta:
        ordering = ['name']
        indexes =[
            models.Index(fields=['name'])
        ]
        verbose_name ='category'
        verbose_name_plural = 'categories'
    
    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products',on_delete=models.CASCADE)
    name=models.CharField (max_length=200)
    slug = models.SlugField(max_length=200,unique=True)
    description  = models.TextField(blank = True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=False)  # auto-managed via save()
    deleted_at = models.DateTimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True) # may not be necessary
    image= models.ImageField(
        upload_to='products/%Y/%m/%d',
        blank=True
    )

    class Meta:
        ordering = ['name']
        indexes =[
            models.Index(fields=['name']),
            models.Index(fields=['-created']),
            models.Index(fields=['id','slug']),
            GinIndex(
                fields=['name'],
                name='product_name_trgm_idx',
                opclasses=['gin_trgm_ops'],
            ),
            GinIndex(
                fields=['description'],
                name='product_desc_trgm_idx',
                opclasses=['gin_trgm_ops'],
            ),
        ]

    def save(self, *args, **kwargs):
        # Keep `available` in sync with stock and deletion status automatically
        if self.deleted_at:
            self.available = False
        else:
            self.available = self.stock > 0
        super().save(*args, **kwargs)

    def soft_delete(self):
        """Mark product as deleted. Block if it's in an open order."""
        open_orders = self.order_items.filter(
            order__status='pending',
            status='pending'
        ).exists()
        if open_orders:
            raise ValidationError(
                "Cannot delete a product that is part of an open order."
            )
        self.deleted_at = timezone.now()
        self.available = False
        self.save()

    @property
    def is_deleted(self):
        return self.deleted_at is not None

    def __str__(self):
        return self.name


