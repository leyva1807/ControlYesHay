<?php

namespace Tests\Feature;

use App\Http\Middleware\RoleMiddleware;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Prueba del middleware de roles simplificado.
 */
class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        // Configurar rutas de prueba protegidas por roles
        Route::middleware(['web', 'role:admin'])->get('/admin-route', function () {
            return 'Admin área';
        });

        Route::middleware(['web', 'role:operador,contadora'])->get('/staff-route', function () {
            return 'Staff área';
        });
    }

    /** @test */
    public function admin_user_can_access_admin_routes()
    {
        // Crear un usuario admin
        $adminUser = User::factory()->create();
        $adminUser->roles = ['admin'];
        $adminUser->save();

        $response = $this->actingAs($adminUser)->get('/admin-route');
        $response->assertStatus(200);
        $response->assertSee('Admin área');
    }

    /** @test */
    public function operador_user_cannot_access_admin_routes()
    {
        // Crear un usuario operador
        $operadorUser = User::factory()->create();
        $operadorUser->roles = ['operador'];
        $operadorUser->save();

        $response = $this->actingAs($operadorUser)->get('/admin-route');
        $response->assertStatus(403); // Acceso denegado
    }

    /** @test */
    public function users_with_allowed_roles_can_access_specific_routes()
    {
        // Crear usuarios con diferentes roles
        $operadorUser = User::factory()->create();
        $operadorUser->roles = ['operador'];
        $operadorUser->save();

        $contadoraUser = User::factory()->create();
        $contadoraUser->roles = ['contadora'];
        $contadoraUser->save();

        // Ambos deberían poder acceder a la ruta de staff
        $this->actingAs($operadorUser)->get('/staff-route')->assertStatus(200);
        $this->actingAs($contadoraUser)->get('/staff-route')->assertStatus(200);
    }

    /** @test */
    public function users_without_roles_cannot_access_protected_routes()
    {
        // Crear un usuario sin roles
        $user = User::factory()->create();
        $user->roles = [];
        $user->save();

        // No debería poder acceder a rutas protegidas
        $this->actingAs($user)->get('/admin-route')->assertStatus(403);
        $this->actingAs($user)->get('/staff-route')->assertStatus(403);
    }

    /** @test */
    public function unauthenticated_users_cannot_access_protected_routes()
    {
        // Usuarios no autenticados deberían ser redirigidos a login
        $this->get('/admin-route')->assertStatus(403);
        $this->get('/staff-route')->assertStatus(403);
    }
}
