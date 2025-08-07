


from platformuser.models import PatientUser

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