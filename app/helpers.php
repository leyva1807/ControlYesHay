<?php

/**
 * Este archivo contiene definiciones globales para la aplicación.
 */

if (!function_exists('check_user_has_role')) {
    /**
     * Verifica si un usuario tiene un rol específico.
     * Esta función delega al objeto User para mantener la compatibilidad con el código existente.
     *
     * @param int $userId ID del usuario
     * @param string $roleName Nombre del rol
     * @return bool
     */
    function check_user_has_role(int $userId, string $roleName): bool {
        $user = \App\Models\User::find($userId);

        if (!$user) {
            return false;
        }

        return $user->hasRole($roleName);
    }
}
