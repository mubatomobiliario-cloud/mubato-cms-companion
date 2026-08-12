# MODELO FOTOGRAFÍA
## MUBATO CMS Companion

**Versión:** 1.0
**Estado:** Borrador inicial

---

# Propósito

Este documento define el modelo oficial utilizado por MUBATO CMS Companion para representar una fotografía de un proyecto.

Una fotografía no es simplemente un archivo JPG.

Es un activo digital que contiene información técnica, editorial y comercial que permitirá automatizar la publicación de proyectos dentro del CMS de Wix.

Toda fotografía deberá poder ser analizada, clasificada, enriquecida y posteriormente exportada al CMS.

---

# Modelo conceptual

```
Proyecto

    ├── Fotografía 1
    ├── Fotografía 2
    ├── Fotografía 3
    ├── Fotografía Hero
    └── ...
```

Cada proyecto contiene una colección de fotografías.

Cada fotografía es independiente y posee atributos propios.

---

# Estructura

## 1. Información del archivo

Describe el archivo físico.

| Campo | Tipo |
|--------|------|
| archivo | string |
| nombreOriginal | string |
| extensión | string |
| tamaño | number |
| ancho | number |
| alto | number |
| orientación | horizontal / vertical / cuadrada |

Ejemplo

```
IMG_0192.jpg
```

---

## 2. Información del proyecto

Relaciona la fotografía con el proyecto.

| Campo | Tipo |
|--------|------|
| proyecto | string |
| códigoProyecto | string |
| cliente | string |
| ciudad | string |

---

## 3. Clasificación espacial

Indica qué espacio aparece.

| Campo |
|--------|
| Cocina |
| Sala |
| Comedor |
| Estudio |
| Home Office |
| Alcoba |
| Baño |
| Terraza |
| Balcón |
| Patio |
| BBQ |
| Walk-in Closet |
| Circulación |
| Fachada |

Una fotografía puede pertenecer a varios espacios.

---

## 4. Clasificación arquitectónica

Describe el tipo de escena.

Ejemplos

- Vista general
- Detalle
- Ambiente
- Mobiliario
- Carpintería
- Iluminación
- Materiales
- Decoración

---

## 5. Calidad técnica

Evaluación objetiva.

Campos

- Nitidez
- Exposición
- Balance de blancos
- Contraste
- Resolución
- Ruido
- Distorsión

Valor

```
Excelente
Buena
Regular
Deficiente
```

---

## 6. Calidad editorial

Evalúa la utilidad para comunicación.

Campos

- Impacto visual
- Composición
- Profundidad
- Limpieza visual
- Orden
- Coherencia

---

## 7. Contenido

Describe qué aparece.

Ejemplos

- Isla
- Biblioteca
- Chimenea
- Sofá
- Mesa
- Escritorio
- Mueble TV
- Barra
- Lavamanos

---

## 8. Materiales

Lista de materiales visibles.

Ejemplo

- Madera
- Piedra
- Mármol
- Vidrio
- Metal
- Microcemento
- Tela
- Cuero

---

## 9. Iluminación

Tipos

- Natural
- Artificial
- Mixta

---

## 10. Personas

Campos

```
true
false
```

---

## 11. Logos

Indica si existen marcas visibles.

```
true
false
```

---

## 12. Texto visible

Determina si aparecen textos en la fotografía.

```
true
false
```

---

# Clasificación editorial

## Hero

```
true
false
```

Indica si la fotografía puede utilizarse como Hero principal.

---

## Galería

```
true
false
```

---

## Orden sugerido

Número entero.

Ejemplo

```
1
2
3
4
```

---

# Contenido generado

Campos producidos por el Companion.

## ALT

Texto alternativo.

---

## Caption

Texto descriptivo.

---

## Título editorial

Nombre amigable de la fotografía.

Ejemplo

"Cocina contemporánea con isla"

---

## Nombre SEO

Nombre recomendado del archivo.

Ejemplo

```
cocina-contemporanea-isla-madera.jpg
```

---

## Palabras clave

Lista de keywords.

Ejemplo

- cocina
- interiorismo
- mobiliario
- isla
- diseño colombiano

---

# Evaluación IA

Campos generados automáticamente.

## Espacio detectado

Confianza

```
97%
```

---

## Estilo

Ejemplos

- Contemporáneo
- Minimalista
- Escandinavo
- Industrial
- Clásico

---

## Materiales detectados

Lista.

---

## Objetos detectados

Lista.

---

## Colores predominantes

Lista.

---

## Probabilidad Hero

Escala

```
0–100
```

---

# Estado

Campos internos.

| Campo | Tipo |
|--------|------|
| analizada | boolean |
| revisada | boolean |
| aprobada | boolean |
| publicada | boolean |

---

# Flujo de vida

```
Fotografía

↓

Importación

↓

Análisis técnico

↓

Análisis IA

↓

Generación editorial

↓

Revisión humana

↓

Aprobación

↓

Publicación CMS

↓

Sitio Web
```

---

# Principios

El Companion nunca reemplaza el criterio editorial de MUBATO.

La IA propone.

El editor decide.

Toda sugerencia debe poder ser modificada antes de publicarse.

El objetivo del Companion no es automatizar decisiones, sino acelerar el trabajo editorial manteniendo la calidad y el estilo característicos de MUBATO.