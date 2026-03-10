@echo off
title Iniciar PGCI Plataforma
:: Obtiene la ruta de la carpeta donde esta el archivo .bat
set BASE_DIR=%~dp0

echo Directorio base: %BASE_DIR%

:: Iniciar el Backend
echo Iniciando Backend en puerto 8000...
start cmd /k "cd /d %BASE_DIR%backend && %BASE_DIR%venv\Scripts\activate && python manage.py runserver"

:: Iniciar el Frontend
echo Iniciando Frontend en puerto 3000...
start cmd /k "cd /d %BASE_DIR%frontend && npm start"

echo.
echo Si las ventanas se cerraron, verifica que la carpeta 'venv' este en:
echo %BASE_DIR%venv
echo.
pause