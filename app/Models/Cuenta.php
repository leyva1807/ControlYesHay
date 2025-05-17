<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuenta extends Model
{
    protected $fillable = [
        'numero_tarjeta',
        'numero_cuenta',
        'tipo_moneda',
        'tipo_cuenta',
        'banco_asociado',
        'estado',
        'fecha_apertura',
        'propietario_id'
    ];

    protected $appends = ['nombre_cuenta', 'titular_tarjeta_id'];

    /**
     * Accesorio para obtener un nombre legible de la cuenta, combinando banco y número
     */
    public function getNombreCuentaAttribute()
    {
        $banco = $this->banco_asociado ?? 'Banco';
        $numero = $this->numero_cuenta ?? $this->numero_tarjeta ?? 'Sin número';
        return "{$banco} - {$numero}";
    }

    /**
     * Accesorio para hacer compatible la propiedad titular_tarjeta_id con propietario_id
     */
    public function getTitularTarjetaIdAttribute()
    {
        return $this->propietario_id;
    }

    public function titular()
    {
        return $this->belongsTo(TitularTarjeta::class, 'propietario_id');
    }

    public function operaciones()
    {
        return $this->hasMany(Operacion::class);
    }
}
