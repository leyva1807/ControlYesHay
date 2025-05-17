<?php
// Este archivo valida el funcionamiento del nuevo sistema de roles simplificado

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// 1. Verificar la existencia de la columna 'roles' en la tabla users
try {
    $columnExists = Schema::hasColumn('users', 'roles');
    echo "✅ Estado de la columna 'roles' en users: " . ($columnExists ? "Existe" : "No existe") . "\n";

    if (!$columnExists) {
        echo "❌ ALERTA: La columna 'roles' no existe. Ejecuta primero las migraciones con php artisan migrate\n";
        exit(1);
    }
} catch (Exception $e) {
    echo "❌ Error al verificar la estructura de la base de datos: " . $e->getMessage() . "\n";
    exit(1);
}

// 2. Crear un usuario de prueba con roles
try {
    $testUser = User::updateOrCreate(
        ['email' => 'prueba-roles@test.com'],
        [
            'name' => 'Usuario de Prueba',
            'password' => Hash::make('password'),
            'roles' => ['admin', 'operador']
        ]
    );
    echo "✅ Usuario de prueba creado/actualizado correctamente\n";
} catch (Exception $e) {
    echo "❌ Error al crear usuario de prueba: " . $e->getMessage() . "\n";
    exit(1);
}

// 3. Verificar el funcionamiento del método hasRole
try {
    $userHasAdminRole = $testUser->hasRole('admin');
    $userHasOperadorRole = $testUser->hasRole('operador');
    $userHasContadoraRole = $testUser->hasRole('contadora');
    
    echo "✅ Verificación de hasRole():\n";
    echo "   - hasRole('admin'): " . ($userHasAdminRole ? "Verdadero" : "Falso") . " (Esperado: Verdadero)\n";
    echo "   - hasRole('operador'): " . ($userHasOperadorRole ? "Verdadero" : "Falso") . " (Esperado: Verdadero)\n";
    echo "   - hasRole('contadora'): " . ($userHasContadoraRole ? "Verdadero" : "Falso") . " (Esperado: Falso)\n";
    
    if (!$userHasAdminRole || !$userHasOperadorRole || $userHasContadoraRole) {
        echo "❌ El método hasRole() no funcionó como se esperaba\n";
    }
} catch (Exception $e) {
    echo "❌ Error al verificar hasRole(): " . $e->getMessage() . "\n";
}

// 4. Verificar el funcionamiento del método hasAnyRole
try {
    $userHasAnyRoleAdminOperador = $testUser->hasAnyRole(['admin', 'operador']);
    $userHasAnyRoleContadoraEditor = $testUser->hasAnyRole(['contadora', 'editor']);
    
    echo "✅ Verificación de hasAnyRole():\n";
    echo "   - hasAnyRole(['admin', 'operador']): " . ($userHasAnyRoleAdminOperador ? "Verdadero" : "Falso") . " (Esperado: Verdadero)\n";
    echo "   - hasAnyRole(['contadora', 'editor']): " . ($userHasAnyRoleContadoraEditor ? "Verdadero" : "Falso") . " (Esperado: Falso)\n";
    
    if (!$userHasAnyRoleAdminOperador || $userHasAnyRoleContadoraEditor) {
        echo "❌ El método hasAnyRole() no funcionó como se esperaba\n";
    }
} catch (Exception $e) {
    echo "❌ Error al verificar hasAnyRole(): " . $e->getMessage() . "\n";
}

// 5. Probar el método setRoles
try {
    $testUser->setRoles(['contadora']);
    $testUser->save();
    
    $userHasContadoraRoleAfterSet = $testUser->hasRole('contadora');
    $userHasAdminRoleAfterSet = $testUser->hasRole('admin');
    
    echo "✅ Verificación de setRoles():\n";
    echo "   - hasRole('contadora') después de setRoles(['contadora']): " . ($userHasContadoraRoleAfterSet ? "Verdadero" : "Falso") . " (Esperado: Verdadero)\n";
    echo "   - hasRole('admin') después de setRoles(['contadora']): " . ($userHasAdminRoleAfterSet ? "Verdadero" : "Falso") . " (Esperado: Falso)\n";
    
    if (!$userHasContadoraRoleAfterSet || $userHasAdminRoleAfterSet) {
        echo "❌ El método setRoles() no funcionó como se esperaba\n";
    }
    
    // Restaurar roles originales para futuras pruebas
    $testUser->setRoles(['admin', 'operador']);
    $testUser->save();
} catch (Exception $e) {
    echo "❌ Error al verificar setRoles(): " . $e->getMessage() . "\n";
}

echo "\n✅ Validación del sistema de roles simplificado completada.\n";
