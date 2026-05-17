from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    ROLES =(
        ('admin','Admin'),
        ('visitor','Visitor'),
    )

    role = models.CharField(max_length=50,choices=ROLES)

    def has_role(self, *roles):
        return self.role in roles