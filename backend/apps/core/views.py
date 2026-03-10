from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
# Importaciones usando la ruta completa
from apps.core.models import Empresa, ClienteEmpresa, ConsultaContacto, Cliente, Documento
from apps.core.serializers import (
    EmpresaSerializer, 
    ClienteEmpresaSerializer, 
    ConsultaContactoSerializer,
    ClienteListSerializer,
    DocumentoSerializer
)

# --- LOGIN ---
# En views.py
class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        
        # Obtenemos los vínculos de este usuario
        vinculos = ClienteEmpresa.objects.filter(cliente__user=user)
        empresas_data = [{
            'id': v.empresa.id,
            'nombre': v.empresa.razon_social,
            'rol': v.rol,
            'permiso_subida': v.permiso_subida
        } for v in vinculos]

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'is_staff': user.is_staff,
            'empresas': empresas_data  # Enviamos todo el pack de permisos
        })

# --- VISTAS PARA EL ROUTER (ADMIN) ---
class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminUsuarioViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteListSerializer
    permission_classes = [permissions.IsAdminUser]

class VinculosViewSet(viewsets.ModelViewSet):
    queryset = ClienteEmpresa.objects.all()
    serializer_class = ClienteEmpresaSerializer
    # Cambiado a Authenticated para permitir que el Dashboard lea su propio vínculo
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ClienteEmpresa.objects.all()
        return ClienteEmpresa.objects.filter(cliente__user=self.request.user)

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        user = self.request.user
        empresa_id = self.request.query_params.get('empresa')
        
        if user.is_staff:
            return Documento.objects.filter(empresa_id=empresa_id) if empresa_id else Documento.objects.all()
        
        try:
            # Los clientes solo ven documentos de empresas a las que están vinculados
            vinculos = ClienteEmpresa.objects.filter(cliente__user=user).values_list('empresa_id', flat=True)
            qs = Documento.objects.filter(empresa_id__in=vinculos)
            return qs.filter(empresa_id=empresa_id) if empresa_id else qs
        except Exception:
            return Documento.objects.none()

    def perform_create(self, serializer):
        """
        Lógica crucial: Valida el permiso de subida antes de guardar el archivo.
        """
        user = self.request.user
        empresa_id = self.request.data.get('empresa')

        if not user.is_staff:
            # Verificamos si existe el vínculo con permiso de subida activo
            tiene_permiso = ClienteEmpresa.objects.filter(
                cliente__user=user,
                empresa_id=empresa_id,
                permiso_subida=True
            ).exists()

            if not tiene_permiso:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("No tienes permisos para subir archivos a esta empresa.")
        
        serializer.save()
        
    # En apps/core/views.py dentro de DocumentoViewSet

def destroy(self, request, *args, **kwargs):
    instance = self.get_object()
    user = request.user
    
    # Si es staff, puede borrar lo que sea
    if user.is_staff:
        return super().destroy(request, *args, **kwargs)
    
    # Si es cliente, verificamos si tiene permiso de subida en esa empresa
    tiene_permiso = ClienteEmpresa.objects.filter(
        cliente__user=user,
        empresa=instance.empresa,
        permiso_subida=True
    ).exists()

    if tiene_permiso:
        return super().destroy(request, *args, **kwargs)
    
    return Response(
        {"error": "No tienes permiso para eliminar este documento."}, 
        status=status.HTTP_403_FORBIDDEN
    )

# --- VISTAS GENÉRICAS ---
class ClienteEmpresasListView(generics.ListAPIView):
    """
    Esta vista es la que usa el Dashboard del cliente para saber qué empresas tiene 
    y qué rol/permiso posee en cada una.
    """
    serializer_class = ClienteEmpresaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ClienteEmpresa.objects.all()
        return ClienteEmpresa.objects.filter(cliente__user=self.request.user)

class ContactoCreateView(generics.CreateAPIView):
    queryset = ConsultaContacto.objects.all()
    serializer_class = ConsultaContactoSerializer
    permission_classes = [permissions.AllowAny]