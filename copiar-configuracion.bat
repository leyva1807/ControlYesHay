@echo off
REM Script para copiar la configuración optimizada al archivo global de VS Code

REM Ubicación del archivo global de configuración de VS Code
set VSCODE_SETTINGS=%APPDATA%\Code\User\settings.json

REM Crear copia de respaldo con fecha y hora
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set BACKUP=%VSCODE_SETTINGS%.backup.%datetime:~0,14%
echo Creando copia de seguridad en %BACKUP%...
copy "%VSCODE_SETTINGS%" "%BACKUP%"

REM Copiar la configuración optimizada
echo Copiando configuración optimizada...
copy "c:\laragon\www\ControlYesHay\configuracion-vscode-global.json" "%VSCODE_SETTINGS%"

echo.
echo Configuración copiada exitosamente.
echo Para activar todos los cambios, por favor reinicia VS Code.
echo.
pause
