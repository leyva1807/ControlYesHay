import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react'; // ReactNode y useEffect importados
import { usePage } from '@inertiajs/react';

// Importa Toaster y la función toast de react-hot-toast
import { Toaster, toast } from 'react-hot-toast';

// Tu componente ToastNotification actual.
// Considera si quieres mantenerlo o que react-hot-toast maneje todas las notificaciones.
// Por ahora, lo dejaremos, pero he comentado su uso más abajo.
// import ToastNotification from '@/components/ui/ToastNotification';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    // Permite que otras props se pasen a AppLayoutTemplate
    [key: string]: any;
}

// Define una interfaz más específica para las props de la página, incluyendo flash.
interface CustomPageProps {
    flash?: {
        success?: string;
        error?: string;
        // puedes añadir otros tipos de mensajes flash como 'info', 'warning'
    };
    // aquí irían otras props globales que esperas de usePage().props
    [key: string]: any; // para otras props no definidas explícitamente
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    // Tipamos usePage para obtener autocompletado y seguridad en `props`
    const page = usePage<CustomPageProps>();
    const flash = page.props.flash;

    // useEffect para mostrar notificaciones flash usando react-hot-toast
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            // Inertia usualmente limpia los mensajes flash después de leerlos una vez.
            // Si necesitas limpiarlos manualmente (raro con Inertia), tendrías que hacerlo aquí.
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        // Podrías añadir más 'if' para otros tipos de mensajes flash (info, warning)
    }, [flash]); // Este efecto se ejecutará cada vez que cambie el objeto 'flash'

    return (
        <>
            {/* Componente Toaster de react-hot-toast */}
            {/* Aquí puedes configurar la posición, duración por defecto, estilos, etc. */}
            <Toaster
                position="top-right" // Posiciones comunes: top-left, top-center, top-right, bottom-left, etc.
                reverseOrder={false}  // Las nuevas toasts aparecen abajo si es true
                gutter={8}            // Espacio entre toasts
                containerClassName="" // Clase para el contenedor
                containerStyle={{}}   // Estilos para el contenedor
                toastOptions={{
                    // Define opciones por defecto para todos los toasts
                    className: '',
                    duration: 5000, // Duración por defecto en ms
                    style: {
                        background: '#ffffff', // Fondo blanco por defecto
                        color: '#333333',    // Texto oscuro por defecto
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    },

                    // Opciones por defecto para tipos específicos de toasts
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981', // Verde Tailwind (emerald-500)
                            secondary: '#FFFFFF',
                        },
                        style: {
                            borderColor: '#10B981',
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444', // Rojo Tailwind (red-500)
                            secondary: '#FFFFFF',
                        },
                        style: {
                            borderColor: '#EF4444',
                        }
                    },
                }}
            />

            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>

            {/*
                Tu componente ToastNotification original:
                Si ahora usas react-hot-toast para manejar los mensajes flash (a través del useEffect de arriba),
                probablemente ya no necesites este componente <ToastNotification /> o deberías adaptarlo.
                Mostrar ambos podría resultar en notificaciones duplicadas para flash.success.
                Por ello, lo he comentado. Si decides no usar el useEffect para los mensajes flash,
                puedes descomentar tu componente.
            */}
            {/* <ToastNotification message={flash?.success} /> */}
        </>
    );
}
