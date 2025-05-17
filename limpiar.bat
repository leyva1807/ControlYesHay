@echo off
REM Script para limpiar archivos temporales y cachés de Laravel
ECHO.
ECHO ===========================================
ECHO   LIMPIEZA DE ARCHIVOS TEMPORALES Y CACHÉ
ECHO ===========================================
ECHO.

REM Mostrar hora de inicio
ECHO Inicio: %TIME%
ECHO.

ECHO === Limpiando cachés de Laravel ===
call php artisan optimize:clear
ECHO.

ECHO === Limpiando archivos temporales ===
REM Limpia la carpeta bootstrap/cache (excepto .gitignore)
ECHO Limpiando bootstrap/cache...
for %%i in (bootstrap\cache\*.php) do (
    del /F /Q "%%i"
)

REM Limpia la carpeta storage/framework/cache/data (excepto .gitignore)
ECHO Limpiando storage/framework/cache/data...
for /d %%i in (storage\framework\cache\data\*) do (
    if not "%%~nxi"==".gitignore" (
        rd /s /q "%%i"
    )
)
del /F /Q storage\framework\cache\data\*.* 2>nul

REM Limpia la carpeta storage/framework/sessions (excepto .gitignore)
ECHO Limpiando storage/framework/sessions...
del /F /Q storage\framework\sessions\*.* 2>nul

REM Limpia la carpeta storage/framework/views (excepto .gitignore)
ECHO Limpiando storage/framework/views...
del /F /Q storage\framework\views\*.* 2>nul

REM Limpia la carpeta storage/logs (excepto .gitignore)
ECHO Limpiando storage/logs...
del /F /Q storage\logs\*.log 2>nul

REM Limpia node_modules/.cache si existe
if exist node_modules\.cache (
    ECHO Limpiando node_modules/.cache...
    rd /s /q node_modules\.cache 2>nul
)

REM Limpia carpeta .phpunit.cache si existe
if exist .phpunit.cache (
    ECHO Limpiando .phpunit.cache...
    rd /s /q .phpunit.cache 2>nul
)

ECHO.
ECHO === Eliminando archivos temporales del sistema ===
del /F /Q *.tmp 2>nul
del /F /Q *._mp 2>nul
del /F /Q *.log 2>nul
del /F /Q *.~* 2>nul
del /F /Q *.bak 2>nul
del /F /Q *.dmp 2>nul

ECHO.
ECHO === Limpieza completa ===
ECHO Inicio: %TIME%
ECHO.
ECHO Los archivos temporales y cachés han sido eliminados.
ECHO Presiona cualquier tecla para salir...
pause > nul
