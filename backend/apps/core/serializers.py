# backend/apps/core/serializers.py (Debe existir)
from rest_framework import serializers
from .models import Empresa, ClienteEmpresa, ConsultaContacto

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id', 'razon_social', 'identificacion_fiscal']

class ClienteEmpresaSerializer(serializers.ModelSerializer):
    # Esto le dice a Django que busque 'razon_social' dentro del objeto 'empresa'
    razon_social = serializers.ReadOnlyField(source='empresa.razon_social')
    
    # Relaciona la empresa con su serializador
    empresa = EmpresaSerializer(read_only=True)
        
    class Meta:
        model = ClienteEmpresa
        fields = ['empresa', 'razon_social', 'rol', 'permiso_subida']
        
class ConsultaContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaContacto
        fields = ['nombre', 'email', 'asunto', 'mensaje']