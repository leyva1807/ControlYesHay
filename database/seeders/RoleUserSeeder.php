<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoleUser;
use App\Models\User;
use App\Models\Role;

class RoleUserSeeder extends Seeder
{
    public function run(): void
    {
        // Este seeder ya no es necesario, ya que UserSeeder se encarga de asignar roles
        // Sin embargo, lo mantenemos por compatibilidad

        // Busca usuarios con el rol 'admin'
        $admins = User::whereHas('roles', function($query) {
            $query->where('nombre', 'admin');
        })->get();

        $this->command->info('Usuarios administradores existentes: ' . $admins->count());

        // Si no hay administradores, busca el primer usuario y el rol admin
        if ($admins->count() === 0) {
            $admin = User::first();
            $roleAdmin = Role::where('nombre', 'admin')->first();

            if ($admin && $roleAdmin) {
                RoleUser::firstOrCreate([
                    'user_id' => $admin->id,
                    'role_id' => $roleAdmin->id,
                ]);

                $this->command->info('Se asignó el rol admin al usuario: ' . $admin->email);
            }
        }
    }
}
