<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TitularTarjeta extends Model
{
    protected $fillable = ['nombre', 'telefono', 'avatar'];

    public function cuentas()
    {
        return $this->hasMany(Cuenta::class, 'propietario_id');
    }

    public function operaciones()
    {
        return $this->hasMany(Operacion::class, 'propietario_id');
    }
}