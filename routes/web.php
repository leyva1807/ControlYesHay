<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TitularTarjetaController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\OperacionController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Rutas para titulares y operaciones (accesibles para todos los usuarios autenticados)
Route::middleware(['auth'])->group(function () {
    Route::resource('titulares', TitularTarjetaController::class);
    Route::resource('operaciones', OperacionController::class);
    Route::resource('cuentas', CuentaController::class);
});

// Otras configuraciones
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
