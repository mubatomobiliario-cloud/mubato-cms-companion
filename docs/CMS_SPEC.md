# MUBATO CMS Companion

## Campos de entrada / datos base de MUBATO

- Proyecto
- Cliente
- Ciudad
- Categoría
- Espacios
- Estado
- Año
- Servicios
- Destacado
- Orden Home

Estos campos forman parte de la información base del proyecto. Companion debe preservarlos durante la exportación salvo que una regla explícita del flujo indique lo contrario.

## Campos generados por Dirección Editorial / Companion

- Código MUBATO
- Hero Texto
- Descripción
- SEO Title
- Meta Description
- Slug

Estos son los campos editoriales que el Companion puede producir y actualizar durante el flujo de generación.

## Multimedia Wix

### Hero Imagen

- Contrato físico: string `wix:image://...`.
- No es JSON.
- La URI completa debe preservarse.
- Companion no inventa `slug` ni `src` de Wix.

### Galería General

- Contrato físico: JSON serializado de un array de objetos multimedia Wix.
- Se preservan las referencias y metadatos físicos existentes.
- El orden de la galería no se modifica en el MVP.

`Hero Imagen` y `Galería General` tienen contratos físicos distintos y requieren parsers distintos.

## Campos técnicos Wix

Los identificadores, fechas, Owner y demás campos técnicos no pertenecientes al modelo editorial deben preservarse sin reconstrucción.

## Contrato de salida

Companion no reconstruye una fila Wix desde cero. El adaptador debe:

1. localizar la fila existente;
2. preservar la fila completa;
3. modificar únicamente campos propiedad de Companion;
4. conservar la identidad multimedia Wix;
5. producir un CSV de salida verificable campo por campo.

El contrato completo está documentado en `docs/01_Arquitectura/CONTRATO_SALIDA_CSV_V0.1.md`.
