# MUBATO CMS Companion — Contrato CSV Editorial V0.1

> Contrato operativo para llevar una salida editorial validada a una fila CSV de Wix sin reconstruir ni contaminar el registro.

## 1. Principio fundamental

El CSV es una **salida de publicación**, no una etapa de redacción.

Companion no debe escribir una Historia de Transformación en el CSV por el solo hecho de que la IA haya generado un texto.

La autorización editorial debe existir antes de la escritura:

`Documentación → Validador → Revisor IA → Contrato semántico → decisión editorial → Adaptador CSV → CSV de salida`

La IA revisa. El contrato decide. El adaptador ejecuta.

## 2. Regla de publicación de Historias de Transformación

Una historia puede entrar al CSV publicable únicamente cuando:

- `aprobado === true`;
- `estado === APROBADA_CON_REVISION_HUMANA`;
- `modo === TRANSFORMACION_DOCUMENTADA`;
- `transformacionDocumentada === true`;
- la historia tiene entre 250 y 500 palabras;
- no existen errores de validación;
- la revisión humana queda pendiente como condición de publicación final.

Si el resultado es `REQUIERE_DOCUMENTACION`, la historia **no se escribe** en el CSV de publicación.

Si el resultado es `TRANSFORMACION_NO_DOCUMENTADA`, tampoco se escribe como Historia de Transformación publicable.

## 3. Regla de preservación CSV/Wix

El adaptador debe:

1. localizar la fila existente;
2. leer y preservar la fila completa;
3. modificar únicamente campos propiedad de Companion;
4. preservar identidad y metadatos físicos de Wix;
5. no reconstruir una fila desde cero;
6. generar una salida verificable campo por campo.

Las reglas físicas generales permanecen en `CONTRATO_SALIDA_CSV_V0.1.md`.

## 4. Campos editoriales

El contrato general del CMS declara como campos generados por Companion:

- `Código MUBATO`
- `Hero Texto`
- `Descripción`
- `SEO Title`
- `Meta Description`
- `Slug`

La implementación histórica también contiene referencias a campos como `Historia` y `Hero`. Estas referencias **no se convierten automáticamente en contrato canónico**.

La columna canónica para la Historia de Transformación debe determinarse a partir del encabezado del CSV real exportado por Wix antes de activar la escritura de historias.

**Regla:** no renombrar, duplicar ni adivinar columnas para resolver esta discrepancia.

## 5. Campos que nunca deben ser reconstruidos

El adaptador no debe reconstruir ni inventar:

- `ID`;
- `Owner`;
- fechas técnicas;
- `Hero Imagen`;
- `Galería General`;
- URI `wix:image://...`;
- `slug` o `src` internos de multimedia Wix;
- columnas desconocidas o no declaradas propiedad de Companion.

## 6. Duplicidad de encabezados

Si el CSV contiene encabezados duplicados, el adaptador debe detectarlos.

Una columna duplicada no puede seleccionarse silenciosamente por posición.

Debe producirse un estado de revisión de estructura hasta que la correspondencia de campo haya sido determinada de forma explícita.

## 7. Separación de fases

### Análisis

Lee el CSV y determina estructura, fila objetivo y campos disponibles.

**No escribe.**

### Preparación editorial

Recibe la salida validada de Dirección Editorial y construye el conjunto de cambios permitido.

**No inventa campos.**

### Exportación

Aplica únicamente cambios autorizados sobre la fila existente y genera un nuevo CSV.

**No modifica el CSV original en el MVP.**

## 8. Casos mínimos de aceptación

### Caso A — transformación no documentada

Entrada editorial:

`aprobado=false`

`estado=REQUIERE_DOCUMENTACION`

Resultado obligatorio:

- no escribir Historia de Transformación;
- no generar CSV publicable con esa historia;
- informar que falta documentación.

### Caso B — transformación documentada

Entrada editorial:

`aprobado=true`

`estado=APROBADA_CON_REVISION_HUMANA`

`modo=TRANSFORMACION_DOCUMENTADA`

`transformacionDocumentada=true`

Resultado obligatorio:

- permitir la preparación de la fila;
- conservar todos los campos no propiedad de Companion;
- escribir únicamente la columna editorial previamente identificada;
- generar CSV de salida sin modificar el original.

### Caso C — columna editorial no identificada

Aunque la historia esté aprobada, si el encabezado real del CSV no permite identificar de forma inequívoca la columna destino:

- no escribir;
- no adivinar;
- estado `REQUIERE_MAPEO_CSV`.

## 9. Regla de autoridad

La decisión de publicación pertenece al contrato editorial, no a la IA ni al adaptador.

`IA → propuesta/revisión`

`Contrato → autorización`

`CSV → ejecución`

## 10. Estado V0.1

### Cerrado

- Contrato semántico de Transformaciones.
- Bloqueo de transformaciones no documentadas.
- Revisión IA subordinada al contrato.
- Preservación de la fila Wix.

### Próximo paso

Probar el contrato contra el **encabezado real del CSV exportado por Wix** y cerrar el mapeo inequívoco de la columna de Historia de Transformación antes de habilitar su escritura automática.
