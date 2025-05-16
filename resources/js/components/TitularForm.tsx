// resources/js/Components/TitularForm.tsx
import React from 'react';
import InputField from './InputField'; // Ajusta la ruta si es necesario
import { InertiaForm } from '@inertiajs/react';

interface TitularFormData {
  id: number | null;
  nombre: string;
  telefono: string;
}

type TitularFormErrors = Partial<Record<keyof TitularFormData, string>>;

type TitularFormProps = {
  formData: TitularFormData;
  setData: InertiaForm<TitularFormData>['setData'];
  onSubmit: (e: React.FormEvent) => void;
  errors: TitularFormErrors;
  isEditing: boolean;
  onCancelEdit?: () => void;
  processing?: boolean;
};

const TitularForm: React.FC<TitularFormProps> = ({
  formData,
  setData,
  onSubmit,
  errors,
  isEditing,
  onCancelEdit,
  processing,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 sm:p-6 bg-white rounded-xl border shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {isEditing ? 'Editar Titular' : 'Registrar Nuevo Titular'}
      </h2>
      <InputField
        name="nombre"
        label="Nombre Completo"
        placeholder="Ej: Juan Pérez"
        value={formData.nombre}
        onChange={e => setData('nombre', e.target.value)}
        error={errors.nombre}
        autoFocus={!isEditing} // Autofocus en crear, no en editar inicialmente
        disabled={processing}
      />
      <InputField
        name="telefono"
        label="Número de Teléfono"
        placeholder="Ej: 987654321"
        value={formData.telefono}
        onChange={e => setData('telefono', e.target.value)}
        error={errors.telefono}
        disabled={processing}
      />
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {processing ? (isEditing ? 'Actualizando...' : 'Registrando...') : (isEditing ? 'Actualizar Titular' : 'Registrar Titular')}
        </button>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={processing}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TitularForm;
