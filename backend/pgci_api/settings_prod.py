import os
from .settings import *

# --- SEGURIDAD CRÍTICA ---
# DEBUG en True te ayudará a ver errores de estáticos, pero recordá pasarlo a False luego.
DEBUG = False

# IP de tu VPS y nombre de servicios Docker
ALLOWED_HOSTS = ['104.236.113.179', 'localhost', '127.0.0.1', 'backend']

# --- SECRET KEY ---
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-zb0f#vv7#+vxf04+(7fz7c!otcxetrqa3q30pwn(#bb)wt9xc3')

# --- BASE DE DATOS (PostgreSQL vía Docker Network) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pgci_db',
        'USER': 'admin',
        'PASSWORD': 'password_seguro',
        'HOST': 'db',
        'PORT': '5432',
    }
}

# --- CONFIGURACIÓN DE CORS ---
# Agregamos la IP sin puerto ya que Nginx corre en el 80
CORS_ALLOWED_ORIGINS = [
    "http://104.236.113.179",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

# Vital para el login y formularios
CSRF_TRUSTED_ORIGINS = [
    "http://104.236.113.179",
]

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
# CORRECCIÓN: Definimos la ruta absoluta directa para que coincida con Docker
STATIC_ROOT = '/app/static'
MEDIA_ROOT = '/app/media'

STATIC_URL = '/static/'
MEDIA_URL = '/media/'