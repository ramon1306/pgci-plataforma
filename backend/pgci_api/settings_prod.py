import os
from .settings import * # Importa la configuración base

# --- SEGURIDAD CRÍTICA ---
DEBUG = False

# Reemplaza con la IP de tu VPS o tu dominio real
ALLOWED_HOSTS = ['tu-dominio.com', 'tu-ip-vps', 'localhost', '127.0.0.1']

# --- SECRET KEY ---
# Se recomienda generarla y ponerla en el .env del VPS
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'clave-secreta-de-emergencia-no-usar-en-vps-real')

# --- BASE DE DATOS (Configurada para Docker) ---
# Usamos 'db' como HOST porque es el nombre del servicio en docker-compose.yml
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL')
    )
}

# --- CONFIGURACIÓN DE CORS ---
# Esto permite que tu Frontend (React) acceda a la API
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://tu-ip-vps",  # Añade la IP de tu servidor cuando la tengas
    "http://tu-dominio.com",
]

# Permitir que se envíen cookies/auth si fuera necesario
CORS_ALLOW_CREDENTIALS = True

# --- SEGURIDAD HTTPS ---
# Nota: Si usas Nginx como proxy, estas líneas aseguran que Django sepa que viene de HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = False  # Cambiar a True solo cuando ya tengas instalado el certificado SSL (HTTPS)
SESSION_COOKIE_SECURE = False # Cambiar a True con SSL
CSRF_COOKIE_SECURE = False    # Cambiar a True con SSL

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
# Rutas donde Docker y Nginx guardarán los archivos
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_root')

STATIC_URL = '/static/'
MEDIA_URL = '/media/'