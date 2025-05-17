import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
// Se quita User de la importación directa ya que viene de InertiaPageProps -> SharedData -> Auth -> User
import { Cuenta, InertiaPageProps, Operacion, PaginatedResource, TitularTarjeta } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit2, Eye, MoreHorizontal, PlusCircle, Search, Trash2, Calendar, Wallet, CreditCard, User, DollarSign, AlertCircle } from 'lucide-react';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

// Definir un tipo para FormDataConvertible ya que no está disponible en la importación
type FormDataConvertible = string | number | boolean | File | null | undefined;

// Props específicas para esta página
interface OperacionesIndexProps extends InertiaPageProps {
    operaciones: PaginatedResource<Operacion>;
    cuentas: Cuenta[];
    titulares: TitularTarjeta[];
    filters?: Record<string, string>;
}

interface OperacionFormData {
    id?: number | undefined;
    cuenta_id: string;
    titular_id?: string; // Auxiliar para seleccionar cuenta
    propietario_id?: string; // Campo requerido por el backend
    fecha_operacion: string;
    tipo_operacion: 'transferencia' | 'efectivo' | 'saldo' | string;
    tipo_moneda: 'CUP' | 'MLC' | 'USD' | 'Soles' | string;
    monto: string;
    detalles: string; // Unificado desde descripcion/notas
    estado: string;
    imagen_pago: File | null;
    current_imagen_pago_url?: string | null; // Auxiliar
    delete_imagen_pago?: boolean; // Auxiliar
    // Índice de firma para permitir propiedades adicionales
    [key: string]: FormDataConvertible | undefined; // Para compatibilidad con FormDataConvertible
}

// Se quita 'errors' de las props si no se usa directamente para errores de página (formErrors maneja los del form)
const OperacionesIndex: React.FC<OperacionesIndexProps> = ({ auth, operaciones, cuentas, titulares, filters: initialFilters, flash }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedOperacion, setSelectedOperacion] = useState<Operacion | null>(null);
    const [filteredCuentas, setFilteredCuentas] = useState<Cuenta[]>(cuentas);
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const initialFormValues: OperacionFormData = {
        cuenta_id: '',
        titular_id: '',
        propietario_id: '',
        fecha_operacion: new Date().toISOString().split('T')[0],
        tipo_operacion: 'transferencia', // Valor esperado por el backend
        tipo_moneda: 'USD', // Valor esperado por el backend
        monto: '',
        detalles: '',
        estado: 'pendiente', // Valor esperado por el backend en minúsculas
        imagen_pago: null,
        current_imagen_pago_url: null,
        delete_imagen_pago: false,
    };

    // Se quita 'put' y 'post' de la desestructuración si no se usan directamente.
    const { data, setData, processing, errors: formErrors, reset, clearErrors } = useForm<OperacionFormData>(initialFormValues);

    useEffect(() => {
        if (flash?.success) {
            console.log('Success:', flash.success);
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setIsDeleteModalOpen(false);
        }
        if (flash?.error) {
            console.error('Error:', flash.error);
        }
    }, [flash]);

    useEffect(() => {
        if (data.titular_id) {
            setFilteredCuentas(cuentas.filter((c) => c.titular_tarjeta_id === parseInt(data.titular_id!)));
            const currentCuentaIsValid = cuentas.find(
                (c) => c.id === parseInt(data.cuenta_id) && c.titular_tarjeta_id === parseInt(data.titular_id!),
            );
            if (!currentCuentaIsValid) {
                setData('cuenta_id', '');
            }
        } else {
            setFilteredCuentas(cuentas);
        }
    }, [data.titular_id, cuentas, setData, data.cuenta_id]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('imagen_pago', file);
            setPreviewImage(URL.createObjectURL(file));
            setData('delete_imagen_pago', false);
        } else {
            setData('imagen_pago', null);
            setPreviewImage(null);
        }
    };

    const openCreateModal = () => {
        reset();
        setData('fecha_operacion', new Date().toISOString().split('T')[0]);
        setPreviewImage(null);
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (operacion: Operacion) => {
        setSelectedOperacion(operacion);
        // Reseteamos el formulario primero para evitar problemas de tipos
        reset();
        // Ahora actualizamos campo por campo para evitar problemas de tipos
        setData('id', operacion.id);
        setData('cuenta_id', operacion.cuenta_id.toString());
        setData('titular_id', operacion.propietario_id?.toString() || operacion.cuenta?.titular_tarjeta_id?.toString() || '');
        setData('propietario_id', operacion.propietario_id?.toString() || '');
        setData('fecha_operacion', operacion.fecha_operacion);
        setData('tipo_operacion', operacion.tipo_operacion);
        setData('tipo_moneda', operacion.tipo_moneda || 'USD');
        setData('monto', operacion.monto.toString());
        setData('detalles', operacion.detalles || '');
        setData('estado', operacion.estado);
        setData('imagen_pago', null);
        setData('current_imagen_pago_url', operacion.imagen_pago_url);
        setData('delete_imagen_pago', false);
        setPreviewImage(operacion.imagen_pago_url || null);
        clearErrors();
        setIsEditModalOpen(true);
    };

    const openViewModal = (operacion: Operacion) => {
        setSelectedOperacion(operacion);
        setIsViewModalOpen(true);
    };

    const openDeleteModal = (operacion: Operacion) => {
        setSelectedOperacion(operacion);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsViewModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedOperacion(null);
        reset();
        clearErrors();
        setPreviewImage(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Construir el objeto de datos para el envío.
        // Los campos auxiliares (titular_id, current_imagen_pago_url) no se incluyen.
        const submissionPayload: Record<string, FormDataConvertible | null> = {
            fecha_operacion: data.fecha_operacion,
            tipo_operacion: data.tipo_operacion,
            tipo_moneda: data.tipo_moneda,
            monto: parseFloat(data.monto) || 0,
            detalles: data.detalles,
            estado: data.estado.toLowerCase(), // Convertir a minúsculas para coincidir con el backend
            cuenta_id: parseInt(data.cuenta_id),
            propietario_id: parseInt(data.titular_id || '0'), // Usar titular_id como propietario_id
            // imagen_pago se maneja especialmente si es un File o se quiere borrar
        };

        if (data.id) {
            submissionPayload.id = data.id;
        }

        if (data.imagen_pago instanceof File) {
            submissionPayload.imagen_pago = data.imagen_pago;
        } else if (data.delete_imagen_pago) {
            submissionPayload.imagen_pago = null; // Indicar que se borre la imagen
        }
        // Si no es un File y no se marca delete_imagen_pago, no se envía imagen_pago,
        // y el backend debería mantener la imagen existente.

        if (data.delete_imagen_pago) {
            submissionPayload.delete_imagen_pago = true;
        }

        if (selectedOperacion && isEditModalOpen) {
            router.post(
                route('operaciones.update', selectedOperacion.id),
                {
                    _method: 'PUT',
                    ...submissionPayload,
                } as Record<string, FormDataConvertible>, // Utilizamos un tipo más específico
                // Inertia maneja la conversión a FormData si submissionPayload.imagen_pago es un File.
                {
                    onSuccess: () => closeModals(),
                    onError: (pageErrors) => {
                        console.error('Error en la actualización:', pageErrors);
                        // formErrors se actualiza automáticamente por useForm si los errores tienen el formato correcto.
                    },
                    preserveState: true, // Para mantener el estado de la página (filtros, paginación)
                    replace: true,
                },
            );
        } else {
            // Para creación, usamos el 'post' del hook useForm,
            // que usará el estado 'data' del formulario.
            // Necesitamos asegurar que 'data' tenga los campos correctos antes de llamar a post.
            // Las transformaciones (parseFloat, parseInt) deben hacerse antes o el backend debe manejarlas.
            // Por consistencia con el payload de edición, y para asegurar tipos correctos:
            const createPayload = { ...submissionPayload };
            delete createPayload.id; // No enviar id en la creación

            // router.post para creación para usar el payload transformado:
            router.post(route('operaciones.store'), createPayload as Record<string, FormDataConvertible>, {
                onSuccess: () => closeModals(),
                onError: (pageErrors) => {
                    console.error('Error en la creación:', pageErrors);
                    // Si se usa router.post, los errores de useForm no se actualizan automáticamente.
                    // Se necesitaría mapearlos manualmente si se quiere usar formErrors del hook.
                    // Ejemplo:
                    // if (pageErrors) {
                    //     Object.keys(pageErrors).forEach(key => {
                    //         formErrors[key] = pageErrors[key];
                    //     });
                    // }
                },
                preserveState: true,
                replace: true,
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedOperacion) {
            router.delete(route('operaciones.destroy', selectedOperacion.id), {
                onSuccess: () => closeModals(),
            });
        }
    };

    const handleTitularChange = (titularId: string) => {
        setData((prevData) => ({
            ...prevData,
            titular_id: titularId,
            propietario_id: titularId, // Aseguramos que se actualice el propietario_id
            cuenta_id: '',
        }));
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('operaciones.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    const handleRemoveImage = () => {
        setData('imagen_pago', null);
        setData('delete_imagen_pago', true);
        setPreviewImage(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Operaciones</h2>}
        >
            <Head title="Operaciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <div className="flex items-center gap-2">
                                <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <CardTitle>Listado de Operaciones</CardTitle>
                            </div>
                            <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
                                <PlusCircle className="mr-2 h-4 w-4" /> Crear Operación
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSearch} className="mb-6 flex gap-2 items-center">
                                <div className="relative flex-grow max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar por descripción, monto..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Buscar
                                </Button>
                            </form>

                            {flash?.success && (
                                <div
                                    className="mb-6 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-900/50 dark:text-green-400 flex items-center gap-2"
                                    role="alert"
                                >
                                    <AlertCircle className="h-5 w-5" />
                                    {flash.success}
                                </div>
                            )}

                            {flash?.error && (
                                <div
                                    className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400 flex items-center gap-2"
                                    role="alert"
                                >
                                    <AlertCircle className="h-5 w-5" />
                                    {flash.error}
                                </div>
                            )}

                            <div className="rounded-md border shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-blue-50 dark:bg-blue-950/50">
                                        <TableRow>
                                            <TableHead className="font-medium">Fecha</TableHead>
                                            <TableHead className="font-medium">Tipo</TableHead>
                                            <TableHead className="font-medium">Monto</TableHead>
                                            <TableHead className="font-medium">Cuenta</TableHead>
                                            <TableHead className="font-medium">Titular</TableHead>
                                            <TableHead className="font-medium">Estado Pago</TableHead>
                                            <TableHead className="text-right font-medium">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {operaciones.data.length > 0 ? (
                                            operaciones.data.map((op) => (
                                                <TableRow key={op.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                                    <TableCell className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        {new Date(op.fecha_operacion).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {op.tipo_operacion === 'transferencia' && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                                                                <CreditCard className="h-3 w-3" />
                                                                Transferencia
                                                            </span>
                                                        )}
                                                        {op.tipo_operacion === 'efectivo' && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-400">
                                                                <DollarSign className="h-3 w-3" />
                                                                Efectivo
                                                            </span>
                                                        )}
                                                        {op.tipo_operacion === 'saldo' && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-400">
                                                                <Wallet className="h-3 w-3" />
                                                                Saldo
                                                            </span>
                                                        )}
                                                        {op.tipo_operacion !== 'transferencia' && op.tipo_operacion !== 'efectivo' && op.tipo_operacion !== 'saldo' && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                                                                {op.tipo_operacion}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {op.monto.toLocaleString('es-VE', {
                                                                style: 'currency',
                                                                currency: op.tipo_moneda || 'VES'
                                                            })}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="flex items-center gap-2">
                                                        <CreditCard className="h-4 w-4 text-gray-500" />
                                                        {op.cuenta?.nombre_cuenta || op.cuenta?.numero_cuenta || 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                        {op.cuenta?.titular_tarjeta?.nombre || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {op.estado === 'completada' && (
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-400">
                                                                Completada
                                                            </span>
                                                        )}
                                                        {op.estado === 'pendiente' && (
                                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400">
                                                                Pendiente
                                                            </span>
                                                        )}
                                                        {op.estado === 'cancelada' && (
                                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-400">
                                                                Cancelada
                                                            </span>
                                                        )}
                                                        {op.estado !== 'completada' && op.estado !== 'pendiente' && op.estado !== 'cancelada' && (
                                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                                {op.estado}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Abrir menú</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem onClick={() => openViewModal(op)} className="cursor-pointer flex items-center gap-2">
                                                                    <Eye className="h-4 w-4 text-blue-600" /> Ver detalles
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEditModal(op)} className="cursor-pointer flex items-center gap-2">
                                                                    <Edit2 className="h-4 w-4 text-green-600" /> Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDeleteModal(op)} className="cursor-pointer flex items-center gap-2 text-red-600">
                                                                    <Trash2 className="h-4 w-4" /> Eliminar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center">
                                                    No hay operaciones registradas.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="mt-4 flex justify-center">
                                {operaciones.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={cn(
                                                'mx-1 rounded-md px-3 py-2 text-sm',
                                                link.active
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
                                                !link.url ? 'cursor-not-allowed text-gray-400 dark:text-gray-500' : '',
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            preserveScroll
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="mx-1 px-3 py-2 text-sm text-gray-400 dark:text-gray-500"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={closeModals}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            {isEditModalOpen ? (
                                <>
                                    <Edit2 className="h-5 w-5 text-blue-600" /> Editar Operación
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-5 w-5 text-green-600" /> Crear Nueva Operación
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditModalOpen ? 'Modifica los detalles de la operación.' : 'Completa los campos para registrar una nueva operación.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-5 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="titular_id" className="text-right font-medium">
                                <User className="mr-1 h-4 w-4 inline-block" /> Titular
                            </Label>
                            <Select value={data.titular_id} onValueChange={handleTitularChange} disabled={processing}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione un titular" />
                                </SelectTrigger>
                                <SelectContent>
                                    {titulares.map((t) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.titular_id && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.titular_id}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cuenta_id" className="text-right font-medium">
                                <CreditCard className="mr-1 h-4 w-4 inline-block" /> Cuenta
                            </Label>
                            <Select value={data.cuenta_id} onValueChange={(value) => setData('cuenta_id', value)} disabled={!data.titular_id || processing}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione una cuenta" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredCuentas.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.nombre_cuenta || c.numero_cuenta}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.cuenta_id && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.cuenta_id}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fecha_operacion" className="text-right font-medium">
                                <Calendar className="mr-1 h-4 w-4 inline-block" /> Fecha
                            </Label>
                            <Input
                                id="fecha_operacion"
                                type="date"
                                value={data.fecha_operacion}
                                onChange={(e) => setData('fecha_operacion', e.target.value)}
                                className="col-span-3"
                                disabled={processing}
                            />
                            {formErrors.fecha_operacion && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.fecha_operacion}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tipo_operacion" className="text-right font-medium">
                                <Wallet className="mr-1 h-4 w-4 inline-block" /> Tipo
                            </Label>
                            <Select
                                value={data.tipo_operacion}
                                onValueChange={(value: string) => setData('tipo_operacion', value)}
                                disabled={processing}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="transferencia">Transferencia</SelectItem>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                    <SelectItem value="saldo">Saldo</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.tipo_operacion && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.tipo_operacion}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tipo_moneda" className="text-right font-medium">
                                <DollarSign className="mr-1 h-4 w-4 inline-block" /> Moneda
                            </Label>
                            <Select
                                value={data.tipo_moneda}
                                onValueChange={(value: string) => setData('tipo_moneda', value as 'CUP' | 'MLC' | 'USD' | 'Soles')}
                                disabled={processing}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione la moneda" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CUP">CUP</SelectItem>
                                    <SelectItem value="MLC">MLC</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="Soles">Soles</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.tipo_moneda && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.tipo_moneda}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="monto" className="text-right font-medium">
                                <DollarSign className="mr-1 h-4 w-4 inline-block" /> Monto
                            </Label>
                            <div className="col-span-3 relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    value={data.monto}
                                    onChange={(e) => setData('monto', e.target.value)}
                                    className="pl-10"
                                    disabled={processing}
                                />
                            </div>
                            {formErrors.monto && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.monto}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="detalles" className="text-right font-medium">
                                <AlertCircle className="mr-1 h-4 w-4 inline-block" /> Detalles
                            </Label>
                            <Textarea
                                id="detalles"
                                value={data.detalles}
                                onChange={(e) => setData('detalles', e.target.value)}
                                className="col-span-3"
                                rows={3}
                                disabled={processing}
                                placeholder="Ingrese detalles relevantes de la operación..."
                            />
                            {formErrors.detalles && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.detalles}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="estado" className="text-right font-medium">
                                <AlertCircle className="mr-1 h-4 w-4 inline-block" /> Estado Pago
                            </Label>
                            <Select
                                value={data.estado}
                                onValueChange={(value: string) => setData('estado', value)}
                                disabled={processing}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Estado del pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                    <SelectItem value="aprobada">Aprobada</SelectItem>
                                    <SelectItem value="pagada">Pagada</SelectItem>
                                    <SelectItem value="en proceso">En proceso</SelectItem>
                                    <SelectItem value="completada">Completada</SelectItem>
                                    <SelectItem value="cancelada">Cancelada</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.estado && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.estado}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imagen_pago" className="text-right font-medium">
                                <Eye className="mr-1 h-4 w-4 inline-block" /> Imagen Pago
                            </Label>
                            <div className="col-span-3">
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="imagen_pago"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="flex-1"
                                        accept="image/*"
                                        disabled={processing}
                                    />
                                </div>

                                {previewImage && (
                                    <div className="relative mt-4 border rounded-md p-2 bg-gray-50 dark:bg-gray-900">
                                        <img src={previewImage} alt="Previsualización" className="max-h-48 rounded mx-auto" />
                                        {isEditModalOpen && data.current_imagen_pago_url && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleRemoveImage}
                                                className="mt-2 w-full"
                                                disabled={processing}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar Imagen Actual
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {!previewImage && data.current_imagen_pago_url && (
                                    <div className="relative mt-4 border rounded-md p-2 bg-gray-50 dark:bg-gray-900">
                                        <img src={data.current_imagen_pago_url} alt="Imagen Actual" className="max-h-48 rounded mx-auto" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveImage}
                                            className="mt-2 w-full"
                                            disabled={processing}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar Imagen Actual
                                        </Button>
                                    </div>
                                )}

                                {data.delete_imagen_pago && (
                                    <p className="mt-2 text-sm text-yellow-600 flex items-center gap-1.5">
                                        <AlertCircle className="h-4 w-4" />
                                        La imagen actual se eliminará al guardar.
                                    </p>
                                )}
                            </div>
                            {formErrors.imagen_pago && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.imagen_pago}</p>}
                        </div>

                        <DialogFooter className="pt-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={processing}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 gap-2">
                                {processing && (
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {processing ? 'Guardando...' : isEditModalOpen ? 'Guardar Cambios' : 'Crear Operación'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewModalOpen} onOpenChange={closeModals}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Eye className="h-5 w-5 text-blue-600" />
                            Detalles de la Operación
                        </DialogTitle>
                    </DialogHeader>
                    {selectedOperacion && (
                        <div className="py-4 space-y-0">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">ID de Operación</div>
                                    <div className="font-semibold text-blue-700 dark:text-blue-400">#{selectedOperacion.id}</div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Estado</div>
                                    <div>
                                        {selectedOperacion.estado === 'completada' && (
                                            <span className="status-badge status-success">
                                                Completada
                                            </span>
                                        )}
                                        {selectedOperacion.estado === 'pendiente' && (
                                            <span className="status-badge status-warning">
                                                Pendiente
                                            </span>
                                        )}
                                        {selectedOperacion.estado === 'cancelada' && (
                                            <span className="status-badge status-danger">
                                                Cancelada
                                            </span>
                                        )}
                                        {selectedOperacion.estado !== 'completada' && selectedOperacion.estado !== 'pendiente' && selectedOperacion.estado !== 'cancelada' && (
                                            <span className="status-badge status-info">
                                                {selectedOperacion.estado}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Fecha</div>
                                    <div className="font-medium flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        {new Date(selectedOperacion.fecha_operacion).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Tipo</div>
                                    <div className="font-medium flex items-center gap-1.5">
                                        {selectedOperacion.tipo_operacion === 'transferencia' && (
                                            <>
                                                <CreditCard className="h-4 w-4 text-blue-600" />
                                                Transferencia
                                            </>
                                        )}
                                        {selectedOperacion.tipo_operacion === 'efectivo' && (
                                            <>
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                Efectivo
                                            </>
                                        )}
                                        {selectedOperacion.tipo_operacion === 'saldo' && (
                                            <>
                                                <Wallet className="h-4 w-4 text-purple-600" />
                                                Saldo
                                            </>
                                        )}
                                        {selectedOperacion.tipo_operacion !== 'transferencia' && selectedOperacion.tipo_operacion !== 'efectivo' && selectedOperacion.tipo_operacion !== 'saldo' && (
                                            <span className="capitalize">{selectedOperacion.tipo_operacion}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2 border-t pt-3 mt-1">
                                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Monto</div>
                                    <div className="font-semibold text-lg flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        {selectedOperacion.monto.toLocaleString('es-VE', {
                                            style: 'currency',
                                            currency: selectedOperacion.tipo_moneda || 'VES',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1 border-t pt-3">
                                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Cuenta</div>
                                    <div className="font-medium flex items-center gap-1.5">
                                        <CreditCard className="h-4 w-4 text-blue-600" />
                                        {selectedOperacion.cuenta?.nombre_cuenta || selectedOperacion.cuenta?.numero_cuenta || 'N/A'}
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1 border-t pt-3">
                                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Titular</div>
                                    <div className="font-medium flex items-center gap-1.5">
                                        <User className="h-4 w-4 text-blue-600" />
                                        {selectedOperacion.cuenta?.titular_tarjeta?.nombre || 'N/A'}
                                    </div>
                                </div>

                                <div className="col-span-2 border-t pt-3">
                                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Detalles</div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded border text-sm">
                                        {selectedOperacion.detalles || 'Sin detalles'}
                                    </div>
                                </div>
                            </div>

                            {selectedOperacion.imagen_pago_url && (
                                <div className="pt-4 border-t mt-4">
                                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" /> Comprobante de Pago
                                    </div>
                                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 p-1">
                                        <img
                                            src={selectedOperacion.imagen_pago_url}
                                            alt="Comprobante de pago"
                                            className="h-auto max-w-full rounded mx-auto shadow-sm hover:shadow-md transition-shadow cursor-zoom-in"
                                            onClick={() => window.open(selectedOperacion.imagen_pago_url, '_blank')}
                                        />
                                    </div>
                                    <div className="text-xs text-center mt-1 text-gray-500">
                                        Haz clic en la imagen para verla en tamaño completo
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter className="border-t pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto">Cerrar</Button>
                        </DialogClose>
                        {selectedOperacion && (
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                                closeModals();
                                setTimeout(() => openEditModal(selectedOperacion), 100);
                            }}>
                                <Edit2 className="h-4 w-4 mr-2" /> Editar
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar la operación ID: {selectedOperacion?.id}? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-900/30 my-2">
                        <p className="text-sm text-red-800 dark:text-red-400">
                            Al eliminar esta operación, se perderán todos los datos asociados, incluyendo registros y archivos adjuntos.
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={processing}>Cancelar</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={processing} className="gap-2">
                            {processing && (
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {processing ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default OperacionesIndex;
