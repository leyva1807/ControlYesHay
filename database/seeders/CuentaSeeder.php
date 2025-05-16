<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cuenta;
use App\Models\TitularTarjeta; // ✅ Import the correct model
use Faker\Factory as Faker;

class CuentaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $cantidadCuentas = 25;

        // ✅ Use TitularTarjeta instead of Propietario
        $titularTarjetaIds = TitularTarjeta::pluck('id')->toArray();

        if (empty($titularTarjetaIds)) {
            $this->command->warn('No hay titulares de tarjeta existentes.  Asegúrate de crear titulares antes de ejecutar este seeder.');
            return;
        }

        foreach (range(1, $cantidadCuentas) as $i) {
            $tipoMoneda = $faker->randomElement(['CUP', 'MLC', 'USD', 'Soles', 'saldo']); // Updated
            $tipoCuenta = $faker->randomElement(['Ahorro', 'Corriente', 'Credito']); // Updated
            $bancoAsociado = $faker->randomElement(['BPA', 'BANDED', 'BCP', 'Interbank', 'BBVA']); // Updated
            $saldoInicial = $faker->randomFloat(2, 100, 10000);
            $fechaApertura = $faker->dateTimeBetween('-2 years', 'now');

            Cuenta::create([
                'numero_tarjeta' => $faker->creditCardNumber(),
                'numero_cuenta' => strtoupper(substr($tipoMoneda, 0, 3)) . '-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                // ✅ Use propietario_id, and assign a TitularTarjeta ID
                'propietario_id' => $faker->randomElement($titularTarjetaIds),
                'tipo_moneda' => $tipoMoneda,
                'tipo_cuenta' => $tipoCuenta,
                'banco_asociado' => $bancoAsociado,
                'saldo' => $saldoInicial,
                'estado' => $faker->boolean(80),
                'fecha_apertura' => $fechaApertura,
                'created_at' => $fechaApertura,
                'updated_at' => $faker->dateTimeBetween($fechaApertura, 'now'),
            ]);
        }

        $this->command->info('Se crearon ' . $cantidadCuentas . ' cuentas.');
    }
}
