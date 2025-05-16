<?php
require __DIR__."/vendor/autoload.php";

echo "==== Verificación de resolución de clase Role ====\n\n";

try {
    echo "Intentando crear un RoleFix directamente:\n";
    $roleFix = new App\RoleFix();
    echo "✅ Se creó RoleFix correctamente: " . get_class($roleFix) . "\n";
    echo "Tabla: " . $roleFix->getTable() . "\n\n";
    
    echo "Intentando resolver role a través de la función helper:\n";
    $role = get_role();
    echo "✅ Se obtuvo role a través de helper: " . get_class($role) . "\n\n";
    
    echo "Verificando si la función check_user_has_role existe:\n";
    if (function_exists("check_user_has_role")) {
        echo "✅ La función check_user_has_role existe\n\n";
    } else {
        echo "❌ La función check_user_has_role NO existe\n\n";
    }
    
    echo "La verificación se ha completado con éxito.";
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "En: " . $e->getFile() . " linea " . $e->getLine() . "\n";
}
