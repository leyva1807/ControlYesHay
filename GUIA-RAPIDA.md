# Guía Rápida de Desarrollo para ControlYesHay

Esta guía proporciona un resumen conciso de las tareas de desarrollo más comunes y cómo realizarlas en este proyecto.

## 🚀 Iniciar Entorno de Desarrollo

### Método recomendado (VS Code)

1. Presiona `F1` o `Ctrl+Shift+P`
2. Escribe "Tasks: Run Task"
3. Selecciona "Desarrollo: Iniciar todo"

### Método alternativo (Terminal)

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

## 📋 Estructura del Proyecto

```
ControlYesHay/
├── app/              # Lógica principal de la aplicación
│   ├── Http/         # Controladores, middleware y requests
│   └── Models/       # Modelos Eloquent
├── resources/        # Frontend
│   ├── js/          # Código React y TypeScript
│   └── css/         # Estilos
└── routes/           # Definición de rutas
```

## 🔄 Flujo de Trabajo

### Ciclo de desarrollo típico

1. Realiza cambios en el código
2. Los servidores de desarrollo refrescan automáticamente
3. Verifica en el navegador (http://localhost:8000)

### Comandos útiles

- **Limpiar caché**: `F1` > "Tasks" > "Laravel: Limpiar caché"
- **Ejecutar pruebas**: `F1` > "Tasks" > "Laravel: Pruebas con Pest"
- **Migraciones**: `F1` > "Tasks" > "Laravel: Migración fresca con datos"

## 🛠 Tareas Comunes de Desarrollo

### Crear nuevos componentes React

1. Crea un archivo en `resources/js/Components/`
2. Usa esta plantilla:

```tsx
import React from 'react';

interface MiComponenteProps {
    // Define tus props aquí
}

export default function MiComponente({ ...props }: MiComponenteProps) {
    return <div>{/* Contenido del componente */}</div>;
}
```

### Crear un nuevo modelo Laravel con migraciones

```bash
php artisan make:model NuevoModelo -m
```

### Crear un controlador con métodos CRUD

```bash
php artisan make:controller NuevoController --resource --model=NuevoModelo
```

### Añadir rutas en Inertia

1. Define la ruta en `routes/web.php`:

```php
Route::resource('nuevo', NuevoController::class);
```

2. Crea el componente de página en `resources/js/Pages/`
3. Renderiza desde el controlador:

```php
return Inertia::render('NuevoComponente', [
    'datos' => $datos
]);
```

## 🔍 Depuración

### PHP

- Usa `dd($variable)` o `dump($variable)` para depurar
- Configura Xdebug: `F5` > "Escuchar Xdebug"

### JavaScript/React

- Usa la extensión React DevTools en Chrome
- Usa `console.log()` para depuración básica
- En componentes React:

```jsx
console.log('Datos:', props.datos);
```

## 📝 Convenciones de Código

### PHP/Laravel

- Seguimos PSR-12
- Usar inyección de dependencias
- Mantener controladores ligeros (lógica en servicios)

### React/TypeScript

- Componentes funcionales con hooks
- Interfaces para props
- Formateado con Prettier

## 🔒 Sistema de Roles (Simplificado)

### Verificación de roles

```php
// En controladores
if ($user->hasRole('admin')) {
    // Acción solo para administradores
}

// En middleware
Route::get('/admin', function () {
    // ...
})->middleware('role:admin');
```

### Roles disponibles

- `admin`: Acceso completo
- `operador`: Gestión de operaciones
- `contadora`: Visualización de informes financieros

## 📚 Recursos Adicionales

- **README.md**: Documentación general del proyecto
- **CONTRIBUTING.md**: Guía completa de contribución
- **comandos-utiles.md**: Lista detallada de comandos
- **guia-copilot-para-aprender.md**: Uso de GitHub Copilot

## 🆘 Solución de Problemas Comunes

### Error: "Target class does not exist"

1. Limpia todas las cachés: `php artisan optimize:clear`
2. Verifica que la clase esté correctamente importada

### Error: "Module not found"

1. Asegúrate de que las rutas de importación son correctas
2. Verifica que el paquete está instalado: `npm install`
3. Reinicia el servidor de Vite: `npm run dev`

### Base de datos desincronizada

Ejecuta: `F1` > "Tasks" > "Laravel: Migración fresca con datos"

## 🔐 Credenciales por Defecto

- **Admin**: admin@example.com / password
- **Operador**: operador@example.com / password
- **Contadora**: contadora@example.com / password
