# DICCIONARIO COMPANION - WIX

**Proyecto:** MUBATO CMS Companion

**Versión:** 1.0

---

# Propósito

Este documento define la correspondencia entre las columnas utilizadas por el CMS de Wix y el modelo interno utilizado por MUBATO CMS Companion.

El Companion nunca debe trabajar directamente sobre nombres de columnas del CSV.

Siempre deberá convertir el CSV a un modelo interno (`Proyecto`) y posteriormente exportarlo nuevamente al formato esperado por Wix.

---

# Flujo de datos

```
CSV Wix

↓

Parser

↓

Proyecto (modelo interno)

↓

Exportador

↓

CSV Wix
```

---

# Diccionario Oficial

| Columna Wix | Propiedad Proyecto | Tipo | Observaciones |
|--------------|-------------------|------|---------------|
| Proyecto | proyecto | Texto | Nombre comercial del proyecto |
| Historias de Transformación | historia | Texto | URL o identificador de la historia |
| Descripción | descripcion | Texto largo | Descripción del proyecto |
| Galería General | galeria | Array | Lista JSON de imágenes |
| Hero Imágen | heroImagen | Texto | Imagen Hero |
| Hero Texto | heroTexto | Texto | Texto del Hero |
| ID | id | Texto | ID interno Wix |
| Created Date | created | Fecha | Solo lectura |
| Updated Date | updated | Fecha | Solo lectura |
| Owner | owner | Texto | Usuario creador |
| Código MUBATO | codigo | Texto | Código interno del proyecto |
| Ciudad | ciudad | Texto | Ciudad del proyecto |
| Categoría | categoria | Array | Etiquetas Wix |
| Espacios | espacios | Array | Etiquetas Wix |
| Estado | estado | Array | Etiquetas Wix |
| Servicios | servicios | Array | Servicios ofrecidos |
| Año | anio | Número | Año del proyecto |
| Destacado | destacado | Boolean | Proyecto destacado |
| Orden Home | ordenHome | Número | Posición en Home |
| SEO Title | seoTitle | Texto | Título SEO |
| Meta Description | metaDescription | Texto largo | Meta descripción |
| Slug | slug | Texto | URL amigable |
| Cliente | cliente | Texto | Nombre del cliente |
| Observaciones | observaciones | Texto largo | Uso interno |

---

# Tipos de datos

## Texto

Cadena simple.

Ejemplo

```
Bogotá
```

---

## Número

Ejemplo

```
2024
```

---

## Boolean

```
true
false
```

---

## Array de etiquetas

En el CSV de Wix las etiquetas llegan como JSON.

Ejemplo

```json
["Sala","Comedor","Home Office"]
```

Internamente el Companion siempre trabajará con un Array de JavaScript.

```javascript
[
    "Sala",
    "Comedor",
    "Home Office"
]
```

---

## Servicios

En el CSV original de MUBATO se almacenan separados por el carácter "|".

Ejemplo

```
Diseño interior|Mobiliario a medida|Remodelación
```

Internamente el Companion siempre utilizará un Array.

```javascript
[
    "Diseño interior",
    "Mobiliario a medida",
    "Remodelación"
]
```

---

# Responsabilidades

## parser.js

Responsable de leer el CSV.

No interpreta información.

No genera contenido.

---

## modelo.js

Convierte una fila del CSV en un objeto Proyecto.

Toda conversión de tipos ocurre aquí.

---

## exportador.js

Convierte un Proyecto nuevamente al formato esperado por Wix.

---

## Proyecto

Representa el modelo interno del Companion.

Nunca debe depender de nombres de columnas del CSV.

---

# Principios

1. El modelo interno es la fuente de verdad.

2. Los nombres de columnas del CSV nunca deben utilizarse fuera de `modelo.js` y `exportador.js`.

3. Cualquier cambio futuro en el CMS de Wix debe resolverse únicamente actualizando este diccionario y las funciones de importación/exportación.

4. Todo el resto del Companion trabajará exclusivamente con objetos `Proyecto`.

---

# Arquitectura

```
               CSV Wix
                  │
                  │
             parser.js
                  │
                  ▼
             modelo.js
                  │
                  ▼
             Proyecto
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
 Analizador   Editor     Companion IA
      │           │           │
      └───────────┼───────────┘
                  ▼
           exportador.js
                  │
                  ▼
              CSV Wix
```

---

# Observación

Este documento constituye el contrato oficial entre el CMS de Wix y el modelo interno del Companion. Ningún módulo nuevo debe acceder directamente a las columnas del CSV; toda interacción debe realizarse a través del objeto `Proyecto`.