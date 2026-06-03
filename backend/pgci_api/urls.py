# backend/pgci_api/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # El prefijo 'api/v1/' es OBLIGATORIO porque React lo busca así
    path('api/v1/', include('pgci_api.api_urls')), 
]