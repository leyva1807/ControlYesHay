// resources/js/Pages/Cuentas/Index.tsx
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CuentaRow from '@/components/CuentaRow'; // Ajusta la ruta si es necesario

// Definición de tipos (idealmente importados desde un archivo central)
type Titular = {
  id: number;
  nombre: string;
  telefono: string;
};

type Cuenta = {
  id: number;
  propietario_id: number;
  numero_tarjeta: string;
  numero_cuenta?: string;
  tipo_moneda: string;
  tipo_cuenta: string;
  banco_asociado?: string;
  estado: boolean;
  fecha_apertura: string;
  titular: Titular;
};

type PageProps = {
  cuentas: Cuenta[];
  // Otros props que pueda pasar Laravel, como filtros, paginación, etc.
};

const breadcrumbs = [
  { title: 'Cuentas', href: '/cuentas' } // Considera usar route('cuentas.index') desde Ziggy si lo tienes configurado
];

export default function Index({ cuentas }: PageProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Listado de Cuentas" />
      <div className="p-6 bg-white shadow rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Cuentas registradas</h1>
          {/* Opcional: Botón para añadir nueva cuenta */}
          {/* <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Nueva Cuenta
          </button> */}
        </div>

        {cuentas.length > 0 ? (
          <div className="overflow-x-auto"> {/* Para mejor respuesta en pantallas pequeñas */}
            <table className="w-full table-auto text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50"> {/* Ligero fondo al header */}
                  <th className="p-2">#</th>
                  <th className="p-2">Titular</th>
                  <th className="p-2">Teléfono</th>
                  <th className="p-2">Tarjeta</th>
                  <th className="p-2">Cuenta</th>
                  <th className="p-2">Banco</th>
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Moneda</th>
                  <th className="p-2">Estado</th>
                  {/* <th className="p-2">Acciones</th> */}
                </tr>
              </thead>
              <tbody>
                {cuentas.map((cuenta, index) => (
                  <CuentaRow key={cuenta.id} cuenta={cuenta} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-6 py-10 border border-dashed rounded-lg">
            <p>No hay cuentas registradas.</p>
            {/* Opcional: Mensaje más amigable o un CTA */}
            {/* <p className="mt-2">¿Deseas <a href="/cuentas/crear" className="text-blue-500 hover:underline">añadir una nueva cuenta</a>?</p> */}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
