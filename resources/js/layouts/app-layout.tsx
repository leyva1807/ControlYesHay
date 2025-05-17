import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// Importamos Toaster y la función toast de react-hot-toast
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: Record<string, unknown>;
    header?: ReactNode;
    // Permite que otras props se pasen a AppLayoutTemplate
    [key: string]: unknown;
}

// Define una interfaz más específica para las props de la página, incluyendo flash.
interface CustomPageProps {
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    auth?: {
        user: Record<string, unknown>;
    };
    errors?: Record<string, string>;
    // aquí irían otras props globales que esperas de usePage().props
    [key: string]: unknown; // para otras props no definidas explícitamente
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    // Tipamos usePage para obtener autocompletado y seguridad en `props`
    const page = usePage<CustomPageProps>();
    const flash = page.props.flash;

    // useEffect para mostrar notificaciones flash usando react-hot-toast con iconos mejorados
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                style: {
                    borderRadius: '10px',
                    background: '#f0fdf4',
                    color: '#166534',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #dcfce7',
                    padding: '16px',
                },
                duration: 5000,
            });
        }

        if (flash?.error) {
            toast.error(flash.error, {
                icon: <XCircle className="h-5 w-5 text-red-600" />,
                style: {
                    borderRadius: '10px',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #fee2e2',
                    padding: '16px',
                },
                duration: 5000,
            });
        }

        if (flash?.warning) {
            toast(flash.warning, {
                icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
                style: {
                    borderRadius: '10px',
                    background: '#fffbeb',
                    color: '#b45309',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #fef3c7',
                    padding: '16px',
                },
                duration: 5000,
            });
        }

        if (flash?.info) {
            toast(flash.info, {
                icon: <Info className="h-5 w-5 text-blue-600" />,
                style: {
                    borderRadius: '10px',
                    background: '#eff6ff',
                    color: '#1e40af',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #dbeafe',
                    padding: '16px',
                },
                duration: 5000,
            });
        }
    }, [flash]);

    return (
        <>
            {/* Componente Toaster mejorado de react-hot-toast */}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={12}
                containerStyle={{
                    top: 80, // Ajustado para que no quede detrás de posibles barras de navegación
                }}
                toastOptions={{
                    className: '',
                    duration: 5000,
                    success: {
                        duration: 5000,
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #dcfce7',
                        },
                    },
                    error: {
                        duration: 7000, // Errores visibles por más tiempo
                        style: {
                            background: '#fef2f2',
                            color: '#b91c1c',
                            border: '1px solid #fee2e2',
                        }
                    },
                }}
            />

            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </>
    );
}
