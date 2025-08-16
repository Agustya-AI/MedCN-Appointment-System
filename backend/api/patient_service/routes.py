

from fastapi import APIRouter, HTTPException, status, Query
from .utils import (
    register_patient,
    login_patient,
    get_family_members,
    add_family_member,
    edit_family_member,
    delete_family_member,
    get_all_practices,
    get_practice_details,
    get_practice_practitioners,
    get_practioner_availability,
    book_appointment_with_practioner,
    get_patient_details
)
from starlette.concurrency import run_in_threadpool

router = APIRouter(
    tags=["Patient"],
    prefix="/patient"
)

@router.get("/")
async def get_patient_service():
    return {"message": "Patient Service"}



@router.post("/register")
async def register(details: dict):
    try:
        result = await run_in_threadpool(register_patient, details)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login") 
async def login(details: dict):
    try:
        result = await run_in_threadpool(login_patient, details)
        return {"status": "success", "token": result["token"]}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/current-patient-details")
async def get_current_patient_details(patient_token: str = Query(..., description="Patient authentication token")):
    """Get current patient details."""
    try:
        result = await run_in_threadpool(get_patient_details, patient_token)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# ------------------------------
# Family Member Endpoints
# ------------------------------

@router.get("/family-members")
async def list_family_members(patient_token: str = Query(..., description="Patient authentication token")):
    """Get all family members for a patient."""
    try:
        result = await run_in_threadpool(get_family_members, patient_token)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/add-family-member")
async def add_family_member_route(
    member_data: dict,
    patient_token: str = Query(..., description="Patient authentication token")
):
    """Create a new family member for a patient."""
    try:
        result = await run_in_threadpool(add_family_member, patient_token, member_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/edit-family-member")
async def edit_family_member_route(
    member_data: dict,
    family_member_uuid: str = Query(..., description="UUID of the family member to edit"),
    patient_token: str = Query(..., description="Patient authentication token")
):
    """Edit an existing family member."""
    try:
        result = await run_in_threadpool(edit_family_member, patient_token, family_member_uuid, member_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/delete-family-member")
async def delete_family_member_route(
    family_member_uuid: str = Query(..., description="UUID of the family member to delete"),
    user_token: str = Query(..., description="User authentication token of the patient performing deletion")
):
    """Delete a family member from a patient's profile."""
    try:
        result = await run_in_threadpool(delete_family_member, user_token, family_member_uuid)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    
@router.get("/practices")
async def get_practices():
    """Get all practices."""
    try:
        result = await run_in_threadpool(get_all_practices)
        return  result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("/practice/{practice_id}")
async def get_practice(practice_id: int):
    """Get details of a practice."""
    try:
        result = await run_in_threadpool(get_practice_details, practice_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("/practice/{practice_id}/doctors")
async def get_practitioners(practice_id: int):
    """Get all doctors for a practice."""
    try:
        result = await run_in_threadpool(get_practice_practitioners, practice_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("/practice/doctors/{practioner_id}/availability")
async def get_practioner_availability_route(practioner_id: int, date: str):
    """Get all doctors for a practice."""
    try:
        result = await run_in_threadpool(get_practioner_availability, practioner_id, date)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.post("/practice/doctors/{practioner_id}/book-appointment")
async def book_appointment_route(practioner_id: int, appointment_data: dict, patient_token: str = Query(..., description="Patient authentication token")):
    """Book an appointment with a practitioner."""
    try:
        result = await run_in_threadpool(book_appointment_with_practioner, patient_token, practioner_id, appointment_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))