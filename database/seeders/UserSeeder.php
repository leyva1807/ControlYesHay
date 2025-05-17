<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador con contraseña personalizada
        $admin = User::updateOrCreate(
            ['email' => 'seeder@example.com'],
            [
                'name' => 'Administrador',
                'email' => 'seeder@example.com',
                'password' => Hash::make('ControlYesHay2025!'), // Nueva contraseña más segura
                'email_verified_at' => now(),
            ]
        );

        // Asignar el rol 'admin' al usuario administrador en el nuevo sistema de roles
        if (!$admin->hasRole('admin')) {
            $admin->roles = ['admin'];
            $admin->save();
        }

        // También podemos crear otros usuarios si es necesario
        User::factory()->create([
            'name' => 'Operador',
            'email' => 'operador@controlyeshay.com',
            'password' => Hash::make('operador2025'),
        ]);

        $this->command->info('Usuario administrador creado/actualizado con éxito.');
        $this->command->info('Email: seeder@example.com');
        $this->command->info('Contraseña: ControlYesHay2025!');
    }
}
