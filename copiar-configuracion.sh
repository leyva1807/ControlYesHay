#!/bin/bash
# Script para copiar la configuración optimizada al archivo global de VS Code

# Ubicación del archivo global de configuración de VS Code
VSCODE_SETTINGS="$APPDATA/Code/User/settings.json"

# Crear copia de respaldo con fecha y hora
BACKUP="$VSCODE_SETTINGS.backup.$(date +%Y%m%d%H%M%S)"
echo "Creando copia de seguridad en $BACKUP..."
cp "$VSCODE_SETTINGS" "$BACKUP"

# Copiar la configuración optimizada
echo "Copiando configuración optimizada..."
cp "$(pwd)/configuracion-vscode-global.json" "$VSCODE_SETTINGS"

echo ""
echo "Configuración copiada exitosamente."
echo "Para activar todos los cambios, por favor reinicia VS Code."
echo ""
read -p "Presiona Enter para continuar..."
