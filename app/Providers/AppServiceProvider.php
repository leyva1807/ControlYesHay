<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */    public function register(): void
    {
        // Solución al error "Target class [role] does not exist"
        // Registramos el modelo Role en el contenedor de servicios de múltiples formas
        $this->app->singleton('role', function ($app) {
            return new Role();
        });

        $this->app->singleton('Role', function ($app) {
            return new Role();
        });

        // Binding directo de la clase
        $this->app->bind(Role::class, function ($app) {
            return new Role();
        });

        // Alias con nombre corto (solo en una dirección para evitar recursión infinita)
        $this->app->alias(Role::class, 'role');
        $this->app->alias(Role::class, 'Role');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
       // Por lo general, la carga de routes/api.php se maneja en RouteServiceProvider.
       // Si esa es tu configuración por defecto, puedes eliminar las siguientes líneas:
       // Route::middleware('api')
       //  ->prefix('api')
       //  ->group(base_path('routes/api.php'));
    }
}
