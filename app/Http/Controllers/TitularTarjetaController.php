<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TitularTarjeta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TitularTarjetaController extends Controller
{
    // Listar todos los titulares
    public function index()
    {
        $titulares = TitularTarjeta::latest()->get();

    return Inertia::render('Titulares/Index', [
        'titulares' => $titulares
        ]);
    }

    // Guardar nuevo titular
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'telefono' => 'required|string|max:20|unique:titular_tarjetas,telefono',
        ]);

        $titular = TitularTarjeta::create($validated);

        return response()->json($titular, 201);
    }

    // Mostrar un titular específico
    public function show($id)
    {
        $titular = TitularTarjeta::findOrFail($id);
        return response()->json($titular);
    }

    // Actualizar un titular
    public function update(Request $request, $id)
    {
        $titular = TitularTarjeta::findOrFail($id);

        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'telefono' => 'required|string|max:20|unique:titular_tarjetas,telefono,' . $id,
        ]);

        $titular->update($validated);

        return response()->json($titular);
    }

    // Eliminar un titular
    public function destroy($id)
    {
        $titular = TitularTarjeta::findOrFail($id);
        $titular->delete();

        return response()->json(['message' => 'Titular eliminado']);
    }
}
