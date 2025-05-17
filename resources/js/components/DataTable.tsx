// resources/js/components/DataTable.tsx
import React, { ReactNode } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface Column<T> {
  key: string;
  header: string;
  cell: (item: T, index: number) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  caption?: string;
  onAdd?: () => void;
  addButtonLabel?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  id?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No hay datos disponibles.',
  caption,
  onAdd,
  addButtonLabel = 'Añadir',
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  id,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        {onSearchChange && (
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <Input
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9"
            />
          </div>
        )}

        {onAdd && (
          <Button onClick={onAdd} size="sm" className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table id={id}>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.sortable ? 'cursor-pointer' : ''}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    <span className="ml-2">Cargando datos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={`row-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.key}`}>{column.cell(item, index)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
