from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from typing import Any, List, Dict

# Importaciones de modelos y serializers
from apps.core.models import Empresa, ClienteEmpresa, ConsultaContacto, Cliente, Documento, Novedad
from apps.core.serializers import (
    EmpresaSerializer, 
    ClienteEmpresaSerializer, 
    ConsultaContactoSerializer,
    ClienteListSerializer,
    DocumentoSerializer,
    NovedadSerializer
)

# --- LOGIN ACTUALIZADO ---
# --- LOGIN CON BYPASS PARA ADMIN ---
class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        
        empresas_data = []

        # FUERZA BRUTA PARA ADMIN: Si es staff, ignoramos la tabla de vínculos
        if user.is_staff or user.is_superuser:
            # Traemos todas las empresas registradas en el sistema
            todas = Empresa.objects.all()
            for emp in todas:
                empresas_data.append({
                    'id': emp.pk,
                    'nombre': getattr(emp, 'razon_social', 'Sin nombre'),
                    'rol': 'Administrador Global',
                    'permiso_subida': True
                })
        else:
            # Lógica para clientes normales (Micaela, etc.)
            vinculos = ClienteEmpresa.objects.filter(cliente__user=user)
            for v in vinculos:
                if v.empresa:
                    empresas_data.append({
                        'id': v.empresa.pk,
                        'nombre': getattr(v.empresa, 'razon_social', 'Sin nombre'),
                        'rol': getattr(v, 'rol', 'Cliente'),
                        'permiso_subida': getattr(v, 'permiso_subida', False)
                    })

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'is_staff': user.is_staff,
            'empresas': empresas_data
        })


# --- VISTAS PARA EL ROUTER (ADMIN) ---

class EmpresaViewSet(viewsets.ModelViewSet):
    serializer_class = EmpresaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # BYPASS: El admin gestiona todas las empresas
        if user.is_staff:
            return Empresa.objects.all()
        # El cliente solo ve las suyas
        return Empresa.objects.filter(vinculos__cliente__user=user).distinct()


class AdminUsuarioViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteListSerializer
    permission_classes = [permissions.IsAdminUser]


class VinculosViewSet(viewsets.ModelViewSet):
    queryset = ClienteEmpresa.objects.all()
    serializer_class = ClienteEmpresaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ClienteEmpresa.objects.all()
        return ClienteEmpresa.objects.filter(cliente__user=user)

class NovedadViewSet(viewsets.ModelViewSet):
    serializer_class = NovedadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        req: Any = self.request 
        empresa_id = req.query_params.get('empresa')

        if user.is_staff:
            qs = Novedad.objects.all()
        else:
            vinculos = ClienteEmpresa.objects.filter(cliente__user=user).values_list('empresa_id', flat=True)
            qs = Novedad.objects.filter(empresa_id__in=list(vinculos))

        if empresa_id and empresa_id not in ['null', 'undefined']:
            qs = qs.filter(empresa_id=empresa_id)
            
        return qs.order_by('-fecha')

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Solo el personal administrativo puede publicar novedades.")
        serializer.save()

class DocumentoViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        user = self.request.user
        req: Any = self.request
        empresa_id = req.query_params.get('empresa')
        
        if user.is_staff:
            qs = Documento.objects.all()
        else:
            vinculos = ClienteEmpresa.objects.filter(cliente__user=user).values_list('empresa_id', flat=True)
            qs = Documento.objects.filter(empresa_id__in=list(vinculos))
            
        if empresa_id and empresa_id not in ['null', 'undefined']:
            qs = qs.filter(empresa_id=empresa_id)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        v_data: Any = serializer.validated_data
        empresa = v_data.get('empresa')

        if not user.is_staff:
            tiene_permiso = ClienteEmpresa.objects.filter(
                cliente__user=user,
                empresa=empresa,
                permiso_subida=True
            ).exists()
            if not tiene_permiso:
                raise PermissionDenied("No tienes permisos para subir archivos a esta empresa.")
        
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance: Any = self.get_object()
        user = request.user
        
        if user.is_staff:
            return super().destroy(request, *args, **kwargs)
        
        tiene_permiso = ClienteEmpresa.objects.filter(
            cliente__user=user,
            empresa=instance.empresa,
            permiso_subida=True
        ).exists()

        if tiene_permiso:
            return super().destroy(request, *args, **kwargs)
        
        return Response(
            {"detail": "No tienes permiso para eliminar este documento."}, 
            status=status.HTTP_403_FORBIDDEN
        )


# --- VISTAS GENÉRICAS ---

class ClienteEmpresasListView(generics.ListAPIView):
    serializer_class = ClienteEmpresaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ClienteEmpresa.objects.all()
        return ClienteEmpresa.objects.filter(cliente__user=user)


class ContactoCreateView(generics.CreateAPIView):
    queryset = ConsultaContacto.objects.all()
    serializer_class = ConsultaContactoSerializer
    permission_classes = [permissions.AllowAny]