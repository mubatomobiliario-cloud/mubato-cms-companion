# MUBATO CMS Companion — Estado del Proyecto

> Documento canónico de continuidad. La información objetiva se regenera desde GitHub Actions. Las decisiones arquitectónicas se registran en la matriz y ADR.

## Última generación

- Generado automáticamente: pendiente de primera ejecución
- Último cambio funcional previo: `0eb91ec3e1d2ef5e0a5e1e410fe6ececd1579cfa`
- Último cambio documental previo: `a13a3deeb560faf0ab0d5a1256be3ad498e5734d`
- Rama: `main`

## Estado ejecutivo vigente

### 🟢 Funcionalidad comprobada
- Importación de proyecto desde carpeta + CSV.
- Modelo `Proyecto` y `Fotografia`.
- Ingesta de fotografías.
- Vision (`AnalizadorFotografias` + `PromptVision` + `OpenAIClient`).
- Expediente de proyecto.
- Contexto editorial MUBATO.
- Flujo UI de análisis: Renderer → preload → IPC → `DirectorProyecto.analizar()` → Vision → Expediente.
- Ejecución real desde la aplicación sobre `Hogar Araque` con 3 fotografías: análisis Vision y Expediente completados.
- Prueba Wix de laboratorio `MUBATO Test`: Hero y Galería General materializados correctamente en la página después de completar campos básicos vacíos del registro, sin modificar los JSON multimedia.
- Contrato físico observado de `Galería General`: JSON serializado en CSV con objetos multimedia Wix.
- Contrato físico observado de `Hero Imagen`: string `wix:image://...` en CSV; no es JSON.

### 🟡 Arquitectura preparada / parcialmente conectada
- Dirección Editorial.
- Generación de Hero.
- Generador Editorial genérico.
- Plantillas editoriales.
- Actualización/exportación CSV.
- Ejecución completa de `DirectorProyecto.ejecutar()`; no debe conectarse todavía al botón de análisis porque escribe CSV y exporta expediente.
- `ProyectoManager`: implementación corregida para importar Galería como JSON y Hero como URI Wix, vincular ambos con fotografías locales y conservar las referencias físicas Wix; validación desde la aplicación pendiente.
- Integridad completa del registro Wix: la prueba demuestra que ciertos campos básicos vacíos impidieron inicialmente la correcta materialización de la galería; el conjunto mínimo de campos aún debe formalizarse.
- `Exportadores/actualizadorCSV.js`: contrato de salida V0.1 definido; implementación todavía parcial.

### 🔴 Contrato o implementación pendiente
- Flujo editorial completo Historia → SEO → contenido de fotografías → CSV.
- Adaptador de salida que preserve objetos multimedia Wix existentes y el `wix:image://...` del Hero, modificando solo los campos que corresponden al Companion.
- Prueba end-to-end completa: proyecto real → análisis → editorial → CSV de una sola fila → Wix.
- Determinar formalmente el conjunto mínimo de campos estructurales que debe contener una fila para que Wix materialice correctamente el item.
- Revisar `direccionEditorial/promptTemplates.js` y cerrar sus contratos de salida.

### ⚪ Fuera del camino crítico del MVP
- Clasificación automática de selección de fotografías.
- Capacidades editoriales futuras no necesarias para fabricar la primera historia end-to-end.

## Principios congelados

1. MUBATO selecciona manualmente Hero y Galería General.
2. Vision observa; no decide selección ni orden.
3. `proyecto.fotografias[]` y `proyecto.galeria[]` son conjuntos distintos.
4. El modelo interno Companion permanece independiente del formato físico Wix.
5. `Galería General` en el CSV de Wix es JSON serializado: un array de objetos multimedia Wix.
6. El objeto multimedia de Galería observado contiene identidad y metadatos como `fileName`, `slug`, `src`, `title`, `alt`, `description`, `type` y `settings`.
7. `Hero Imagen` en el CSV de Wix es una URI `wix:image://...`, no un JSON.
8. Wix genera/conserva `slug` y `src`; Companion no debe inventarlos.
9. Companion debe preservar la identidad multimedia Wix recibida en el CSV.
10. El orden de la galería no se modifica en el MVP.
11. La fase de análisis debe poder ejecutarse sin modificar el CSV.
12. En la prueba `MUBATO Test`, completar campos básicos vacíos del registro permitió la correcta materialización de Hero y Galería sin alterar los objetos multimedia.
13. `ProyectoManager` vincula Galería y Hero con las fotografías locales por `fileName`; para Hero, el `fileName` se extrae de la URI Wix y la URI completa se conserva en `foto.wixHeroSrc`.
14. La exportación parte de la fila Wix existente y solo modifica campos explícitamente propiedad de Companion.
15. Los campos técnicos Wix y las referencias multimedia existentes no se reconstruyen.

## Camino crítico

`CSV + carpeta → Proyecto → Fotografías → Vision → Expediente → Dirección Editorial → Adaptador CSV → CSV de salida → Wix`

## Último descubrimiento

La aplicación falló al importar `MUBATO Test` con `No se pudo interpretar el campo Wix "Hero Imagen" como JSON.` La inspección directa del CSV real mostró la causa: `Galería General` es JSON serializado, pero `Hero Imagen` es directamente una URI `wix:image://...`. Por tanto, el contrato físico no puede tratar ambos campos con el mismo parser. `ProyectoManager` fue corregido para parsear únicamente la Galería como JSON y tratar Hero como string Wix, extrayendo el nombre de archivo de la URI para localizar la fotografía y preservando la URI completa.

## Decisión documental nueva

Se formalizó `docs/01_Arquitectura/CONTRATO_SALIDA_CSV_V0.1.md`. El contrato establece que Companion no reconstruye filas Wix desde cero: localiza la fila, preserva el registro completo y modifica únicamente los campos declarados de su propiedad. También congela la preservación de la identidad multimedia Wix y la separación de parsers entre Hero y Galería.

## Próximo objetivo

Revisar y cerrar `direccionEditorial/promptTemplates.js`, conectarlo con `ConstructorContexto` / `DirectorEditorial` y comprobar que Dirección Editorial produzca un objeto estructurado que el adaptador CSV pueda consumir sin conocer detalles de Wix. Después se implementará el adaptador bajo el Contrato de Salida CSV V0.1 y se hará la primera prueba end-to-end con una sola historia.
