

from fastapi import APIRouter, HTTPException, status, Query
from .utils import (
    register_patient,
    login_patient,
    get_family_members,
    add_family_member,
    edit_family_member,
    delete_family_member,
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