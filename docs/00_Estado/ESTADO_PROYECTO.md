# MUBATO CMS Companion — Estado del Proyecto

> Documento canónico de continuidad. La información objetiva se regenera desde GitHub Actions. Las decisiones arquitectónicas se registran en la matriz y ADR.

## Última generación

- Generado automáticamente: pendiente de primera ejecución
- Último cambio funcional: reconstrucción de contratos de Dirección Editorial
- Rama: `main`

## Estado ejecutivo vigente

### 🟢 Funcionalidad comprobada
- Importación de proyecto desde carpeta + CSV.
- Modelo `Proyecto` y `Fotografia`.
- Ingesta de fotografías.
- Vision (`AnalizadorFotografias` + `PromptVision` + `OpenAIClient`).
- Expediente de proyecto.
- Flujo UI de análisis: Renderer → preload → IPC → `DirectorProyecto.analizar()` → Vision → Expediente.
- Prueba Wix de laboratorio `MUBATO Test`: Hero y Galería General materializados correctamente en la página después de completar campos básicos vacíos del registro, sin modificar los JSON multimedia.
- Contrato físico observado de `Galería General`: JSON serializado en CSV con objetos multimedia Wix.
- Contrato físico observado de `Hero Imagen`: string `wix:image://...` en CSV; no es JSON.

### 🟡 Arquitectura preparada / parcialmente conectada
- Dirección Editorial.
- `contextoMarca.js`: doctrina estructurada conservada como una única exportación.
- `promptTemplates.js`: reconstruido con contratos separados para Hero, Historia, SEO, ALT, Keywords, Slug, Código, Categoría, Servicios y Espacios.
- `ConstructorContexto.js`: preparado para construir contexto específico por contrato.
- Generación de Hero.
- Generador Editorial genérico.
- Actualización/exportación CSV.
- Ejecución completa de `DirectorProyecto.ejecutar()`; no debe conectarse todavía al botón de análisis porque escribe CSV y exporta expediente.
- `ProyectoManager`: implementación corregida para importar Galería como JSON y Hero como URI Wix, vincular ambos con fotografías locales y conservar las referencias físicas Wix.
- Integridad completa del registro Wix: la prueba demuestra que ciertos campos básicos vacíos impidieron inicialmente la correcta materialización de la galería; el conjunto mínimo de campos aún debe formalizarse.
- `Exportadores/actualizadorCSV.js`: contrato de salida V0.1 definido; implementación todavía parcial.

### 🔴 Contrato o implementación pendiente
- Conectar Historia, SEO y contenido de fotografías al `DirectorEditorial`.
- Producir un objeto editorial interno completo antes de tocar el adaptador CSV.
- Adaptador de salida que preserve objetos multimedia Wix existentes y el `wix:image://...` del Hero, modificando solo los campos que corresponden al Companion.
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
16. Cada plantilla editorial tiene un contrato de entrada y salida separado; ninguna plantilla decide selección de Hero/Galería.
17. La doctrina de marca debe existir como una única representación estructurada y no ser sobrescrita por un segundo `module.exports`.

## Camino crítico

`CSV + carpeta → Proyecto → Fotografías → Vision → Expediente → Dirección Editorial → Adaptador CSV → CSV de salida → Wix`

## Último descubrimiento

La inspección de `promptTemplates.js` reveló dos problemas estructurales: un segundo `module.exports` sobrescribía todas las plantillas anteriores, y `CLASIFICACION` instruía al sistema a decidir Hero/Galería, contradiciendo el principio congelado de selección humana. La inspección de `contextoMarca.js` reveló el mismo patrón de doble exportación, por lo que la doctrina estructurada podía quedar reemplazada por un placeholder.

## Decisión documental nueva

Se formalizó `docs/01_Arquitectura/CONTRATO_PROMPTS_EDITORIAL_V0.1.md`. Define la entrada y salida de cada plantilla y separa generación editorial de decisiones de selección y de serialización Wix.

## Cambios realizados

- `promptTemplates.js` reconstruido con una única exportación y diez contratos explícitos.
- `CLASIFICACION` eliminado del contrato editorial del MVP.
- `contextoMarca.js` corregido para conservar una única fuente estructurada.
- `ConstructorContexto.js` ampliado con métodos específicos para cada contrato editorial y para ALT por fotografía.
- Matriz Viva actualizada.

## Próximo objetivo

Conectar las salidas preparadas al `DirectorEditorial`/`GeneradorEditorial`, ejecutar una prueba controlada sobre un proyecto ya analizado y validar primero el **objeto editorial interno**. Solo después se implementará el adaptador bajo el Contrato de Salida CSV V0.1 y se hará la primera prueba end-to-end con una sola historia.
