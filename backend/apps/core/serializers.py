from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Empresa, ClienteEmpresa, ConsultaContacto, Cliente, Documento, Novedad
from django.db import transaction

# --- SERIALIZADOR DE USUARIOS (CLIENTES) ---
class ClienteListSerializer(serializers.ModelSerializer):
    # Campos para la creación (POST)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=False, allow_blank=True, write_only=True)
    is_staff = serializers.BooleanField(default=False, write_only=True)
    
    # Campos para la lectura (GET) - Cruciales para los selectores de React
    username_display = serializers.ReadOnlyField(source='user.username')
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Cliente
        fields = ['id', 'username', 'password', 'email', 'is_staff', 'username_display', 'user_email', 'activo']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya existe.")
        return value

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email', '')
        is_staff = validated_data.pop('is_staff', False)

        with transaction.atomic():
            # Crear el usuario de Django
            user = User.objects.create_user(
                username=username, 
                password=password, 
                email=email, 
                is_staff=is_staff
            )
            # Crear el perfil de Cliente asociado
            cliente = Cliente.objects.create(user=user, **validated_data)
        return cliente

# --- SERIALIZADOR DE EMPRESAS ---
class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id', 'razon_social', 'identificacion_fiscal', 'domicilio']

# --- SERIALIZADOR DE VÍNCULOS (CLIENTE-EMPRESA) ---
class ClienteEmpresaSerializer(serializers.ModelSerializer):
    # ReadOnlyFields para mostrar información amigable en la tabla de React
    razon_social = serializers.ReadOnlyField(source='empresa.razon_social')
    cliente_nombre = serializers.ReadOnlyField(source='cliente.user.username')
    
    class Meta:
        model = ClienteEmpresa
        # Incluimos 'permiso_subida' para que el AdminPanel pueda leerlo y editarlo
        fields = [
            'id', 
            'cliente', 
            'cliente_nombre', 
            'empresa', 
            'razon_social', 
            'rol', 
            'permiso_subida'
        ]
        # Hacemos que cliente y empresa sean obligatorios solo en la creación
        # pero permitimos que en el PATCH (actualización de rol/permiso) sean opcionales
        extra_kwargs = {
            'cliente': {'required': False},
            'empresa': {'required': False}
        }

# --- SERIALIZADOR DE DOCUMENTOS ---
class DocumentoSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.ReadOnlyField(source='empresa.razon_social')
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = Documento
        fields = ['id', 'nombre', 'archivo', 'archivo_url', 'fecha_subida', 'empresa', 'empresa_nombre']

    def get_archivo_url(self, obj):
        if obj.archivo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.archivo.url)
            return obj.archivo.url
        return None

# --- SERIALIZADOR DE CONTACTO ---
class ConsultaContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaContacto
        fields = ['id', 'nombre', 'email', 'asunto', 'mensaje', 'fecha_envio', 'leido']
        
# --- SERIALIZADOR DE NOVEDADES ---
class NovedadSerializer(serializers.ModelSerializer):
    # Esto permite que React envíe el ID numérico, pero Django sepa que es una Empresa
    empresa = serializers.PrimaryKeyRelatedField(queryset=Empresa.objects.all())
    # Esto sirve para mostrar el nombre en el listado de React sin esfuerzo extra
    empresa_nombre = serializers.ReadOnlyField(source='empresa.razon_social')

    class Meta:
        model = Novedad
        fields = ['id', 'empresa', 'empresa_nombre', 'titulo', 'contenido', 'fecha', 'importante']