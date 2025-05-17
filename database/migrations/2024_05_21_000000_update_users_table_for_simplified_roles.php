<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Agregar columna para almacenar los roles como JSON
            if (!Schema::hasColumn('users', 'roles')) {
                $table->json('roles')->nullable()->after('remember_token');
            }
        });

        // Migrar roles existentes desde la tabla role_user a la nueva columna roles en users
        $this->migrateExistingRoles();
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'roles')) {
                $table->dropColumn('roles');
            }
        });
    }

    /**
     * Migra los roles existentes a la nueva estructura
     */
    protected function migrateExistingRoles(): void
    {
        try {
            // Comprueba si existe la tabla role_user
            if (Schema::hasTable('role_user') && Schema::hasTable('roles')) {
                $db = DB::table('users')->get();

                foreach ($db as $user) {
                    // Buscar los roles del usuario en la tabla role_user
                    $roleIds = DB::table('role_user')
                        ->where('user_id', $user->id)
                        ->pluck('role_id')
                        ->toArray();

                    if (!empty($roleIds)) {
                        // Obtener los nombres de los roles
                        $roleNames = DB::table('roles')
                            ->whereIn('id', $roleIds)
                            ->pluck('nombre') // Asumiendo que la columna se llama 'nombre'
                            ->toArray();

                        if (!empty($roleNames)) {
                            // Actualizar el usuario con la nueva estructura de roles
                            DB::table('users')
                                ->where('id', $user->id)
                                ->update(['roles' => json_encode($roleNames)]);
                        }
                    } else {
                        // Establece un array vacío para usuarios sin roles
                        DB::table('users')
                            ->where('id', $user->id)
                            ->update(['roles' => json_encode([])]);
                    }
                }
            }
        } catch (\Exception $e) {
            // Log el error pero no impide que la migración avance
            Log::error("Error al migrar roles: " . $e->getMessage());
        }
    }
};
