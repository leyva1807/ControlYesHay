// resources/js/components/EmptyState.tsx
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
  iconClassName,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed",
        "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800",
        className
      )}
    >
      {icon && (
        <div className={cn("mb-4 text-gray-400", iconClassName)}>
          {icon}
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>

      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-4"
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
