from django.contrib import admin
from Users.models import *
# Register your models here.

admin.site.register(CustomUser)
admin.site.register(MaskNumber)
admin.site.register(UserNumberMapping)