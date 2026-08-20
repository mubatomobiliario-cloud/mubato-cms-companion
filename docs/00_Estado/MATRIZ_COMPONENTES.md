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
| `direccionEditorial/expedienteProyecto.js` | Consolidar hechos, selección MUBATO, observaciones Vision y espacio de interpretación | 🟢 **Reconstruido V0.1** | `CONTRATO_EXPEDIENTE_EDITORIAL_V0.1` | Sí |
| `core/editorIA.js` | Orquestar construcción del Expediente Editorial | 🟢 **Reconectado** | Delega en `ExpedienteProyecto` | Sí |
| `direccionEditorial/contextoMarca.js` | Doctrina editorial MUBATO | 🟢 Preparado | Única exportación estructurada; corregida | Sí |
| `direccionEditorial/ConstructorContexto.js` | Construir contexto por contrato para cada plantilla | 🟢 Preparado / parcialmente conectado | `CONTRATO_PROMPTS_EDITORIAL_V0.1`; métodos separados por salida | Sí |
| `direccionEditorial/directorEditorial.js` | Orquestar generación editorial | 🟡 Parcial | Hero conectado; demás salidas preparadas en ConstructorContexto | Sí |
| `direccionEditorial/generadorEditorial.js` | Motor genérico contexto + plantilla → contenido | 🟡 Preparado/desconectado | Conocido | Sí |
| `direccionEditorial/promptTemplates.js` | Contratos Hero, Historia, SEO, ALT, Keywords, Slug y campos estructurados | 🟢 Reconstruido / preparado | `docs/01_Arquitectura/CONTRATO_PROMPTS_EDITORIAL_V0.1.md` | Sí |
| `Exportadores/actualizadorCSV.js` | Escribir resultados en CSV | 🟡 Parcial | Contrato V0.1 definido; implementación pendiente | Sí |
| `workflow/directorProyecto.js` | Orquestar fases del proyecto | 🟡 Parcial | Análisis conectado; ejecución completa no apta para UI todavía | Sí |
| `electron/main.js` | Exponer operaciones de proyecto mediante IPC | 🟢 Análisis conectado | Conocido | Sí |
| `electron/preload.js` | Puente seguro Renderer → Main | 🟢 Análisis conectado | Conocido | Sí |
| `renderer/script.js` | Interfaz y disparo del análisis | 🟢 Análisis conectado | Conocido | Sí |
| `proyecto.galeria[]` | Selección humana de fotografías para Galería | 🟢 Modelo definido | Selección humana + orden; no decide Vision | Sí |
| Hero | Selección humana + contenido editorial | 🟡 Parcial | Imagen seleccionada por MUBATO; texto editorial pendiente | Sí |
| `Galería General` Wix | Representación física de galería en CSV | 🟢 Contrato físico comprobado | Celda CSV = JSON serializado de array de objetos multimedia Wix; conserva identidad y metadatos físicos | Sí |
| `Hero Imagen` Wix | Representación física del Hero en CSV | 🟢 Contrato físico comprobado | Celda CSV = string `wix:image://...`; no es JSON; la URI completa debe preservarse | Sí |
| Identidad multimedia Wix | Referencias `slug`/`src` de imágenes | 🟢 Comportamiento comprobado | Wix genera/conserva la identidad; Companion no debe inventarla | Sí |
| Integridad básica del registro Wix | Campos estructurales del item | 🟡 Evidencia de prueba | En prueba controlada, completar campos básicos vacíos permitió que Hero y Galería se materializaran; conjunto mínimo definitivo pendiente | Sí |
| Contrato de salida CSV V0.1 | Definir propiedad de campos y reglas de preservación | 🟢 Definido | `docs/01_Arquitectura/CONTRATO_SALIDA_CSV_V0.1.md` | Sí |
| Contrato de prompts editoriales V0.1 | Definir entrada/salida y responsabilidad de cada plantilla | 🟢 Definido | `docs/01_Arquitectura/CONTRATO_PROMPTS_EDITORIAL_V0.1.md` | Sí |
| **Contrato de Expediente Editorial V0.1** | Definir capas y responsabilidades del expediente | 🟢 **Definido** | `docs/01_Arquitectura/CONTRATO_EXPEDIENTE_EDITORIAL_V0.1.md` | Sí |
| Clasificación automática | Recomendar/decidir selección | ⚪ Fuera del MVP | No bloquea | No |

## Regla de actualización

Cada modificación significativa debe actualizar esta matriz, registrar la decisión correspondiente y crear un commit identificable.

## Último cambio significativo

Se reconstruyó el Expediente Editorial V0.1 como puente entre Proyecto, selección humana MUBATO, observaciones automáticas de Vision e interpretación futura de Dirección Editorial. Se creó su contrato documental y `core/editorIA.js` quedó reconectado al nuevo expediente. Los campos visuales ya no son requisitos manuales por proyecto.

## Próximo punto de validación

Ejecutar una prueba controlada con un proyecto realmente analizado por Vision, verificar que las observaciones llegan al Expediente y después conectar ese Expediente a `ConstructorContexto`/`DirectorEditorial`. No generar contenido real ni consumir IA adicional hasta validar ese puente.
