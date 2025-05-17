// resources/js/Components/TitularRow.tsx
import React, { memo } from 'react';
import { Edit2, Trash2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  isProcessingDelete?: boolean;
  indexNumber?: number; // Para mostrar un número de fila
};

// Usamos memo para prevenir renderizados innecesarios
const TitularRow: React.FC<TitularRowProps> = ({ titular, onEdit, onDelete, isProcessingDelete, indexNumber }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
      <td className="py-3 px-4 text-sm text-gray-700">{indexNumber || titular.id}</td>
      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{titular.nombre}</td>
      <td className="py-3 px-4 text-sm text-gray-700">
        <a
          href={`tel:${titular.telefono}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 group gap-1"
        >
          <Phone className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          {titular.telefono}
        </a>
      </td>
      <td className="py-3 px-4 text-xs text-gray-500">{formatDate(titular.created_at)}</td>
      <td className="py-3 px-4 text-xs text-gray-500">{formatDate(titular.updated_at)}</td>
      <td className="py-3 px-4 text-right">
        <TooltipProvider>
          <div className="flex items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onEdit(titular)}
                  disabled={isProcessingDelete}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4 text-yellow-600" />
                  <span className="sr-only">Editar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar titular</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onDelete(titular.id)}
                  disabled={isProcessingDelete}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eliminar titular</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </td>
    </tr>
  );
}

export default React.memo(TitularRow);
