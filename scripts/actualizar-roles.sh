#!/bin/bash

# Script para actualizar el sistema de roles

echo "Actualizando el sistema de roles de ControlYesHay..."

# Ejecutar la migración para añadir la columna roles
echo "Ejecutando migración para añadir columna roles..."
php artisan migrate

# Reiniciar la caché
echo "Limpiando caché..."
php artisan optimize:clear

# Ejecutar el script de prueba de roles
echo "Ejecutando prueba de roles..."
php tests/test-roles-simplificado.php

echo ""
echo "El sistema de roles ha sido actualizado y probado."
echo "Si hubo errores, revisa el mensaje anterior."
