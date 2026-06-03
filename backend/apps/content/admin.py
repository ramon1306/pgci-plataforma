from django.contrib import admin
# Importamos Documento desde core y ConsultaContacto desde el models local
from apps.core.models import Documento 
from .models import ConsultaContacto

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'empresa', 'fecha_subida')
    search_fields = ('nombre', 'empresa__razon_social')
    list_filter = ('empresa', 'fecha_subida')

@admin.register(ConsultaContacto)
class ConsultaContactoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'asunto', 'fecha_envio', 'leido')
    list_filter = ('leido', 'fecha_envio')
    search_fields = ('nombre', 'email', 'asunto')