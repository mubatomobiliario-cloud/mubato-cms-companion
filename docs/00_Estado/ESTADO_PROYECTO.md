# MUBATO CMS Companion — Estado del Proyecto

> Documento canónico de continuidad. La información objetiva se regenera desde GitHub Actions. Las decisiones arquitectónicas se registran en la matriz y ADR.

## Última generación

- Generado automáticamente: pendiente de primera ejecución
- Commit observado: `17de3d262a9bd6466d4c9dc5179fd18755424b14`
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

### 🟡 Arquitectura preparada / parcialmente conectada
- Dirección Editorial.
- Generación de Hero.
- Generador Editorial genérico.
- Plantillas editoriales.
- Actualización/exportación CSV.
- Ejecución completa de `DirectorProyecto.ejecutar()`; no debe conectarse todavía al botón de análisis porque escribe CSV y exporta expediente.
- `ProyectoManager`: importa datos básicos y fotografías; falta modelar/preservar explícitamente Hero y Galería existentes desde el CSV de Wix.
- Integridad completa del registro Wix: la prueba demuestra que ciertos campos básicos vacíos impidieron inicialmente la correcta materialización de la galería; el conjunto mínimo de campos aún debe formalizarse.

### 🔴 Contrato o implementación pendiente
- Flujo editorial completo Historia → SEO → contenido de fotografías → CSV.
- Adaptador de salida que preserve objetos multimedia Wix existentes (`fileName`, `slug`, `src`, `title`, `alt`, `description`, `type`, `settings`) y modifique solo los campos que corresponden al Companion.
- Prueba end-to-end completa: proyecto real → análisis → editorial → CSV de una sola fila → Wix.
- Determinar formalmente el conjunto mínimo de campos estructurales que debe contener una fila para que Wix materialice correctamente el item.

### ⚪ Fuera del camino crítico del MVP
- Clasificación automática de selección de fotografías.
- Capacidades editoriales futuras no necesarias para fabricar la primera historia end-to-end.

## Principios congelados

1. MUBATO selecciona manualmente Hero y Galería General.
2. Vision observa; no decide selección ni orden.
3. `proyecto.fotografias[]` y `proyecto.galeria[]` son conjuntos distintos.
4. El modelo interno Companion permanece independiente del formato físico Wix.
5. `Galería General` en el CSV de Wix es JSON serializado: un array de objetos multimedia Wix.
6. El objeto multimedia Wix observado contiene identidad y metadatos como `fileName`, `slug`, `src`, `title`, `alt`, `description`, `type` y `settings`.
7. Wix genera/conserva `slug` y `src`; Companion no debe inventarlos.
8. Companion debe preservar la identidad multimedia Wix recibida en el CSV.
9. El orden de la galería no se modifica en el MVP.
10. La fase de análisis debe poder ejecutarse sin modificar el CSV.
11. En la prueba `MUBATO Test`, completar campos básicos vacíos del registro permitió la correcta materialización de Hero y Galería sin alterar los objetos multimedia.

## Camino crítico

`CSV + carpeta → Proyecto → Fotografías → Vision → Expediente → Dirección Editorial → CSV de salida → Wix`

## Último cambio significativo

Se validó mediante un experimento controlado en Wix el contrato físico de `Galería General` y la necesidad de conservar la identidad multimedia Wix. El proyecto de laboratorio contenía tres imágenes: una seleccionada como Hero y dos como Galería. El CSV exportado conservó los objetos multimedia Wix; al completar únicamente campos básicos vacíos y recargar el CSV, Hero y Galería se materializaron correctamente en la página.

## Próximo objetivo

Formalizar el contrato mínimo de la fila Wix y adaptar `ProyectoManager`/el modelo interno para importar y preservar Hero y Galería existentes. Después conectar Dirección Editorial de forma incremental, sin permitir todavía que el flujo de análisis escriba CSV.
