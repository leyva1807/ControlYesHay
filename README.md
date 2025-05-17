# ControlYesHay

![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=flat-square&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![Inertia.js](https://img.shields.io/badge/Inertia.js-1.0-6675E0?style=flat-square)

## Descripción

ControlYesHay es una aplicación web para la gestión de tarjetas bancarias, cuentas y operaciones financieras. Desarrollada con Laravel 12, React, TypeScript e Inertia.js.

## Características

- **Gestión de titulares**: Registro y administración de titulares de tarjetas bancarias
- **Gestión de cuentas**: Control de cuentas bancarias asociadas a titulares
- **Registro de operaciones**: Seguimiento de transacciones realizadas
- **Sistema de roles simplificado**: Control de acceso basado en roles de usuario
- **Interfaz moderna**: Diseñada con Tailwind CSS y componentes React

## Tecnologías Utilizadas

- **Backend**:

    - Laravel 12
    - MySQL/SQLite
    - PHP 8.2+

- **Frontend**:
    - React 18
    - TypeScript
    - Tailwind CSS
    - Inertia.js
    - Vite.js

## Instalación

### Requisitos Previos

- PHP 8.2 o superior
- Composer
- Node.js 18+ y NPM
- MySQL/SQLite

### Pasos de Instalación

1. Clona el repositorio:

    ```bash
    git clone <url-del-repositorio>
    cd ControlYesHay
    ```

2. Configura el entorno:

    ```bash
    # Método rápido (Windows)
    ./setup-entorno.bat

    # O manualmente:
    composer install
    npm install
    cp .env.example .env
    php artisan key:generate
    ```

3. Configura tu archivo .env con los datos de tu base de datos

4. Ejecuta las migraciones y seeders:

    ```bash
    php artisan migrate:fresh --seed
    ```

5. Compila los activos:

    ```bash
    npm run build
    ```

6. Inicia el servidor:

    ```bash
    php artisan serve
    ```

7. Visita `http://localhost:8000` en tu navegador

## Estructura del Proyecto

```
ControlYesHay/
├── app/                  # Código principal de la aplicación
│   ├── Http/            # Controladores, middleware, y requests
│   ├── Models/          # Modelos Eloquent
│   └── Providers/       # Service providers
├── database/            # Migraciones y seeders
├── resources/           # Recursos frontend (React, CSS)
│   ├── js/             # Componentes React y TypeScript
│   │   ├── Components/ # Componentes React reutilizables
│   │   └── Pages/      # Componentes de página para Inertia
│   └── css/           # Archivos CSS/Tailwind
└── routes/              # Definiciones de rutas
```

## Desarrollo

### Comandos Útiles

- **Iniciar servidor de desarrollo**:

    ```bash
    # En VS Code:
    # Presiona F1 -> "Tasks: Run Task" -> "Desarrollo: Iniciar todo"

    # Manualmente (requiere dos terminales):
    php artisan serve
    npm run dev
    ```

- **Ejecutar pruebas**:

    ```bash
    php artisan test
    ```

- **Limpiar cachés**:
    ```bash
    php artisan optimize:clear
    ```

### Extensiones Recomendadas para VS Code

Ver archivo `.vscode/extensions.json` para una lista completa de extensiones recomendadas.

## Contribuir

Por favor, lee el archivo [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre nuestro proceso de contribución.

## Licencia

Este proyecto está licenciado bajo [Licencia MIT](LICENSE).

## Contacto

[Información de contacto del equipo o personas responsables del proyecto]
