# MUBATO CMS Companion — Matriz Viva de Componentes

> Documento canónico de estado funcional. Se actualiza con cada cambio significativo y sirve como referencia de continuidad.

| Componente | Responsabilidad | Estado | Contrato | Camino crítico |
|---|---|---|---|---|
| `core/parser.js` | Encontrar CSV/proyecto e iniciar importación | 🟢 Comprobado | Conocido | Sí |
| `core/proyectoManager.js` | Construir `Proyecto` desde CSV y carpeta | 🟡 Implementado; validación pendiente | Importa datos básicos/fotografías; `Galería General` se parsea como JSON de objetos Wix y `Hero Imagen` como URI `wix:image://...`; vincula por `fileName` y conserva referencias Wix | Sí |
| `core/proyecto.js` | Modelo central de proyecto, Hero, Galería y fotografías | 🟢 Comprobado | Conocido | Sí |
| `core/fotografiaManager.js` | Ingestar fotografías locales | 🟢 Comprobado | Conocido | Sí |
| `core/fotografia.js` | Modelo de fotografía y contenido editorial | 🟢 Comprobado | Conocido | Sí |
| `vision/analizadorFotografias.js` | Ejecutar observación visual por fotografía | 🟢 Comprobado | Conocido | Sí |
| `vision/promptVision.js` | Contrato de observación visual | 🟢 Comprobado | Conocido | Sí |
| `direccionEditorial/expedienteProyecto.js` | Consolidar observaciones del proyecto | 🟢 Comprobado | Conocido | Sí |
| `direccionEditorial/contextoMarca.js` | Doctrina editorial MUBATO | 🟢 Preparado | Conocido | Sí |
| `direccionEditorial/ConstructorContexto.js` | Construir contexto para generación editorial | 🟡 Parcial | Parcial | Sí |
| `direccionEditorial/directorEditorial.js` | Orquestar generación editorial | 🟡 Parcial | Parcial | Sí |
| `direccionEditorial/generadorEditorial.js` | Motor genérico contexto + plantilla → contenido | 🟡 Preparado/desconectado | Conocido | Sí |
| `direccionEditorial/promptTemplates.js` | Contratos Hero, Historia, SEO, ALT, Keywords, Slug y otros | 🔴 Revisar exportación | Conocido | Sí |
| `Exportadores/actualizadorCSV.js` | Escribir resultados en CSV | 🟡 Parcial | Parcial | Sí |
| `workflow/directorProyecto.js` | Orquestar fases del proyecto | 🟡 Parcial | Análisis conectado; ejecución completa no apta para UI todavía | Sí |
| `electron/main.js` | Exponer operaciones de proyecto mediante IPC | 🟢 Análisis conectado | Conocido | Sí |
| `electron/preload.js` | Puente seguro Renderer → Main | 🟢 Análisis conectado | Conocido | Sí |
| `renderer/script.js` | Interfaz y disparo del análisis | 🟢 Análisis conectado | Conocido | Sí |
| `proyecto.galeria[]` | Selección humana de fotografías para Galería | 🟢 Modelo definido | Selección humana + orden; no decide Vision | Sí |
| Hero | Selección humana + contenido editorial | 🟡 Parcial | Imagen seleccionada por MUBATO; texto editorial pendiente | Sí |
| `Galería General` Wix | Representación física de galería en CSV | 🟢 Contrato físico comprobado | Celda CSV = JSON serializado de array de objetos multimedia Wix; conserva `fileName`, `slug`, `src`, `title`, `alt`, `description`, `type`, `settings` | Sí |
| `Hero Imagen` Wix | Representación física del Hero en CSV | 🟢 Contrato físico comprobado | Celda CSV = string `wix:image://...`; no es JSON. El nombre del archivo se puede extraer de la URI y la URI completa debe preservarse | Sí |
| Identidad multimedia Wix | Referencias `slug`/`src` de imágenes | 🟢 Comportamiento comprobado | Wix genera/conserva la identidad; Companion no debe inventarla | Sí |
| Integridad básica del registro Wix | Campos estructurales del item | 🟡 Evidencia de prueba | En prueba controlada, completar campos básicos vacíos permitió que Hero y Galería se materializaran en la página; contrato mínimo completo aún por formalizar | Sí |
| Clasificación automática | Recomendar/decidir selección | ⚪ Fuera del MVP | No bloquea | No |

## Regla de actualización

Cada modificación significativa debe actualizar esta matriz, registrar la decisión correspondiente y crear un commit identificable.

## Último cambio significativo

La prueba real del CSV Wix reveló que `Galería General` y `Hero Imagen` NO tienen el mismo contrato físico: `Galería General` es JSON serializado de un array de objetos multimedia Wix, mientras `Hero Imagen` es directamente una URI `wix:image://...`. `ProyectoManager` fue corregido para no ejecutar `JSON.parse()` sobre Hero. La URI completa del Hero se conserva en `foto.wixHeroSrc`, mientras que la Galería conserva sus objetos Wix completos en `foto.wixMedia`.

La aplicación todavía debe validar esta reconstrucción en `MUBATO Test` después de sincronizar el nuevo commit.
