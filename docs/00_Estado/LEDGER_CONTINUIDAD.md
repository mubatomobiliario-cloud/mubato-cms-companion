# MUBATO CMS Companion — Ledger de Continuidad

<!-- CONTINUIDAD_AUTO_START -->
- Generado automáticamente: `2026-09-04 16:27:22.929Z`
- Commit observado: `0e75094`
- Rama: `feat/csv-editorial-v1`
- Archivos versionados: `157`
- Verificaciones: **OK** — canon documental, bifurcación Parser, contrato de salida y campos Wix protegidos.
- Últimos commits:
  - 0e75094 — 2026-09-04 — feat(portfolio): add individual expression context constructor
  - 69d9305 — 2026-09-04 — chore(continuidad): update canonical checkpoint
  - fee44ab — 2026-09-04 — fix(portfolio): correct individual expression contract syntax
  - 4b0810e — 2026-09-04 — test(portfolio): add individual expression contract test
  - f923bac — 2026-09-04 — chore(continuidad): update canonical checkpoint
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

## 2026-08-31 — Auditoría de continuidad y nueva prioridad del proyecto

Se realizó una auditoría del sistema de continuidad con un objetivo explícito: comprobar que la pérdida del chat no obligue a reconstruir el proyecto desde cero.

### Resultado

La concepción de Continuidad se mantiene. Su función es preservar la memoria técnica oficial del proyecto y permitir reconstruir el estado, decisiones y derroteros sin depender del chat.

Se reafirma que los tres documentos canónicos cumplen funciones distintas:

- `ESTADO_PROYECTO.md` — dónde estamos y cuál es el camino crítico.
- `MATRIZ_COMPONENTES.md` — qué existe, qué está comprobado y qué falta.
- `LEDGER_CONTINUIDAD.md` — qué decisiones se tomaron, cuándo y por qué.

### Nueva prioridad absoluta

El único entregable válido del proyecto es el **nuevo HOME de MUBATO funcionando sobre el Companion terminado**.

El camino crítico queda congelado como:

```text
PROYECTO
   ↓
COMPANION terminado
   ↓
NUEVO HOME MUBATO
   ↓
ENTREGABLE FINAL VÁLIDO
```

Portfolio no debe desplazar este camino crítico. Su implementación queda documentada para una fase posterior, salvo que sea necesaria para completar Companion/Home.

### Decisión de economía circular

Se establece como principio de implementación:

> **Reutilizar primero. Adaptar después. Crear solo cuando sea necesario.**

Ningún componente nuevo debe duplicar una capacidad existente que ya haya demostrado funcionar.

### Estados de continuidad

Se adopta una clasificación documental común:

- 🟢 **Cerrado / Comprobado** — contrato, implementación y prueba suficiente.
- 🔵 **Diseñado** — decisión o contrato cerrado, pero no implementado.
- 🟡 **En implementación / consolidación** — existe código o trabajo activo, pero el cierre no está demostrado.
- 🟠 **En validación** — implementación disponible, pendiente de prueba definitiva.
- ⚪ **Pendiente** — todavía no iniciado.
- 🔴 **Conflicto** — existe contradicción que debe resolverse antes de continuar.

Esto evita confundir decisiones conceptualmente cerradas con funcionalidades efectivamente comprobadas.

### Portfolio — decisiones conceptuales preservadas

La conversación de trabajo reciente avanzó el contrato conceptual de Portfolio y sus decisiones deben considerarse memoria de diseño, no implementación.

Capas:

```text
VISION → REUNIR → ABRIR → EXPRESAR → VALIDAR
```

Decisiones preservadas:

- Vision observa; no decide selección ni orden.
- La suficiencia del Portfolio depende de variedad significativa de soluciones, características o posibilidades reconocibles, no solo del número de fotografías.
- La selección de Hero y Galería General es humana y previa.
- La posición de una fotografía en la Galería no autoriza inferencias de importancia, representatividad o calidad.
- El orden de Galería se conserva; la prioridad contextual no lo modifica.
- El contexto de mobiliario es una instrucción de observación, no una conclusión de Vision.
- Una fotografía puede contener varias posibilidades; no todas deben expresarse.
- Las posibilidades no seleccionadas no se destruyen.
- ABRIR no fabrica posibilidades cuando la evidencia no las sostiene.
- EXPRESAR no convierte Portfolio en Historia de Transformación.
- EXPRESAR produce un **párrafo corto** con una sola idea editorial dominante.
- El texto debe ser específico, sustentado y dejar espacio para continuar descubriendo.
- El Companion realiza su mejor esfuerzo editorial; no controla si el visitante continúa a la siguiente fotografía.
- VALIDAR protege el contrato; no crea, mejora ni embellece.
- VALIDAR puede producir `APROBADO`, `ADVERTENCIA` o `RECHAZADO`.

Estas decisiones permanecen subordinadas a la prioridad PROYECTO → COMPANION → HOME.

## 2026-08-31 — Regla de sincronización de continuidad

Se reafirma la regla:

> **Ningún cambio significativo se considera cerrado hasta que contrato, implementación, prueba y documentación estén sincronizados.**

La actualización de Continuidad debe acompañar cada hito significativo, pero los documentos especializados deben conservar el detalle contractual en su propia ubicación y Continuidad debe referenciarlos sin duplicarlos innecesariamente.

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
- Auditoría conceptual de Continuidad realizada.
- Prioridad absoluta PROYECTO → COMPANION → HOME registrada.
- Principio de economía circular registrado.

### 🔵 Diseñado

- Arquitectura conceptual Editorial Portfolio: VISION → REUNIR → ABRIR → EXPRESAR → VALIDAR.
- ABRIR V0.1.
- EXPRESAR V0.1.
- VALIDAR V0.1.

### 🟡 En curso / consolidación

- Cierre operativo de PROYECTO.
- Integración definitiva del componente de salida en el workflow.
- Prueba end-to-end definitiva.
- Finiquitación de COMPANION.
- Verificación operacional completa de la automatización de continuidad.

### ⚪ Posterior

- Implementación de Editorial Portfolio, salvo dependencia directa del camino crítico.
- Optimización adicional de consumo IA cuando no retrase PROYECTO/COMPANION.
- Prueba end-to-end de Portfolio cuando corresponda.

## Próximo checkpoint obligatorio

El siguiente checkpoint de trabajo no es Portfolio.

1. Consolidar PROYECTO.
2. Ejecutar y superar la prueba end-to-end.
3. Documentar el cierre de PROYECTO.
4. Finiquitar COMPANION.
5. Preparar la aplicación del Companion terminado al nuevo HOME de MUBATO.

> Regla de continuidad: si el chat desaparece, el repositorio debe permitir reconstruir el estado, las decisiones y el camino crítico sin empezar desde cero.
