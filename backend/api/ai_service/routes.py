


from fastapi import APIRouter, UploadFile, File
from .utils import get_doctor_details_from_file


router = APIRouter(
    tags=["AI Service"],
    prefix="/ai"
)


@router.post("/get-doctor-details-from-file")
async def get_doctor_details(file: UploadFile = File(...)):
    file_content = await file.read()
    doctor_details = get_doctor_details_from_file(file_content)
    return doctor_details