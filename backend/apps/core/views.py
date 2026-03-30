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

# --- LOGIN ---
class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # Usamos Any para evitar que el editor proteste por .data
        req: Any = request
        serializer = self.serializer_class(data=req.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        v_data: Any = serializer.validated_data
        user = v_data['user']
        
        token, _ = Token.objects.get_or_create(user=user)
        
        vinculos = ClienteEmpresa.objects.filter(cliente__user=user)
        
        # Construcción de datos de empresas silenciando errores de Pylance
        empresas_data: List[Dict[str, Any]] = []
        for v in vinculos:
            emp = v.empresa
            if emp:
                empresas_data.append({
                    'id': emp.pk, # .pk es reconocido mejor que .id por los editores
                    'nombre': getattr(emp, 'razon_social', 'Sin nombre'),
                    'rol': getattr(v, 'rol', ''),
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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ClienteEmpresa.objects.all()
        return ClienteEmpresa.objects.filter(cliente__user=user)

class NovedadViewSet(viewsets.ModelViewSet):
    queryset = Novedad.objects.all().order_by('-fecha')
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

        # IMPORTANTE: Esto aplica el filtro que envía el Frontend
        if empresa_id and empresa_id != 'null' and empresa_id != 'undefined':
            qs = qs.filter(empresa_id=empresa_id)
            
        return qs.order_by('-fecha')

    def perform_create(self, serializer):
        # SEGURIDAD: Solo el Staff o usuarios con permiso especial deberían crear novedades
        if not self.request.user.is_staff:
            raise PermissionDenied("Solo el personal administrativo puede publicar novedades.")
        serializer.save()

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
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
            
        if empresa_id:
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