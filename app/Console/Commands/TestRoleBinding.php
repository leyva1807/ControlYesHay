<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Role;

class TestRoleBinding extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-role-binding';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test if role binding is working properly';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando prueba de bindings de Role...');

        try {
            // Test 1: Resolución directa de la clase Role
            $role1 = app(Role::class);
            $this->info('✓ Test 1: Resolución de app(Role::class) exitosa');

            // Test 2: Resolución usando el alias 'role'
            $role2 = app('role');
            $this->info('✓ Test 2: Resolución de app("role") exitosa');

            // Test 3: Resolución usando el alias 'Role'
            $role3 = app('Role');
            $this->info('✓ Test 3: Resolución de app("Role") exitosa');

            // Test 4: Verificar si están retornando el mismo tipo de objeto
            if (get_class($role1) === get_class($role2) && get_class($role2) === get_class($role3)) {
                $this->info('✓ Test 4: Todos los bindings retornan el mismo tipo: ' . get_class($role1));
            } else {
                $this->error('✗ Test 4: Los bindings retornan tipos diferentes');
                $this->line('Clase 1: ' . get_class($role1));
                $this->line('Clase 2: ' . get_class($role2));
                $this->line('Clase 3: ' . get_class($role3));
            }

            // Test 5: Consulta a la base de datos
            $rolesCount = Role::count();
            $this->info('✓ Test 5: Consulta a la base de datos exitosa. Roles encontrados: ' . $rolesCount);

            $this->info('Todos los tests completados con éxito!');

        } catch (\Exception $e) {
            $this->error('Error durante la prueba: ' . $e->getMessage());
            $this->line('Trace: ');
            $this->line($e->getTraceAsString());
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
