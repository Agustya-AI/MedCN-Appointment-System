


from typing import List
from fastapi import APIRouter, status, HTTPException
from starlette.concurrency import run_in_threadpool
from practiceapp.models import PractionerUser
from .utils import register_user, login_user

router = APIRouter(
    tags=["Practics"],
    prefix="/practice",
)


from pydantic import BaseModel

class RegisterRequest(BaseModel):
    name: str
    email: str 
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

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


@router.get("/details")
async def practice_details():
    pass