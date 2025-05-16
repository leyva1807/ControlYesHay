<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones para crear la tabla 'cuentas'.
     */
    public function up(): void
    {
        Schema::create('cuentas', function (Blueprint $table) {
            $table->id(); // ID de la cuenta

            // Relación con titular_tarjetas
            $table->foreignId('propietario_id')
                ->constrained('titular_tarjetas')
                ->onDelete('cascade'); // Si se elimina el titular, eliminar sus cuentas

            // Información de la cuenta
            $table->enum('tipo_moneda', ['CUP', 'MLC', 'USD', 'Soles', 'saldo']); // Moneda de la cuenta
            $table->string('numero_cuenta')->nullable()->unique();
            $table->string('numero_tarjeta')->unique(); // Número de tarjeta
            $table->enum('tipo_cuenta', ['Ahorro', 'Corriente', 'Crédito']); // Tipo de cuenta
            $table->date('fecha_apertura')->useCurrent(); // Fecha de apertura (por defecto la fecha actual)
            $table->boolean('estado')->default(true); // Estado de la cuenta (activa/inactiva)
            $table->enum('banco_asociado', ['BPA', 'BANDED', 'BCP', 'Interbank', 'BBVA'])->nullable(); // Banco asociado (opcional)
            $table->decimal('saldo', 15, 2)->default(0.00); // Saldo de la cuenta (por defecto 0.00)

            $table->timestamps(); // created_at y updated_at

            // Índice combinado opcional (dependiendo de las consultas frecuentes)
            // $table->index(['propietario_id', 'tipo_moneda', 'estado']);
        });
    }

    /**
     * Revierte las migraciones, eliminando la tabla 'cuentas'.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuentas');
    }
};
