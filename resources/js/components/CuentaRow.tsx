// resources/js/components/CuentaRow.tsx
import React from 'react';
import EstadoBadge from '@/components/EstadoBadge';

// Definición de tipos (pueden importarse desde un archivo central de tipos)
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

type CuentaRowProps = {
  cuenta: Cuenta;
  index: number; // Para mostrar el número de fila
};

const CuentaRow: React.FC<CuentaRowProps> = ({ cuenta, index }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2">{index + 1}</td>
      <td className="py-2">{cuenta.titular?.nombre ?? 'N/A'}</td>
      <td className="py-2">{cuenta.titular?.telefono ?? 'N/A'}</td>
      <td className="py-2">{cuenta.numero_tarjeta}</td>
      <td className="py-2">{cuenta.numero_cuenta || '-'}</td>
      <td className="py-2">{cuenta.banco_asociado || '-'}</td>
      <td className="py-2">{cuenta.tipo_cuenta}</td>
      <td className="py-2">{cuenta.tipo_moneda}</td>
      <td className="py-2">
        <EstadoBadge estado={cuenta.estado} />
      </td>
      {/* Aquí podrías añadir una celda para acciones (editar, eliminar) si es necesario */}
      {/* <td className="py-2"> Acciones </td> */}
    </tr>
  );
};

// React.memo evita re-renderizados si las props (cuenta, index) no han cambiado.
// Es útil si el componente padre (Index) se re-renderiza por razones que no afectan
// a esta fila específica, o si la lista de cuentas es muy grande.
export default React.memo(CuentaRow);
