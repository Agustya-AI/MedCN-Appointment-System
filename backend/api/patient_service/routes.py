

from fastapi import APIRouter
from .utils import register_patient, login_patient
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
        return {"status": "error", "message": str(e)}


@router.post("/login") 
async def login(details: dict):
    try:
        result = await run_in_threadpool(login_patient, details)
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}