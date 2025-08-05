from django.db import models
import uuid
 

class PractionerUser(models.Model):
    practioner_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=True)
    token = models.CharField(max_length=255, null=True, blank=True)
    
    
    def __str__(self) -> str:
        return self.name + " " + self.email


class PracticeRegistry(models.Model):
    # Link to the master user who owns this practice
    practice_owner = models.ForeignKey(PractionerUser, on_delete=models.CASCADE, null=True, blank=True)
    practice_associated_with = models.CharField(max_length=500)  # Keep for backward compatibility
    practice_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    practice_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    practice_website = models.CharField(max_length=255, null=True, blank=True)
    practice_accrediation = models.CharField(max_length=255, null=True, blank=True)
    social_media_links = models.JSONField(null=True, blank=True)
    about_practice = models.TextField(null=True, blank=True)
    facilities = models.JSONField(null=True, blank=True)
    wheel_chair_access = models.BooleanField(null=True, blank=True)
    opening_hours = models.JSONField(null=True, blank=True)
    
    practice_location = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.practice_name

class AppointmentType(models.Model):
    appointment_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    is_appointment_enabled = models.BooleanField(default=True)
    type_of_consultation = models.CharField(max_length=255)
    
    appointment_patient_type = models.CharField(max_length=255)
    appointment_patient_duration = models.CharField(max_length=255)
    appointment_description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.type_of_consultation} - {self.appointment_patient_type}"
    
    
class PractionerRegistry(models.Model):
    practitioner_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    practioner_belong_to = models.ForeignKey(PracticeRegistry, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=255)
    link_to_best_practice = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=50, null=True, blank=True)
    profession = models.CharField(max_length=255)
    qualifications = models.CharField(max_length=255)
    education = models.CharField(max_length=255)
    languages_spoken = models.CharField(max_length=255)
    
    professional_statement = models.TextField(null=True, blank=True)
    professional_areas_of_interest = models.JSONField(null=True, blank=True)
    appointments = models.ManyToManyField(AppointmentType, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.display_name


class AvailabilitySlot(models.Model):
    DAYS_OF_WEEK = [
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
        ('SATURDAY', 'Saturday'),
        ('SUNDAY', 'Sunday'),
    ]
    
    availability_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    practitioner = models.ForeignKey(PractionerRegistry, on_delete=models.CASCADE, related_name='availability_slots')
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['day_of_week', 'start_time']
        # Ensure no overlapping slots for the same practitioner on the same day
        unique_together = ['practitioner', 'day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.practitioner.display_name} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_time >= self.end_time:
            raise ValidationError('Start time must be before end time.')
    
    