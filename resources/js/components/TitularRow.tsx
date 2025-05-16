// resources/js/Components/TitularRow.tsx
import React from 'react';

type Titular = {
  id: number;
  nombre: string;
  telefono: string;
  created_at: string;
  updated_at: string;
};

type TitularRowProps = {
  titular: Titular;
  onEdit: (titular: Titular) => void;
  onDelete: (id: number) => void;
  isProcessingDelete?: boolean; // Para deshabilitar botones si algo se está eliminando
};

const TitularRow: React.FC<TitularRowProps> = ({ titular, onEdit, onDelete, isProcessingDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
      <td className="py-3 px-4 text-sm text-gray-700">{titular.id}</td>
      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{titular.nombre}</td>
      <td className="py-3 px-4 text-sm text-gray-700">{titular.telefono}</td>
      <td className="py-3 px-4 text-xs text-gray-500">{formatDate(titular.created_at)}</td>
      <td className="py-3 px-4 text-xs text-gray-500">{formatDate(titular.updated_at)}</td>
      <td className="py-3 px-4 text-center space-x-2">
        <button
          onClick={() => onEdit(titular)}
          disabled={isProcessingDelete}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-1 rounded-md text-xs shadow-sm transition-colors duration-150 ease-in-out disabled:opacity-50"
          aria-label={`Editar ${titular.nombre}`}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(titular.id)}
          disabled={isProcessingDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-md text-xs shadow-sm transition-colors duration-150 ease-in-out disabled:opacity-50"
          aria-label={`Eliminar ${titular.nombre}`}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default React.memo(TitularRow);
