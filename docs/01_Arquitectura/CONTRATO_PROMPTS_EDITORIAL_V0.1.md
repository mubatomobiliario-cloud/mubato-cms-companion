# MUBATO CMS Companion — Contrato de Prompts Editorial V0.1

## Propósito

Definir qué información recibe cada plantilla de Dirección Editorial y qué responsabilidad tiene. Este contrato separa el conocimiento del proyecto de las instrucciones de generación y evita que una plantilla tome decisiones que pertenecen a otra fase.

## Principios congelados

1. **MUBATO selecciona Hero y Galería.**
2. **Vision observa; no decide selección ni orden de publicación.**
3. Las plantillas editoriales no reconstruyen formatos físicos de Wix.
4. El contexto de marca proviene de `contextoMarca.js`.
5. El expediente del proyecto proviene de las observaciones consolidadas.
6. La ausencia de evidencia debe producir `Sin información`, `PENDIENTE` o un arreglo vacío según el contrato; nunca datos inventados.

## Matriz de contratos

| Plantilla | Entrada principal | Salida | Estado |
|---|---|---|---|
| `HERO` | Proyecto + Expediente + Marca | Texto HERO 35–60 palabras | Preparada |
| `HISTORIA` | Proyecto + Expediente + Marca | Historia 300–500 palabras | Preparada |
| `SEO` | Proyecto + Historia + Marca | JSON `{seoTitle, metaDescription}` | Preparada |
| `ALT_TEXT` | Proyecto + Fotografía + observación Vision + Marca | ALT ≤125 caracteres | Preparada |
| `KEYWORDS` | Proyecto + Historia + Expediente + Marca | JSON `{keywords: []}` | Preparada |
| `SLUG` | Proyecto + Marca | Slug | Preparada |
| `CODIGO` | Proyecto + regla de código | Código o `PENDIENTE` | Preparada; consecutivo externo aún no definido |
| `CATEGORIAS` | Proyecto + evidencia | Una categoría o `PENDIENTE` | Preparada |
| `SERVICIOS` | Proyecto + evidencia | JSON `{servicios: []}` | Preparada |
| `ESPACIOS` | Proyecto + Expediente | JSON `{espacios: []}` | Preparada |

## Fuera del contrato editorial

### Selección de fotografías

No existe una plantilla editorial que decida `esHero`, `enGaleria` ni el orden de `proyecto.galeria[]`. Esas decisiones pertenecen a MUBATO y llegan al Companion desde el CSV/proyecto importado.

### Formato Wix

No corresponde a `promptTemplates.js` generar `wix:image://...`, objetos multimedia Wix, IDs, `slug`, `src` ni estructuras de `Galería General`. Eso pertenece al modelo de datos/importador y al adaptador CSV.

## Contexto de marca

`contextoMarca.js` es una única fuente estructurada. No debe existir un segundo `module.exports` que la sobrescriba.

## Estado de conexión

La reconstrucción de `promptTemplates.js` y `ConstructorContexto.js` deja los contratos preparados. Esto **no significa que todas las plantillas estén conectadas al flujo UI ni que hayan consumido IA**. La generación real sigue siendo una fase posterior de integración y prueba.
