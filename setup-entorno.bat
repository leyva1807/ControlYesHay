@echo off
REM Script para configurar entorno de desarrollo ControlYesHay
REM Este script ayuda a preparar un entorno de desarrollo para Laravel 12 con React

echo ==========================================
echo   Configuración de Entorno ControlYesHay
echo ==========================================
echo.

REM Verificar si tenemos PHP disponible
where php >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PHP no está disponible en el PATH.
    echo Asegúrate de tener instalado PHP y añadido al PATH.
    goto :error
)

REM Verificar si tenemos Composer disponible
where composer >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Composer no está disponible en el PATH.
    echo Asegúrate de tener instalado Composer y añadido al PATH.
    goto :error
)

REM Verificar si tenemos Node disponible
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está disponible en el PATH.
    echo Asegúrate de tener instalado Node.js y añadido al PATH.
    goto :error
)

REM Verificar si tenemos NPM disponible
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] NPM no está disponible en el PATH.
    echo Asegúrate de tener instalado Node.js con NPM y añadido al PATH.
    goto :error
)

echo [OK] Se han verificado todas las dependencias.

echo.
echo === Actualizando dependencias PHP con Composer ===
call composer install
if %errorlevel% neq 0 goto :error

echo.
echo === Actualizando dependencias JavaScript con NPM ===
call npm install
if %errorlevel% neq 0 goto :error

echo.
echo === Verificando archivo .env ===
if not exist ".env" (
    echo Creando archivo .env desde plantilla...
    copy .env.example .env
    if %errorlevel% neq 0 goto :error

    echo Generando clave de aplicación...
    php artisan key:generate
    if %errorlevel% neq 0 goto :error
) else (
    echo [OK] Archivo .env ya existe.
)

echo.
echo === Preparando base de datos ===
echo NOTA: Asegúrate de tener la base de datos configurada en el archivo .env
echo.
set /p resetdb="¿Deseas ejecutar migraciones y seeders? (s/n): "
if /i "%resetdb%"=="s" (
    echo Ejecutando migraciones y seeders...
    php artisan migrate:fresh --seed
    if %errorlevel% neq 0 goto :error
) else (
    echo Omitiendo migraciones.
)

echo.
echo === Limpiando cachés ===
php artisan optimize:clear
if %errorlevel% neq 0 goto :error

echo.
echo === Compilando assets ===
set /p compilar="¿Deseas compilar los assets para desarrollo? (s/n): "
if /i "%compilar%"=="s" (
    echo Compilando assets...
    npm run build
    if %errorlevel% neq 0 goto :error
) else (
    echo Omitiendo compilación de assets.
)

echo.
echo ==========================================
echo   ENTORNO CONFIGURADO CORRECTAMENTE
echo ==========================================
echo.
echo Para iniciar el servidor de desarrollo usa:
echo.
echo   * En VS Code: Presiona F1 y ejecuta "Tasks: Run Task" y selecciona "Desarrollo: Iniciar todo"
echo   * Manualmente: Ejecuta "php artisan serve" y en otra terminal "npm run dev"
echo.
goto :end

:error
echo.
echo [ERROR] Se ha producido un error durante la configuración.
echo Por favor, revisa los mensajes anteriores.
exit /b 1

:end
echo.
echo Gracias por usar el script de configuración.
echo Presiona cualquier tecla para salir...
pause > nul
exit /b 0
