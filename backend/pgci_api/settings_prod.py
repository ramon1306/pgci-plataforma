import os
from .settings import *

# --- SEGURIDAD CRÍTICA ---
DEBUG = False

# IP de tu VPS
ALLOWED_HOSTS = ['104.236.113.179', 'localhost', '127.0.0.1']

# --- SECRET KEY ---
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-zb0f#vv7#+vxf04+(7fz7c!otcxetrqa3q30pwn(#bb)wt9xc3')

# --- BASE DE DATOS (PostgreSQL Local) ---
# Aquí eliminamos dj_database_url para evitar el error de la captura
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pgci_db',
        'USER': 'ramon',
        'PASSWORD': 'rado1306', 
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# --- CONFIGURACIÓN DE CORS ---
# Solo agregamos las IPs, ya que 'corsheaders' ya está en el settings.py base
CORS_ALLOWED_ORIGINS = [
    "http://104.236.113.179",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

# Vital para altas de usuarios/empresas
CSRF_TRUSTED_ORIGINS = [
    "http://104.236.113.179",
    "http://104.236.113.179:8000",
    "http://127.0.0.1",
]

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_root')