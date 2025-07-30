from practiceapp.models import PractionerUser, PractionerRegistry, PracticeRegistry, Appointment
from django.core.exceptions import ObjectDoesNotExist
from uuid import uuid4


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
        practitioner = PractionerRegistry(practice_belong_to=practice)
        
        # Set fields dynamically
        for field, value in practitioner_data.items():
            if hasattr(practitioner, field) and field not in ['id', 'practitioner_uuid', 'practice_belong_to']:
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
            practice_belong_to=practice
        ).first()
        
        if not practitioner:
            raise Exception("Practitioner not found")
        
        # Update fields dynamically
        for field, value in practitioner_data.items():
            if hasattr(practitioner, field) and field not in ['id', 'practitioner_uuid', 'practice_belong_to']:
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
            practice_belong_to=practice
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
            practice_belong_to=practice,
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
            practice_belong_to=practice
        ).first()
        
        if not practitioner:
            raise Exception("Practitioner not found")
        
        # Get appointments by their UUIDs
        appointments = Appointment.objects.filter(appointment_uuid__in=appointment_uuids)
        
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
        
        appointments = Appointment.objects.filter(is_enabled=True)
        
        appointments_list = []
        for appointment in appointments:
            appointments_list.append({
                "appointment_uuid": str(appointment.appointment_uuid),
                "type_of_consultation": appointment.type_of_consultation,
                "patient_type": appointment.patient_type,
                "patient_duration": appointment.patient_duration,
                "is_enabled": appointment.is_enabled
            })
        
        return appointments_list
    except Exception as e:
        raise Exception(str(e))


def create_appointment_type(user_token: str, appointment_data: dict):
    """Create a new appointment type"""
    try:
        # Verify user exists
        practice_user = PractionerUser.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("User not found")
        
        appointment = Appointment()
        
        # Set fields dynamically
        for field, value in appointment_data.items():
            if hasattr(appointment, field) and field not in ['id', 'appointment_uuid']:
                setattr(appointment, field, value)
        
        appointment.save()
        
        return {
            "appointment_uuid": str(appointment.appointment_uuid),
            "type_of_consultation": appointment.type_of_consultation,
            "message": "Appointment type created successfully"
        }
    except Exception as e:
        raise Exception(str(e))