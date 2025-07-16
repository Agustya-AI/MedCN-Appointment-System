from django.db import models
from django.utils.translation import gettext_lazy as _

# --------------------------------------------------------------------------------
# Doctor & Availability
# --------------------------------------------------------------------------------
class Doctor(models.Model):
    """Stores basic information about a doctor."""

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    specialty = models.CharField(max_length=120, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class AvailabilitySlot(models.Model):
    """Represents a single available slot for a doctor on a given date/time."""

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="availability_slots",
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Availability Slot")
        verbose_name_plural = _("Availability Slots")
        unique_together = ("doctor", "date", "start_time", "end_time")
        ordering = ["date", "start_time"]

    def __str__(self):
        return f"{self.doctor.name} | {self.date} {self.start_time}-{self.end_time}"


# --------------------------------------------------------------------------------
# Booking (Patient Appointment)
# --------------------------------------------------------------------------------
class Booking(models.Model):
    """Stores a patient's appointment booking with a doctor."""

    consultation_type = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    message = models.TextField(blank=True)

    # Relations
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    slot = models.ForeignKey(
        AvailabilitySlot,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings",
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} → {self.doctor.name} on {self.slot.date if self.slot else 'TBD'}"