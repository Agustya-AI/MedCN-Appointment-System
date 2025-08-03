from fastapi import APIRouter

# Example Router
# from api.courses_api.routes import router as courses_router
# from api.job_notifier.routes import router as job_router
from api.example_router.routes import router as example_router
from api.booking.routes import router as booking_router
from api.practice_service.routes import router as practice_router
from api.ai_service.routes import router as ai_router
router = APIRouter(prefix="/api/v1")


# Example Router Include
# router.include_router(courses_router)
# router.include_router(job_router)

router.include_router(example_router)
router.include_router(booking_router)
router.include_router(practice_router)
router.include_router(ai_router)