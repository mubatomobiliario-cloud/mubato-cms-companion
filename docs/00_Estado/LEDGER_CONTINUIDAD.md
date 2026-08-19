# MUBATO CMS Companion — Ledger de Continuidad

## 2026-08-19 — Instalación del sistema de continuidad

- Se establece `ESTADO_PROYECTO.md` como estado canónico.
- Se establece `MATRIZ_COMPONENTES.md` como matriz viva.
- Se establece este ledger como cronología de checkpoints.
- El código no debe modificarse sin actualizar estado cuando el cambio sea significativo.
- La selección de Hero y Galería General pertenece a MUBATO, no a Vision.
- El modelo interno Companion debe permanecer separado del formato físico Wix.
- Próximo trabajo: conectar Dirección Editorial y completar una historia end-to-end.

### Commits de instalación

- `e340725e02b3823a7bc8de7bea3093df10d1980f` — estado canónico inicial.
- `af28e19dd53ff8178c6413fa6f2ee470aca9b7ac` — matriz viva inicial.

## 2026-08-19 — Incisión 1: corrección de rutas del workflow

- Se corrigieron en `src/workflow/directorProyecto.js` las referencias a `Exportadores` para respetar la capitalización real del directorio.
- Cambio aplicado:
  - `../exportadores/actualizadorCSV` → `../Exportadores/actualizadorCSV`
  - `../exportadores/exportadorEditorial` → `../Exportadores/exportadorEditorial`
- Commit de código: `a1b8c657f67ede835dfdd13346a92edb9f1c6e71`.
- No se modificó la lógica del pipeline.
- No se modificó Vision, Dirección Editorial, selección de Hero/Galería ni contratos Wix.

## 2026-08-19 — Incisión 2: conexión del análisis a la aplicación

Se implementó el primer tramo ejecutable del pipeline, deliberadamente separado de cualquier escritura del CSV:

`Renderer → preload → IPC → DirectorProyecto.analizar() → Vision → Expediente`

### Cambios

- `src/workflow/directorProyecto.js`
  - Se añadió `analizar(proyecto)`.
  - Ejecuta únicamente Vision y construcción del Expediente.
  - No genera Hero.
  - No actualiza CSV.
  - No exporta Expediente Editorial.
- `src/electron/main.js`
  - Se añadió `analizarProyecto` por IPC.
  - Reconstruye el proyecto desde la carpeta y ejecuta la fase de análisis.
  - Devuelve al Renderer un objeto serializable con expediente y observaciones Vision.
- `src/electron/preload.js`
  - Se expuso `window.companion.analizarProyecto(carpeta)`.
- `src/renderer/script.js`
  - El botón `Analizar fotografías` ahora dispara el flujo real.
  - La carpeta seleccionada queda disponible para la fase de análisis.
  - La interfaz muestra el resultado del análisis y el expediente.

### Commits de la operación

- `324aa4e764fa3769447bb50eec9a28c7786d3456` — fase de análisis en workflow.
- `75e2b5b0060d0e09be65a904aa855d8d95df253f` — puente IPC de análisis.
- `502df5ff48f6462b6ba7c9edc35fe616877ffce6` — puente preload.
- `1157e229966e693b924b3e7a600ac1be188c9dff` — conexión del botón en Renderer.
- `62d55aa486016f551fe286e93a632011a9e23c2f` — actualización de la matriz.
- `e574b76e40c4e573f85a51290652456a41ffdc7e` — actualización del estado del proyecto.
- Este commit — actualización del Ledger.

### Estado de validación

- Código conectado en GitHub: 🟢
- Prueba de ejecución real desde la aplicación: 🔴 pendiente
- Modificación del CSV durante la fase de análisis: 🟢 no ocurre por diseño
- Selección humana de Hero/Galería alterada: 🟢 no ocurre

### Próximo paso

Ejecutar una prueba real desde la aplicación con un proyecto de prueba. Si el análisis funciona, documentar el resultado y continuar con Dirección Editorial de forma incremental.
