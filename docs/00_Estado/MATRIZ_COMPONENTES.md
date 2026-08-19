# MUBATO CMS Companion — Matriz Viva de Componentes

> Documento canónico de estado funcional. Se actualiza con cada cambio significativo y sirve como referencia de continuidad.

| Componente | Responsabilidad | Estado | Contrato | Camino crítico |
|---|---|---|---|---|
| `core/parser.js` | Encontrar CSV/proyecto e iniciar importación | 🟢 Comprobado | Conocido | Sí |
| `core/proyectoManager.js` | Construir `Proyecto` desde CSV y carpeta | 🟢 Comprobado | Conocido | Sí |
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
| `electron/main.js` | Exponer operaciones de proyecto mediante IPC | 🟡 Parcial | Importación + análisis conectados | Sí |
| `electron/preload.js` | Puente seguro Renderer → Main | 🟢 Análisis conectado | Conocido | Sí |
| `renderer/script.js` | Interfaz y disparo del análisis | 🟢 Análisis conectado | Conocido | Sí |
| `proyecto.galeria[]` | Selección humana de fotografías para Galería | 🟢 Modelo definido | Wix físico conocido | Sí |
| Hero | Selección humana + contenido editorial | 🟡 Parcial | Parcial | Sí |
| Clasificación automática | Recomendar/decidir selección | ⚪ Fuera del MVP | No bloquea | No |

## Regla de actualización

Cada modificación significativa debe actualizar esta matriz, registrar la decisión correspondiente y crear un commit identificable.

## Último cambio significativo

Se conectó el primer tramo ejecutable del pipeline a la aplicación:

`Renderer → preload → IPC → DirectorProyecto.analizar() → Vision → Expediente`

Este tramo es **análisis solamente**. No genera Hero, no modifica el CSV y no altera la selección humana de Hero/Galería.
