from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
# Create your models here.

class CustomUser(AbstractUser):
	date_created = models.DateField(null=True, blank=True, auto_now=True)
	mobile_number = models.CharField(max_length=15,null=True, blank=True)
	display_name = models.CharField(max_length=255, null=True, blank=True)
	
	objects = UserManager()

	def __str__(self):
		return self.email
