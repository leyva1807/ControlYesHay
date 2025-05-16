<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Operacion;
use App\Models\Cuenta;
use App\Models\TitularTarjeta; // Asegúrate de importar TitularTarjeta
use App\Models\User; // Asegúrate de importar User
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB; // Para transacciones si es necesario

class OperacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('es_ES'); // Usar localización para datos más realistas si aplica
        $cantidadOperaciones = 50;

        // Obtener todos los IDs existentes
        $cuentasIds = Cuenta::pluck('id')->toArray();
        $titularIds = TitularTarjeta::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray();

        if (empty($cuentasIds)) {
            $this->command->warn('No hay cuentas existentes. Ejecuta CuentaSeeder primero.');
            return;
        }
        if (empty($titularIds)) {
            $this->command->warn('No hay titulares existentes. Ejecuta TitularTarjetaSeeder primero.');
            return;
        }
        if (empty($userIds)) {
            $this->command->warn('No hay usuarios existentes. Asegúrate de tener usuarios en la BD.');
            // Podrías crear un usuario por defecto aquí si lo deseas
             User::factory()->create(['name' => 'Usuario Seeder', 'email' => 'seeder@example.com']);
             $userIds = User::pluck('id')->toArray();
            if(empty($userIds)) return; // Salir si aún no hay usuarios
            return;
        }

        $this->command->info("Creando {$cantidadOperaciones} operaciones...");

        for ($i = 0; $i < $cantidadOperaciones; $i++) {
            $tipoOperacion = $faker->randomElement(['transferencia', 'efectivo', 'saldo']);
            $fechaOperacion = $faker->dateTimeBetween('-1 year', 'now'); // Rango más amplio
            $monto = $faker->randomFloat(2, 5, 10000);
            // Unificar tipos de moneda con los usados en el controlador
            $tipoMoneda = $faker->randomElement(['CUP', 'MLC', 'USD', 'Soles']);
            $estado = $faker->randomElement(['pendiente', 'aprobada', 'pagada', 'en proceso', 'completada', 'cancelada']);
            $cuentaId = $faker->randomElement($cuentasIds);
            $propietarioId = $faker->randomElement($titularIds);
            $usuarioOrdenaId = $faker->randomElement($userIds);
            // Opcionalmente, asignar un usuario que ejecuta solo para algunos estados
            $usuarioEjecutaId = null;
            if (in_array($estado, ['aprobada', 'pagada', 'en proceso', 'completada'])) {
                $usuarioEjecutaId = $faker->optional(0.7)->randomElement($userIds); // 70% de probabilidad
            }

            try {
                Operacion::create([
                    'numero_operacion' => 'OP-' . $fechaOperacion->format('Ymd') . '-' . strtoupper(Str::random(6)), // Formato consistente
                    'numero_voucher_remitente' => $faker->optional(0.8)->numerify('VREM-######'), // Corregido y opcional
                    'numero_voucher_destinatario' => $faker->optional(0.8)->numerify('VDES-######'), // Corregido y opcional
                    'tipo_operacion' => $tipoOperacion,
                    'fecha_operacion' => $fechaOperacion,
                    'orden' => $faker->optional(0.9)->sentence(4), // Más corto y opcional
                    'cuenta_id' => $cuentaId,
                    'propietario_id' => $propietarioId, // Añadido
                    'monto' => $monto,
                    'tipo_moneda' => $tipoMoneda,
                    'cuenta_destino' => ($tipoOperacion === 'transferencia') ? $faker->bankAccountNumber : null, // Usar bankAccountNumber para IBAN/Cuentas
                    'telefono_notificar' => $faker->optional(0.7)->e164PhoneNumber, // Formato E.164
                    'telefono_cliente' => $faker->optional(0.7)->e164PhoneNumber,
                    'usuario_ordena_id' => $usuarioOrdenaId, // Asignado
                    'usuario_ejecuta_id' => $usuarioEjecutaId, // Asignado condicionalmente
                    'detalles' => $faker->optional(0.6)->paragraph(2),
                    'imagen_pago' => $faker->optional(0.3)->imageUrl(640, 480, 'finance', true, 'transfer'), // Más específico
                    'voucher_generado' => $faker->optional(0.5)->text(150),
                    'estado' => $estado,
                    // created_at y updated_at son manejados por Eloquent automáticamente
                ]);
            } catch (\Illuminate\Database\QueryException $e) {
                $this->command->error("Error de base de datos al crear operación: " . $e->getMessage());
                // Podrías querer registrar el error y continuar, o detenerte
            } catch (\Exception $e) {
                $this->command->error("Error general al crear operación: " . $e->getMessage());
            }
        }

        $this->command->info('Se crearon ' . Operacion::count() . ' operaciones en total (o se intentaron crear).');
    }
}
