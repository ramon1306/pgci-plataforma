from django.db import models
from django.contrib.auth.models import User

# --- PERFIL DE USUARIO ---
class Cliente(models.Model):
    """Usuarios que acceden a la plataforma."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_cliente')
    telefono = models.CharField(max_length=20, blank=True, null=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username

# --- ENTIDADES FISCALES ---
class Empresa(models.Model):
    """Datos fiscales de las entidades que el estudio asesora."""
    razon_social = models.CharField(max_length=255, unique=True)
    identificacion_fiscal = models.CharField(max_length=50, unique=True) # CUIT, NIF, etc.
    domicilio = models.TextField(blank=True, null=True)
    servicio_it_activo = models.BooleanField(default=False)

    def __str__(self):
        return self.razon_social

# --- VINCULACIÓN Y PERMISOS (M:M) ---
class ClienteEmpresa(models.Model):
    """Tabla Nexo que maneja la vinculación y Permisos."""

    ROLES = [
        ('ADMINISTRADOR', 'Administrador'),
        ('DUENO', 'Dueño'),
        ('GERENTE_FINANCIERO', 'Gerente Financiero'),
        ('RRHH', 'Recursos Humanos'),
        ('OTRO', 'Otro'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='vinculos')
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='clientes_vinculados')
    
    rol = models.CharField(max_length=50, choices=ROLES, default='OTRO')
    permiso_subida = models.BooleanField(default=False)

    class Meta:
        # Clave primaria compuesta lógica para evitar duplicados
        unique_together = ('cliente', 'empresa') 
        verbose_name = "Vínculo Cliente-Empresa"
        verbose_name_plural = "Vínculos Cliente-Empresa"

    def __str__(self):
        return f"{self.cliente.user.username} -> {self.empresa.razon_social} ({self.rol})"

# --- GESTIÓN DE DOCUMENTOS ---
def ruta_documentos_empresa(instance, filename):
    # Organiza archivos por Empresa/Año/Mes para que no se mezclen
    return f'documentos/empresa_{instance.empresa.id}/{instance.fecha_subida.year}/{instance.fecha_subida.month}/{filename}'

class Documento(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='documentos')
    nombre = models.CharField(max_length=255)
    archivo = models.FileField(upload_to='documentos/%Y/%m/') # O usa ruta_documentos_empresa
    fecha_subida = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha_subida'] # Los más nuevos aparecen primero

    def __str__(self):
        return f"{self.nombre} ({self.empresa.razon_social})"

    @property
    def archivo_url(self):
        return self.archivo.url if self.archivo else ""

# --- CONTACTO ---
class ConsultaContacto(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    asunto = models.CharField(max_length=200)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Consulta de Contacto"
        verbose_name_plural = "Consultas de Contacto"

    def __str__(self):
        return f"{self.nombre} - {self.asunto}"