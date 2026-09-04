# MUBATO CMS Companion — Estado del Proyecto

<!-- CONTINUIDAD_AUTO_START -->
- Generado automáticamente: `2026-09-04 20:43:33.139Z`
- Commit observado: `ca065f4`
- Rama: `feat/csv-editorial-v1`
- Archivos versionados: `164`
- Verificaciones: **OK** — canon documental, bifurcación Parser, contrato de salida y campos Wix protegidos.
- Últimos commits:
  - ca065f4 — 2026-09-04 — feat(portfolio): add editorial output bridge
  - 4500b74 — 2026-09-04 — fix(portfolio): align comprehension director test with fixture
  - 12cf459 — 2026-09-04 — test(portfolio): add comprehension director functional test
  - 04ec69e — 2026-09-04 — test(portfolio): add comprehension director structural test
  - c4a5110 — 2026-09-04 — chore(continuidad): update canonical checkpoint
<!-- CONTINUIDAD_AUTO_END -->

> Documento canónico de continuidad. Describe el estado real del repositorio y las decisiones editoriales vigentes.

## Prioridad absoluta del proyecto

El objetivo no es completar Companion como un producto aislado ni desarrollar Portfolio por sí mismo. El único entregable válido es el **nuevo HOME de MUBATO funcionando sobre el Companion terminado**.

El camino crítico queda establecido así:

1. **PROYECTO — 🟢 cerrado/comprobado**.
2. **Finiquitar COMPANION**.
3. **Concluir y entregar el nuevo HOME de MUBATO**.

Toda decisión, implementación, prueba o documentación debe contribuir directa o indirectamente a ese objetivo. Ninguna línea de trabajo secundaria debe desplazar el camino crítico.

## Canon documental de continuidad

La memoria técnica oficial del proyecto vive exclusivamente en `docs/00_Estado/` y está formada por estos tres documentos:

1. `ESTADO_PROYECTO.md` — fotografía ejecutiva vigente.
2. `MATRIZ_COMPONENTES.md` — estado funcional por componente.
3. `LEDGER_CONTINUIDAD.md` — cronología de decisiones, cambios y checkpoints.

No existe un segundo `Estado_Proyecto.md` canónico en `docs/04_Guías/`. Esa ruta no forma parte del sistema de continuidad vigente y no debe utilizarse como fuente de verdad.

## Estados de continuidad

- 🟢 **Cerrado / Comprobado** — contrato, implementación y prueba suficiente para el alcance actual.
- 🔵 **Diseñado** — decisión o contrato cerrado, pero todavía no implementado.
- 🟡 **En implementación / consolidación** — existe código o trabajo activo, pero el cierre todavía no está demostrado.
- 🟠 **En validación** — implementación disponible, pendiente de prueba definitiva.
- ⚪ **Pendiente** — todavía no iniciado.
- 🔴 **Conflicto** — existe una contradicción que debe resolverse antes de continuar.

## Estado ejecutivo vigente

### 🟢 PROYECTO V2.2 — CERRADO / COMPROBADO

La prueba de fuego **Hogar Giraldo** demostró el funcionamiento extremo a extremo del flujo PROYECTO V2.2 sobre un proyecto distinto de Araque.

Proyecto probado:
- **Hogar Giraldo**
- Cliente: Andres y Carolina Giraldo
- 11 fotografías
- Flujo: `EDITORIAL_PROYECTO_V2.2`

La ejecución confirmó:

- independencia respecto de Araque;
- selección explícita del proyecto y del CSV;
- Parser → ProyectoManager / FotografiaManager;
- Vision como módulo de observación;
- persistencia de evidencia visual;
- reutilización de evidencia por Editorial sin volver a ejecutar Vision;
- Editorial Proyecto V2.2;
- generación de salida editorial para el proyecto correcto;
- generación de un CSV separado;
- respeto del contrato Wix y campos protegidos;
- generalización del pipeline a un proyecto nuevo.

> **Araque fue la depuración. Giraldo fue la validación.**

### 🔵 COMPANION — EN CONSOLIDACIÓN

La arquitectura principal está construida y varias capas están comprobadas. El siguiente trabajo consiste en consolidar el Companion como producto operativo, reutilizando la infraestructura existente y evitando duplicaciones.

Principio rector:

> **Reutilizar primero. Adaptar después. Crear solo cuando sea necesario.**

### 🔵 PORTFOLIO — DISEÑADO / IMPLEMENTACIÓN POSTERIOR

El contrato conceptual está avanzado y documentado:

```text
VISION
  ↓
REUNIR
  ↓
ABRIR V0.1
  ↓
EXPRESAR V0.1
  ↓
VALIDAR V0.1
```

Portfolio no debe desplazar la consolidación de Companion ni convertirse en un camino crítico independiente.

### ⚪ NUEVO HOME MUBATO — META FINAL

El HOME es el único entregable final válido. Su construcción se aborda una vez que Companion esté suficientemente terminado para soportar el flujo editorial requerido.

## PRUEBA DE FUEGO GIRALDO — REGISTRO CANÓNICO

### Qué fue

La **prueba de fuego Giraldo** fue la primera ejecución real, de extremo a extremo, del flujo **PROYECTO V2.2** sobre un proyecto distinto de Araque, después de corregir y estabilizar el pipeline.

El objetivo fue demostrar que un proyecto nuevo podía entrar como ingredientes brutos —CSV de Wix + fotografías— y salir convertido en un CSV editorial nuevo, listo para regresar a Wix, sin depender de configuraciones o archivos de Araque.

### Cadena ejecutada

```text
CSV + fotografías
      ↓
Parser
      ↓
ProyectoManager / modelo Proyecto
      ↓
FotografiaManager / modelo Fotografia
      ↓
Vision
      ↓
Expediente / evidencia visual
      ↓
DirectorProyecto
      ↓
Editorial Proyecto V2.2
      ↓
Director Editorial MUBATO + llamadas editoriales
      ↓
SalidaEditorialCSV V2.2
      ↓
CSV editorial de Giraldo
      ↓
Wix
```

### Resultado

**Éxito total.**

Salida registrada:

`Hogar Giraldo_Editorial_20260830011007.csv`

Costo aproximado de la ejecución: **USD 0,70**.

### Comprobaciones clave

- El flujo dejó de depender de Araque.
- Parser identificó el proyecto y el flujo `EDITORIAL_PROYECTO_V2.2`.
- Vision produjo evidencia visual estructurada.
- La evidencia quedó persistida como `Hogar Giraldo.evidencia-visual.json`.
- Editorial reutilizó esa evidencia y no volvió a ejecutar Vision.
- La salida editorial correspondió al proyecto correcto.
- El CSV original no se modificó silenciosamente; se generó un archivo de salida separado.
- El contrato Wix fue respetado, incluyendo las dos columnas originales `Historias de Transformación` y `Hero Imágen`.
- La prueba demostró que el pipeline es generalizable a otro proyecto.

Regla arquitectónica confirmada:

> **observar → persistir → reutilizar → redactar**

### Decisiones descartadas / superadas

- seleccionar arbitrariamente el primer CSV de la carpeta;
- depender de un archivo histórico de Araque;
- volver a ejecutar Vision durante Editorial;
- permitir que Vision decida la Galería General;
- tocar las dos columnas originales `Historias de Transformación`;
- utilizar el modelo físico de Wix como modelo interno del Companion;
- utilizar una barra de progreso ficticia como representación de actividad real.

### Relación con el test de integración previo

El test de integración completo de PROYECTO V2.2 fue el antecedente que dio vía libre para llevar el pipeline a la App. La prueba Giraldo fue después la **validación real extremo a extremo desde la App**.

### Nota sobre checkpoint

El checkpoint canónico conocido asociado a esta etapa es `ca7f85c` (`chore(continuidad): update canonical checkpoint`). El commit exacto que contiene la totalidad de los cambios posteriores utilizados en la ejecución Giraldo debe verificarse mediante historial Git y **no debe inferirse** a partir de ese SHA.

## Bifurcación editorial congelada

```text
OBSERVACIONES vacía       → PROYECTO
OBSERVACIONES no vacía    → PORTFOLIO
```

No se interpreta el contenido de `Observaciones` ni se normaliza para decidir el tipo.

**PROYECTO**
- Una intervención de uno o varios espacios de un cliente.
- La editorial narra una transformación.
- Continúa por el pipeline validado como **Editorial Proyecto V2.2**.
- La Historia de Transformación es el eje narrativo.

**PORTFOLIO**
- Una familia de mobiliario bajo un concepto: cocinas, centros de entretenimiento, bibliotecas, alcobas, estudios, etc.
- `Observaciones` no vacía solo dispara la bifurcación.
- `Cliente` representa aquí el tipo de mueble/concepto de portfolio.
- La galería puede reunir muebles de uno o varios clientes/proyectos.
- La editorial debe describir lo que muestran las fotografías, nombrar correctamente cada imagen, producir un comentario breve y trabajar especialmente el SEO.
- El pipeline Portfolio todavía no está implementado.

## Contrato de salida CSV V2.2

Componente vigente: `src/Exportadores/salidaEditorialCSV.js`.

Reglas congeladas:
1. Parte del CSV Wix existente.
2. Localiza exactamente la fila recibida.
3. Preserva las 25 cabeceras originales, incluidos duplicados.
4. No toca las dos columnas originales `Historias de Transformación`.
5. No toca `Hero Imágen`.
6. No reconstruye `slug`, `src` ni objetos multimedia Wix.
7. Solo aplica campos explícitamente autorizados.
8. Genera un CSV de salida separado.

Campos autorizados en Proyecto V2.2:

- `Código MUBATO`
- `Hero Texto`
- `Historia`
- `Descripción`
- `Servicios`
- `Slug`
- `SEO Title`
- `Meta Description`

## PORTFOLIO — diseño conceptual avanzado

Portfolio ya no se considera un contrato por definir desde cero. Su diseño conceptual se encuentra avanzado y debe conservarse para implementación posterior sin alterar Proyecto V2.2.

Capas acordadas:

```text
VISION
  ↓ ¿Qué veo?
REUNIR
  ↓ ¿Qué variedad aparece?
ABRIR
  ↓ ¿Qué vale la pena abrir?
EXPRESAR
  ↓ ¿Cómo lo abro sin agotarlo?
VALIDAR
  ↓ ¿Cumple el contrato?
```

Decisiones conceptuales congeladas hasta nuevo cambio explícito:

- Vision observa; no decide selección ni orden.
- La suficiencia del Portfolio depende de la variedad significativa de soluciones, características o posibilidades reconocibles, no solo del número de fotografías.
- La selección de Hero y Galería General es previa y humana.
- La posición de una fotografía en la Galería no autoriza a inferir importancia, representatividad o calidad.
- El orden de Galería se conserva; la prioridad contextual no lo modifica.
- El contexto de mobiliario es una instrucción de observación, no una conclusión de Vision.
- Una fotografía puede contener varias posibilidades válidas; la expresión puede activar una sola.
- Las posibilidades no seleccionadas no se destruyen.
- ABRIR no está obligado a producir una posibilidad artificial cuando la evidencia no la sostiene.
- EXPRESAR no describe inventario ni convierte el Portfolio en una Historia de Transformación.
- EXPRESAR produce un párrafo corto con una sola idea editorial dominante.
- El párrafo debe ser específico de la fotografía, estar anclado en evidencia y dejar espacio para continuar descubriendo.
- No se garantiza que el visitante continúe a la siguiente fotografía; el Companion solo realiza su mejor esfuerzo editorial.
- VALIDAR no crea, mejora ni embellece; protege el contrato y devuelve el resultado cuando no cumple.
- VALIDAR puede producir estados `APROBADO`, `ADVERTENCIA` o `RECHAZADO`.
- La implementación de Portfolio debe reutilizar primero infraestructura existente, adaptar después y crear solo lo que realmente falte.

## Principios congelados

1. MUBATO selecciona manualmente Hero y Galería General.
2. Vision observa; no decide selección ni orden.
3. `proyecto.fotografias[]` y `proyecto.galeria[]` son conjuntos distintos.
4. El modelo interno Companion permanece independiente del formato físico Wix.
5. `Galería General` es JSON serializado de objetos multimedia Wix.
6. `Hero Imágen` es independiente de `Hero Texto`.
7. Wix genera/conserva `slug` y `src`; Companion no los inventa.
8. Companion preserva la identidad multimedia Wix recibida.
9. El orden de la galería no se modifica en el MVP.
10. La exportación parte de la fila Wix existente y solo modifica campos explícitamente propiedad de Companion.
11. Cada plantilla editorial tiene contrato de entrada y salida separado.
12. `Historias de Transformación` es un campo Wix existente y protegido.
13. La bifurcación editorial ocurre al leer la fila CSV, antes del pipeline editorial.
14. `Observaciones` vacía significa PROYECTO; `Observaciones` no vacía significa PORTFOLIO.
15. Editorial Proyecto y Editorial Portfolio son contratos distintos y no deben mezclarse.
16. **Economía circular de implementación:** reutilizar primero, adaptar después, crear solo cuando sea necesario.
17. Ningún componente nuevo debe duplicar una capacidad existente que haya demostrado funcionar.
18. Ningún cambio significativo se considera cerrado hasta que contrato, implementación, prueba y documentación estén sincronizados.
19. La prioridad absoluta del proyecto es **PROYECTO → COMPANION → HOME MUBATO**.

## Próximo objetivo operativo

**No reabrir PROYECTO.** Continuar con la consolidación/finiquitación de **COMPANION**, reutilizando la arquitectura comprobada en PROYECTO. Portfolio queda documentado para implementación posterior salvo dependencia directa del camino crítico.
