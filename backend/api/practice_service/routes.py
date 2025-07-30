

from typing import List
from fastapi import APIRouter, status, HTTPException, Query
from starlette.concurrency import run_in_threadpool
from practiceapp.models import PractionerUser
from .utils import (
    register_user, login_user, get_practice_details, edit_practice_details,
    add_practitioner, edit_practitioner, delete_practitioner, get_all_practitioners,
    edit_practitioner_appointments, get_all_appointments, create_appointment_type
)

router = APIRouter(
    tags=["Practics"],
    prefix="/practice",
)


from pydantic import BaseModel
from typing import Optional, List as PydanticList

class RegisterRequest(BaseModel):
    name: str
    email: str 
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class PractitionerRequest(BaseModel):
    display_name: str
    profession: str
    qualifications: str
    education: str
    languages_spoken: str
    gender: Optional[str] = None
    link_to_best_practice: Optional[str] = None
    professional_statement: Optional[str] = None
    professional_areas_of_interest: Optional[dict] = None

class PractitionerUpdateRequest(BaseModel):
    display_name: Optional[str] = None
    profession: Optional[str] = None
    qualifications: Optional[str] = None
    education: Optional[str] = None
    languages_spoken: Optional[str] = None
    gender: Optional[str] = None
    link_to_best_practice: Optional[str] = None
    professional_statement: Optional[str] = None
    professional_areas_of_interest: Optional[dict] = None
    is_active: Optional[bool] = None

class AppointmentAssignmentRequest(BaseModel):
    appointment_uuids: PydanticList[str]

class AppointmentTypeRequest(BaseModel):
    type_of_consultation: str
    patient_type: str
    patient_duration: str
    is_enabled: Optional[bool] = True

@router.post("/register")
async def practice_register(request: RegisterRequest):
    try:
        practice_user = await run_in_threadpool(register_user, request.name, request.email, request.password)
        return practice_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login") 
async def practice_login(request: LoginRequest):
    try:
        practice_user = await run_in_threadpool(login_user, request.email, request.password)
        return practice_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/current-practice-details")
async def practice_details(user_token: str = Query(..., description="User authentication token")):
    try:
        practice_user = await run_in_threadpool(get_practice_details, user_token)
        return practice_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Current practice not found")
    

@router.put("/edit-practice-details")
async def edit_practice_details_route(user_token: str = Query(..., description="User authentication token"), practice_details: dict = ...):
    try:
        practice_user = await run_in_threadpool(edit_practice_details, user_token, practice_details)
        return practice_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Practitioner Management Routes

@router.post("/add-practitioner")
async def add_practitioner_route(
    request: PractitionerRequest,
    user_token: str = Query(..., description="User authentication token")
):
    """Add a new practitioner (doctor, nurse, etc.) to the practice"""
    try:
        practitioner_data = request.model_dump(exclude_unset=True)
        result = await run_in_threadpool(add_practitioner, user_token, practitioner_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/edit-practitioner")
async def edit_practitioner_route(
    request: PractitionerUpdateRequest,
    practitioner_uuid: str = Query(..., description="UUID of the practitioner to edit"),
    user_token: str = Query(..., description="User authentication token")
):
    """Edit practitioner details"""
    try:
        practitioner_data = request.model_dump(exclude_unset=True)
        result = await run_in_threadpool(edit_practitioner, user_token, practitioner_uuid, practitioner_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/delete-practitioner")
async def delete_practitioner_route(
    practitioner_uuid: str = Query(..., description="UUID of the practitioner to delete"),
    user_token: str = Query(..., description="User authentication token")
):
    """Delete a practitioner (soft delete)"""
    try:
        result = await run_in_threadpool(delete_practitioner, user_token, practitioner_uuid)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/practitioners")
async def get_practitioners_route(
    user_token: str = Query(..., description="User authentication token")
):
    """Get all practitioners for the practice"""
    try:
        practitioners = await run_in_threadpool(get_all_practitioners, user_token)
        return {"practitioners": practitioners}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/edit-practitioner-appointments")
async def edit_practitioner_appointments_route(
    request: AppointmentAssignmentRequest,
    practitioner_uuid: str = Query(..., description="UUID of the practitioner"),
    user_token: str = Query(..., description="User authentication token")
):
    """Assign appointments to a practitioner"""
    try:
        result = await run_in_threadpool(
            edit_practitioner_appointments, 
            user_token, 
            practitioner_uuid, 
            request.appointment_uuids
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/appointments")
async def get_appointments_route(
    user_token: str = Query(..., description="User authentication token")
):
    """Get all available appointment types"""
    try:
        appointments = await run_in_threadpool(get_all_appointments, user_token)
        return {"appointments": appointments}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/create-appointment-type")
async def create_appointment_type_route(
    request: AppointmentTypeRequest,
    user_token: str = Query(..., description="User authentication token")
):
    """Create a new appointment type"""
    try:
        appointment_data = request.model_dump(exclude_unset=True)
        result = await run_in_threadpool(create_appointment_type, user_token, appointment_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
