<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuenta extends Model
{
    protected $fillable = [
        'numero_tarjeta', 'numero_cuenta', 'tipo_moneda',
        'tipo_cuenta', 'banco_asociado', 'estado',
        'fecha_apertura', 'propietario_id'
    ];

    public function titular()
    {
        return $this->belongsTo(TitularTarjeta::class, 'propietario_id');
    }

    public function operaciones()
    {
        return $this->hasMany(Operacion::class);
    }
}