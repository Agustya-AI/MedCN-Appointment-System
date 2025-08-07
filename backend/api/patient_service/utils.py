


from platformuser.models import PatientUser, PatientFamilyMember

import uuid


def register_patient(fields):
    try:
        # Fields that should not be set during registration
        REMOVE_FIELDS = ["is_active", "is_verified", "is_deleted"]
        
        # Remove protected fields if they exist
        for field in REMOVE_FIELDS:
            fields.pop(field, None)
            
        # Validate required fields
        required_fields = ["email", "password", "first_name", "date_of_birth"]
        for field in required_fields:
            if field not in fields:
                raise ValueError(f"Missing required field: {field}")
                
        # Check if email already exists
        if PatientUser.objects.filter(email=fields["email"]).exists():
            raise ValueError("Email already exists")
            
        # Create and save the patient
        patient = PatientUser.objects.create(**fields)
        patient.save()
        
        return {
            "patient_uuid": str(patient.patient_uuid),
            "email": patient.email,
            "first_name": patient.first_name
        }
        
    except ValueError as e:
        raise Exception(str(e))
    except Exception as e:
        raise Exception("Failed to register patient: " + str(e))

def login_patient(fields):
    try:
        # Validate required fields
        required_fields = ["email", "password"]
        for field in required_fields:
            if field not in fields:
                raise ValueError(f"Missing required field: {field}")

        # Get patient with matching email and password
        try:
            patient = PatientUser.objects.get(
                email=fields["email"], 
                password=fields["password"],
                is_active=True,
                is_deleted=False
            )
        except PatientUser.DoesNotExist:
            raise ValueError("Invalid email or password")

        # Generate and save authentication token
        patient.token = str(uuid.uuid4())
        patient.save()

        return {
            "token": patient.token,
            "patient_uuid": str(patient.patient_uuid),
            "email": patient.email,
            "first_name": patient.first_name
        }

    except ValueError as e:
        raise Exception(str(e))
    except Exception as e:
        raise Exception("Login failed: " + str(e))


def get_family_members(patient_token: str):
    """Retrieve all family members associated with a patient via the patient's auth token."""
    try:
        patient = PatientUser.objects.filter(token=patient_token, is_active=True, is_deleted=False).first()
        if not patient:
            raise Exception("Invalid patient token")

        family_members = patient.patient_family_members.all()
        result = []
        for fm in family_members:
            result.append({
                "patient_family_member_uuid": str(fm.patient_family_member_uuid),
                "first_name": fm.first_name,
                "date_of_birth": str(fm.date_of_birth),
                "gender": fm.gender,
                "relationship": fm.relationship,
            })
        return result
    except Exception as e:
        raise Exception(str(e))


def add_family_member(patient_token: str, member_data: dict):
    """Add a new family member to the given patient (identified by token)."""
    try:
        patient = PatientUser.objects.filter(token=patient_token, is_active=True, is_deleted=False).first()
        if not patient:
            raise Exception("Invalid patient token")

        # Disallow editing of protected fields
        protected_fields = ["patient_family_member_uuid", "id"]
        for field in protected_fields:
            member_data.pop(field, None)

        # Validate required fields
        required_fields = ["first_name", "date_of_birth"]
        for field in required_fields:
            if field not in member_data:
                raise Exception(f"Missing required field: {field}")

        family_member = PatientFamilyMember.objects.create(**member_data)
        family_member.save()

        # Associate with patient
        patient.patient_family_members.add(family_member)

        return {
            "patient_family_member_uuid": str(family_member.patient_family_member_uuid),
            "first_name": family_member.first_name,
            "date_of_birth": str(family_member.date_of_birth),
            "gender": family_member.gender,
            "relationship": family_member.relationship,
        }
    except Exception as e:
        raise Exception(str(e))


def edit_family_member(patient_token: str, family_member_uuid: str, member_data: dict):
    """Edit an existing family member for a patient."""
    try:
        patient = PatientUser.objects.filter(token=patient_token, is_active=True, is_deleted=False).first()
        if not patient:
            raise Exception("Invalid patient token")

        family_member = patient.patient_family_members.filter(patient_family_member_uuid=family_member_uuid).first()
        if not family_member:
            raise Exception("Family member not found")

        # Update dynamic fields except protected
        protected_fields = ["patient_family_member_uuid", "id"]
        for field, value in member_data.items():
            if hasattr(family_member, field) and field not in protected_fields:
                setattr(family_member, field, value)

        family_member.save()
        return {"message": "Family member updated successfully"}
    except Exception as e:
        raise Exception(str(e))


def delete_family_member(user_token: str, family_member_uuid: str):
    """Delete (hard delete) a family member of the patient identified by user_token."""
    try:
        patient = PatientUser.objects.filter(token=user_token, is_active=True, is_deleted=False).first()
        if not patient:
            raise Exception("Invalid user token")

        family_member = patient.patient_family_members.filter(patient_family_member_uuid=family_member_uuid).first()
        if not family_member:
            raise Exception("Family member not found")

        # Remove association first
        patient.patient_family_members.remove(family_member)
        # Delete the record
        family_member.delete()

        return {"message": "Family member deleted successfully"}
    except Exception as e:
        raise Exception(str(e))