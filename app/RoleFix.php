<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Esta es una implementación alternativa de Role para usar como reemplazo directo
 * cuando hay problemas con la resolución de la clase original.
 *
 * Se posiciona en el namespace App para evitar conflictos con App\Models\Role
 */
class RoleFix extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     */
    protected $table = 'roles';

    /**
     * Los atributos que son asignables masivamente.
     */
    protected $fillable = ['nombre'];

    /**
     * Los usuarios que pertenecen a este rol.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\User::class, 'role_user', 'role_id', 'user_id');
    }

    /**
     * Encuentra un rol por su nombre.
     */
    public static function findByNombre(string $nombre): ?self
    {
        return static::where('nombre', $nombre)->first();
    }
}
