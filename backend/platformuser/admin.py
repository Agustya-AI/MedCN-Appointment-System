from django.contrib import admin

# Register your models here.
from .models import PatientUser

admin.site.register(PatientUser)

# admin.site.register(Doctor)
# admin.site.register(AvailabilitySlot)
# admin.site.register(Booking)