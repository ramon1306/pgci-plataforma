"""
Django settings for pgci_api project.
"""

import os
import sys
from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Agregamos 'apps' al Python Path
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

# --- SEGURIDAD ---
SECRET_KEY = 'django-insecure-zb0f#vv7#+vxf04+(7fz7c!otcxetrqa3q30pwn(#bb)wt9xc3'
DEBUG = True # Cambiar a False en producción definitiva

ALLOWED_HOSTS = ['104.236.113.179', 'localhost', '127.0.0.1']

# --- CONFIGURACIÓN DE CONFIANZA (Esto arregla el error de carga de datos) ---
CSRF_TRUSTED_ORIGINS = ['http://104.236.113.179']
CORS_ALLOWED_ORIGINS = ['http://104.236.113.179']
CORS_ALLOW_CREDENTIALS = True

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # API y CORS
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    
    # Aplicaciones del Proyecto PGCI
    'apps.core.apps.CoreConfig',
    'apps.content.apps.ContentConfig',
    'apps.staff.apps.StaffConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pgci_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.template.context_processors.media',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pgci_api.wsgi.application'

# --- DATABASE (Configurada para el PostgreSQL de tu Docker Compose) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pgci_db',
        'USER': 'admin',
        'PASSWORD': 'password_seguro',
        'HOST': 'db', # Nombre del servicio en docker-compose
        'PORT': '5432',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Internationalization
LANGUAGE_CODE = 'es-ar'
TIME_ZONE = 'America/Argentina/Buenos_Aires'
USE_I18N = True
USE_TZ = True

# Static and Media files
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# CONFIGURACIÓN PARA ARCHIVOS SUBIDOS
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'