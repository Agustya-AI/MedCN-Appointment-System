from typing import List, Optional
from fastapi import HTTPException, status
from api.config import configureDjangoSettings

# Ensure Django is configured before importing Django models
configureDjangoSettings()

from platformuser.models import Doctor, AvailabilitySlot, Booking  # noqa: E402
from .models import BookingCreate  # noqa: E402


def list_doctors() -> List[Doctor]:
    """Get all doctors from the database."""
    return list(Doctor.objects.all())


def get_doctor(doctor_id: int) -> Doctor:
    """Get a specific doctor by ID."""
    try:
        return Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Doctor not found"
        ) from e


def list_slots(doctor: Doctor, only_available: bool = False, only_booked: bool = False) -> List[AvailabilitySlot]:
    """Get availability slots for a doctor with optional filtering."""
    qs = doctor.availability_slots.all()
    if only_available:
        qs = qs.filter(is_booked=False)
    if only_booked:
        qs = qs.filter(is_booked=True)
    return list(qs)


def create_booking(data: BookingCreate) -> Booking:
    """Create a new booking and mark slot as booked if provided."""
    doctor = get_doctor(data.doctor_id)

    slot: Optional[AvailabilitySlot] = None
    if data.slot_id is not None:
        try:
            slot = AvailabilitySlot.objects.get(id=data.slot_id, doctor=doctor)
        except AvailabilitySlot.DoesNotExist as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid slot for given doctor"
            ) from e
        
        if slot.is_booked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Slot already booked"
            )

    # Create the booking
    booking = Booking.objects.create(
        consultation_type=data.consultation_type,
        name=data.name,
        email=data.email,
        phone_number=data.phone_number,
        message=data.message or "",
        doctor=doctor,
        slot=slot,
    )

    # Mark slot as booked if provided
    if slot:
        slot.is_booked = True
        slot.save(update_fields=["is_booked"])

    return booking
