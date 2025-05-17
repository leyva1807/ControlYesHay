@echo off
REM Script para iniciar el entorno Docker de ControlYesHay en Windows

echo Iniciando el entorno Docker de ControlYesHay...

REM Crear directorios necesarios si no existen
if not exist "docker\mysql" mkdir "docker\mysql"
if not exist "docker\nginx" mkdir "docker\nginx"
if not exist "docker\php" mkdir "docker\php"

REM Verificar si docker-compose está instalado
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo docker-compose no está instalado. Por favor, instálalo primero.
    exit /b 1
)

REM Compilar e iniciar los contenedores en segundo plano
docker-compose up -d

echo Instalando dependencias de Composer...
docker-compose exec app composer install

echo Ejecutando migraciones...
docker-compose exec app php artisan migrate

echo Instalando dependencias de Node...
npm install

echo Compilando assets...
npm run dev

echo ¡Entorno Docker de ControlYesHay iniciado correctamente!
echo Accede a la aplicación en http://localhost:8080
