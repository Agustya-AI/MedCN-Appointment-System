from django.db import models
import uuid

# Create your models here.  
# Practice Registry Model



class PractionerUser(models.Model):
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


class PractionerRegistry(models.Model):
    practice_belong_to = models.ForeignKey(PracticeRegistry, on_delete=models.CASCADE)
    practioner_name = models.CharField(max_length=255)
    practioner_email = models.EmailField(max_length=255)
    practioner_phone = models.CharField(max_length=255)
    practioner_address = models.CharField(max_length=255)
    practioner_city = models.CharField(max_length=255)
    practioner_state = models.CharField(max_length=255)
    practioner_zip = models.CharField(max_length=255)
    
    