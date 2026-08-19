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
- Siguiente paso: conectar el pipeline existente con Electron mediante Renderer → preload → IPC → main → DirectorProyecto.
