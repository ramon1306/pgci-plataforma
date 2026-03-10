# backend/pgci_api/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # DEBE EXISTIR ESTA LÍNEA EXACTA para incluir las rutas de la API
    path('api/v1/', include('pgci_api.api_urls')), 
]

# Esto es lo que permite que el botón "Descargar" del dashboard funcione
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)