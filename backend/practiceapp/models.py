from django.db import models

# Create your models here.


class PracticeRegistry(models.Model):
    name = models.CharField(max_length=255)