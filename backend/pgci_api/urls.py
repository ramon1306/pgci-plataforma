# backend/pgci_api/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # DEBE EXISTIR ESTA LÍNEA EXACTA para incluir las rutas de la API
    path('api/v1/', include('pgci_api.api_urls')), 
]