# backend/apps/staff/models.py
from django.db import models

class StaffInterno(models.Model):
    """Empleados/Asesores del estudio que atienden tickets y gestionan documentos."""

    AREAS = [
        ('FISCAL', 'Fiscal'),
        ('CONTABLE', 'Contable'),
        ('IT', 'IT'),
        ('SOPORTE', 'Soporte General'),
    ]

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    area = models.CharField(max_length=50, choices=AREAS)
    email = models.EmailField(unique=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.area})"