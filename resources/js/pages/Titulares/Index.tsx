// resources/js/Pages/Titulares/Index.tsx
import TitularForm from '@/components/TitularForm';
import TitularRow from '@/components/TitularRow';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useCallback, useEffect, useState } from 'react';
// Asegúrate de tener Ziggy configurado y esta importación si no lo haces global.
// import route from 'ziggy-js';

// Definiciones de Tipos
type Titular = {
    id: number;
    nombre: string;
    telefono: string;
    created_at: string;
    updated_at: string;
};

interface TitularFormData {
    id: number | null;
    nombre: string;
    telefono: string;
}

interface PageProps {
    titulares: Titular[];
    flash?: {
        success?: string;
        error?: string;
    };
    ziggy?: any; // Ziggy inyecta las rutas aquí
}

// Accede a la función route de Ziggy (si está disponible globalmente)
// Si has instalado ziggy-js y lo importas, puedes usar directamente `route`
const route = (window as any).route;

const breadcrumbs = [{ title: 'Titulares', href: route ? route('titulares.index') : '/titulares' }];

export default function Index({ titulares, flash, ziggy }: PageProps) {
    const {
        data,
        setData,
        post,
        reset,
        errors,
        put,
        delete: destroy,
        processing,
        recentlySuccessful,
    } = useForm<TitularFormData>({
        id: null,
        nombre: '',
        telefono: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

    const resetFormAndState = useCallback(() => {
        reset();
        setIsEditing(false);
    }, [reset]);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!route) {
                console.error("Ziggy 'route' function is not available. Make sure Ziggy is configured correctly.");
                // Podrías mostrar un error al usuario aquí o usar rutas estáticas como fallback
                return;
            }
            const targetUrl = isEditing && data.id ? route('titulares.update', data.id) : route('titulares.store');

            if (isEditing) {
                put(targetUrl, {
                    onSuccess: () => {
                        resetFormAndState();
                        // Aquí se podría mostrar un toast de éxito
                    },
                    // onError: (pageErrors) => { /* Mostrar toast de error */ }
                });
            } else {
                post(targetUrl, {
                    onSuccess: () => {
                        reset(); // Mantiene el formulario para crear otro
                        // Aquí se podría mostrar un toast de éxito
                    },
                    // onError: (pageErrors) => { /* Mostrar toast de error */ }
                });
            }
        },
        [isEditing, data, put, post, resetFormAndState, reset, route],
    );

    const handleEdit = useCallback(
        (titular: Titular) => {
            setData({
                id: titular.id,
                nombre: titular.nombre,
                telefono: titular.telefono,
            });
            setIsEditing(true);
            const formElement = document.querySelector('form');
            formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        [setData],
    );

    const handleDelete = useCallback(
        (id: number) => {
            if (!route) {
                console.error("Ziggy 'route' function is not available.");
                return;
            }
            if (confirm('¿Estás realmente seguro de eliminar este titular? Esta acción no se puede deshacer.')) {
                setIsDeletingId(id);
                const deleteUrl = route('titulares.destroy', id);
                destroy(deleteUrl, {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Toast de éxito
                    },
                    // onError: () => { /* Toast de error */ },
                    onFinish: () => setIsDeletingId(null),
                });
            }
        },
        [destroy, route],
    );

    useEffect(() => {
        if (recentlySuccessful && !processing && !isEditing && (data.nombre !== '' || data.telefono !== '')) {
            reset();
        }
    }, [recentlySuccessful, processing, isEditing, reset, data.nombre, data.telefono]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Titulares" />

            <div className="container mx-auto space-y-6 px-2 py-4 sm:px-4 md:py-6">
                {/* Mensajes Flash */}
                {flash?.success && <div className="mb-4 rounded-md border border-green-400 bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-4 rounded-md border border-red-400 bg-red-100 p-4 text-red-700">{flash.error}</div>}

                <TitularForm
                    formData={data}
                    setData={setData}
                    onSubmit={handleSubmit}
                    errors={errors}
                    isEditing={isEditing}
                    onCancelEdit={resetFormAndState}
                    processing={processing}
                />

                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                        <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">Listado de Titulares Registrados</h3>
                    </div>

                    {titulares.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-left">
                                <thead className="bg-gray-50 text-xs tracking-wider text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">ID</th>
                                        <th className="px-4 py-3 font-medium">Nombre</th>
                                        <th className="px-4 py-3 font-medium">Teléfono</th>
                                        <th className="px-4 py-3 font-medium">Creado</th>
                                        <th className="px-4 py-3 font-medium">Modificado</th>
                                        <th className="px-4 py-3 text-center font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-gray-700">
                                    {titulares.map((titular) => (
                                        <TitularRow
                                            key={titular.id}
                                            titular={titular}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            isProcessingDelete={processing && isDeletingId === titular.id}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-4 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-700">No hay titulares registrados</h3>
                            <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo titular usando el formulario de arriba.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
