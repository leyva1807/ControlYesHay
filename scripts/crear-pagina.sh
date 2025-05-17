#!/bin/bash
# Script para crear una nueva página React para Inertia

# Verificar si se proporcionaron los parámetros
if [ "$#" -lt 1 ]; then
    echo "Uso: $0 NombrePagina [carpeta]"
    echo "Ejemplo: $0 Index Titulares"
    exit 1
fi

# Establecer nombre de la página
PAGE_NAME="$1"

# Establecer carpeta (opcional)
FOLDER=""
if [ "$#" -eq 2 ]; then
    FOLDER="$2/"
    # Crear carpeta si no existe
    if [ ! -d "resources/js/Pages/$FOLDER" ]; then
        mkdir -p "resources/js/Pages/$FOLDER"
        echo "Creada carpeta: resources/js/Pages/$FOLDER"
    fi
fi

# Verificar que el nombre empiece con mayúscula
if [[ ! "$PAGE_NAME" =~ ^[A-Z] ]]; then
    echo "Error: El nombre de la página debe empezar con mayúscula."
    echo "Ejemplo: Index, Create, Edit, Show, etc."
    exit 1
fi

# Crear archivo de la página
PAGE_FILE="resources/js/Pages/$FOLDER$PAGE_NAME.tsx"
cat > "$PAGE_FILE" << EOF
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface ${PAGE_NAME}Props {
  // Define tus props aquí
  // datos enviados desde el controlador
}

export default function ${PAGE_NAME}(props: ${PAGE_NAME}Props) {
  return (
    <>
      <Head title="${PAGE_NAME}" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Contenido de tu página aquí */}
              <h1 className="text-2xl font-bold mb-4">${FOLDER}${PAGE_NAME}</h1>

              {/* Accede a los datos de props */}
              <pre>{JSON.stringify(props, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Establecer el layout de la página
${PAGE_NAME}.layout = (page: React.ReactNode) => <AppLayout children={page} />;
EOF

echo "Creada página: $PAGE_FILE"

# Crear archivo de controlador si es Index
if [ "$PAGE_NAME" == "Index" ] && [ ! -z "$FOLDER" ]; then
    # Quitar slash final si existe
    CONTROLLER_NAME="${FOLDER%/}Controller"

    # Crear controlador
    CONTROLLER_FILE="app/Http/Controllers/$CONTROLLER_NAME.php"
    if [ ! -f "$CONTROLLER_FILE" ]; then
        cat > "$CONTROLLER_FILE" << EOF
<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Inertia\\Inertia;

class $CONTROLLER_NAME extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('$FOLDER$PAGE_NAME', [
            'datos' => [] // Tus datos aquí
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('${FOLDER}Create', [
            'datos' => [] // Tus datos aquí
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request \$request)
    {
        // Validación
        \$validated = \$request->validate([
            // Define tus reglas de validación aquí
        ]);

        // Crear registro
        // \$item = Model::create(\$validated);

        return redirect()->route('${FOLDER%/}.index')
            ->with('success', 'Creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int \$id)
    {
        // \$item = Model::findOrFail(\$id);

        return Inertia::render('${FOLDER}Show', [
            'item' => [] // \$item
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int \$id)
    {
        // \$item = Model::findOrFail(\$id);

        return Inertia::render('${FOLDER}Edit', [
            'item' => [] // \$item
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request \$request, int \$id)
    {
        // Validación
        \$validated = \$request->validate([
            // Define tus reglas de validación aquí
        ]);

        // \$item = Model::findOrFail(\$id);
        // \$item->update(\$validated);

        return redirect()->route('${FOLDER%/}.index')
            ->with('success', 'Actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int \$id)
    {
        // \$item = Model::findOrFail(\$id);
        // \$item->delete();

        return redirect()->route('${FOLDER%/}.index')
            ->with('success', 'Eliminado exitosamente.');
    }
}
EOF
        echo "Creado controlador: $CONTROLLER_FILE"

        # Crear ruta si no existe
        ROUTE_CONTENT=$(cat routes/web.php)
        ROUTE_LINE="Route::resource('${FOLDER%/}', $CONTROLLER_NAME::class);"
        if [[ ! $ROUTE_CONTENT == *"$ROUTE_LINE"* ]]; then
            # Añadir importación si no existe
            if [[ ! $ROUTE_CONTENT == *"use App\\Http\\Controllers\\$CONTROLLER_NAME;"* ]]; then
                IMPORT_LINE="use App\\Http\\Controllers\\$CONTROLLER_NAME;"
                sed -i "1i$IMPORT_LINE" routes/web.php
                echo "Añadida importación para $CONTROLLER_NAME"
            fi

            # Añadir ruta
            echo "$ROUTE_LINE" >> routes/web.php
            echo "Añadida ruta: $ROUTE_LINE"
        fi
    else
        echo "Controlador ya existe: $CONTROLLER_FILE"
    fi
fi

echo "¡Página $PAGE_NAME creada exitosamente!"
echo "Recuerda definir las rutas necesarias en routes/web.php si no se crearon automáticamente."
