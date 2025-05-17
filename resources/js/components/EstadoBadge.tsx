// resources/js/components/EstadoBadge.tsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

type EstadoBadgeProps = {
  estado: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, showIcon = true, size = 'md' }) => {
  const isActive = estado;
  const text = isActive ? 'Activa' : 'Inactiva';

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 rounded',
    md: 'text-sm px-2 py-1 rounded-md',
    lg: 'text-base px-3 py-1.5 rounded-lg'
  };

  const bgColorClass = isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200';
  const iconColorClass = isActive ? 'text-green-500' : 'text-red-500';

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${bgColorClass} ${sizeClasses[size]}`}>
      {showIcon && (
        isActive ?
          <CheckCircle className={`${iconColorClass} ${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}`} /> :
          <XCircle className={`${iconColorClass} ${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}`} />
      )}
      {text}
    </span>
  );
};

export default EstadoBadge;
