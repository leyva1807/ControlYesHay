<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Operacion extends Model
{
    protected $table = 'operaciones'; // Especificar el nombre correcto de la tabla

    protected $fillable = [
        'numero_operacion',
        'numero_voucher_remitente', // Corregido
        'numero_voucher_destinatario', // Corregido
        'tipo_operacion',
        'fecha_operacion',
        'orden',
        'cuenta_id',
        'propietario_id', // Añadido
        'monto',
        'tipo_moneda',
        'cuenta_destino',
        'telefono_notificar',
        'telefono_cliente',
        'usuario_ordena_id',
        'usuario_ejecuta_id',
        'detalles',
        'imagen_pago',
        'voucher_generado',
        'estado',
    ];

    /**
     * Get the cuenta associated with the operacion.
     */
    public function cuenta(): BelongsTo
    {
        return $this->belongsTo(Cuenta::class);
    }

    /**
     * Get the propietario (TitularTarjeta) associated with the operacion.
     */
    public function propietario(): BelongsTo
    {
        return $this->belongsTo(TitularTarjeta::class, 'propietario_id');
    }

    /**
     * Get the user who ordered the operacion.
     */
    public function usuarioOrdena(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_ordena_id');
    }

    /**
     * Get the user who executed the operacion.
     */
    public function usuarioEjecuta(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_ejecuta_id');
    }

    /**
     * Accesorio para obtener la URL completa de la imagen de pago
     */
    protected $appends = ['imagen_pago_url'];

    public function getImagenPagoUrlAttribute()
    {
        if (!$this->imagen_pago) {
            return null;
        }

        return asset('storage/' . $this->imagen_pago);
    }
}
