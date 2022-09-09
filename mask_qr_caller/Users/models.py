
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
# Create your models here.

class CustomUser(AbstractUser):
    date_created = models.DateField(null=True, blank=True, auto_now=True)
    mobile_number = models.CharField(max_length=15,null=True, blank=True)
    display_name = models.CharField(max_length=255, null=True, blank=True)
    qr_uuid = models.CharField(max_length=255, null=True, blank=True)
    scan_count = models.IntegerField(default=0)
    called_count = models.IntegerField(default=0)

    objects = UserManager()

    def __str__(self):
        return self.email



class MaskNumber(models.Model):
    cli = models.CharField(max_length=255)


class UserNumberMapping(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    cli = models.ForeignKey(MaskNumber, on_delete=models.CASCADE)

