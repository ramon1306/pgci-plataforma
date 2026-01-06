# backend/apps/core/apps.py

from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # 1. Usar el nombre corto para el label (core)
    # 2. Mantener el nombre del módulo completo para el name
    name = 'apps.core'
    label = 'core' # <-- ESTO ES CLAVE