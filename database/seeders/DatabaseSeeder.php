<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Ejecutar los seeders en orden correcto
        $this->call([
            RoleSeeder::class,  // Primero los roles
            UserSeeder::class,  // Luego los usuarios (incluye asignación de roles)
            TitularTarjetaSeeder::class,
            CuentaSeeder::class,
            OperacionSeeder::class,
            // RoleUserSeeder::class, // Ya no necesario porque UserSeeder asigna roles
        ]);
    }
}
