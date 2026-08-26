# MUBATO CMS Companion — Estado del Proyecto

<!-- CONTINUIDAD_AUTO_START -->
- Generado automáticamente: `2026-08-26 01:53:19.384Z`
- Commit observado: `e601565`
- Rama: `feat/csv-editorial-v1`
- Archivos versionados: `136`
- Verificaciones: **OK** — canon documental, bifurcación Parser, contrato de salida y campos Wix protegidos.
- Últimos commits:
  - e601565 — 2026-08-25 — docs(4.4): cerrar consolidacion editorial
  - a3f5837 — 2026-08-25 — fix(4.3.3): validar contexto web reutilizado en SEO y galeria
  - 61bf9af — 2026-08-25 — fix(4.3.3): validar reutilización con resultados reales de etapas
  - 69fc1f0 — 2026-08-25 — docs(4.3.3): documentar criterio de correccion del test
  - 2f0b817 — 2026-08-25 — test(4.3.3): consolidar flujo editorial V2.2 ejecutable
<!-- CONTINUIDAD_AUTO_END -->

> Documento canónico de continuidad. Describe el estado real del repositorio y las decisiones editoriales vigentes.

## Última sincronización

- Fecha: 2026-08-24
- Rama de trabajo: `feat/csv-editorial-v1`
- Commit de código de referencia: `9247fa9`
- Último cambio funcional: bifurcación editorial incorporada en `src/core/parser.js`.
- Continuidad: estado, matriz y ledger deben permanecer sincronizados; la automatización histórica de continuidad queda pendiente de verificación operacional.

## Canon documental de continuidad

La memoria técnica oficial del proyecto vive exclusivamente en `docs/00_Estado/` y está formada por estos tres documentos:

1. `ESTADO_PROYECTO.md` — fotografía ejecutiva vigente.
2. `MATRIZ_COMPONENTES.md` — estado funcional por componente.
3. `LEDGER_CONTINUIDAD.md` — cronología de decisiones, cambios y checkpoints.

No existe un segundo `Estado_Proyecto.md` canónico en `docs/04_Guías/`. Esa ruta no forma parte del sistema de continuidad vigente y no debe utilizarse como fuente de verdad.

## Estado ejecutivo vigente

### 🟢 Comprobado

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

### 🟢 Contrato de salida CSV V2.2

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

### 🟡 Pendiente de consolidación

- Editorial Portfolio.
- Optimización adicional del número de llamadas IA.
- Integración definitiva de `SalidaEditorialCSV` en el workflow operativo.
- Verificación operacional del sistema automático de continuidad.
- Determinación formal del conjunto mínimo de campos estructurales Wix.
- Prueba end-to-end definitiva Proyecto y Portfolio → CSV → Wix.

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
CSV + carpeta
   ↓
Parser
   ↓
Determinar tipo editorial
   ├── PROYECTO → Editorial Proyecto V2.2
   └── PORTFOLIO → Editorial Portfolio (pendiente)
   ↓
Contrato editorial interno
   ↓
SalidaEditorialCSV V2.2
   ↓
CSV de salida
   ↓
Wix
```

## Próximo objetivo

**Respeto editorial de la bifurcación:** construir Editorial Portfolio como pipeline separado, sin alterar el pipeline probado de Editorial Proyecto V2.2, compartiendo el contrato de salida únicamente en el punto autorizado para escribir el CSV Wix.
