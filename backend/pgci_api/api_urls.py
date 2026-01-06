# backend/pgci_api/api_urls.py 
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
# Importamos la vista de empresas que crearemos después
from apps.core.views import ContactoCreateView, ClienteEmpresasListView

urlpatterns = [
    # ENDPOINT DE LOGIN: La ruta exacta es 'auth/login/'
    # 1. Login
    path('auth/login/', obtain_auth_token, name='api_login'),
    
    # 2. Formulario de Contacto: La ruta completa será /api/v1/contacto/
    path('contacto/', ContactoCreateView.as_view(), name='contacto-create'),
    
    # ENDPOINT DE EMPRESAS (Para el siguiente paso)
    # Las demás rutas de la API irán aquí...
    path('empresas/', ClienteEmpresasListView.as_view(), name='cliente_empresas'),
]