<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Los atributos que se pueden asignar en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Los atributos que deben ocultarse para la serialización.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deben convertirse a tipos nativos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }    /**
     * Array de roles del usuario (simplificado para evitar problemas de resolución)
     * Posibles valores: 'admin', 'operador', 'contadora'
     *
     * @var array<string>
     */
    protected $userRoles = ['admin']; // Por defecto asignamos admin para pruebas

    /**
     * Verifica si el usuario tiene un rol específico.
     * Implementación simplificada sin depender de modelos externos.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        // Implementación simple basada en array de roles
        return in_array($role, $this->userRoles);
    }

    /**
     * Verifica si el usuario tiene alguno de los roles dados.
     * Implementación simplificada sin depender de modelos externos.
     *
     * @param array $roles
     * @return bool
     */
    public function hasAnyRole(array $roles): bool
    {
        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Establece los roles del usuario.
     *
     * @param array $roles
     * @return self
     */
    public function setRoles(array $roles): self
    {
        $this->userRoles = $roles;
        return $this;
    }
}
