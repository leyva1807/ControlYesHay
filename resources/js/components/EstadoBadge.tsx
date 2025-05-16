// resources/js/components/EstadoBadge.tsx
import React from 'react';

type EstadoBadgeProps = {
  estado: boolean;
};

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
  const isActive = estado;
  const text = isActive ? 'Activa' : 'Inactiva';
  const className = isActive ? 'text-green-600' : 'text-red-600';

  return <span className={className}>{text}</span>;
};

export default EstadoBadge;
