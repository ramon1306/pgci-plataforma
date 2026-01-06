from django.contrib import admin
from .models import Cliente, ClienteEmpresa, Empresa, ConsultaContacto # Register your models here.

admin.site.register(Cliente)
admin.site.register(ClienteEmpresa)
admin.site.register(Empresa)

@admin.register(ConsultaContacto)
class ConsultaContactoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'email', 'asunto', 'fecha_envio', 'leido') # Columnas que verás en la tabla
    list_filter = ('leido', 'fecha_envio') # Filtros laterales
    search_fields = ('nombre', 'email', 'asunto') # Buscador