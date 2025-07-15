from fastapi import FastAPI
from logging.config import dictConfig
from fastapi.middleware.cors import CORSMiddleware
from api.logger import LogConfig
from api.api import router
import logging 

import os
from django.core.wsgi import get_wsgi_application
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.staticfiles import StaticFiles
from api.config import LOGGER_NAME

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main_backend.settings')
os.environ.setdefault("DJANGO_CONFIGURATIN", "Localdev")
django_app = get_wsgi_application()




dictConfig(LogConfig())

logger = logging.getLogger(LOGGER_NAME)

# [TODO] NOT RECOMMENDED FOR PRODUCTION
origins = ["*"]

def configure_cors(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
logger.info("STARTING SERVER")

app = FastAPI(title=LOGGER_NAME)
configure_cors(app=app)


app.include_router(router=router)

# app.include_router(router=router)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.mount("/", WSGIMiddleware(django_app))







