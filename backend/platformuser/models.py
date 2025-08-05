from django.db import models
from django.utils.translation import gettext_lazy as _

import uuid

from practiceapp.models import PractionerRegistry, AppointmentType


class PatientUser(models.Model):
    # Add fields for email, uuid (auto_add), password, first_name, date_of_birth
    # Optional fields Gender, mobile_number
    patient_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(max_length=255)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=255, null=True, blank=True)
    mobile_number = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    token = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.first_name
    
    def delete(self):
        self.is_deleted = True
        self.save()
    
    def save(self, *args, **kwargs):
        self.is_verified = True
        super().save(*args, **kwargs)

class PatientBooking(models.Model):
    patient_booking_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    patient = models.ForeignKey(PatientUser, on_delete=models.CASCADE)
    practitioner = models.ForeignKey(PractionerRegistry, on_delete=models.CASCADE)
    appointment = models.ForeignKey(AppointmentType, on_delete=models.CASCADE)
    booking_date = models.DateField(null=True, blank=True)
    booking_time = models.TimeField(null=True, blank=True)
    booking_status = models.CharField(max_length=255, default="pending")
    booking_notes = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient.first_name} → {self.practitioner.display_name} on {self.booking_date} at {self.booking_time}"


# class Booking(models.Model):
#     """Stores a patient's appointment booking with a doctor."""

#     consultation_type = models.CharField(max_length=100)
#     name = models.CharField(max_length=100)
#     email = models.EmailField()
#     phone_number = models.CharField(max_length=20)
#     message = models.TextField(blank=True)

#     # Relations
#     doctor = models.ForeignKey(
#         Doctor,
#         on_delete=models.CASCADE,
#         related_name="bookings",
#     )
#     slot = models.ForeignKey(
#         AvailabilitySlot,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="bookings",
#     )

#     # Metadata
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.name} → {self.doctor.name} on {self.slot.date if self.slot else 'TBD'}"