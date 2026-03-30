from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.core.views import (
    CustomLoginView,
    ClienteEmpresasListView,
    ContactoCreateView,
    EmpresaViewSet,
    AdminUsuarioViewSet,
    VinculosViewSet,
    DocumentoViewSet,
    NovedadViewSet  # <-- Importación agregada aquí
)

router = DefaultRouter()

# Cambiamos 'empresas_list' por 'empresas' para que coincida con React
router.register(r'empresas', EmpresaViewSet, basename='empresa')

# 'usuarios' coincide con tu AdminPanel.jsx
router.register(r'usuarios', AdminUsuarioViewSet, basename='usuarios')

# 'vinculos' coincide con tu AdminPanel.jsx
router.register(r'vinculos', VinculosViewSet, basename='vinculos')

# 'documentos' coincide con tu AdminPanel.jsx
router.register(r'documentos', DocumentoViewSet, basename='documento')

# 'novedades' para el feed del Dashboard
router.register(r'novedades', NovedadViewSet, basename='novedades')

urlpatterns = [
    # Auth y endpoints específicos
    path('login/', CustomLoginView.as_view(), name='api_token_auth'),
    path('mis-empresas/', ClienteEmpresasListView.as_view(), name='mis-empresas'),
    path('contacto/', ContactoCreateView.as_view(), name='contacto-post'),
    
    # Inclusión de las rutas del router
    path('', include(router.urls)),
]