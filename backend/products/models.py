from django.db import models
from django.contrib.postgres.indexes import GinIndex


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
    stock = models.PositiveIntegerField() # this may not be neede as available filed is used
    available = models.BooleanField(default=True)
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

    def __str__(self):
        return self.name


