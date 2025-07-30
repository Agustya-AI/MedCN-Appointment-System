from django.contrib import admin

# Register your models here.

from .models import PractionerUser, PracticeRegistry, PractionerRegistry, Appointment, AvailabilitySlot

admin.site.register(PractionerUser)
admin.site.register(PractionerRegistry)
admin.site.register(PracticeRegistry)
admin.site.register(Appointment)
admin.site.register(AvailabilitySlot)