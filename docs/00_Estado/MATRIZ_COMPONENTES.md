# MUBATO CMS Companion — Matriz Viva de Componentes

<!-- CONTINUIDAD_AUTO_START -->
- Generado automáticamente: `2026-08-30 00:42:05.106Z`
- Commit observado: `c2ffd0c`
- Rama: `feat/csv-editorial-v1`
- Archivos versionados: `141`
- Verificaciones: **OK** — canon documental, bifurcación Parser, contrato de salida y campos Wix protegidos.
- Últimos commits:
  - c2ffd0c — 2026-08-29 — feat(ui): estilizar consola de ejecucion
  - 2a3ee37 — 2026-08-29 — feat(ui): agregar consola visual de ejecucion
  - e4f5803 — 2026-08-30 — chore(continuidad): update canonical checkpoint
  - 56b9ff8 — 2026-08-29 — feat(ui): seleccionar CSV fuente y mostrar consola real
  - 37614d3 — 2026-08-30 — chore(continuidad): update canonical checkpoint
<!-- CONTINUIDAD_AUTO_END -->

> Documento canónico de estado funcional. Se actualiza con cada cambio significativo.

## Canon documental de continuidad

La memoria técnica oficial del proyecto vive exclusivamente en `docs/00_Estado/`:

- `ESTADO_PROYECTO.md` — fotografía ejecutiva vigente.
- `MATRIZ_COMPONENTES.md` — estado funcional por componente.
- `LEDGER_CONTINUIDAD.md` — cronología de decisiones y checkpoints.

`docs/04_Guías/Estado_Proyecto.md` **no existe** y no es una ubicación alternativa de continuidad.

## Prioridad del proyecto

El camino crítico no es Portfolio. La prioridad es:

1. **Terminar PROYECTO**.
2. **Finiquitar COMPANION**.
3. **Concluir y entregar el nuevo HOME de MUBATO**, único entregable válido.

Las líneas secundarias no deben desplazar este orden.

## Estados de continuidad

- 🟢 **Cerrado / Comprobado** — contrato, implementación y prueba suficiente para el alcance actual.
- 🔵 **Diseñado** — decisión o contrato cerrado, pero todavía no implementado.
- 🟡 **En implementación / consolidación** — existe código o trabajo activo, pero el cierre todavía no está demostrado.
- 🟠 **En validación** — implementación disponible, pendiente de prueba definitiva.
- ⚪ **Pendiente** — todavía no iniciado.
- 🔴 **Conflicto** — existe una contradicción que debe resolverse antes de continuar.

| Componente | Responsabilidad | Estado | Contrato | Camino crítico |
|---|---|---|---|---|
| `core/parser.js` | Encontrar CSV/proyecto e iniciar importación y bifurcación editorial | 🟢 Comprobado | `Observaciones` vacía → PROYECTO; no vacía → PORTFOLIO | Sí |
| `core/proyectoManager.js` | Construir `Proyecto` desde CSV y carpeta | 🟢 Implementado | Importa datos/fotografías y conserva referencias Wix | Sí |
| `core/proyecto.js` | Modelo central de proyecto, Hero, Galería y fotografías | 🟢 Comprobado | Modelo Companion | Sí |
| `core/fotografiaManager.js` | Ingestar fotografías locales | 🟢 Comprobado | Conocido | Sí |
| `core/fotografia.js` | Modelo de fotografía y contenido editorial | 🟢 Comprobado | Conocido | Sí |
| `vision/analizadorFotografias.js` | Ejecutar observación visual por fotografía | 🟢 Comprobado | Evidencia Vision persistible/reutilizable | Sí |
| `direccionEditorial/expedienteProyecto.js` | Consolidar hechos, selección MUBATO y observaciones Vision | 🟢 Comprobado | Contrato de Expediente Editorial | Sí |
| `direccionEditorial/contextoMarca.js` | Doctrina editorial MUBATO | 🟢 Preparado | Única exportación estructurada | Sí |
| `direccionEditorial/ConstructorContexto.js` | Construir contexto por contrato | 🟢 Comprobado | Contratos editoriales separados | Sí |
| `direccionEditorial/directorEditorial.js` | Orquestar generación editorial | 🟡 Superado en V2.2 mediante `procesadorEditorialV2.js`; integración histórica requiere consolidación | Editorial Proyecto V2.2 | Sí |
| `direccionEditorial/promptHistoriaWebV2.js` | Generar Historia Web contractual | 🟢 Comprobado | Contrato JSON + validador | Sí |
| `direccionEditorial/validadorHistoriaWebV2.js` | Validar Historia Web | 🟢 Comprobado | Contrato estructural/narrativo | Sí |
| `Editorial/procesadorEditorialV2.js` | Pipeline Editorial Proyecto V2.2 | 🟢 Comprobado | 9 llamadas IA en prueba de referencia; evidencia Vision reutilizada | Sí |
| `Exportadores/salidaEditorialCSV.js` | Aplicar contrato de salida al CSV Wix | 🟢 Blindado V2.2 | 8 campos autorizados; 18 protegidos; salida separada | Sí |
| `Exportadores/adaptadorCSVEditorial.js` | Adaptación histórica parcial de salida | 🟡 Legado; no es el contrato final | Sustituido conceptualmente por `salidaEditorialCSV.js` | No |
| `Exportadores/actualizadorCSV.js` | Actualizador histórico | ⚪ Eliminado | No usar | No |
| `workflow/directorProyecto.js` | Orquestar fases de proyecto | 🟡 En consolidación | Análisis separado de escritura CSV | Sí |
| `electron/main.js` | IPC de operaciones de proyecto | 🟢 Análisis conectado | Conocido | Sí |
| `electron/preload.js` | Puente seguro Renderer → Main | 🟢 Análisis conectado | Conocido | Sí |
| `renderer/script.js` | Interfaz y disparo del análisis | 🟢 Análisis conectado | Conocido | Sí |
| `proyecto.galeria[]` | Selección humana de fotografías | 🟢 Comprobado | Selección y orden humanos | Sí |
| `Galería General` Wix | Representación física de galería | 🟢 Comprobado | JSON serializado de objetos multimedia Wix | Sí |
| `Hero Imágen` Wix | Representación física del Hero | 🟢 Comprobado | URI/objeto Wix independiente de Hero Texto | Sí |
| Identidad multimedia Wix | `slug`/`src` | 🟢 Comprobado | Wix conserva/genera; Companion no inventa | Sí |
| Contrato de salida CSV V2.2 | Propiedad y preservación de campos | 🟢 Blindado | 8 campos autorizados; duplicados de `Historias de Transformación` protegidos | Sí |
| Historia Companion | Campo editorial de salida | 🟢 Comprobado | Columna independiente `Historia` | Sí |
| **Bifurcación editorial** | Seleccionar pipeline | 🟢 Comprobado | `Observaciones` vacía → PROYECTO; no vacía → PORTFOLIO | Sí |
| **Editorial Proyecto V2.2** | Narrar transformación | 🟢 Comprobado | Historia + Historia Web + Hero + SEO + foto + estructurados | Sí |
| **Editorial Portfolio** | Describir/posicionar visualmente mobiliario | 🔵 Diseñado; implementación posterior | Capas VISION → REUNIR → ABRIR V0.1 → EXPRESAR V0.1 → VALIDAR V0.1 | No por ahora |
| Optimización de consumo IA | Reducir llamadas/tokens sin degradar calidad | 🟡 Pendiente | Línea base: 9 llamadas / 15.290 tokens | Sí, después de PROYECTO |
| Continuidad documental | Preservar memoria técnica y estado del proyecto | 🟢 Operativa; auditoría documental actualizada | Tres documentos canónicos en `docs/00_Estado/` | Sí |

## Contratos Portfolio ya diseñados

### VISION
Observa y aporta evidencia. No decide selección, orden ni importancia editorial.

### REUNIR
Reconoce la variedad significativa de soluciones, características o posibilidades presentes en el conjunto. No se limita al número de fotografías.

### ABRIR V0.1
Identifica posibilidades de comunicación ancladas en observaciones de Vision. Una fotografía puede tener varias posibilidades o ninguna si la evidencia no las sostiene. La prioridad de una posibilidad no modifica el orden de la Galería.

### EXPRESAR V0.1
Expresa una posibilidad seleccionada mediante un **párrafo corto** con una sola idea editorial dominante. No enumera inventario, no repite discurso comercial genérico y no agota las posibilidades restantes.

### VALIDAR V0.1
No crea ni mejora contenido. Protege el contrato mediante controles de integridad, trazabilidad, fronteras entre capas, calidad editorial, diversidad de colección, respeto del orden de Galería y protección de la salida. Puede producir `APROBADO`, `ADVERTENCIA` o `RECHAZADO`.

## Reglas congeladas

1. MUBATO selecciona Hero y Galería General.
2. Vision observa; no decide selección ni orden.
3. El modelo interno Companion es independiente del formato físico Wix.
4. `Historias de Transformación` es un campo Wix existente y protegido.
5. `Hero Imágen` no se confunde con `Hero Texto`.
6. La salida parte de la fila Wix existente y solo modifica campos autorizados.
7. La bifurcación ocurre en el primer contacto con el CSV.
8. `Observaciones` vacía = PROYECTO.
9. `Observaciones` no vacía = PORTFOLIO.
10. No se interpreta, normaliza ni clasifica el texto de `Observaciones`.
11. Editorial Proyecto y Editorial Portfolio son pipelines distintos.
12. El contrato de salida común se comparte únicamente después de que cada pipeline produzca su contrato editorial interno.
13. La memoria técnica oficial vive exclusivamente en `docs/00_Estado/`.
14. No se mantiene un segundo documento de estado del proyecto en otra ruta.
15. La posición de una fotografía en la Galería no autoriza a inferir importancia, representatividad o calidad.
16. El orden de Galería se conserva; la prioridad contextual no lo modifica.
17. El contexto de mobiliario es una instrucción de observación, no una conclusión de Vision.
18. Las posibilidades no seleccionadas de una fotografía no se destruyen.
19. El Companion realiza su mejor esfuerzo editorial, pero no garantiza que el visitante continúe a la siguiente fotografía.
20. **Economía circular de implementación:** reutilizar primero, adaptar después, crear solo cuando sea necesario.
21. Ningún componente nuevo debe duplicar una capacidad existente que haya demostrado funcionar.
22. Ningún cambio significativo se considera cerrado hasta que contrato, implementación, prueba y documentación estén sincronizados.
23. La prioridad absoluta es PROYECTO → COMPANION → HOME MUBATO.

## Último cambio significativo

La bifurcación editorial binaria quedó incorporada al Parser. El último commit funcional de referencia es `9247fa9`. Los commits posteriores de interfaz y continuidad no sustituyen ese hito funcional.

## Próximo punto de validación

**PROYECTO, no Portfolio:** consolidar la integración de `SalidaEditorialCSV` en el workflow y ejecutar la prueba end-to-end definitiva. Portfolio queda documentado para retomarse después sin alterar el pipeline probado de Proyecto.
