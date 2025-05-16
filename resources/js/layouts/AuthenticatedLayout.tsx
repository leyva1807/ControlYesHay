import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

/**
 * Componente de compatibilidad para mantener imports antiguos.
 * Este componente adapta AppLayout a la interfaz AuthenticatedLayout
 * para mantener compatibilidad con los componentes que lo importan.
 */
export default function AuthenticatedLayout({
    children,
    user, // Se mantine para compatibilidad aunque no se use directamente
    header,
    breadcrumbs = [],
    ...props
}: {
    children: ReactNode;
    user?: Record<string, unknown>; // Tipo más específico en lugar de any
    header?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    [key: string]: unknown; // Tipo más específico en lugar de any
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} {...props}>
            {header && (
                <div className="py-6 px-4 sm:px-6">
                    {header}
                </div>
            )}
            {children}
        </AppLayout>
    );
}
