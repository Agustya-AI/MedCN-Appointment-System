from django.contrib import admin

# Register your models here.

from .models import PractionerUser, PracticeRegistry, PractionerRegistry, AppointmentType, AvailabilitySlot, PracticeMembers

admin.site.register(PractionerUser)
admin.site.register(PractionerRegistry)
admin.site.register(PracticeRegistry)
admin.site.register(AppointmentType)
admin.site.register(AvailabilitySlot)
admin.site.register(PracticeMembers)