# MUBATO CMS Companion — Estado del Proyecto

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

> Documento canónico de continuidad. Describe el estado real del repositorio y las decisiones editoriales vigentes.

## Prioridad absoluta del proyecto

El objetivo no es completar Companion como un producto aislado ni desarrollar Portfolio por sí mismo. El único entregable válido es el **nuevo HOME de MUBATO funcionando sobre el Companion terminado**.

El camino crítico queda establecido así:

1. **Terminar PROYECTO**.
2. **Finiquitar COMPANION**.
3. **Concluir y entregar el nuevo HOME de MUBATO**.

Toda decisión, implementación, prueba o documentación debe contribuir directa o indirectamente a ese objetivo. Ninguna línea de trabajo secundaria debe desplazar el camino crítico.

## Último checkpoint funcional

- Rama de trabajo: `feat/csv-editorial-v1`
- Último cambio funcional de referencia: `9247fa9` — bifurcación editorial incorporada en `src/core/parser.js`.
- Los commits posteriores de interfaz y continuidad no sustituyen ese hito funcional.
- El checkpoint automático más reciente es el que aparece en `CONTINUIDAD_AUTO_START/END`.

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

### 🟢 Cerrado / comprobado

- Importación de proyecto desde carpeta + CSV.
- Modelo `Proyecto` y `Fotografia`.
- Ingesta de fotografías y Vision por fotografía.
- Persistencia de evidencia visual.
- Expediente de proyecto.
- Editorial Proyecto V2.2.
- Evidencia Vision reutilizada en Editorial Proyecto V2.2 sin segunda lectura Vision.
- Historia Editorial maestra y validación estructural.
- Historia Web mediante contrato JSON y validación propia.
- Hero, SEO, Código MUBATO, Servicios y Slug.
- Metadatos editoriales por fotografía: `title`, `alt`, `keywords` y `nombreSEO`.
- Telemetría editorial.
- Prueba real `EDITORIAL V2.2` superada sobre `Hogar Araque`.
- Prueba blindada de `SalidaEditorialCSV V2.2` superada.
- Contrato de salida probado: exactamente 8 campos editoriales autorizados y 18 campos protegidos.
- Las dos columnas originales `Historias de Transformación` permanecen intactas.
- `Historia` se escribe en una columna Companion independiente.
- `Hero Texto` se mapea al campo Wix correcto; `Hero Imágen` permanece separado e intacto.
- Las 25 cabeceras originales permanecen en el mismo orden.
- Filas y referencias multimedia Wix preservadas.
- `src/core/parser.js` decide el tipo editorial en el primer contacto con la fila CSV.
- Canon documental de Continuidad establecido en `docs/00_Estado/`.

### 🟢 Bifurcación editorial congelada

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

## PROYECTO — prioridad inmediata

Editorial Proyecto V2.2 está comprobado. El trabajo restante del camino crítico es consolidar la integración operativa, ejecutar la prueba end-to-end definitiva y cerrar PROYECTO antes de abrir nuevas líneas de implementación que no sean necesarias para ese cierre.

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

## PORTFOLIO — diseño conceptual avanzado, implementación no prioritaria

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

## 🟡 Pendiente / camino crítico

1. **Cerrar PROYECTO**: integración definitiva del componente de salida en el workflow y prueba end-to-end.
2. **Finiquitar COMPANION**: consolidar el flujo operativo completo, sus pruebas y sus contratos.
3. **HOME MUBATO**: utilizar el Companion terminado para producir el único entregable válido del proyecto.

Trabajo secundario, a mantener sin desplazar el camino crítico:

- Editorial Portfolio y su implementación posterior.
- Optimización adicional del número de llamadas IA.
- Determinación formal del conjunto mínimo de campos estructurales Wix.
- Prueba end-to-end definitiva de Portfolio cuando corresponda.

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
19. La prioridad absoluta del proyecto es PROYECTO → COMPANION → HOME MUBATO.

## Rendimiento de referencia — Editorial Proyecto V2.2

Prueba real sobre `Hogar Araque`:

- Modelo: `gpt-5.5`
- Llamadas IA: 9
- Vision en fase editorial: 0
- Input tokens: 12.145
- Output tokens: 3.145
- Total: 15.290 tokens
- Tiempo acumulado: 58.061 ms
- Fotografías procesadas editorialmente: 2

Estos valores son línea base de optimización, no tarifa fija.

## Camino crítico vigente

```text
PROYECTO
   ↓
Integración + prueba E2E
   ↓
COMPANION terminado
   ↓
Aplicación al HOME MUBATO
   ↓
NUEVO HOME MUBATO
   ↓
ENTREGABLE FINAL VÁLIDO
```

La bifurcación técnica existente se conserva:

```text
CSV + carpeta
   ↓
Parser
   ↓
Determinar tipo editorial
   ├── PROYECTO → Editorial Proyecto V2.2
   └── PORTFOLIO → Editorial Portfolio (posterior)
   ↓
Contrato editorial interno
   ↓
SalidaEditorialCSV V2.2
   ↓
CSV de salida
   ↓
Wix
```

## Próximo objetivo operativo

**Cerrar PROYECTO sin alterar el pipeline probado:** consolidar la integración del workflow, ejecutar la prueba end-to-end y dejar documentado el cierre. Portfolio permanece documentado y no debe desplazar esta prioridad.
