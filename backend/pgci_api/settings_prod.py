import os
from .settings import *

# --- SEGURIDAD CRÍTICA ---
# settings_prod.py
DEBUG = True  # <--- Cambialo a True temporalmente

# IP de tu VPS y nombre de servicios Docker
ALLOWED_HOSTS = ['104.236.113.179', 'localhost', '127.0.0.1', 'backend']

# --- SECRET KEY ---
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-zb0f#vv7#+vxf04+(7fz7c!otcxetrqa3q30pwn(#bb)wt9xc3')

# --- BASE DE DATOS (PostgreSQL vía Docker Network) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pgci_db',
        'USER': 'admin',           # Según tu docker-compose.yml
        'PASSWORD': 'password_seguro', # Según tu docker-compose.yml
        'HOST': 'db',              # Nombre del servicio en Docker Compose
        'PORT': '5432',
    }
}

# --- CONFIGURACIÓN DE CORS ---
CORS_ALLOWED_ORIGINS = [
    "http://104.236.113.179",
    "http://104.236.113.179:8001",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

# Vital para altas de usuarios/empresas
CSRF_TRUSTED_ORIGINS = [
    "http://104.236.113.179",
    "http://104.236.113.179:8001",
]

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_root')