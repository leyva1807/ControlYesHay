<?php

namespace App\Http\Controllers;

use App\Models\Cuenta;
use App\Models\TitularTarjeta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CuentaController extends Controller
{
    /**
     * Mostrar listado de cuentas con sus titulares.
     */
    public function index(Request $request)
    {
        $query = Cuenta::with('titular')
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('numero_tarjeta', 'like', "%{$search}%")
                        ->orWhere('numero_cuenta', 'like', "%{$search}%")
                        ->orWhere('banco_asociado', 'like', "%{$search}%")
                        ->orWhereHas('titular', function ($query) use ($search) {
                            $query->where('nombre', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('id', 'desc');

        $cuentas = $query->paginate(10)->withQueryString();
        $titulares = TitularTarjeta::orderBy('nombre')->get();

        return Inertia::render('Cuentas/Index', [
            'cuentas' => $cuentas,
            'titulares' => $titulares,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Almacenar nueva cuenta.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'propietario_id' => 'required|exists:titular_tarjetas,id',
            'tipo_moneda' => 'required|in:CUP,MLC,USD,Soles,saldo',
            'numero_tarjeta' => 'required|string|unique:cuentas,numero_tarjeta',
            'numero_cuenta' => 'nullable|string|unique:cuentas,numero_cuenta',
            'tipo_cuenta' => 'required|in:Ahorro,Corriente,Credito',
            'banco_asociado' => 'nullable|in:BPA,BANDED,BCP,Interbank,BBVA',
            'estado' => 'boolean',
            'fecha_apertura' => 'nullable|date',
        ]);

        Cuenta::create($data);

        return redirect()->back()->with('success', 'Cuenta creada correctamente.');
    }

    /**
     * Actualizar cuenta existente.
     */
    public function update(Request $request, $id)
    {
        $cuenta = Cuenta::findOrFail($id);

        $data = $request->validate([
            'propietario_id' => 'required|exists:titular_tarjetas,id',
            'tipo_moneda' => 'required|in:CUP,MLC,USD,Soles,saldo',
            'numero_tarjeta' => 'required|string|unique:cuentas,numero_tarjeta,' . $cuenta->id,
            'numero_cuenta' => 'nullable|string|unique:cuentas,numero_cuenta,' . $cuenta->id,
            'tipo_cuenta' => 'required|in:Ahorro,Corriente,Credito',
            'banco_asociado' => 'nullable|in:BPA,BANDED,BCP,Interbank,BBVA',
            'estado' => 'boolean',
            'fecha_apertura' => 'nullable|date',
        ]);

        $cuenta->update($data);

        return redirect()->back()->with('success', 'Cuenta actualizada correctamente.');
    }

    /**
     * Eliminar una cuenta.
     */
    public function destroy($id)
    {
        $cuenta = Cuenta::findOrFail($id);
        $cuenta->delete();

        return redirect()->back()->with('success', 'Cuenta eliminada correctamente.');
    }
}
