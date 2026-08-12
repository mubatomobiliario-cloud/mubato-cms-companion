# Especificación Funcional

## MUBATO CMS Companion

**Versión:** 1.0 (Borrador)

## 1. Propósito

El MUBATO CMS Companion es una herramienta para automatizar la
administración del CMS de Wix. Su objetivo es leer un archivo CSV
exportado desde Wix, transformarlo mediante reglas definidas y generar
un nuevo CSV listo para importar nuevamente al CMS.

------------------------------------------------------------------------

# 2. Arquitectura

    CSV Wix
        │
        ▼
    parser.js
        │
        ▼
    modelo.js
        │
        ▼
    Proyecto
        │
        ▼
    exportador.js
        │
        ▼
    CSV generado

## Responsabilidades

  Archivo         Responsabilidad
  --------------- ------------------------------
  parser.js       Leer el CSV de Wix
  modelo.js       Construir el modelo Proyecto
  exportador.js   Transformar Proyecto en CSV
  script.js       Coordinar el flujo
  ui.js           Interfaz con el usuario
  config.js       Configuración y constantes

------------------------------------------------------------------------

# 3. Modelo Proyecto

El objeto `Proyecto` representa un proyecto de MUBATO.

Campos actuales:

-   proyecto
-   historia
-   descripcion
-   heroImagen
-   heroTexto
-   galeria
-   codigo
-   ciudad
-   categoria
-   espacios
-   estado
-   servicios
-   anio
-   destacado
-   ordenHome
-   seoTitle
-   metaDescription
-   slug
-   cliente
-   observaciones

------------------------------------------------------------------------

# 4. Diccionario Companion ↔ Wix

## Identificación

  Campo Wix   Proyecto   Estado
  ----------- ---------- --------
  Título      proyecto   ✅
  Slug        slug       ✅
  Código      codigo     ✅

## Contenido

  Campo Wix     Proyecto      Estado
  ------------- ------------- --------
  Historia      historia      ✅
  Descripción   descripcion   ✅
  Hero Texto    heroTexto     ✅

## Imágenes

  Campo Wix    Proyecto     Estado
  ------------ ------------ -----------------------------
  Hero Image   heroImagen   🟡 Transformación pendiente
  Gallery      galeria      🟡 Transformación pendiente

## SEO

  Campo Wix          Proyecto          Estado
  ------------------ ----------------- --------
  SEO Title          seoTitle          ✅
  Meta Description   metaDescription   ✅

## Clasificación

  Campo Wix   Proyecto    Estado
  ----------- ----------- --------
  Categoría   categoria   🟡
  Espacios    espacios    🟡
  Estado      estado      🟡
  Servicios   servicios   🟡

## Datos del proyecto

  Campo Wix    Proyecto    Estado
  ------------ ----------- --------
  Ciudad       ciudad      ✅
  Año          anio        ✅
  Cliente      cliente     ✅
  Destacado    destacado   🟡
  Orden Home   ordenHome   🟡

------------------------------------------------------------------------

# 5. Hoja de Ruta

## Etapa 1 -- Infraestructura ✅

-   Parser propio
-   Modelo Proyecto
-   Exportador básico
-   Descarga de CSV

## Etapa 2 -- Transformación del CMS

-   Completar todas las columnas
-   Validaciones
-   Importación 100% compatible con Wix

## Etapa 3 -- Inteligencia Editorial

Generación automática de:

-   SEO Title
-   Meta Description
-   Slug
-   Hero Text
-   Historias

## Etapa 4 -- IA para imágenes

Generación automática de:

-   Nombre de archivo
-   Alt Text
-   Title
-   Caption
-   Palabras clave
-   Clasificación
-   Selección de Hero
-   Selección de Galería

## Etapa 5 -- Curador Inteligente

El Companion sugerirá automáticamente:

-   Mejor Hero
-   Mejor galería
-   Fotografías repetidas
-   Fotografías descartables
-   Calidad fotográfica
-   Cobertura del proyecto

------------------------------------------------------------------------

# 6. Principios

1.  Una responsabilidad por archivo.
2.  El modelo `Proyecto` es el núcleo del sistema.
3.  El Companion transforma datos, no modifica el CSV original.
4.  Todas las decisiones importantes deben documentarse antes de
    implementarse.
5.  La IA debe preservar el estilo editorial de MUBATO.

------------------------------------------------------------------------

# 7. Visión

El objetivo final no es únicamente convertir archivos CSV.

El MUBATO CMS Companion será un asistente editorial capaz de analizar
proyectos, comprender fotografías, generar contenido, optimizar SEO y
preparar automáticamente la publicación de los proyectos en el CMS de
Wix manteniendo la identidad editorial de MUBATO.
