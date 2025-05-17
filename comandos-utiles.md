# Comandos Útiles para Desarrollo Laravel 12 + React

## Laravel - Comandos Básicos

### Servidor de Desarrollo

```bash
php artisan serve
```

### Tinker (REPL de Laravel)

```bash
php artisan tinker
```

### Limpiar Cachés

```bash
# Limpiar todas las cachés
php artisan optimize:clear

# O individualmente:
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

## Laravel - Base de Datos

### Migraciones

```bash
# Ejecutar migraciones
php artisan migrate

# Revertir última migración
php artisan migrate:rollback

# Rehacer base de datos desde cero
php artisan migrate:fresh

# Rehacer base de datos y ejecutar seeders
php artisan migrate:fresh --seed
```

### Seeders

```bash
# Ejecutar todos los seeders
php artisan db:seed

# Ejecutar un seeder específico
php artisan db:seed --class=UserSeeder
```

## Laravel - Generadores

### Generar Modelo con Migración y Factory

```bash
php artisan make:model NuevoModelo -mf
```

### Generar Controlador

```bash
# Controlador básico
php artisan make:controller NuevoController

# Controlador CRUD completo (con Modelo)
php artisan make:controller NuevoController --resource --model=NuevoModelo
```

### Generar Policy

```bash
php artisan make:policy NuevoModeloPolicy --model=NuevoModelo
```

## Pruebas

### Ejecutar Pruebas

```bash
# Todas las pruebas
php artisan test

# Prueba específica
php artisan test --filter=TestEspecifico
```

### Crear Pruebas

```bash
# Prueba de característica
php artisan make:test NuevaPruebaTest

# Prueba unitaria
php artisan make:test NuevaPruebaTest --unit
```

## React y Vite

### Desarrollo Frontend

```bash
# Iniciar servidor de Vite
npm run dev

# Compilar para producción
npm run build
```

### Instalación de Paquetes

```bash
# Instalar un paquete
npm install nombre-paquete

# Instalar paquete de desarrollo
npm install --save-dev nombre-paquete
```

## Git

### Flujo de Trabajo Básico

```bash
# Actualizar rama local
git pull origin main

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Añadir cambios
git add .

# Crear commit
git commit -m "feat: implementa nueva funcionalidad"

# Subir cambios
git push origin feature/nueva-funcionalidad
```

## Composer

### Gestión de Paquetes

```bash
# Instalar dependencias
composer install

# Actualizar dependencias
composer update

# Instalar un nuevo paquete
composer require proveedor/paquete
```

## Docker (Laravel Sail)

### Comandos Sail

```bash
# Iniciar contenedores
./vendor/bin/sail up

# Iniciar contenedores en segundo plano
./vendor/bin/sail up -d

# Detener contenedores
./vendor/bin/sail down
```

## Comandos de Mantenimiento

```bash
# Activar modo mantenimiento (con bypass IP)
php artisan down --secret="token-acceso" --allow=127.0.0.1

# Desactivar modo mantenimiento
php artisan up
```

## Inertia.js

### Validación Compartida

```php
// En el controlador
return Inertia::render('Formulario', [
    'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
]);
```

## Helpers de Depuración

```php
// Mostrar y continuar
dump($variable);

// Mostrar y detener
dd($variable);

// Rayos X para depuración elegante
ray($variable);
```

## Actualización de Dependencias

```bash
# Actualizar Laravel a la última versión
composer update laravel/framework

# Actualizar NPM paquetes
npm update
```

## Laravel Pint (Formateo de código)

```bash
# Formatear todo el código
./vendor/bin/pint

# Formatear un archivo específico
./vendor/bin/pint app/Models/User.php
```
