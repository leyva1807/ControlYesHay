# Guía de Contribución al Proyecto

## Introducción

Bienvenido a la guía de contribución del proyecto ControlYesHay. Este documento está diseñado para ayudar a los desarrolladores a entender cómo contribuir efectivamente al proyecto.

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- PHP 8.2 o superior
- Composer
- Node.js 18+ y NPM
- Laravel 12
- Git

### Pasos de Configuración

1. Clona el repositorio:

    ```bash
    git clone <url-del-repositorio>
    cd ControlYesHay
    ```

2. Ejecuta el script de configuración:

    ```bash
    ./setup-entorno.bat
    ```

    Este script:

    - Instala dependencias PHP con Composer
    - Instala dependencias JavaScript con NPM
    - Crea el archivo `.env` si no existe
    - Ejecuta migraciones y seeders si se confirma
    - Limpia cachés
    - Compila assets si se confirma

3. Alternativamente, puedes configurar el entorno manualmente:
    ```bash
    composer install
    npm install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate:fresh --seed
    php artisan optimize:clear
    npm run build
    ```

## Flujo de Trabajo de Desarrollo

### Ramas

- `main`: Rama principal, siempre estable
- `develop`: Rama de desarrollo principal
- `feature/nombre-funcionalidad`: Para nuevas funcionalidades
- `bugfix/nombre-bug`: Para correcciones de errores

### Commits

Seguimos una convención de mensajes de commit estructurados:

```
tipo(ámbito): descripción

cuerpo
```

Donde:

- **tipo**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- **ámbito**: (opcional) parte del código afectada
- **descripción**: resumen conciso de los cambios
- **cuerpo**: (opcional) explicación más detallada

Ejemplos:

- `feat(roles): implementar sistema simplificado de roles`
- `fix(auth): corregir error en validación de permisos`

### Pull Requests

1. Asegúrate de que tu rama esté actualizada con la rama destino (`develop` o `main`)
2. Ejecuta y verifica que pasen todas las pruebas
3. Sigue el formato de PR:
    - Título claro y descriptivo
    - Descripción del problema que resuelve
    - Cómo se ha probado
    - Screenshots si aplica

## Estándares de Código

### Laravel

- Seguimos [PSR-12](https://www.php-fig.org/psr/psr-12/) para estilo de código PHP
- Utilizamos Laravel Pint para formatear código PHP
- Nombramos controladores en singular y PascalCase: `UserController`
- Nombramos modelos en singular y PascalCase: `TitularTarjeta`
- Nombramos tablas en plural y snake_case: `titular_tarjetas`

### React/TypeScript

- Utilizamos componentes funcionales con hooks
- Nombramos componentes en PascalCase: `TitularForm`
- Usamos tipos TypeScript para todos los componentes y funciones
- Seguimos formato con Prettier

## Pruebas

- Utilizamos Pest para pruebas en PHP
- Asegúrate de que todas las pruebas pasen antes de enviar un PR:
    ```bash
    php artisan test
    ```

## Documentación

- Documenta las nuevas características en los archivos README correspondientes
- Usa comentarios PHPDoc para funciones y métodos
- Para componentes React, incluye una descripción de props y funcionalidad

## Contacto

Si tienes dudas, puedes contactar al equipo de desarrollo a través de:

- [Email del equipo de desarrollo]
- [Canal de comunicación]

## Reconocimientos

¡Gracias por contribuir a ControlYesHay! Tu tiempo y esfuerzo son muy apreciados.
