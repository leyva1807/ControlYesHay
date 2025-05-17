#!/bin/bash

# Script para iniciar el entorno Docker de ControlYesHay

echo "Iniciando el entorno Docker de ControlYesHay..."

# Crear directorios necesarios si no existen
mkdir -p docker/mysql docker/nginx docker/php

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose no está instalado. Por favor, instálalo primero."
    exit 1
fi

# Compilar e iniciar los contenedores en segundo plano
docker-compose up -d

echo "Instalando dependencias de Composer..."
docker-compose exec app composer install

echo "Ejecutando migraciones..."
docker-compose exec app php artisan migrate

echo "Instalando dependencias de Node..."
npm install

echo "Compilando assets..."
npm run dev

echo "¡Entorno Docker de ControlYesHay iniciado correctamente!"
echo "Accede a la aplicación en http://localhost:8080"
