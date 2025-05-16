<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TitularTarjeta;

class TitularTarjetaSeeder extends Seeder
{
    public function run(): void
    {
        $titulares = [
            ['nombre' => 'ISM', 'telefono' => '+53 59381868'],
            ['nombre' => 'YAMILK', 'telefono' => '+53 58104788'],
            ['nombre' => 'MAMI', 'telefono' => '+53 59381988'],
            ['nombre' => 'HAYDE', 'telefono' => '+53 54370075'],
            ['nombre' => 'MAIKEL', 'telefono' => '+53 58103165'],
            ['nombre' => 'YARIMA', 'telefono' => '+53 56558089'],
            ['nombre' => 'MAITE', 'telefono' => '+53 53407777'],
            ['nombre' => 'M ESTER', 'telefono' => '+53 58818876'],
            ['nombre' => 'TATIANA', 'telefono' => '+53 55310937'],
            ['nombre' => 'ELIER', 'telefono' => '+53 54277258'],
            ['nombre' => 'ENZONA', 'telefono' => '+53 63627719'],
            ['nombre' => 'PAPITO', 'telefono' => '+53 50318845'],
            ['nombre' => 'JULIO', 'telefono' => '+53 58929271'],
            ['nombre' => 'Sergio', 'telefono' => '+53 58603525'],
        ];

        foreach ($titulares as $t) {
            // ✅ Evita duplicados usando firstOrCreate por el campo 'telefono'
            TitularTarjeta::firstOrCreate(
                ['telefono' => $t['telefono']],
                ['nombre' => $t['nombre']]
            );
        }
    }
}