from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class DoctorOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    specialty: Optional[str] = None
    phone_number: Optional[str] = None

    class Config:
        orm_mode = True


class AvailabilitySlotOut(BaseModel):
    id: int
    date: str  # ISO date
    start_time: str  # HH:MM:SS
    end_time: str
    is_booked: bool

    class Config:
        orm_mode = True


class BookingCreate(BaseModel):
    consultation_type: str
    name: str
    email: EmailStr
    phone_number: str
    message: Optional[str] = None

    doctor_id: int = Field(..., description="ID of the doctor to book")
    slot_id: Optional[int] = Field(None, description="ID of the slot to associate with the booking")


class BookingOut(BaseModel):
    id: int
    consultation_type: str
    name: str
    email: EmailStr
    phone_number: str
    message: Optional[str]

    doctor: DoctorOut
    slot: Optional[AvailabilitySlotOut]

    class Config:
        orm_mode = True
