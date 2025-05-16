<?php

namespace App\Http\Controllers;

use App\Models\Operacion;
use App\Models\Cuenta;
use App\Models\TitularTarjeta;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response; // Asegúrate de importar Response

class OperacionController extends Controller
{
    public function index(Request $request): Response
    {
        $operaciones = Operacion::with(['cuenta', 'propietario', 'usuarioOrdena', 'usuarioEjecuta'])
            ->latest()
            ->paginate(15); // Paginación es buena idea

        return Inertia::render('Operaciones/Index', [
            'operaciones' => $operaciones,
            'cuentas' => Cuenta::select('id', 'numero_cuenta', 'banco')->get(),
            'titulares' => TitularTarjeta::select('id', 'nombre')->get(),
            'usuarios' => User::select('id', 'name')->get(), // Para asignar quien ejecuta
            'tipos_operacion' => ['transferencia', 'efectivo', 'saldo'],
            'tipos_moneda' => ['CUP', 'MLC', 'USD', 'Soles'],
            'estados_operacion' => ['pendiente', 'aprobada', 'pagada', 'en proceso', 'completada', 'cancelada'],
        ]);
    }

    protected function generarNumeroOperacion(): string
    {
        // Ejemplo: OP-YYYYMMDD-XXXXXX
        return 'OP-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cuenta_id' => 'required|exists:cuentas,id',
            'propietario_id' => 'required|exists:titular_tarjetas,id',
            'monto' => 'required|numeric|min:0.01',
            'tipo_moneda' => 'required|in:CUP,MLC,USD,Soles',
            'tipo_operacion' => 'required|in:transferencia,efectivo,saldo',
            'cuenta_destino' => 'nullable|string|max:255',
            'telefono_notificar' => 'nullable|string|max:20',
            'telefono_cliente' => 'nullable|string|max:20',
            'usuario_ejecuta_id' => 'nullable|exists:users,id',
            'detalles' => 'nullable|string',
            'imagen_pago' => 'nullable|string|max:255', // Asumiendo URL/path por ahora
            'numero_voucher_remitente' => 'nullable|string|max:30',
            'numero_voucher_destinatario' => 'nullable|string|max:30',
            'orden' => 'nullable|string|max:255',
            'voucher_generado' => 'nullable|string',
            'estado' => 'required|in:pendiente,aprobada,pagada,en proceso,completada,cancelada',
        ]);

        $operacion = Operacion::create(array_merge($validated, [
            'numero_operacion' => $this->generarNumeroOperacion(),
            'usuario_ordena_id' => Auth::id(),
            'fecha_operacion' => now(), // Aunque useCurrent está en la migración, es bueno ser explícito
        ]));

        return redirect()->route('operaciones.index')->with('success', 'Operación creada exitosamente.');
    }

    public function update(Request $request, Operacion $operacion)
    {
        $validated = $request->validate([
            'cuenta_id' => 'sometimes|required|exists:cuentas,id',
            'propietario_id' => 'sometimes|required|exists:titular_tarjetas,id',
            'monto' => 'sometimes|required|numeric|min:0.01',
            'tipo_moneda' => 'sometimes|required|in:CUP,MLC,USD,Soles',
            'tipo_operacion' => 'sometimes|required|in:transferencia,efectivo,saldo',
            'cuenta_destino' => 'nullable|string|max:255',
            'telefono_notificar' => 'nullable|string|max:20',
            'telefono_cliente' => 'nullable|string|max:20',
            'usuario_ejecuta_id' => 'nullable|exists:users,id',
            'detalles' => 'nullable|string',
            'imagen_pago' => 'nullable|string|max:255',
            'numero_voucher_remitente' => 'nullable|string|max:30',
            'numero_voucher_destinatario' => 'nullable|string|max:30',
            'orden' => 'nullable|string|max:255',
            'voucher_generado' => 'nullable|string',
            'estado' => 'sometimes|required|in:pendiente,aprobada,pagada,en proceso,completada,cancelada',
        ]);

        $operacion->update($validated);

        return redirect()->route('operaciones.index')->with('success', 'Operación actualizada exitosamente.');
    }

    public function destroy(Operacion $operacion)
    {
        $operacion->delete();
        return redirect()->route('operaciones.index')->with('success', 'Operación eliminada exitosamente.');
    }
}
