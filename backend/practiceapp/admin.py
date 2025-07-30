from django.contrib import admin

# Register your models here.

from .models import PractionerUser, PracticeRegistry, PractionerRegistry, Appointment   

admin.site.register(PractionerUser)
admin.site.register(PractionerRegistry)
admin.site.register(PracticeRegistry)
admin.site.register(Appointment)