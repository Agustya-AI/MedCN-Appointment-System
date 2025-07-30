from typing import List
from fastapi import APIRouter, status
from starlette.concurrency import run_in_threadpool

# from .models import DoctorOut, AvailabilitySlotOut, BookingCreate, BookingOut
# from .utils import list_doctors, get_doctor, list_slots, create_booking

router = APIRouter(
    tags=["Booking"],
    prefix="/booking",
)


# @router.get("/doctors", response_model=List[DoctorOut])
# async def get_doctors():
#     """Retrieve all doctors."""
#     doctors = await run_in_threadpool(list_doctors)
#     return doctors


# @router.get("/doctors/{doctor_id}/availability")
# async def get_doctor_availability(doctor_id: int, include_booked: bool = False):
#     """Return availability slots for a doctor.

#     Set `include_booked=false` (default) to get only open slots.
#     Set `include_booked=true` to get all slots with booking status.
#     """
#     doctor = await run_in_threadpool(get_doctor, doctor_id)
#     slots = await run_in_threadpool(list_slots, doctor, not include_booked, False)
#     return slots


# @router.get("/doctors/{doctor_id}/blocked-slots", response_model=List[AvailabilitySlotOut])
# async def get_doctor_blocked_slots(doctor_id: int):
#     """Return only slots that are already booked for a doctor."""
#     doctor = await run_in_threadpool(get_doctor, doctor_id)
#     slots = await run_in_threadpool(list_slots, doctor, False, True)
#     return slots


# @router.post("/", status_code=status.HTTP_201_CREATED)
# async def create_new_booking(payload: BookingCreate):
#     """Create a booking for a patient with a doctor."""
#     booking = await run_in_threadpool(create_booking, payload)
#     return booking


