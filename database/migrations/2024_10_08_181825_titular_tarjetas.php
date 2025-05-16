<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones.
     */
    public function up(): void
    {
        Schema::create('titular_tarjetas', function (Blueprint $table) {
            $table->id(); // Clave primaria autoincremental del titular de la tarjeta

            $table->string('avatar')->nullable(); // Ruta o nombre del archivo del avatar (puede ser nulo)

            $table->string('nombre')->unique(); // Nombre completo del titular de la tarjeta (debe ser único)

            $table->string('telefono')->unique(); // Número de teléfono único del titular de la tarjeta

            $table->timestamps(); // Columnas 'created_at' y 'updated_at' para el seguimiento de cambios
        });
    }

    /**
     * Revierte las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('titular_tarjetas'); // Elimina la tabla 'titular_tarjetas' si existe
    }
};
