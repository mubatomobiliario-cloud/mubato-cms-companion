# MUBATO CMS Companion — Contrato de Salida CSV V0.1

> Contrato operativo para la salida Companion → CSV Wix. Define qué campos puede modificar Companion y qué información debe preservar sin reconstruirla.

## 1. Principio fundamental

Companion no reconstruye una fila Wix desde cero.

El flujo de salida es:

`CSV original Wix → localizar fila → preservar fila → modificar únicamente campos propiedad de Companion → CSV de salida`

El CSV de salida debe conservar la identidad y estructura física que Wix ya generó, especialmente las referencias multimedia.

## 2. Propiedad de campos

### 2.1 Campos de entrada / datos MUBATO

Estos campos provienen del registro del proyecto y deben preservarse salvo que el flujo editorial tenga una razón explícita para actualizarlos:

- `Proyecto`
- `Cliente`
- `Ciudad`
- `Categoría`
- `Espacios`
- `Estado`
- `Año`
- `Servicios`
- `Destacado`
- `Orden Home`

**Regla:** el exportador no debe vaciar ni reemplazar estos valores por ausencia de información editorial.

### 2.2 Campos generados por Companion

Companion puede escribir o actualizar, según la fase del flujo:

- `Código MUBATO`
- `Hero Texto`
- `Descripción`
- `SEO Title`
- `Meta Description`
- `Slug`

Estos campos forman parte del producto editorial y serán alimentados por Dirección Editorial.

### 2.3 Multimedia Wix: preservar identidad física

#### `Hero Imagen`

Contrato físico comprobado:

- Es una cadena `wix:image://...`.
- No debe tratarse como JSON.
- La URI completa debe conservarse.
- Companion puede asociar esa URI con la fotografía local mediante su `fileName`.
- Companion no inventa ni reconstruye `slug` o `src` de Wix.

#### `Galería General`

Contrato físico comprobado:

- Es JSON serializado de un array de objetos multimedia Wix.
- Los objetos contienen identidad y metadatos físicos generados/conservados por Wix.
- Deben preservarse las referencias existentes (`fileName`, `slug`, `src`, `type`, `settings` y demás propiedades recibidas).
- El orden de la galería no se modifica en el MVP.

**Importante:** `Galería General` y `Hero Imagen` tienen contratos físicos diferentes y no deben compartir parser.

### 2.4 Campos técnicos Wix

Los campos técnicos del registro que no pertenecen al modelo editorial Companion deben copiarse sin modificación. Esto incluye, cuando estén presentes, identificadores y metadatos de auditoría generados por Wix como `ID`, fechas de creación/modificación, `Owner` y cualquier otro campo técnico no declarado propiedad de Companion.

## 3. Reglas de escritura

1. Localizar la fila existente; no crear una fila paralela.
2. Leer la fila completa antes de modificarla.
3. Modificar únicamente campos explícitamente propiedad de Companion.
4. Nunca convertir `Hero Imagen` a JSON.
5. Nunca reconstruir objetos multimedia Wix a partir de nombres de archivo.
6. Nunca inventar `slug` o `src` de multimedia Wix.
7. Preservar los campos técnicos Wix desconocidos.
8. Si un campo propiedad de Companion no tiene contenido válido, no borrar automáticamente el valor existente sin una regla explícita.
9. La fase de análisis no escribe el CSV.
10. La exportación debe ser verificable comparando entrada y salida campo por campo.

## 4. Estado V0.1

### Comprobado

- `Galería General` = JSON serializado de objetos multimedia Wix.
- `Hero Imagen` = URI `wix:image://...`.
- Wix conserva/genera identidad multimedia.
- Completar campos básicos vacíos del registro de prueba permitió materializar Hero y Galería sin alterar sus objetos multimedia.

### Pendiente

- Formalizar con el CSV real el conjunto definitivo de campos estructurales mínimos que Wix exige para materializar un item.
- Implementar el adaptador de salida bajo estas reglas.
- Ejecutar prueba end-to-end con una sola historia.

## 5. Relación con Dirección Editorial

Dirección Editorial produce contenido estructurado; el adaptador CSV es responsable de traducir únicamente ese contenido a las columnas de salida permitidas.

`Proyecto + Observaciones + Doctrina → Dirección Editorial → campos Companion → Adaptador CSV → fila Wix preservada`
