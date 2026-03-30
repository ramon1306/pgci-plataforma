# Imagen base estable y ligera
FROM python:3.11-slim

# Evitar que Python genere archivos de cache (.pyc)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instalar dependencias para PostgreSQL y Pillow (imágenes)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Instalar las librerías del proyecto
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Instalar Gunicorn para producción
RUN pip install gunicorn

# Copiar el resto del código
COPY . /app/

# Exponer el puerto de Django
EXPOSE 8000

# Comando de arranque (usando tus settings de producción)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "pgci_api.wsgi:application"]