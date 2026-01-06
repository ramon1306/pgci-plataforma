# backend/apps/core/views.py (Fragmento)
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Cliente, ClienteEmpresa,ConsultaContacto
# ¡Importamos el serializador que acabamos de crear!
from .serializers import ClienteEmpresaSerializer, ConsultaContactoSerializer
from django.contrib.auth.models import User 

class ClienteEmpresasListView(generics.ListAPIView):
    # Solo permite acceso si el usuario está autenticado (usando el Token)
    permission_classes = [IsAuthenticated]
    serializer_class = ClienteEmpresaSerializer

    def get_queryset(self):
        # 1. Obtenemos el objeto Cliente (profile) asociado al User autenticado
        # NOTA: Asumimos que hay un modelo Cliente con OneToOneField a User
        try:
            cliente = Cliente.objects.get(user=self.request.user)
        except Cliente.DoesNotExist:
            # Manejo de error si el usuario autenticado no tiene perfil de cliente
            return ClienteEmpresa.objects.none() 
        
        # 2. Filtramos las vinculaciones ClienteEmpresa por ese Cliente
        return ClienteEmpresa.objects.filter(cliente=cliente)

# (Deja cualquier otro contenido que tengas en views.py)
from rest_framework.permissions import AllowAny # Importante para que cualquiera escriba
from .models import ConsultaContacto
from .serializers import ConsultaContactoSerializer

class ContactoCreateView(generics.CreateAPIView):
    """
    Vista para recibir y guardar las consultas del formulario de contacto.
    """
    queryset = ConsultaContacto.objects.all()
    serializer_class = ConsultaContactoSerializer
    permission_classes = [AllowAny] # No requiere Token para enviar mensaje