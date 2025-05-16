<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'roles';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = ['nombre'];

    /**
     * Los usuarios que pertenecen a este rol.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Encuentra un rol por su nombre.
     *
     * @param string $nombre
     * @return self|null
     */
    public static function findByNombre(string $nombre): ?self
    {
        return static::where('nombre', $nombre)->first();
    }
}
