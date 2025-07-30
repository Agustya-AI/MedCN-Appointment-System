from django.db import models
from django.utils.translation import gettext_lazy as _


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