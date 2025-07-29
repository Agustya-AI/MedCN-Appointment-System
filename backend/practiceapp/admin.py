from django.contrib import admin

# Register your models here.

from .models import PractionerUser, PracticeRegistry, PractionerRegistry

admin.site.register(PractionerUser)
admin.site.register(PractionerRegistry)
admin.site.register(PracticeRegistry)