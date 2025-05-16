<?php
require __DIR__."/vendor/autoload.php";

echo "Verificando si la clase Role existe y puede ser instanciada:\n";

try {
    $role = new App\\Models\\Role();
    echo "✓ Se pudo crear una instancia de Role directamente\n";
    
    echo "La clase Role tiene los siguientes métodos:\n";
    print_r(get_class_methods($role));
    
    echo "\nLa tabla asignada al modelo es: " . $role->getTable() . "\n";
    
    echo "Verificación exitosa. La clase Role existe y funciona correctamente.";
} catch (Exception $e) {
    echo "Error al instanciar Role: " . $e->getMessage();
}
