# MUBATO CMS Companion — Matriz Viva de Componentes

> Documento canónico de estado funcional. Se actualiza con cada cambio significativo.

| Componente | Responsabilidad | Estado | Contrato | Camino crítico |
|---|---|---|---|---|
| `core/parser.js` | Encontrar CSV/proyecto e iniciar importación y bifurcación editorial | 🟢 Comprobado | `Observaciones` vacía → PROYECTO; no vacía → PORTFOLIO | Sí |
| `core/proyectoManager.js` | Construir `Proyecto` desde CSV y carpeta | 🟢 Implementado | Importa datos/fotografías y conserva referencias Wix | Sí |
| `core/proyecto.js` | Modelo central de proyecto, Hero, Galería y fotografías | 🟢 Comprobado | Modelo Companion | Sí |
| `core/fotografiaManager.js` | Ingestar fotografías locales | 🟢 Comprobado | Conocido | Sí |
| `core/fotografia.js` | Modelo de fotografía y contenido editorial | 🟢 Comprobado | Conocido | Sí |
| `vision/analizadorFotografias.js` | Ejecutar observación visual por fotografía | 🟢 Comprobado | Evidencia Vision persistible/reutilizable | Sí |
| `direccionEditorial/expedienteProyecto.js` | Consolidar hechos, selección MUBATO y observaciones Vision | 🟢 Comprobado | Contrato de Expediente Editorial | Sí |
| `direccionEditorial/contextoMarca.js` | Doctrina editorial MUBATO | 🟢 Preparado | Única exportación estructurada | Sí |
| `direccionEditorial/ConstructorContexto.js` | Construir contexto por contrato | 🟢 Comprobado | Contratos editoriales separados | Sí |
| `direccionEditorial/directorEditorial.js` | Orquestar generación editorial | 🟡 Superado en V2.2 mediante `procesadorEditorialV2.js`; integración histórica requiere consolidación | Editorial Proyecto V2.2 | Sí |
| `direccionEditorial/promptHistoriaWebV2.js` | Generar Historia Web contractual | 🟢 Comprobado | Contrato JSON + validador | Sí |
| `direccionEditorial/validadorHistoriaWebV2.js` | Validar Historia Web | 🟢 Comprobado | Contrato estructural/narrativo | Sí |
| `Editorial/procesadorEditorialV2.js` | Pipeline Editorial Proyecto V2.2 | 🟢 Comprobado | 9 llamadas IA en prueba de referencia; evidencia Vision reutilizada | Sí |
| `Exportadores/salidaEditorialCSV.js` | Aplicar contrato de salida al CSV Wix | 🟢 Blindado V2.2 | 8 campos autorizados; 18 protegidos; salida separada | Sí |
| `Exportadores/adaptadorCSVEditorial.js` | Adaptación histórica parcial de salida | 🟡 Legado; no es el contrato final | Sustituido conceptualmente por `salidaEditorialCSV.js` | No |
| `Exportadores/actualizadorCSV.js` | Actualizador histórico | ⚪ Eliminado | No usar | No |
| `workflow/directorProyecto.js` | Orquestar fases de proyecto | 🟡 En consolidación | Análisis separado de escritura CSV | Sí |
| `electron/main.js` | IPC de operaciones de proyecto | 🟢 Análisis conectado | Conocido | Sí |
| `electron/preload.js` | Puente seguro Renderer → Main | 🟢 Análisis conectado | Conocido | Sí |
| `renderer/script.js` | Interfaz y disparo del análisis | 🟢 Análisis conectado | Conocido | Sí |
| `proyecto.galeria[]` | Selección humana de fotografías | 🟢 Comprobado | Selección y orden humanos | Sí |
| `Galería General` Wix | Representación física de galería | 🟢 Comprobado | JSON serializado de objetos multimedia Wix | Sí |
| `Hero Imágen` Wix | Representación física del Hero | 🟢 Comprobado | URI/objeto Wix independiente de Hero Texto | Sí |
| Identidad multimedia Wix | `slug`/`src` | 🟢 Comprobado | Wix conserva/genera; Companion no inventa | Sí |
| Contrato de salida CSV V2.2 | Propiedad y preservación de campos | 🟢 Blindado | 8 campos autorizados; duplicados de `Historias de Transformación` protegidos | Sí |
| Historia Companion | Campo editorial de salida | 🟢 Comprobado | Columna independiente `Historia` | Sí |
| **Bifurcación editorial** | Seleccionar pipeline | 🟢 Comprobado | `Observaciones` vacía → PROYECTO; no vacía → PORTFOLIO | Sí |
| **Editorial Proyecto V2.2** | Narrar transformación | 🟢 Comprobado | Historia + Historia Web + Hero + SEO + foto + estructurados | Sí |
| **Editorial Portfolio** | Describir/posicionar visualmente mobiliario | 🟡 Diseño acordado; implementación pendiente | Contrato por definir | Sí |
| Optimización de consumo IA | Reducir llamadas/tokens sin degradar calidad | 🟡 Pendiente | Línea base: 9 llamadas / 15.290 tokens | Sí |
| Continuidad documental | Estado + matriz + ledger | 🟡 Recuperada manualmente; automatización pendiente de verificación | Tres documentos canónicos | Sí |

## Reglas congeladas

1. MUBATO selecciona Hero y Galería General.
2. Vision observa; no decide selección ni orden.
3. El modelo interno Companion es independiente del formato físico Wix.
4. `Historias de Transformación` es un campo Wix existente y protegido.
5. `Hero Imágen` no se confunde con `Hero Texto`.
6. La salida parte de la fila Wix existente y solo modifica campos autorizados.
7. La bifurcación ocurre en el primer contacto con el CSV.
8. `Observaciones` vacía = PROYECTO.
9. `Observaciones` no vacía = PORTFOLIO.
10. No se interpreta, normaliza ni clasifica el texto de `Observaciones`.
11. Editorial Proyecto y Editorial Portfolio son pipelines distintos.
12. El contrato de salida común se comparte únicamente después de que cada pipeline produzca su contrato editorial interno.

## Último cambio significativo

Se incorporó al `Parser` la decisión binaria de tipo editorial. El último commit funcional es `9247fa9`. El proyecto ya cuenta con Editorial Proyecto V2.2 validada y con el componente de salida CSV V2.2 blindado. Portfolio queda deliberadamente separado para no poner en riesgo el pipeline probado.

## Próximo punto de validación

Definir y probar el contrato de Editorial Portfolio con el mismo rigor contractual usado para Proyecto, manteniendo intactos los campos Wix protegidos y reutilizando la evidencia visual sin una segunda lectura innecesaria.
