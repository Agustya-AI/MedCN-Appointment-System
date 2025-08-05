from practiceapp.models import PractionerUser, PractionerRegistry, PracticeRegistry, AppointmentType, AvailabilitySlot
from django.core.exceptions import ObjectDoesNotExist
from uuid import uuid4
from datetime import time
from django.db import models
import uuid

def register_user(name, email, password):
    try:
        # Check if email already exists
        if PractionerUser.objects.filter(email=email).exists():
            return {"message": "Email already exists"}
            
        practice_user = PractionerUser.objects.create(
            name=name,
            email=email,
            password=password
        )
        practice_user.save()
        return practice_user
    except:
        return {"message": "Something went wrong"}
    
def login_user(email, password):
    try:
        token = str(uuid4())
        practice_user = PractionerUser.objects.get(email=email, password=password)
        practice_user.token = token
        practice_user.save()
        return {"token": token}
    except Exception as e:
        return str(e)
    
    
def get_user_details(token):
    try:
        practice_user = PractionerUser.objects.filter(token=token).first()
        if not practice_user:
            raise Exception("User not found")
        return practice_user
    except Exception as e:
        raise Exception(str(e))
    
def get_practice_details(user_token: str):
    try:
        # First get the user from token
        practice_user = PractionerUser.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("User not found")
            
        # Then get the practice owned by this user
        practice = PracticeRegistry.objects.filter(practice_owner=practice_user).first()
        if not practice:
            # Fallback to old method using practice_associated_with
            practice = PracticeRegistry.objects.filter(practice_associated_with=user_token).first()
            if not practice:
                raise Exception("Practice not found")
        
        return {
            "practice_uuid": str(practice.practice_uuid),
            "practice_name": practice.practice_name,
            "phone_number": practice.phone_number,
            "practice_website": practice.practice_website,
            "practice_accrediation": practice.practice_accrediation,
            "social_media_links": practice.social_media_links,
            "about_practice": practice.about_practice,
            "facilities": practice.facilities,
            "wheel_chair_access": practice.wheel_chair_access,
            "opening_hours": practice.opening_hours,
            "practice_location": practice.practice_location,
        }
    except Exception as e:
        raise Exception(str(e))
    
def add_practice_details(user_token: str, practice_details: dict):
    try:
        practice_user = PractionerUser.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("User not found")
        
        # Create practice with all fields from practice_details
        create_fields = {"practice_owner": practice_user}
        for field, value in practice_details.items():
            if hasattr(PracticeRegistry, field):
                create_fields[field] = value
                
        practice = PracticeRegistry.objects.create(**create_fields)
        
        return {
            "message": "Practice created successfully",
            "practice_uuid": str(practice.practice_uuid)
        }
    except Exception as e:
        raise Exception(str(e))

def edit_practice_details(user_token: str, practice_details: dict):
    try:
        # First get the user from token
        practice_user = PractionerUser.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("User not found")
            
        # Then get the practice owned by this user
        practice = PracticeRegistry.objects.filter(practice_owner=practice_user).first()
        if not practice:
            # Fallback to old method
            practice = PracticeRegistry.objects.filter(practice_associated_with=user_token).first()
            if not practice:
                raise Exception("Practice not found")
        
        # Update fields dynamically
        for field, value in practice_details.items():
            if hasattr(practice, field):
                setattr(practice, field, value)
        
        practice.save()
        return {"message": "Practice updated successfully"}
    except Exception as e:
        raise Exception(str(e))


def get_user_practice(user_token: str):
    """Helper function to get practice for a user"""
    try:
        practice_user = PractionerUser.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("User not found")
            
        practice = PracticeRegistry.objects.filter(practice_owner=practice_user).first()
        if not practice:
            # Fallback to old method
            practice = PracticeRegistry.objects.filter(practice_associated_with=user_token).first()
            if not practice:
                raise Exception("Practice not found")
        
        return practice
    except Exception as e:
        raise Exception(str(e))


# Practitioner Management Functions

def add_practitioner(user_token: str, practitioner_data: dict):
    """Add a new practitioner to the practice"""
    try:
        practice = get_user_practice(user_token)
        
        # Create practitioner with dynamic fields
        practitioner = PractionerRegistry(practioner_belong_to=practice)
        
        # Set fields dynamically
        for field, value in practitioner_data.items():
            if hasattr(practitioner, field) and field not in ['id', 'practitioner_uuid', 'practioner_belong_to']:
                setattr(practitioner, field, value)
        
        practitioner.save()
        
        return {
            "practitioner_uuid": str(practitioner.practitioner_uuid),
            "display_name": practitioner.display_name,
            "profession": practitioner.profession,
            "message": "Practitioner added successfully"
        }
    except Exception as e:
        raise Exception(str(e))


def edit_practitioner(user_token: str, practitioner_uuid: str, practitioner_data: dict):
    """Edit practitioner details"""
    try:
        practice = get_user_practice(user_token)
        
        practitioner = PractionerRegistry.objects.filter(
            practitioner_uuid=practitioner_uuid,
            practioner_belong_to=practice
        ).first()
        
        if not practitioner:
            raise Exception("Practitioner not found")
        
        # Update fields dynamically
        for field, value in practitioner_data.items():
            if hasattr(practitioner, field) and field not in ['id', 'practitioner_uuid', 'practioner_belong_to']:
                setattr(practitioner, field, value)
        
        practitioner.save()
        
        return {"message": "Practitioner updated successfully"}
    except Exception as e:
        raise Exception(str(e))


def delete_practitioner(user_token: str, practitioner_uuid: str):
    """Delete a practitioner (soft delete by setting is_active to False)"""
    try:
        practice = get_user_practice(user_token)
        
        practitioner = PractionerRegistry.objects.filter(
            practitioner_uuid=practitioner_uuid,
            practioner_belong_to=practice
        ).first()
        
        if not practitioner:
            raise Exception("Practitioner not found")
        
        practitioner.is_active = False
        practitioner.save()
        
        return {"message": "Practitioner deleted successfully"}
    except Exception as e:
        raise Exception(str(e))


def get_all_practitioners(user_token: str):
    """Get all practitioners for a practice"""
    try:
        practice = get_user_practice(user_token)
        
        practitioners = PractionerRegistry.objects.filter(
            practioner_belong_to=practice,
            is_active=True
        )
        
        practitioners_list = []
        for practitioner in practitioners:
            practitioners_list.append({
                "practitioner_uuid": str(practitioner.practitioner_uuid),
                "display_name": practitioner.display_name,
                "profession": practitioner.profession,
                "qualifications": practitioner.qualifications,
                "education": practitioner.education,
                "gender": practitioner.gender,
                "languages_spoken": practitioner.languages_spoken,
                "professional_statement": practitioner.professional_statement,
                "professional_areas_of_interest": practitioner.professional_areas_of_interest,
                "link_to_best_practice": practitioner.link_to_best_practice,
                "appointments_count": practitioner.appointments.count(),
                "is_active": practitioner.is_active
            })
        
        return practitioners_list
    except Exception as e:
        raise Exception(str(e))


def edit_practitioner_appointments(user_token: str, practitioner_uuid: str, appointment_uuids: list):
    """Edit appointments assigned to a practitioner"""
    try:
        practice = get_user_practice(user_token)
        
        practitioner = PractionerRegistry.objects.filter(
            practitioner_uuid=practitioner_uuid,
            practioner_belong_to=practice
        ).first()
        
        if not practitioner:
            raise Exception("Practitioner not found")
        
        # Get appointments by their UUIDs
        appointments = AppointmentType.objects.filter(appointment_uuid__in=appointment_uuids)
        
        # Clear existing appointments and set new ones
        practitioner.appointments.clear()
        practitioner.appointments.set(appointments)
        
        return {
            "message": "Practitioner appointments updated successfully",
            "appointments_assigned": len(appointments)
        }
    except Exception as e:
        raise Exception(str(e))


def get_all_appointments(user_token: str):
    """Get all available appointments"""
    try:
        # Verify user exists
        practice_user = PractionerUser.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("User not found")
        
        appointments = AppointmentType.objects.filter(is_appointment_enabled=True)
        
        appointments_list = []
        for appointment in appointments:
            appointment_dict = {}
            # Dynamically add all fields from the model
            for field in appointment._meta.fields:
                field_name = field.name
                field_value = getattr(appointment, field_name)
                
                # Convert UUID fields to string
                if isinstance(field_value, uuid.UUID):
                    field_value = str(field_value)
                    
                appointment_dict[field_name] = field_value
                
            appointments_list.append(appointment_dict)
        
        return appointments_list
    except Exception as e:
        raise Exception(str(e))


def create_appointment_type(user_token: str, appointment_data: dict):
    """Create a new AppointmentType type"""
    try:
        # Verify user exists
        practice_user = PractionerUser.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("User not found")
        
        appointment_type = AppointmentType()
        
        # Set fields dynamically
        for field, value in appointment_data.items():
            if hasattr(appointment_type, field) and field not in ['id', 'appointment_uuid']:
                setattr(appointment_type, field, value)
        
        appointment_type.save()
        
        return {
            "appointment_uuid": str(appointment_type.appointment_uuid),
            "type_of_consultation": appointment_type.type_of_consultation,
            "message": "AppointmentType type created successfully"
        }
    except Exception as e:
        print(str(e))
        raise Exception(str(e))


# Availability Slot Management Functions

def get_practitioner_availability_slots(user_token: str, practitioner_uuid: str):
    """Get all availability slots for a specific practitioner"""
    try:
        practice = get_user_practice(user_token)
        
        practitioner = PractionerRegistry.objects.filter(
            practitioner_uuid=practitioner_uuid,
            practioner_belong_to=practice
        ).first()
        
        if not practitioner:
            raise Exception("Practitioner not found")
        
        availability_slots = AvailabilitySlot.objects.filter(
            practitioner=practitioner,
            is_active=True
        ).order_by('day_of_week', 'start_time')
        
        slots_list = []
        for slot in availability_slots:
            slots_list.append({
                "availability_uuid": str(slot.availability_uuid),
                "day_of_week": slot.day_of_week,
                "day_name": slot.get_day_of_week_display(),
                "start_time": slot.start_time.strftime('%H:%M'),
                "end_time": slot.end_time.strftime('%H:%M'),
                "is_active": slot.is_active,
                "created_at": slot.created_at.isoformat(),
                "updated_at": slot.updated_at.isoformat()
            })
        
        return {
            "practitioner_name": practitioner.display_name,
            "practitioner_uuid": str(practitioner.practitioner_uuid),
            "availability_slots": slots_list
        }
    except Exception as e:
        raise Exception(str(e))


def add_availability_slot(user_token: str, practitioner_uuid: str, slot_data: dict):
    """Add a new availability slot for a practitioner"""
    try:
        practice = get_user_practice(user_token)
        
        practitioner = PractionerRegistry.objects.filter(
            practitioner_uuid=practitioner_uuid,
            practioner_belong_to=practice
        ).first()
        
        if not practitioner:
            raise Exception("Practitioner not found")
        
        # Parse time strings
        start_time = time.fromisoformat(slot_data.get('start_time'))
        end_time = time.fromisoformat(slot_data.get('end_time'))
        
        # Validate times
        if start_time >= end_time:
            raise Exception("Start time must be before end time")
        
        # Check for overlapping slots
        overlapping_slots = AvailabilitySlot.objects.filter(
            practitioner=practitioner,
            day_of_week=slot_data.get('day_of_week'),
            is_active=True
        ).filter(
            models.Q(start_time__lt=end_time) & models.Q(end_time__gt=start_time)
        )
        
        if overlapping_slots.exists():
            raise Exception("This time slot overlaps with an existing availability slot")
        
        availability_slot = AvailabilitySlot.objects.create(
            practitioner=practitioner,
            day_of_week=slot_data.get('day_of_week'),
            start_time=start_time,
            end_time=end_time
        )
        
        return {
            "availability_uuid": str(availability_slot.availability_uuid),
            "day_of_week": availability_slot.day_of_week,
            "day_name": availability_slot.get_day_of_week_display(),
            "start_time": availability_slot.start_time.strftime('%H:%M'),
            "end_time": availability_slot.end_time.strftime('%H:%M'),
            "message": "Availability slot added successfully"
        }
    except Exception as e:
        raise Exception(str(e))


def edit_availability_slot(user_token: str, availability_uuid: str, slot_data: dict):
    """Edit an existing availability slot"""
    try:
        practice = get_user_practice(user_token)
        
        availability_slot = AvailabilitySlot.objects.filter(
            availability_uuid=availability_uuid,
            practitioner__practioner_belong_to=practice
        ).first()
        
        if not availability_slot:
            raise Exception("Availability slot not found")
        
        # Update fields if provided
        if 'start_time' in slot_data:
            availability_slot.start_time = time.fromisoformat(slot_data['start_time'])
        
        if 'end_time' in slot_data:
            availability_slot.end_time = time.fromisoformat(slot_data['end_time'])
        
        if 'day_of_week' in slot_data:
            availability_slot.day_of_week = slot_data['day_of_week']
        
        if 'is_active' in slot_data:
            availability_slot.is_active = slot_data['is_active']
        
        # Validate times
        if availability_slot.start_time >= availability_slot.end_time:
            raise Exception("Start time must be before end time")
        
        # Check for overlapping slots (excluding current slot)
        overlapping_slots = AvailabilitySlot.objects.filter(
            practitioner=availability_slot.practitioner,
            day_of_week=availability_slot.day_of_week,
            is_active=True
        ).exclude(
            availability_uuid=availability_uuid
        ).filter(
            models.Q(start_time__lt=availability_slot.end_time) & 
            models.Q(end_time__gt=availability_slot.start_time)
        )
        
        if overlapping_slots.exists():
            raise Exception("This time slot overlaps with an existing availability slot")
        
        availability_slot.save()
        
        return {
            "availability_uuid": str(availability_slot.availability_uuid),
            "day_of_week": availability_slot.day_of_week,
            "day_name": availability_slot.get_day_of_week_display(),
            "start_time": availability_slot.start_time.strftime('%H:%M'),
            "end_time": availability_slot.end_time.strftime('%H:%M'),
            "is_active": availability_slot.is_active,
            "message": "Availability slot updated successfully"
        }
    except Exception as e:
        raise Exception(str(e))


def delete_availability_slot(user_token: str, availability_uuid: str):
    """Delete an availability slot (soft delete by setting is_active to False)"""
    try:
        practice = get_user_practice(user_token)
        
        availability_slot = AvailabilitySlot.objects.filter(
            availability_uuid=availability_uuid,
            practitioner__practioner_belong_to=practice
        ).first()
        
        if not availability_slot:
            raise Exception("Availability slot not found")
        
        availability_slot.is_active = False
        availability_slot.save()
        
        return {"message": "Availability slot deleted successfully"}
    except Exception as e:
        raise Exception(str(e))


def get_all_practitioners_with_availability(user_token: str):
    """Get all practitioners with their availability slots for the practice"""
    try:
        practice = get_user_practice(user_token)
        
        practitioners = PractionerRegistry.objects.filter(
            practioner_belong_to=practice,
            is_active=True
        ).prefetch_related('availability_slots')
        
        practitioners_list = []
        for practitioner in practitioners:
            availability_slots = []
            for slot in practitioner.availability_slots.filter(is_active=True):
                availability_slots.append({
                    "availability_uuid": str(slot.availability_uuid),
                    "day_of_week": slot.day_of_week,
                    "day_name": slot.get_day_of_week_display(),
                    "start_time": slot.start_time.strftime('%H:%M'),
                    "end_time": slot.end_time.strftime('%H:%M')
                })
            
            practitioners_list.append({
                "practitioner_uuid": str(practitioner.practitioner_uuid),
                "display_name": practitioner.display_name,
                "profession": practitioner.profession,
                "availability_slots": availability_slots
            })
        
        return practitioners_list
    except Exception as e:
        raise Exception(str(e))