# Generated by Django 5.2.4 on 2025-07-30 10:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('platformuser', '0002_availabilityslot_booking_doctor_delete_bookingperson_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='booking',
            name='slot',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='doctor',
        ),
        migrations.DeleteModel(
            name='AvailabilitySlot',
        ),
        migrations.DeleteModel(
            name='Booking',
        ),
        migrations.DeleteModel(
            name='Doctor',
        ),
    ]
