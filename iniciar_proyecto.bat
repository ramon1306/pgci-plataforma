@echo off
title Iniciar PGCI Plataforma

:: Iniciar el Backend en una nueva ventana
echo Iniciando Backend...
start cmd /k "cd backend && ..\venv\Scripts\activate && python manage.py runserver"

:: Iniciar el Frontend en otra ventana
echo Iniciando Frontend...
start cmd /k "cd frontend && npm start"

echo ¡Todo listo! Puedes cerrar esta ventana.
pause
exit