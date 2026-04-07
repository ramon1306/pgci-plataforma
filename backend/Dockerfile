# 1. Imagen base estable y ligera
FROM python:3.11-slim

# 2. Evitar archivos de cache y permitir logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Directorio de trabajo
WORKDIR /app

# 4. Instalar dependencias del sistema
# Agregamos python3-dev por si alguna librería necesita compilar
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    && apt-get clean \
    rm -rf /var/lib/apt/lists/*

# 5. Instalar librerías
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copiar el código del proyecto
# Importante: El .dockerignore evitará que se copien carpetas pesadas como /env
COPY . /app/

# 7. Exponer puerto
EXPOSE 8000

# 8. Comando de arranque
# Usamos gunicorn directamente. 
# Nota: Si el comando de arranque ya está en el docker-compose.yml, 
# el de Compose pisará a este.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "pgci_api.wsgi:application"]