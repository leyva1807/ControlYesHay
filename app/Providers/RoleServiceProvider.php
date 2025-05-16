<?php

namespace App\Providers;

use App\Models\Role;
use App\RoleFix;
use Illuminate\Support\ServiceProvider;

class RoleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // SOLUCIÓN DEFINITIVA: Usar RoleFix como una implementación alternativa para evitar
        // problemas de resolución circular con el modelo Role principal
        $this->app->bind('role', function ($app) {
            return new RoleFix();
        });

        // Registrar también con mayúscula inicial
        $this->app->bind('Role', function ($app) {
            return new RoleFix();
        });

        // También registrar directamente Role::class para que pueda ser resuelto
        $this->app->bind(Role::class, function ($app) {
            return new Role();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
