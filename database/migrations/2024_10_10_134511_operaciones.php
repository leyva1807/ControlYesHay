<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('operaciones', function (Blueprint $table) {
            $table->id();
            $table->string('numero_operacion', 20)->unique();
            $table->string('numero_voucher_remitente', 30)->nullable();
            $table->string('numero_voucher_destinatario', 30)->nullable();
            $table->enum('tipo_operacion', ['transferencia', 'efectivo', 'saldo'])->default('transferencia');
            $table->dateTime('fecha_operacion')->useCurrent();
            $table->string('orden')->nullable();
            $table->foreignId('cuenta_id')->constrained('cuentas')->onDelete('cascade');
            $table->foreignId('propietario_id')->constrained('titular_tarjetas')->onDelete('cascade');
            $table->decimal('monto', 15, 2);
            $table->string('tipo_moneda', 10);
            $table->string('cuenta_destino')->nullable();
            $table->string('telefono_notificar', 20)->nullable();
            $table->string('telefono_cliente', 20)->nullable();
            $table->foreignId('usuario_ordena_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('usuario_ejecuta_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('detalles')->nullable();
            $table->string('imagen_pago', 255)->nullable();
            $table->text('voucher_generado')->nullable();
            $table->enum('estado', [
                'pendiente',
                'aprobada',
                'pagada',
                'en proceso',
                'completada',
                'cancelada'
            ])->default('pendiente');
            $table->timestamps();
            $table->index(['cuenta_id', 'numero_operacion', 'fecha_operacion']);
            $table->index('propietario_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operaciones');
    }
};
