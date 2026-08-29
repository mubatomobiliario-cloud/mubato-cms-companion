# MUBATO CMS Companion — Ledger de Continuidad

<!-- CONTINUIDAD_AUTO_START -->
- Generado automáticamente: `2026-08-29 23:33:47.321Z`
- Commit observado: `7673f8c`
- Rama: `feat/csv-editorial-v1`
- Archivos versionados: `141`
- Verificaciones: **OK** — canon documental, bifurcación Parser, contrato de salida y campos Wix protegidos.
- Últimos commits:
  - 7673f8c — 2026-08-29 — fix(csv): actualizar Historia existente de Wix
  - e54df08 — 2026-08-29 — chore(continuidad): update canonical checkpoint
  - 87f2cb4 — 2026-08-29 — Actualizar interfaz Electron para ejecución completa
  - 8bcc905 — 2026-08-29 — Ejecutar pipeline editorial completo desde Electron
  - e8663f2 — 2026-08-29 — chore(continuidad): update canonical checkpoint
<!-- CONTINUIDAD_AUTO_END -->

> Cronología canónica de decisiones, implementaciones y validaciones significativas. No sustituye la Matriz Viva ni el Estado del Proyecto.

## 2026-08-19 — Instalación del sistema de continuidad

- Se establece `ESTADO_PROYECTO.md` como estado canónico.
- Se establece `MATRIZ_COMPONENTES.md` como matriz viva.
- Se establece este ledger como cronología de checkpoints.
- La selección de Hero y Galería General pertenece a MUBATO, no a Vision.
- El modelo interno Companion permanece separado del formato físico Wix.

### Commits de instalación

- `e340725` — estado canónico inicial.
- `af28e19` — matriz viva inicial.
- `ae60817` — ledger de continuidad.
- `3a5a300` — generador determinista de estado.
- `a3331a8` — workflow autónomo.
- `daea923` — corrección para evitar recursión del workflow.

## 2026-08-19 — Pipeline de análisis separado de escritura

Se implementó el tramo ejecutable:

`Renderer → preload → IPC → DirectorProyecto.analizar() → Vision → Expediente`

La fase de análisis no modifica el CSV. Se validó sobre `Hogar Araque` con 3 fotografías y Vision real.

## 2026-08-19 — Contrato físico Wix

Se comprobó mediante `MUBATO Test` que:

- `Galería General` es JSON serializado de objetos multimedia Wix.
- `Hero Imágen` es independiente de la galería.
- `slug` y `src` son identidad Wix y no deben inventarse.
- La integridad de campos estructurales del registro afecta la materialización del item en Wix.
- La selección de Hero/Galería sigue siendo humana.

## 2026-08-19/20 — Reconstrucción de Dirección Editorial

Se reconstruyeron contratos de prompts, contexto de marca, ConstructorContexto y validadores para separar generación editorial de selección y serialización Wix.

## 2026-08-20 — Editorial Proyecto V2.2 y optimización de evidencia

Se consolidó el pipeline `Editorial Proyecto V2.2`.

Decisión fundamental:

- Vision ocurre antes y su evidencia se persiste.
- Editorial reutiliza esa evidencia.
- No se ejecuta una segunda lectura Vision en fase editorial.

Prueba de referencia `Hogar Araque`:

- 9 llamadas IA.
- 0 llamadas Vision en fase editorial.
- 12.145 input tokens.
- 3.145 output tokens.
- 15.290 tokens totales.
- 58.061 ms acumulados.
- 2 fotografías procesadas editorialmente.

La prueba fue superada.

## 2026-08-20/21 — Contrato de salida CSV V2.2

Se sustituyó conceptualmente el actualizador CSV histórico por `src/Exportadores/salidaEditorialCSV.js`.

El contrato quedó blindado para:

- localizar exactamente la fila;
- conservar las 25 cabeceras originales;
- conservar duplicados;
- proteger las dos columnas `Historias de Transformación`;
- proteger `Hero Imágen`;
- no inventar identidad Wix;
- escribir solo 8 campos editoriales autorizados;
- crear una columna Companion `Historia` independiente;
- generar un archivo de salida separado.

La prueba blindada fue superada.

Campos autorizados Proyecto V2.2:

1. `Código MUBATO`
2. `Hero Texto`
3. `Historia`
4. `Descripción`
5. `Servicios`
6. `Slug`
7. `SEO Title`
8. `Meta Description`

Se verificaron 18 campos protegidos.

## 2026-08-21 — Protección explícita de `Historias de Transformación`

Se detectó repetidamente el riesgo de confundir las dos cabeceras originales `Historias de Transformación` con la nueva Historia editorial. Se congeló la decisión:

- Las dos columnas existentes son **Wix y protegidas**.
- No se escriben.
- No se reutilizan como salida editorial.
- La Historia generada por Companion se escribe en una columna independiente `Historia`.

La prueba blindada final confirmó que ambas columnas permanecen byte/valor equivalentemente intactas.

## 2026-08-22/23 — Eliminación del actualizador CSV histórico

`src/Exportadores/actualizadorCSV.js` fue eliminado para evitar dos rutas de escritura contradictorias.

`SalidaEditorialCSV V2.2` queda como componente de salida de referencia.

## 2026-08-24 — Bifurcación editorial

Se acordó formalmente separar dos naturalezas editoriales:

### PROYECTO

`Observaciones` vacía.

- Un cliente puede tener uno o varios espacios intervenidos.
- La editorial narra una transformación.
- Se utiliza **Editorial Proyecto V2.2**.

### PORTFOLIO

`Observaciones` no vacía.

- Agrupa mobiliario bajo un concepto específico: cocinas, centros de entretenimiento, bibliotecas, alcobas, estudios, etc.
- Puede reunir muebles de uno o varios clientes/proyectos.
- La editorial describe lo que se ve, nombra correctamente las imágenes, produce comentario breve y trabaja SEO.
- El contenido de `Observaciones` no se interpreta: su sola presencia dispara PORTFOLIO.

La regla congelada es:

```text
OBSERVACIONES VACÍA       → PROYECTO
OBSERVACIONES NO VACÍA    → PORTFOLIO
```

## 2026-08-24 — Implementación de la bifurcación en Parser

`src/core/parser.js` incorpora `determinarTipoEditorial(fila)` y asigna `proyecto.tipoEditorial`.

Commit funcional: `9247fa9`.

El Parser es el primer punto de contacto con la fila CSV y, por tanto, el lugar correcto para decidir el pipeline antes de consumir IA editorial.

## 2026-08-24 — Recuperación histórica de continuidad documental

Se detectó una copia antigua de `Estado_Proyecto.md` dentro de `docs/04_Guías/`. Ese documento correspondía al estado del proyecto del 12 de agosto de 2026 y contenía información histórica sobre la recuperación inicial, el hot test y la antigua Fase 2.

Antes de eliminarlo, se verificó que sus decisiones vigentes ya estaban absorbidas por el canon actual y que los datos históricos relevantes quedaban preservados aquí:

- La recuperación inicial del Companion y su baseline quedaron como antecedente histórico.
- El problema del hot test de `tests/testPipeline.js`, que tenía fijado `Proyectos/Andrés Giraldo` mientras se pretendía probar Araque, queda registrado como antecedente de trazabilidad.
- La aparición de referencias inesperadas como `tonos metálicos` quedó registrada como incidente cuyo origen debía rastrearse, sin atribuirlo automáticamente a OpenAI.
- La arquitectura documental maestra y la bifurcación Historia vs Portfolio fueron posteriormente redefinidas y superan aquella documentación de agosto 12.

Por tanto, `docs/04_Guías/Estado_Proyecto.md` se considera **documento histórico obsoleto, no canónico y eliminado**. No debe recrearse.

## 2026-08-24 — Canon documental de continuidad blindado

Se verificaron directamente en GitHub los tres documentos canónicos de continuidad de la rama `feat/csv-editorial-v1`.

Resultado final:

- `docs/00_Estado/ESTADO_PROYECTO.md` — canónico.
- `docs/00_Estado/MATRIZ_COMPONENTES.md` — canónico.
- `docs/00_Estado/LEDGER_CONTINUIDAD.md` — canónico.
- `docs/04_Guías/Estado_Proyecto.md` / `ESTADO_PROYECTO.md` — **prohibido y eliminado**.

No habrá dos documentos competidores de estado del proyecto.

La automatización de continuidad debe verificar además la ausencia de cualquier variante de mayúsculas/minúsculas del antiguo documento, para evitar que una diferencia de filesystem o de nombre vuelva a crear una segunda fuente de verdad.

## Estado actual

### 🟢 Cerrado

- Análisis Vision con evidencia reutilizable.
- Editorial Proyecto V2.2.
- Contrato de salida CSV V2.2.
- Protección de `Historias de Transformación`.
- Eliminación de `actualizadorCSV.js`.
- Bifurcación binaria en Parser.
- Canon documental de continuidad fijado en `docs/00_Estado/`.
- Eliminación de la copia histórica competidora de `Estado_Proyecto.md`.

### 🟡 En curso

- Optimización de llamadas IA.
- Integración definitiva del componente de salida en el workflow.
- Editorial Portfolio.
- Verificación operacional de la automatización de continuidad.

## Próximo checkpoint obligatorio

Antes de alterar Editorial Proyecto V2.2:

1. Definir contrato de Editorial Portfolio.
2. Probarlo de manera aislada.
3. Mantener intactos los campos Wix protegidos.
4. Reutilizar evidencia Vision ya existente.
5. Solo después integrar ambos contratos al punto común de salida CSV.

> Regla de continuidad: ningún cambio significativo se considera cerrado hasta que código, prueba y documentación estén sincronizados.
