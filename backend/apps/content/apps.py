# backend/apps/content/apps.py
from django.apps import AppConfig
class ContentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.content'  # Debe coincidir con la ruta en INSTALLED_APPS
    label = 'content_app'  # Esto evita el choque con 'contenttypes' de Django