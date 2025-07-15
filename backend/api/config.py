MYSQL_DATABASE_CONNECTION = "mysql+pymysql://root@localhost:3306/apnacollege_db"
LOGGER_NAME = "ApnaCollege"
from django.core.wsgi import get_wsgi_application
from django.core.asgi import get_asgi_application
import os

from functools import lru_cache


def configureDjangoSettings():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main_backend.settings')
    os.environ.setdefault("DJANGO_CONFIGURATIN", "Localdev")
    django_app = get_wsgi_application()

    return django_app