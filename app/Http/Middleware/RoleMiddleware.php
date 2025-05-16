<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Maneja una solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  Uno o más roles permitidos
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = auth()->user();

        // Verifica que el usuario esté autenticado
        if (!$user) {
            abort(403, 'Acceso denegado. Usuario no autenticado.');
        }

        // Si no se especifican roles, permitir acceso (evita problemas en rutas sin roles)
        if (empty($roles)) {
            return $next($request);
        }

        // Implementación simplificada: usar el método hasAnyRole del modelo User
        if ($user->hasAnyRole($roles)) {
            return $next($request);
        }

        // Si no tiene ninguno de los roles requeridos
        abort(403, 'Acceso denegado. No tienes el rol necesario.');
    }
}
