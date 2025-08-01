# Generated by Django 5.2.4 on 2025-07-16 09:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('platformuser', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AvailabilitySlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('is_booked', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Availability Slot',
                'verbose_name_plural': 'Availability Slots',
                'ordering': ['date', 'start_time'],
            },
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('consultation_type', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=20)),
                ('message', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('slot', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bookings', to='platformuser.availabilityslot')),
            ],
        ),
        migrations.CreateModel(
            name='Doctor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('specialty', models.CharField(blank=True, max_length=120)),
                ('phone_number', models.CharField(blank=True, max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.DeleteModel(
            name='BookingPerson',
        ),
        migrations.DeleteModel(
            name='Doctors',
        ),
        migrations.AddField(
            model_name='booking',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='platformuser.doctor'),
        ),
        migrations.AddField(
            model_name='availabilityslot',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='availability_slots', to='platformuser.doctor'),
        ),
        migrations.AlterUniqueTogether(
            name='availabilityslot',
            unique_together={('doctor', 'date', 'start_time', 'end_time')},
        ),
    ]
