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
| `Exportadores/actualizadorCSV.js` | Escribir resultados en CSV | 🟡 Parcial | **Contrato V0.1 definido; implementación pendiente** | Sí |
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
| **Contrato de salida CSV V0.1** | Definir propiedad de campos y reglas de preservación | 🟢 **Definido** | `docs/01_Arquitectura/CONTRATO_SALIDA_CSV_V0.1.md` | Sí |
| Clasificación automática | Recomendar/decidir selección | ⚪ Fuera del MVP | No bloquea | No |

## Regla de actualización

Cada modificación significativa debe actualizar esta matriz, registrar la decisión correspondiente y crear un commit identificable.

## Último cambio significativo

Se formalizó el **Contrato de Salida CSV V0.1**. La salida debe partir de la fila Wix existente, preservarla y modificar únicamente campos propiedad de Companion. Se congeló además la diferencia física entre `Galería General` (JSON serializado de objetos multimedia Wix) y `Hero Imagen` (URI `wix:image://...`). Los campos técnicos Wix y la identidad multimedia existente quedan fuera de la escritura editorial.

## Próximo punto de validación

Implementar el adaptador de salida conforme al contrato y probarlo primero sobre una sola fila, verificando que los campos no propiedad de Companion permanezcan byte/valor-equivalentes cuando sea posible y que las referencias multimedia Wix no sean reconstruidas.
