// resources/js/components/StatusBadge.tsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'error' | 'warning' | 'pending' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    colors: 'bg-green-100 text-green-800 border border-green-200',
    iconColor: 'text-green-500',
  },
  error: {
    icon: XCircle,
    colors: 'bg-red-100 text-red-800 border border-red-200',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertCircle,
    colors: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    iconColor: 'text-yellow-500',
  },
  pending: {
    icon: Clock,
    colors: 'bg-blue-100 text-blue-800 border border-blue-200',
    iconColor: 'text-blue-500',
  },
  neutral: {
    icon: AlertCircle,
    colors: 'bg-gray-100 text-gray-800 border border-gray-200',
    iconColor: 'text-gray-500',
  },
};

const defaultTexts = {
  success: 'Completado',
  error: 'Error',
  warning: 'Advertencia',
  pending: 'Pendiente',
  neutral: 'Neutral',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  showIcon = true,
  size = 'md',
  className,
  iconClassName,
  textClassName,
}) => {
  const { icon: Icon, colors, iconColor } = statusConfig[status];

  const displayText = text || defaultTexts[status];

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 rounded',
    md: 'text-sm px-2 py-1 rounded-md',
    lg: 'text-base px-3 py-1.5 rounded-lg',
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        colors,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(iconColor, iconSizeClasses[size], iconClassName)} />
      )}
      <span className={cn(textClassName)}>{displayText}</span>
    </span>
  );
};
