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
            'cuentas' => Cuenta::select('id', 'numero_cuenta', 'banco_asociado', 'tipo_moneda', 'propietario_id')->get(),
            'titulares' => TitularTarjeta::select('id', 'nombre')->get(),
            'usuarios' => User::select('id', 'name')->get(), // Para asignar quien ejecuta
            'tipos_operacion' => ['transferencia', 'efectivo', 'saldo'],
            'tipos_moneda' => ['CUP', 'MLC', 'USD', 'Soles'],
            'estados_operacion' => ['pendiente', 'aprobada', 'pagada', 'en proceso', 'completada', 'cancelada'],
            'filters' => $request->only(['search']), // Añadimos el campo filters esperado por el componente
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
            'imagen_pago' => 'nullable|file|image|max:2048', // Permitir archivos de imagen
            'numero_voucher_remitente' => 'nullable|string|max:30',
            'numero_voucher_destinatario' => 'nullable|string|max:30',
            'orden' => 'nullable|string|max:255',
            'voucher_generado' => 'nullable|string',
            'estado' => 'required|in:pendiente,aprobada,pagada,en proceso,completada,cancelada',
        ]);

        // Extraer imagen_pago del array de datos validados antes de crear el registro
        $imagenPago = $request->file('imagen_pago');
        $datosOperacion = array_merge($validated, [
            'numero_operacion' => $this->generarNumeroOperacion(),
            'usuario_ordena_id' => Auth::id(),
            'fecha_operacion' => now(), // Aunque useCurrent está en la migración, es bueno ser explícito
        ]);

        // Eliminar el archivo de imagen de los datos validados para evitar errores de conversión
        if (isset($datosOperacion['imagen_pago'])) {
            unset($datosOperacion['imagen_pago']);
        }

        // Crear la operación primero
        $operacion = Operacion::create($datosOperacion);

        // Si hay un archivo de imagen, procesarlo y guardarlo
        if ($imagenPago) {
            $nombreArchivo = 'operacion_' . $operacion->id . '_' . time() . '.' . $imagenPago->getClientOriginalExtension();
            $imagenPago->storeAs('public/operaciones', $nombreArchivo);
            $operacion->update(['imagen_pago' => 'operaciones/' . $nombreArchivo]);
        }

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
            'imagen_pago' => 'nullable|file|image|max:2048', // Permitir archivos de imagen
            'delete_imagen_pago' => 'nullable|boolean', // Nuevo campo para controlar la eliminación de imágenes
            'numero_voucher_remitente' => 'nullable|string|max:30',
            'numero_voucher_destinatario' => 'nullable|string|max:30',
            'orden' => 'nullable|string|max:255',
            'voucher_generado' => 'nullable|string',
            'estado' => 'sometimes|required|in:pendiente,aprobada,pagada,en proceso,completada,cancelada',
        ]);

        // Extraer imagen_pago y delete_imagen_pago del array de datos validados
        $imagenPago = $request->file('imagen_pago');
        $borrarImagen = $request->boolean('delete_imagen_pago');
        $datosOperacion = $validated;

        // Eliminar los campos especiales del array para evitar errores
        if (isset($datosOperacion['imagen_pago'])) {
            unset($datosOperacion['imagen_pago']);
        }
        if (isset($datosOperacion['delete_imagen_pago'])) {
            unset($datosOperacion['delete_imagen_pago']);
        }

        // Actualizar los datos básicos
        $operacion->update($datosOperacion);

        // Manejar la imagen según corresponda
        if ($imagenPago) {
            // Si hay una imagen actual, eliminarla primero
            if ($operacion->imagen_pago) {
                \Storage::delete('public/' . $operacion->imagen_pago);
            }

            // Guardar la nueva imagen
            $nombreArchivo = 'operacion_' . $operacion->id . '_' . time() . '.' . $imagenPago->getClientOriginalExtension();
            $imagenPago->storeAs('public/operaciones', $nombreArchivo);
            $operacion->update(['imagen_pago' => 'operaciones/' . $nombreArchivo]);
        } elseif ($borrarImagen && $operacion->imagen_pago) {
            // Si no hay nueva imagen pero se indicó eliminar la existente
            \Storage::delete('public/' . $operacion->imagen_pago);
            $operacion->update(['imagen_pago' => null]);
        }

        return redirect()->route('operaciones.index')->with('success', 'Operación actualizada exitosamente.');
    }

    public function destroy(Operacion $operacion)
    {
        $operacion->delete();
        return redirect()->route('operaciones.index')->with('success', 'Operación eliminada exitosamente.');
    }
}
