from typing import List, Optional
from fastapi import HTTPException, status
from api.config import configureDjangoSettings
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

# Ensure Django is configured before importing Django models
configureDjangoSettings()

# from platformuser.models import Doctor, AvailabilitySlot, Booking  # noqa: E402
# from .models import BookingCreate  # noqa: E402


# def list_doctors() -> List[Doctor]:
#     """Get all doctors from the database."""
#     return list(Doctor.objects.all())


# def get_doctor(doctor_id: int) -> Doctor:
#     """Get a specific doctor by ID."""
#     try:
#         return Doctor.objects.get(id=doctor_id)
#     except Doctor.DoesNotExist as e:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, 
#             detail="Doctor not found"
#         ) from e


# def list_slots(doctor: Doctor, only_available: bool = False, only_booked: bool = False) -> List[AvailabilitySlot]:
#     """Get availability slots for a doctor with optional filtering."""
#     qs = doctor.availability_slots.all()
#     if only_available:
#         qs = qs.filter(is_booked=False)
#     if only_booked:
#         qs = qs.filter(is_booked=True)
#     return list(qs)


# def create_booking(data: BookingCreate) -> Booking:
#     """Create a new booking and mark slot as booked if provided."""
#     doctor = get_doctor(data.doctor_id)

#     slot: Optional[AvailabilitySlot] = None
#     if data.slot_id is not None:
#         try:
#             slot = AvailabilitySlot.objects.get(id=data.slot_id, doctor=doctor)
#         except AvailabilitySlot.DoesNotExist as e:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST, 
#                 detail="Invalid slot for given doctor"
#             ) from e
        
#         if slot.is_booked:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST, 
#                 detail="Slot already booked"
#             )

#     # Create the booking
#     booking = Booking.objects.create(
#         consultation_type=data.consultation_type,
#         name=data.name,
#         email=data.email,
#         phone_number=data.phone_number,
#         message=data.message or "",
#         doctor=doctor,
#         slot=slot,
#     )

#     # Mark slot as booked if provided
#     if slot:
#         slot.is_booked = True
#         slot.save(update_fields=["is_booked"])

#     send_confirmation_email_tool(data.name, data.email, doctor.name, slot.date, data.consultation_type)

#     return booking
# configuration = sib_api_v3_sdk.Configuration()
# configuration.api_key['api-key'] = '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'

# api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

# def send_confirmation_email_tool(name, email, doctor_name, appointment_time, consultation_type):
#     try:
#         smptEmail = sib_api_v3_sdk.SendSmtpEmail()
#         smptEmail.html_content = f"""

#     <html>
#     <body style="font-family: Arial, sans-serif;">
#         <p>Dear {name},</p>
#         <p>Your appointment has been successfully scheduled!</p>
#         <p><strong>Appointment Details:</strong></p>
#         <ul>
#             <li>Doctor: Dr. {doctor_name}</li>
#             <li>Date & Time: {appointment_time}</li>
#             <li>Consultation Type: {consultation_type}</li>
#         </ul>
#         <p>Please arrive 10 minutes before your scheduled appointment time. If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
#         <p>Please feel free to contact us if you have any questions or need further assistance.</p>
#         <br>
#         <p>Best regards,</p>
#         <p><strong>MedCN</strong></p>
#         <br>
#     </body>
#     </html>
        
#         """
        
#         smptEmail.sender = {
#             "name": "MedCN",
#             "email": "no-reply@medcn.in",
#         }
        
#         smptEmail.to = [
#         { "name": name,
#             "email": email
#         }
#         ]
#         smptEmail.subject = "Appointment Confirmation"
#         smptEmail.headers = { "Some-Custom-Name": "unique-id-1234" }

#         api_instance.send_transac_email(smptEmail)
#     except ApiException as e:
#         print("Exception when calling AccountApi->get_account: %s\n" % e)
