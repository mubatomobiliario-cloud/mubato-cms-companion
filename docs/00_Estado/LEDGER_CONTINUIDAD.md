# MUBATO CMS Companion — Ledger de Continuidad

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

## 2026-08-24 — Recuperación de continuidad documental

Se detectó que los documentos de continuidad habían quedado atrasados respecto del código real. Se sincronizaron:

- `ESTADO_PROYECTO.md`
- `MATRIZ_COMPONENTES.md`
- `LEDGER_CONTINUIDAD.md`

Esta sincronización documenta el estado real hasta `9247fa9` y recupera la bifurcación editorial como decisión canónica.

## Estado actual

### 🟢 Cerrado

- Análisis Vision con evidencia reutilizable.
- Editorial Proyecto V2.2.
- Contrato de salida CSV V2.2.
- Protección de `Historias de Transformación`.
- Eliminación de `actualizadorCSV.js`.
- Bifurcación binaria en Parser.

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
