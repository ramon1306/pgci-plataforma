# backend/apps/core/models.py
from django.db import models
from django.contrib.auth.models import User # Usaremos el modelo User de Django por simplicidad, o podrías usar uno personalizado

class Cliente(models.Model):
    """Usuarios que acceden a la plataforma."""
    # Se asume que usaremos el modelo User de Django para login/password
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Datos adicionales del cliente
    telefono = models.CharField(max_length=20, blank=True, null=True)
    activo = models.BooleanField(default=True)

    # Campos de nombre/apellido pueden obtenerse del objeto User

    def __str__(self):
        return f"Cliente: {self.user.get_full_name()}"

class Empresa(models.Model):
    """Datos fiscales de las entidades que el estudio asesora."""
    razon_social = models.CharField(max_length=255, unique=True)
    identificacion_fiscal = models.CharField(max_length=50, unique=True) # CUIT, NIF, etc.
    domicilio = models.TextField(blank=True, null=True)
    servicio_it_activo = models.BooleanField(default=False) # Para servicios IT

    def __str__(self):
        return self.razon_social

class ClienteEmpresa(models.Model):
    """Tabla Nexo M:M que maneja la vinculación y Permisos (Clave Compuesta)."""

    ROLES = [
        ('DUENO', 'Dueño'),
        ('GERENTE_FINANCIERO', 'Gerente Financiero'),
        ('RRHH', 'Recursos Humanos'),
        ('OTRO', 'Otro'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    rol = models.CharField(max_length=50, choices=ROLES)
    permiso_subida = models.BooleanField(default=False) # ¿Puede el cliente subir documentos?

    class Meta:
        # DEFINICIÓN DE LA CLAVE PRIMARIA COMPUESTA:
        # Asegura que un mismo cliente NO pueda estar asociado a la misma empresa más de una vez.
        unique_together = ('cliente', 'empresa') 

    def __str__(self):
        return f"{self.cliente.user.username} - {self.empresa.razon_social} ({self.rol})"
    
class ConsultaContacto(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    asunto = models.CharField(max_length=200)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)

    class Meta:
        # Asegúrate de que NO haya una línea que diga unique_together aquí
        verbose_name = "Consulta de Contacto"
        verbose_name_plural = "Consultas de Contacto"

    def __str__(self):
        return f"{self.nombre} - {self.asunto}"