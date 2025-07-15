from django.db import models
from django.utils.text import slugify
from django.utils import timezone
import uuid
# Create your models here.
class BaseModel(models.Model):

    slug = models.SlugField(max_length=100, unique=True, auto_created=True, blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)    

    class Meta:
        abstract = True


    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = f"{self.generate_slug()}-{str(uuid.uuid4())}"

        super().save(*args, **kwargs)

    def generate_slug(self):
        pass

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()