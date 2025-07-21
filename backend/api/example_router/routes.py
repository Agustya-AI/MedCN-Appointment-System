from fastapi import APIRouter
from asgiref.sync import sync_to_async
from api.config import configureDjangoSettings
from starlette.concurrency import run_in_threadpool

from fastapi import Request


configureDjangoSettings()

from example_app.models import ExampleModel

router = APIRouter(
    tags=[""],
    prefix="/example"
)


@router.get("/example_route")
async def getData():
    all_data = await run_in_threadpool(lambda: list(ExampleModel.objects.all()))
    print(all_data)
    return {"message": "DETA"}


@router.post("/admin")
async def getadminLogin(request: Request):
    
    data = await request.json()
    
    if data["username"] == "admin" and data["password"] == "admin":
        return {"message": "Login successful"}
    else:
        return {"message": "Login failed"}
    
    
    