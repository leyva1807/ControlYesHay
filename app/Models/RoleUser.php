<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoleUser extends Model
{
    use HasFactory;

    protected $table = 'role_user'; // importante porque Laravel no pluraliza "user" bien

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'role_id',
    ];
}
