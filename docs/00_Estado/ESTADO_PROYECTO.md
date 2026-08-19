# MUBATO CMS Companion — Estado del Proyecto

> Documento canónico de continuidad. La información objetiva se regenera desde GitHub Actions. Las decisiones arquitectónicas se registran en la matriz y ADR.

## Última generación

- Generado automáticamente: pendiente de primera ejecución
- Commit observado: pendiente de primera ejecución
- Rama: `main`

## Estado ejecutivo vigente

### 🟢 Funcionalidad comprobada
- Importación de proyecto desde carpeta + CSV.
- Modelo `Proyecto` y `Fotografia`.
- Ingesta de fotografías.
- Vision (`AnalizadorFotografias` + `PromptVision` + `OpenAIClient`).
- Expediente de proyecto.
- Contexto editorial MUBATO.

### 🟡 Arquitectura preparada / parcialmente conectada
- Dirección Editorial.
- Generación de Hero.
- Generador Editorial genérico.
- Plantillas editoriales.
- Actualización/exportación CSV.

### 🔴 Contrato o implementación pendiente
- Flujo editorial completo Historia → SEO → contenido de fotografías → CSV.
- Exportación completa de Galería General conservando la selección Wix.

### ⚪ Fuera del camino crítico del MVP
- Clasificación automática de selección de fotografías.
- Capacidades editoriales futuras no necesarias para fabricar la primera historia end-to-end.

## Principios congelados

1. MUBATO selecciona manualmente Hero y Galería General.
2. Vision observa; no decide selección ni orden.
3. `proyecto.fotografias[]` y `proyecto.galeria[]` son conjuntos distintos.
4. El modelo interno Companion permanece independiente del formato físico Wix.
5. `Galería General` en el CSV de Wix es JSON serializado: un array de objetos multimedia Wix.
6. Companion debe preservar la identidad multimedia Wix recibida en el CSV.
7. El orden de la galería no se modifica en el MVP.

## Camino crítico

`CSV + carpeta → Proyecto → Fotografías → Vision → Expediente → Dirección Editorial → CSV de salida → Wix`

## Próximo objetivo

Conectar Dirección Editorial y completar el flujo de una historia real end-to-end sin rediseñar Vision ni la selección humana de Hero/Galería.
