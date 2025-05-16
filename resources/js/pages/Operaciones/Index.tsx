import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
// Se quita User de la importación directa ya que viene de InertiaPageProps -> SharedData -> Auth -> User
import { Cuenta, InertiaPageProps, Operacion, PaginatedResource, TitularTarjeta } from '@/types';
import { Head, Link, router, useForm, type FormDataConvertible } from '@inertiajs/react'; // Importar FormDataConvertible
import { Edit2, Eye, MoreHorizontal, PlusCircle, Search, Trash2 } from 'lucide-react';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

// Props específicas para esta página
interface OperacionesIndexProps extends InertiaPageProps {
    operaciones: PaginatedResource<Operacion>;
    cuentas: Cuenta[];
    titulares: TitularTarjeta[];
    filters: Record<string, string>;
}

interface OperacionFormData {
    id?: number;
    cuenta_id: string;
    titular_id?: string; // Auxiliar
    fecha_operacion: string;
    tipo_operacion: 'Ingreso' | 'Egreso' | string;
    monto: string;
    detalles: string; // Unificado desde descripcion/notas
    estado: string;
    imagen_pago: File | null;
    current_imagen_pago_url?: string | null; // Auxiliar
    delete_imagen_pago?: boolean; // Auxiliar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Requerido por useForm para cumplir con FormDataType si hay campos no estrictamente definidos o para su funcionamiento interno.
}

// Se quita 'errors' de las props si no se usa directamente para errores de página (formErrors maneja los del form)
const OperacionesIndex: React.FC<OperacionesIndexProps> = ({ auth, operaciones, cuentas, titulares, filters: initialFilters, flash }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedOperacion, setSelectedOperacion] = useState<Operacion | null>(null);
    const [filteredCuentas, setFilteredCuentas] = useState<Cuenta[]>(cuentas);
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const initialFormValues: OperacionFormData = {
        cuenta_id: '',
        titular_id: '',
        fecha_operacion: new Date().toISOString().split('T')[0],
        tipo_operacion: 'Ingreso',
        monto: '',
        detalles: '', // Usar detalles
        estado: 'Pendiente',
        imagen_pago: null,
        current_imagen_pago_url: null,
        delete_imagen_pago: false,
    };

    // Se quita 'put' de la desestructuración si no se usa directamente.
    const { data, setData, post, processing, errors: formErrors, reset, clearErrors } = useForm<OperacionFormData>(initialFormValues);

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
        setData({
            id: operacion.id,
            cuenta_id: operacion.cuenta_id.toString(),
            titular_id: operacion.propietario_id?.toString() || operacion.cuenta?.titular_tarjeta_id?.toString() || '',
            fecha_operacion: operacion.fecha_operacion,
            tipo_operacion: operacion.tipo_operacion,
            monto: operacion.monto.toString(),
            detalles: operacion.detalles || '', // Usar detalles
            estado: operacion.estado,
            imagen_pago: null,
            current_imagen_pago_url: operacion.imagen_pago_url,
            delete_imagen_pago: false,
        });
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
            monto: parseFloat(data.monto) || 0,
            detalles: data.detalles,
            estado: data.estado,
            cuenta_id: parseInt(data.cuenta_id),
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
                } as any, // Se mantiene 'as any' aquí debido a la complejidad de _method con FormDataConvertible y File.
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
            router.post(route('operaciones.store'), createPayload as any, {
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Listado de Operaciones</CardTitle>
                            <Button onClick={openCreateModal}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Crear Operación
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Buscar por descripción, monto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-sm"
                                />
                                <Button type="submit">
                                    <Search className="mr-2 h-4 w-4" /> Buscar
                                </Button>
                            </form>
                            {flash?.success && (
                                <div
                                    className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-200 dark:text-green-800"
                                    role="alert"
                                >
                                    {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800" role="alert">
                                    {flash.error}
                                </div>
                            )}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Monto</TableHead>
                                            <TableHead>Cuenta</TableHead>
                                            <TableHead>Titular</TableHead>
                                            <TableHead>Estado Pago</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {operaciones.data.length > 0 ? (
                                            operaciones.data.map((op) => (
                                                <TableRow key={op.id}>
                                                    <TableCell>{new Date(op.fecha_operacion).toLocaleDateString()}</TableCell>
                                                    <TableCell>{op.tipo_operacion}</TableCell>
                                                    <TableCell>{op.monto.toLocaleString('es-VE', { style: 'currency', currency: 'VES' })}</TableCell>
                                                    <TableCell>{op.cuenta?.nombre_cuenta || op.cuenta?.numero_cuenta || 'N/A'}</TableCell>
                                                    <TableCell>{op.cuenta?.titular_tarjeta?.nombre || 'N/A'}</TableCell>
                                                    <TableCell>{op.estado}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Abrir menú</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openViewModal(op)}>
                                                                    <Eye className="mr-2 h-4 w-4" /> Ver
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEditModal(op)}>
                                                                    <Edit2 className="mr-2 h-4 w-4" /> Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDeleteModal(op)} className="text-red-600">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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
                        <DialogTitle>{isEditModalOpen ? 'Editar Operación' : 'Crear Nueva Operación'}</DialogTitle>
                        <DialogDescription>
                            {isEditModalOpen ? 'Modifica los detalles de la operación.' : 'Completa los campos para registrar una nueva operación.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="titular_id" className="text-right">
                                Titular
                            </Label>
                            <Select value={data.titular_id} onValueChange={handleTitularChange}>
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
                            {formErrors.titular_id && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.titular_id}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cuenta_id" className="text-right">
                                Cuenta
                            </Label>
                            <Select value={data.cuenta_id} onValueChange={(value) => setData('cuenta_id', value)} disabled={!data.titular_id}>
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
                            {formErrors.cuenta_id && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.cuenta_id}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fecha_operacion" className="text-right">
                                Fecha
                            </Label>
                            <Input
                                id="fecha_operacion"
                                type="date"
                                value={data.fecha_operacion}
                                onChange={(e) => setData('fecha_operacion', e.target.value)}
                                className="col-span-3"
                            />
                            {formErrors.fecha_operacion && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.fecha_operacion}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tipo_operacion" className="text-right">
                                Tipo
                            </Label>
                            <Select
                                value={data.tipo_operacion}
                                onValueChange={(value: string) => setData('tipo_operacion', value as 'Ingreso' | 'Egreso')}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                                    <SelectItem value="Egreso">Egreso</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.tipo_operacion && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.tipo_operacion}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="monto" className="text-right">
                                Monto
                            </Label>
                            <Input
                                id="monto"
                                type="number"
                                step="0.01"
                                value={data.monto}
                                onChange={(e) => setData('monto', e.target.value)}
                                className="col-span-3"
                            />
                            {formErrors.monto && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.monto}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="detalles" className="text-right">
                                {' '}
                                {/* Cambiado de descripcion */}
                                Detalles
                            </Label>
                            <Textarea
                                id="detalles" // Cambiado de descripcion
                                value={data.detalles} // Cambiado de descripcion
                                onChange={(e) => setData('detalles', e.target.value)} // Cambiado de descripcion
                                className="col-span-3"
                                rows={3}
                            />
                            {formErrors.detalles && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.detalles}</p>}{' '}
                            {/* Cambiado de descripcion */}
                        </div>

                        {/* El campo de Notas se elimina si se ha fusionado con Detalles */}
                        {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notas" className="text-right">
                                Notas
                            </Label>
                            <Textarea id="notas" value={data.notas} onChange={(e) => setData('notas', e.target.value)} className="col-span-3" />
                            {formErrors.notas && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.notas}</p>}
                        </div> */}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="estado" className="text-right">
                                Estado Pago
                            </Label>
                            <Select
                                value={data.estado}
                                onValueChange={(value: string) => setData('estado', value as 'Pendiente' | 'Pagado' | 'Vencido')}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Estado del pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                                    <SelectItem value="Pagado">Pagado</SelectItem>
                                    <SelectItem value="Vencido">Vencido</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.estado && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.estado}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imagen_pago" className="text-right">
                                Imagen Pago
                            </Label>
                            <div className="col-span-3">
                                <Input id="imagen_pago" type="file" onChange={handleFileChange} className="mb-2" accept="image/*" />
                                {previewImage && (
                                    <div className="relative mt-2">
                                        <img src={previewImage} alt="Previsualización" className="max-h-40 rounded" />
                                        {isEditModalOpen && data.current_imagen_pago_url && (
                                            <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage} className="mt-1">
                                                Eliminar Imagen Actual
                                            </Button>
                                        )}
                                    </div>
                                )}
                                {!previewImage && data.current_imagen_pago_url && (
                                    <div className="relative mt-2">
                                        <img src={data.current_imagen_pago_url} alt="Imagen Actual" className="max-h-40 rounded" />
                                        <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage} className="mt-1">
                                            Eliminar Imagen Actual
                                        </Button>
                                    </div>
                                )}
                                {data.delete_imagen_pago && <p className="mt-1 text-xs text-yellow-600">La imagen actual se eliminará al guardar.</p>}
                            </div>
                            {formErrors.imagen_pago && <p className="col-span-4 text-xs text-red-500 italic">{formErrors.imagen_pago}</p>}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : isEditModalOpen ? 'Guardar Cambios' : 'Crear Operación'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewModalOpen} onOpenChange={closeModals}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalles de la Operación</DialogTitle>
                    </DialogHeader>
                    {selectedOperacion && (
                        <div className="space-y-2 py-4">
                            <p>
                                <strong>ID:</strong> {selectedOperacion.id}
                            </p>
                            <p>
                                <strong>Fecha:</strong> {new Date(selectedOperacion.fecha_operacion).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Tipo:</strong> {selectedOperacion.tipo_operacion}
                            </p>
                            <p>
                                <strong>Monto:</strong> {selectedOperacion.monto.toLocaleString('es-VE', { style: 'currency', currency: 'VES' })}
                            </p>
                            <p>
                                <strong>Cuenta:</strong> {selectedOperacion.cuenta?.nombre_cuenta || selectedOperacion.cuenta?.numero_cuenta || 'N/A'}
                            </p>
                            <p>
                                <strong>Titular:</strong> {selectedOperacion.cuenta?.titular_tarjeta?.nombre || 'N/A'}
                            </p>
                            <p>
                                <strong>Detalles:</strong> {selectedOperacion.detalles || 'N/A'}
                            </p>
                            <p>
                                <strong>Estado Pago:</strong> {selectedOperacion.estado}
                            </p>
                            {/* Ya no hay notas separadas si se fusionaron en detalles */}
                            {/* <p>
                                <strong>Notas:</strong> {selectedOperacion.notas || 'N/A'}
                            </p> */}
                            {selectedOperacion.imagen_pago_url && (
                                <div>
                                    <strong>Imagen de Pago:</strong>
                                    <img
                                        src={selectedOperacion.imagen_pago_url}
                                        alt="Comprobante de pago"
                                        className="mt-2 h-auto max-w-full rounded"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar la operación ID: {selectedOperacion?.id}? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={processing}>
                            {processing ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default OperacionesIndex;
