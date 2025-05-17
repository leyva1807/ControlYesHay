# Guía para resolver el problema de memoria agotada en Laravel

Si experimentas el error "Allowed memory size of 512MB exhausted", hay varias maneras de solucionarlo:

## Solución 1: Usar el entorno Docker configurado

Este proyecto incluye una configuración de Docker optimizada con límites de memoria aumentados:

1. **Inicia el entorno Docker**:

    ```bash
    # En Linux/Mac
    ./scripts/docker-start.sh

    # En Windows
    scripts\docker-start.bat
    ```

2. **Beneficios**:
    - Límite de memoria PHP aumentado a 1GB
    - Configuración optimizada de MySQL
    - Entorno aislado y consistente para desarrollo

## Solución 2: Modificar la configuración de PHP en Laragon

Si prefieres seguir usando Laragon:

1. **Editar php.ini**:

    - Abre el menú de Laragon > PHP > php.ini
    - Busca `memory_limit` y cambia el valor a `1G`
    - Guarda y reinicia Laragon

2. **O mediante línea de comandos**:
    ```bash
    sed -i 's/memory_limit = 512M/memory_limit = 1G/g' /path/to/laragon/bin/php/phpX.X.X/php.ini
    ```

## Solución 3: Configuración local de PHP para este proyecto

Crea un archivo `.user.ini` en la raíz del proyecto:

```
memory_limit = 1G
max_execution_time = 120
```

## Otras optimizaciones

- **Optimiza consultas**: Revisa queries complejas que puedan consumir mucha memoria
- **Usa paginación**: En lugar de cargar todos los registros a la vez
- **Procesa por lotes**: Para operaciones masivas, procesa los datos en batches

## Monitoreo

Para monitorear el uso de memoria:

```php
// Al inicio del script
$memoryStart = memory_get_usage();

// En puntos críticos
$currentMemory = memory_get_usage();
Log::info("Uso de memoria: " . ($currentMemory - $memoryStart) . " bytes");
```

Recuerda que aumentar los límites de memoria es una solución temporal. Es mejor optimizar el código para reducir el consumo de memoria siempre que sea posible.
