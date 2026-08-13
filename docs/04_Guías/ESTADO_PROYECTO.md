# MUBATO CMS Companion — Estado del Proyecto

**Documento:** Estado del proyecto  
**Versión:** 1.0  
**Fecha:** 12 de agosto de 2026  
**Propósito:** Punto de guardado operativo para retomar el trabajo del MUBATO CMS Companion sin depender de la continuidad de una conversación.

---

# 1. ESTADO GENERAL

El MUBATO CMS Companion tiene una **Fase 1 funcional y respaldada en GitHub**.

La Fase 2 está en investigación debido al error ocurrido durante el hot test.

La Fase 3 está pendiente y corresponde a la definición de la relación entre las galerías de la **Historia del Proyecto** y del **Portafolio**.

| Fase de trabajo | Estado | Situación |
|---|---|---|
| Fase 1 — Companion en GitHub | 🟢 COMPLETADA | Baseline recuperado, commit realizado y publicado |
| Fase 2 — Error del hot test | 🟡 EN INVESTIGACIÓN | Debemos corregir el laboratorio de pruebas y rastrear el origen de información incorrecta |
| Fase 3 — Historia vs Portafolio | 🔵 PENDIENTE | Debemos definir modelo, clasificación y exportación de ambas galerías |

---

# 2. FASE 1 — COMPANION EN GITHUB

## Estado

🟢 **COMPLETADA**

Repositorio:

`mubatomobiliario-cloud/mubato-cms-companion`

Branch:

`main`

Commit de referencia:

`c73275d — Restore MUBATO CMS Companion baseline`

Estado al cierre de la fase:

- Commit realizado.
- Push realizado a `origin/main`.
- Working tree limpio.
- El repositorio fue verificado en GitHub.
- El Companion recuperado está respaldado.

Este commit constituye el **punto de restauración de referencia** para el estado recuperado del Companion.

---

# 3. ARQUITECTURA BASE

La arquitectura editorial acordada es:

```text
CSV
 ↓
Parser
 ↓
Proyecto
 ↓
Vision
 ↓
Expediente
 ↓
Dirección Editorial
 ↓
Hero
 ↓
Historia
 ↓
SEO
 ↓
CMS
```

Principios fundamentales:

1. Cada módulo tiene una responsabilidad.
2. Vision observa.
3. La Dirección Editorial interpreta.
4. El Expediente es la fuente única de verdad para los textos editoriales.
5. El Companion piensa antes de escribir.
6. El conocimiento es acumulativo.
7. La IA no decide aspectos editoriales de MUBATO.
8. El lenguaje nace del conocimiento.
9. El Companion no debe inventar.

---

# 4. PRODUCCIÓN DOCUMENTAL

La documentación existente forma parte del diseño maestro del Companion y debe utilizarse como fuente de verdad antes de modificar o completar código.

## Arquitectura

- `docs/01_Arquitectura/ARQUITECTURA_EDITORIAL.md`
- `docs/01_Arquitectura/CMS_SPEC.md`
- `docs/01_Arquitectura/Especificacion_Funcional_MUBATO_CMS_Companion.md`

## Modelo y diccionarios

- `docs/02_Modelos/MODELO_FOTOGRAFIA.md`
- `docs/03_Diccionarios/DICCIONARIO_COMPANION_WIX.md`

## Guías

- `docs/04_Guías/CHECKLIST_MVP.md`

## Dirección Editorial

- `docs/05_Editorial/01_Filosofia.md`
- `docs/05_Editorial/02_Voz.md`
- `docs/05_Editorial/03_Tono.md`
- `docs/05_Editorial/04_Vocabulario.md`
- `docs/05_Editorial/05_Palabras_Prohibidas.md`
- `docs/05_Editorial/06_Hero.md`
- `docs/05_Editorial/07_Historias.md`
- `docs/05_Editorial/08_Ejemplos.md`

## Vision

- `docs/06_Vision/01_Espacios.md`
- `docs/06_Vision/02_Tipos.md`
- `docs/06_Vision/03_Planos.md`
- `docs/06_Vision/04_Estilos.md`
- `docs/06_Vision/05_Iluminacion.md`
- `docs/06_Vision/06_Sensaciones.md`
- `docs/06_Vision/07_Materiales.md`
- `docs/06_Vision/08_Elementos.md`

### Regla documental

No asumir que un archivo vacío es un error.

Antes de eliminarlo, rellenarlo o reemplazarlo, determinar si corresponde a:

- funcionalidad futura;
- conocimiento previsto;
- estructura reservada;
- componente reemplazado;
- o error de recuperación.

---

# 5. MODELO DE CAMPOS ACORDADO

## Campos diligenciados por Juan Germán

- Proyecto
- Hero
- Ciudad
- Categoría
- Espacios
- Estado
- Año
- Cliente

## Campos diligenciados por CHATico

- Hero Texto
- Descripción
- Código MUBATO
- Servicios
- SEO Title
- Meta Description
- Slug
- JSON Galería General

La IA no sustituye el criterio editorial de MUBATO.

---

# 6. FASE 2 — ERROR DEL HOT TEST

## Estado

🟡 **EN INVESTIGACIÓN**

El test utilizado fue:

`tests/testPipeline.js`

Ese test tenía la carpeta del proyecto fijada directamente a:

```text
Proyectos/Andrés Giraldo
```

Por esta razón, aunque el proyecto que se pretendía probar era **Araque**, el pipeline ejecutó el análisis sobre **Andrés Giraldo**.

La secuencia real fue:

```text
testPipeline.js
 ↓
Andrés Giraldo
 ↓
Parser
 ↓
Fotografías de Giraldo
 ↓
Vision
 ↓
Expediente de Giraldo
 ↓
Dirección Editorial
 ↓
OpenAI
```

### Información inesperada

Durante aquella ejecución aparecieron referencias como **“tonos metálicos”**.

Todavía NO está determinado en qué etapa se originó esa información.

No asumir que fue inventada por OpenAI.

Debe rastrearse mediante una prueba controlada.

---

# 7. OBJETIVO DE LA FASE 2

Transformar `tests/testPipeline.js` en un laboratorio de pruebas seguro.

El test debe permitir como mínimo:

1. Seleccionar la carpeta del proyecto.
2. Mostrar la identidad del proyecto detectado.
3. Mostrar CSV y fotografías encontradas.
4. Elegir ejecución:
   - sin IA;
   - con IA.
5. Confirmar antes de realizar llamadas a OpenAI.
6. Ejecutar el pipeline sobre el proyecto seleccionado.
7. Permitir rastrear las salidas intermedias.

## Trazabilidad deseada

```text
Fotografía
 ↓
Respuesta RAW de Vision
 ↓
Fotografía normalizada
 ↓
Expediente
 ↓
Prompt Editorial
 ↓
Respuesta de Dirección Editorial
```

### Criterio de cierre

La Fase 2 se considera cerrada cuando podamos:

- seleccionar Araque explícitamente;
- ejecutar el pipeline correcto;
- evitar consumir IA cuando no sea necesario;
- identificar exactamente qué proyecto fue procesado;
- determinar dónde se origina cualquier información que no corresponda al proyecto.

### No hacer todavía

- No completar archivos vacíos solo por estar vacíos.
- No rediseñar la arquitectura editorial.
- No modificar el modelo Historia vs Portafolio.
- No hacer nuevas pruebas costosas de OpenAI hasta tener el test seguro.
- No hacer cambios destructivos sobre los proyectos originales.

---

# 8. FASE 3 — HISTORIA VS PORTAFOLIO

## Estado

🔵 **PENDIENTE**

La nueva necesidad detectada es distinguir:

### Galería de Historia del Proyecto

Fotografías utilizadas para construir y contar narrativamente la transformación del proyecto.

### Galería de Portafolio

Fotografías destinadas a presentar el proyecto dentro del Portafolio de MUBATO.

No asumir todavía que ambas galerías utilizan exactamente las mismas fotografías.

## Preguntas que debemos resolver

1. ¿Una fotografía puede pertenecer a ambas galerías?
2. ¿Qué criterios determinan pertenencia a Historia?
3. ¿Qué criterios determinan pertenencia a Portafolio?
4. ¿Quién toma esa decisión: MUBATO, reglas del Companion o IA?
5. ¿Cómo se almacena esa clasificación en el modelo de Fotografía?
6. ¿Cómo se representa cada galería en JSON?
7. ¿Cómo se exportan al CSV?
8. ¿Cómo llegan finalmente a Wix?

Esta decisión debe respetar la arquitectura existente y el modelo de fotografía antes de modificar código.

---

# 9. ESTADO FUNCIONAL DEL MVP

Según `CHECKLIST_MVP.md`:

## Importación

- ☑ Lee carpeta
- ☑ Lee CSV
- ☑ Encuentra proyecto pendiente
- ☑ Lee fotografías

## IA

- ☑ Analiza fotografías
- ☑ Construye expediente
- ☑ Genera Hero
- ☐ Genera Historia
- ☐ SEO Title
- ☐ Meta Description
- ☐ Slug

## Publicación

- ☑ Actualiza CSV
- ☐ Hero Image
- ☐ Galería
- ☐ Servicios
- ☐ Espacios

## Wix

- ☐ Importa sin errores
- ☐ Proyecto visible
- ☐ Home correcto

Este checklist describe el **estado del MVP**, no debe confundirse con el flujo arquitectónico final.

---

# 10. PRÓXIMA ACCIÓN

## Inmediata

**Construir el nuevo `testPipeline.js` como laboratorio seguro**, con:

- selección de carpeta;
- identificación explícita del proyecto;
- modo IA / sin IA;
- confirmación previa al consumo de OpenAI;
- trazabilidad de resultados.

## Después

Reproducir de forma controlada el caso que produjo “tonos metálicos”.

## Después

Cerrar Fase 2.

## Después

Abordar Fase 3: Historia vs Portafolio.

---

# 11. PUNTO DE REANUDACIÓN

Si se cierra el computador y se retoma el proyecto posteriormente:

### Leer primero este documento.

La situación es:

```text
FASE 1
GitHub
🟢 CERRADA

        ↓

FASE 2
Hot Test
🟡 EN INVESTIGACIÓN

        ↓
PRÓXIMA ACCIÓN:
Rediseñar testPipeline.js

        ↓

FASE 3
Historia vs Portafolio
🔵 PENDIENTE
```

**No saltar directamente a Fase 3.**

Primero cerrar la Fase 2.

---

# 12. PRINCIPIO DE CONTINUIDAD

Este documento debe actualizarse cada vez que:

- se cierre una fase;
- se tome una decisión arquitectónica importante;
- se detecte un error relevante;
- cambie la próxima acción;
- o se termine una sesión de trabajo significativa.

Al finalizar una sesión importante:

```text
Actualizar ESTADO_PROYECTO.md
        ↓
git add .
        ↓
git commit
        ↓
git push
```

El objetivo es que el proyecto pueda retomarse con certeza aunque hayan pasado días entre sesiones.
