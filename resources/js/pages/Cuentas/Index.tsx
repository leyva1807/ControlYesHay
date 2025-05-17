// resources/js/Pages/Cuentas/Index.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import EstadoBadge from '@/components/EstadoBadge';
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  CreditCard,
  User,
  DollarSign,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Definición de tipos
interface Titular {
  id: number;
  nombre: string;
  telefono: string;
}

interface Cuenta {
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
  nombre_cuenta?: string;
}

interface CuentasIndexProps {
  cuentas: {
    data: Cuenta[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  titulares: Titular[];
  filters: Record<string, string>;
  auth: {
    user: Record<string, any>
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

// Formulario para crear/editar cuentas
interface CuentaFormData {
  id?: number;
  propietario_id: string;
  numero_tarjeta: string;
  numero_cuenta: string;
  tipo_moneda: string;
  tipo_cuenta: string;
  banco_asociado: string;
  estado: boolean;
  fecha_apertura: string;
  [key: string]: FormDataConvertible | undefined;
}

// Tipo para datos que pueden ser enviados en formularios
type FormDataConvertible = string | number | boolean | Date | null | undefined;

const CuentasIndex: React.FC<CuentasIndexProps> = ({
  cuentas,
  titulares,
  filters: initialFilters = {},
  auth,
  flash
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState<Cuenta | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');

  // Valores iniciales para el formulario
  const initialFormValues: CuentaFormData = {
    propietario_id: '',
    numero_tarjeta: '',
    numero_cuenta: '',
    tipo_moneda: 'USD',
    tipo_cuenta: 'Ahorro',
    banco_asociado: '',
    estado: true,
    fecha_apertura: new Date().toISOString().split('T')[0],
  };

  // Hook useForm para manejar el formulario
  const { data, setData, processing, errors: formErrors, reset, clearErrors } = useForm<CuentaFormData>(initialFormValues);

  // Efecto para cerrar modales cuando hay éxito
  React.useEffect(() => {
    if (flash?.success) {
      closeModals();
    }
  }, [flash]);

  // Manejadores para los modales
  const openCreateModal = () => {
    reset();
    setData('fecha_apertura', new Date().toISOString().split('T')[0]);
    clearErrors();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (cuenta: Cuenta) => {
    setSelectedCuenta(cuenta);
    // Reset del formulario y cargar datos de la cuenta
    reset();
    setData({
      id: cuenta.id,
      propietario_id: cuenta.propietario_id.toString(),
      numero_tarjeta: cuenta.numero_tarjeta,
      numero_cuenta: cuenta.numero_cuenta || '',
      tipo_moneda: cuenta.tipo_moneda,
      tipo_cuenta: cuenta.tipo_cuenta,
      banco_asociado: cuenta.banco_asociado || '',
      estado: cuenta.estado,
      fecha_apertura: cuenta.fecha_apertura,
    });
    clearErrors();
    setIsEditModalOpen(true);
  };

  const openViewModal = (cuenta: Cuenta) => {
    setSelectedCuenta(cuenta);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (cuenta: Cuenta) => {
    setSelectedCuenta(cuenta);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCuenta(null);
    reset();
    clearErrors();
  };

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (selectedCuenta && isEditModalOpen) {
      router.post(route('cuentas.update', selectedCuenta.id), {
        _method: 'PUT',
        ...data,
      } as Record<string, FormDataConvertible>, {
        onSuccess: () => closeModals(),
        preserveState: true,
        replace: true,
      });
    } else {
      router.post(route('cuentas.store'), data as Record<string, FormDataConvertible>, {
        onSuccess: () => closeModals(),
        preserveState: true,
        replace: true,
      });
    }
  };

  // Manejar eliminación
  const handleDeleteConfirm = () => {
    if (selectedCuenta) {
      router.delete(route('cuentas.destroy', selectedCuenta.id), {
        onSuccess: () => closeModals(),
      });
    }
  };

  // Manejar búsqueda
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    router.get(route('cuentas.index'), { search: searchTerm }, {
      preserveState: true,
      replace: true
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Cuentas</h2>}
    >
      <Head title="Cuentas" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <CardTitle>Listado de Cuentas</CardTitle>
              </div>
              <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Nueva Cuenta
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="mb-6 flex gap-2 items-center">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por titular, número de cuenta..."
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
                      <TableHead className="font-medium w-10">#</TableHead>
                      <TableHead className="font-medium">Titular</TableHead>
                      <TableHead className="font-medium">Número de Cuenta</TableHead>
                      <TableHead className="font-medium">Banco</TableHead>
                      <TableHead className="font-medium">Tipo</TableHead>
                      <TableHead className="font-medium">Moneda</TableHead>
                      <TableHead className="font-medium">Estado</TableHead>
                      <TableHead className="font-medium text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cuentas.data.length > 0 ? (
                      cuentas.data.map((cuenta, index) => (
                        <TableRow key={cuenta.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                          <TableCell>{(cuentas.current_page - 1) * cuentas.per_page + index + 1}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            {cuenta.titular?.nombre || 'N/A'}
                          </TableCell>
                          <TableCell className="font-medium">{cuenta.numero_cuenta || cuenta.numero_tarjeta}</TableCell>
                          <TableCell>
                            {cuenta.banco_asociado ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                                {cuenta.banco_asociado}
                              </span>
                            ) : 'No especificado'}
                          </TableCell>
                          <TableCell>{cuenta.tipo_cuenta}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-400">
                              <DollarSign className="h-3 w-3" />
                              {cuenta.tipo_moneda}
                            </span>
                          </TableCell>
                          <TableCell>
                            <EstadoBadge estado={cuenta.estado} size="sm" />
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
                                <DropdownMenuItem onClick={() => openViewModal(cuenta)} className="cursor-pointer flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-blue-600" /> Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditModal(cuenta)} className="cursor-pointer flex items-center gap-2">
                                  <Edit2 className="h-4 w-4 text-green-600" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openDeleteModal(cuenta)} className="cursor-pointer flex items-center gap-2 text-red-600">
                                  <Trash2 className="h-4 w-4" /> Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 py-4 text-gray-500">
                            <CreditCard className="h-10 w-10 text-gray-400" />
                            <p>No hay cuentas registradas.</p>
                            <Button variant="outline" onClick={openCreateModal} className="mt-2">
                              <PlusCircle className="mr-2 h-4 w-4" /> Crear nueva cuenta
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {cuentas.data.length > 0 && (
                <div className="mt-4 flex justify-center">
                  {cuentas.links.map((link, index) =>
                    link.url ? (
                      <a
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para Crear/Editar cuenta */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={closeModals}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEditModalOpen ? (
                <>
                  <Edit2 className="h-5 w-5 text-blue-600" /> Editar Cuenta
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 text-green-600" /> Nueva Cuenta
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? 'Modifica los detalles de la cuenta.' : 'Completa los campos para registrar una nueva cuenta.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propietario_id" className="text-right font-medium">
                <User className="mr-1 h-4 w-4 inline-block" /> Titular
              </Label>
              <Select
                value={data.propietario_id}
                onValueChange={(value) => setData('propietario_id', value)}
                disabled={processing}
              >
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
              {formErrors.propietario_id && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.propietario_id}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero_tarjeta" className="text-right font-medium">
                <CreditCard className="mr-1 h-4 w-4 inline-block" /> Número de Tarjeta
              </Label>
              <Input
                id="numero_tarjeta"
                type="text"
                value={data.numero_tarjeta}
                onChange={(e) => setData('numero_tarjeta', e.target.value)}
                className="col-span-3"
                disabled={processing}
              />
              {formErrors.numero_tarjeta && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.numero_tarjeta}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero_cuenta" className="text-right font-medium">
                <CreditCard className="mr-1 h-4 w-4 inline-block" /> Número de Cuenta
              </Label>
              <Input
                id="numero_cuenta"
                type="text"
                value={data.numero_cuenta}
                onChange={(e) => setData('numero_cuenta', e.target.value)}
                className="col-span-3"
                disabled={processing}
              />
              {formErrors.numero_cuenta && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.numero_cuenta}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="banco_asociado" className="text-right font-medium">
                <Wallet className="mr-1 h-4 w-4 inline-block" /> Banco
              </Label>
              <Select
                value={data.banco_asociado}
                onValueChange={(value) => setData('banco_asociado', value)}
                disabled={processing}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione un banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPA">BPA</SelectItem>
                  <SelectItem value="BANDED">BANDED</SelectItem>
                  <SelectItem value="BCP">BCP</SelectItem>
                  <SelectItem value="Interbank">Interbank</SelectItem>
                  <SelectItem value="BBVA">BBVA</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.banco_asociado && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.banco_asociado}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo_cuenta" className="text-right font-medium">
                <Wallet className="mr-1 h-4 w-4 inline-block" /> Tipo de Cuenta
              </Label>
              <Select
                value={data.tipo_cuenta}
                onValueChange={(value) => setData('tipo_cuenta', value)}
                disabled={processing}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione tipo de cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ahorro">Ahorro</SelectItem>
                  <SelectItem value="Corriente">Corriente</SelectItem>
                  <SelectItem value="Credito">Crédito</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.tipo_cuenta && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.tipo_cuenta}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo_moneda" className="text-right font-medium">
                <DollarSign className="mr-1 h-4 w-4 inline-block" /> Moneda
              </Label>
              <Select
                value={data.tipo_moneda}
                onValueChange={(value) => setData('tipo_moneda', value)}
                disabled={processing}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUP">CUP</SelectItem>
                  <SelectItem value="MLC">MLC</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="Soles">Soles</SelectItem>
                  <SelectItem value="saldo">Saldo</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.tipo_moneda && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.tipo_moneda}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha_apertura" className="text-right font-medium">
                <Calendar className="mr-1 h-4 w-4 inline-block" /> Fecha de Apertura
              </Label>
              <Input
                id="fecha_apertura"
                type="date"
                value={data.fecha_apertura}
                onChange={(e) => setData('fecha_apertura', e.target.value)}
                className="col-span-3"
                disabled={processing}
              />
              {formErrors.fecha_apertura && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.fecha_apertura}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right font-medium">
                Estado
              </Label>
              <Select
                value={data.estado ? "true" : "false"}
                onValueChange={(value) => setData('estado', value === "true")}
                disabled={processing}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Estado de la cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activa</SelectItem>
                  <SelectItem value="false">Inactiva</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.estado && <p className="col-span-4 text-xs text-red-500 italic pl-32">{formErrors.estado}</p>}
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
                {processing ? 'Guardando...' : isEditModalOpen ? 'Guardar Cambios' : 'Crear Cuenta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para Ver Detalles */}
      <Dialog open={isViewModalOpen} onOpenChange={closeModals}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Eye className="h-5 w-5 text-blue-600" />
              Detalles de la Cuenta
            </DialogTitle>
          </DialogHeader>

          {selectedCuenta && (
            <div className="py-4 space-y-0">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">ID de Cuenta</div>
                  <div className="font-semibold text-blue-700 dark:text-blue-400">#{selectedCuenta.id}</div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Estado</div>
                  <div>
                    <EstadoBadge estado={selectedCuenta.estado} size="sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Titular</div>
                  <div className="font-medium flex items-center gap-1.5">
                    <User className="h-4 w-4 text-blue-600" />
                    {selectedCuenta.titular?.nombre || 'N/A'}
                  </div>
                </div>

                {selectedCuenta.titular?.telefono && (
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Teléfono</div>
                    <div className="font-medium">
                      {selectedCuenta.titular.telefono}
                    </div>
                  </div>
                )}

                <div className="col-span-2 border-t pt-3">
                  <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Número de Tarjeta</div>
                  <div className="font-medium flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    {selectedCuenta.numero_tarjeta}
                  </div>
                </div>

                {selectedCuenta.numero_cuenta && (
                  <div className="col-span-2 border-t pt-3">
                    <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Número de Cuenta</div>
                    <div className="font-medium flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      {selectedCuenta.numero_cuenta}
                    </div>
                  </div>
                )}

                <div className="col-span-2 sm:col-span-1 border-t pt-3">
                  <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Banco</div>
                  <div className="font-medium">
                    {selectedCuenta.banco_asociado || 'No especificado'}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 border-t pt-3">
                  <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Tipo</div>
                  <div className="font-medium">
                    {selectedCuenta.tipo_cuenta}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 border-t pt-3">
                  <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Moneda</div>
                  <div className="font-medium flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {selectedCuenta.tipo_moneda}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 border-t pt-3">
                  <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Fecha de Apertura</div>
                  <div className="font-medium flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {new Date(selectedCuenta.fecha_apertura).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">Cerrar</Button>
            </DialogClose>
            {selectedCuenta && (
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                closeModals();
                setTimeout(() => openEditModal(selectedCuenta), 100);
              }}>
                <Edit2 className="h-4 w-4 mr-2" /> Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Confirmar Eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la cuenta #{selectedCuenta?.id}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-900/30 my-2">
            <p className="text-sm text-red-800 dark:text-red-400">
              Al eliminar esta cuenta, se perderán todos los datos asociados.
              {selectedCuenta?.nombre_cuenta && (
                <span className="block mt-1 font-medium">{selectedCuenta.nombre_cuenta}</span>
              )}
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

export default CuentasIndex;
