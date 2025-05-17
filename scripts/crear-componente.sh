#!/bin/bash
# Script para crear un nuevo componente React en TypeScript con Inertia

# Verificar si se proporcionó un nombre
if [ "$#" -ne 1 ]; then
    echo "Uso: $0 NombreComponente"
    exit 1
fi

# Establecer nombre del componente
COMPONENT_NAME="$1"

# Verificar que el nombre empiece con mayúscula
if [[ ! "$COMPONENT_NAME" =~ ^[A-Z] ]]; then
    echo "Error: El nombre del componente debe empezar con mayúscula."
    echo "Ejemplo: Index, Create, Edit, Show, etc."
    exit 1
fi

# Crear directorio para el componente (si no existe)
COMPONENT_DIR="resources/js/Components/$COMPONENT_NAME"
if [ ! -d "$COMPONENT_DIR" ]; then
    mkdir -p "$COMPONENT_DIR"
    echo "Creado directorio: $COMPONENT_DIR"
fi

# Crear archivo principal del componente
COMPONENT_FILE="$COMPONENT_DIR/index.tsx"
cat > "$COMPONENT_FILE" << EOF
import React from 'react';

interface ${COMPONENT_NAME}Props {
  // Define tus props aquí
  className?: string;
}

/**
 * Componente ${COMPONENT_NAME}
 *
 * @description Componente para...
 */
export function ${COMPONENT_NAME}({ className = '', ...props }: ${COMPONENT_NAME}Props) {
  return (
    <div className={\`${COMPONENT_NAME.toLowerCase()}-component \${className}\`}>
      {/* Contenido de tu componente aquí */}
      <h2>${COMPONENT_NAME}</h2>
    </div>
  );
}

export default ${COMPONENT_NAME};
EOF

echo "Creado componente: $COMPONENT_FILE"

# Crear archivo de tipos (opcional)
TYPES_FILE="$COMPONENT_DIR/types.ts"
cat > "$TYPES_FILE" << EOF
/**
 * Tipos para el componente ${COMPONENT_NAME}
 */

export interface ${COMPONENT_NAME}Data {
  id: number;
  name: string;
  // Añade más campos según sea necesario
}

export type ${COMPONENT_NAME}Status = 'idle' | 'loading' | 'success' | 'error';
EOF

echo "Creado archivo de tipos: $TYPES_FILE"

# Crear ejemplo de CSS (opcional)
CSS_FILE="$COMPONENT_DIR/styles.css"
cat > "$CSS_FILE" << EOF
/* Estilos para el componente ${COMPONENT_NAME} */

.${COMPONENT_NAME.toLowerCase()}-component {
  /* Estilos básicos */
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
}
EOF

echo "Creado archivo CSS: $CSS_FILE"

echo "¡Componente $COMPONENT_NAME creado con éxito!"
echo "Puedes importarlo con: import { $COMPONENT_NAME } from '@/Components/$COMPONENT_NAME';"
