<?php

// Cargamos el framework sin ejecutar el script completo de Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Buscamos el rol admin
$adminRole = \App\Models\Role::where('nombre', 'admin')->first();
if ($adminRole) {
    echo "Rol Admin encontrado (ID: {$adminRole->id})\n";

    // Buscamos usuarios con ese rol
    $adminUsers = $adminRole->users;

    if ($adminUsers->count() > 0) {
        echo "Usuarios administradores encontrados:\n";
        foreach ($adminUsers as $user) {
            echo "- ID: {$user->id}, Nombre: {$user->name}, Email: {$user->email}\n";
        }
    } else {
        echo "No se encontraron usuarios con el rol de admin.\n";

        // Mostramos todos los usuarios disponibles
        echo "\nUsuarios disponibles en la base de datos:\n";
        $allUsers = \App\Models\User::all();
        foreach ($allUsers as $user) {
            echo "- ID: {$user->id}, Nombre: {$user->name}, Email: {$user->email}\n";
        }
    }
} else {
    echo "No se encontró el rol admin en la base de datos.\n";

    // Mostramos todos los roles disponibles
    $allRoles = \App\Models\Role::all();
    echo "Roles disponibles:\n";
    foreach ($allRoles as $role) {
        echo "- ID: {$role->id}, Nombre: {$role->nombre}\n";
    }

    // Mostramos todos los usuarios disponibles
    echo "\nUsuarios disponibles en la base de datos:\n";
    $allUsers = \App\Models\User::all();
    foreach ($allUsers as $user) {
        echo "- ID: {$user->id}, Nombre: {$user->name}, Email: {$user->email}\n";
    }
}

// Si no hay usuarios, creemos uno administrador
if (\App\Models\User::count() == 0) {
    echo "\nNo hay usuarios en la base de datos. Creando un administrador...\n";

    $user = \App\Models\User::create([
        'name' => 'Administrador',
        'email' => 'admin@controlyeshay.com',
        'password' => \Illuminate\Support\Facades\Hash::make('password'),
        'email_verified_at' => now(),
    ]);

    $adminRole = \App\Models\Role::where('nombre', 'admin')->first();
    if ($adminRole) {
        $user->roles()->attach($adminRole);
        echo "Se ha creado un usuario administrador con email: admin@controlyeshay.com y contraseña: password\n";
    } else {
        echo "No se pudo asignar el rol de administrador porque el rol no existe.\n";
    }
}
