import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Clientes {
    id: number;
    Nombre: string;
    telefono: string;
    Premium: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResource<T> {
    data: T[];
    total: number;
    per_page: number;
    current_page: number;
    first_page_url: string;
    last_page_url: string;
    last_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface Cuenta {
    id: number;
    numero_cuenta: string; // De Cuenta.php
    nombre_cuenta?: string; // Para visualización (ej. "Banco - NNNN"). El backend debería proveerlo o se construye en frontend.
    // OperacionesIndex.tsx usa op.cuenta?.nombre_cuenta. Asumimos que el backend lo incluye.
    banco_asociado?: string; // De Cuenta.php
    propietario_id: number; // FK a TitularTarjeta, de Cuenta.php.
    // titular_tarjeta_id es usado por el filtro en el frontend: c.titular_tarjeta_id.
    // Esto implica que la prop 'cuentas' (array de Cuenta) tiene este campo.
    // Probablemente se deriva de propietario_id o es un accesor en el backend.
    titular_tarjeta_id: number;
    titular_tarjeta?: TitularTarjeta; // Para datos anidados como op.cuenta.titular_tarjeta.nombre
    created_at?: string;
    updated_at?: string;
    // Campos adicionales del modelo Cuenta.php que podrían ser útiles:
    // numero_tarjeta?: string;
    // tipo_moneda?: string;
    // tipo_cuenta?: string;
    // estado?: string;
    // fecha_apertura?: string;
}

export interface TitularTarjeta {
    id: number;
    nombre: string; // Corresponde a $fillable = ['nombre'] en TitularTarjeta.php
    telefono?: string; // Opcional, de TitularTarjeta.php
    avatar?: string; // Opcional, de TitularTarjeta.php
    created_at?: string;
    updated_at?: string;
}

export interface Operacion {
    id: number;
    fecha_operacion: string; // De Operacion.php 'fecha_operacion'
    cuenta_id: number; // De Operacion.php
    propietario_id?: number; // FK a TitularTarjeta, de Operacion.php 'propietario_id'
    tipo_operacion: 'Ingreso' | 'Egreso' | string; // De Operacion.php 'tipo_operacion'. El formulario usa 'Ingreso'/'Egreso'.
    monto: number; // De Operacion.php
    detalles?: string | null; // Cambiado de descripcion a detalles
    estado: string; // De Operacion.php 'estado'. El formulario usa 'Pendiente' | 'Pagado' | 'Vencido'.
    // notas?: string | null; // Se elimina si se combina con detalles en el frontend antes de enviar
    imagen_pago_url?: string | null; // Derivado de 'imagen_pago' (nombre de archivo) en Operacion.php
    cuenta?: Cuenta; // Para datos anidados como op.cuenta.nombre_cuenta
    // titular_tarjeta se accede vía operacion.cuenta.titular_tarjeta
    // Campos adicionales del modelo Operacion.php que podrían ser útiles:
    // numero_operacion?: string;
    // tipo_moneda?: string;
    // detalles?: string; // Si 'descripcion' y 'notas' no lo cubren.
    created_at?: string;
    updated_at?: string;
}

// Base PageProps for Inertia applications, extending SharedData
export type InertiaPageProps = SharedData & {
    errors: Record<string, string>;
    flash: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
        [key: string]: string | undefined;
    };
};
