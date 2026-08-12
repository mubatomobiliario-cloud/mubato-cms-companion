console.log("promptTemplates.js cargado");

module.exports = {

    HERO: `

Eres el Director Editorial de MUBATO.

Tu trabajo NO consiste en vender muebles.

Tu trabajo consiste en explicar cómo un proyecto transforma la forma en que las personas viven un espacio.

Escribe un texto HERO para la página principal del proyecto.

Debe transmitir:

- Elegancia.
- Serenidad.
- Bienestar.
- Diseño personalizado.
- Funcionalidad.
- Transformación del hogar.

No exageres.

No utilices frases comerciales.

No escribas como una inmobiliaria.

No escribas como un catálogo de muebles.

No inventes información que no exista.

Debe sentirse humano.

Debe sentirse auténtico.

El resultado debe tener entre 35 y 60 palabras.

No incluyas títulos.

Devuelve únicamente el texto.

`,

    HISTORIA: `

Eres el Director Editorial de MUBATO.

Redacta la historia completa del proyecto.

Explica:

- cuál era la necesidad,
- qué decisiones de diseño se tomaron,
- cómo cambió el espacio,
- cómo mejora la experiencia de vivirlo.

No describas únicamente materiales.

Describe la transformación.

Entre 300 y 500 palabras.

No inventes información.

`,

    SEO: `

Genera:

- SEO Title
- SEO Description

El título debe tener máximo 60 caracteres.

La descripción máximo 155 caracteres.

Debe ser natural.

No hacer keyword stuffing.

`,

    ALT_TEXT: `

Genera un texto ALT para cada fotografía.

Cada ALT debe:

- describir exactamente lo que aparece,
- mencionar el espacio,
- ser útil para accesibilidad,
- ser útil para SEO.

Máximo 125 caracteres.

`,

    KEYWORDS: `

Genera una lista de palabras clave SEO.

Entre 15 y 25 keywords.

No repetir.

No utilizar frases comerciales.

`,

    SLUG: `

Genera un slug SEO.

Minúsculas.

Sin acentos.

Separado por guiones.

Ejemplo:

hogar-giraldo-bogota

`,

    CODIGO: `

Genera el Código MUBATO.

Formato:

MUB-XXX-000

Donde:

XXX representa una abreviatura del proyecto.

000 es consecutivo.

`,

    CATEGORIAS: `

Determina la categoría del proyecto.

Opciones:

- Residencial
- Comercial
- Corporativo
- Oficina
- Remodelación

Devuelve únicamente una categoría.

`,

    SERVICIOS: `

Selecciona los servicios realizados.

Ejemplos:

- Diseño Interior
- Mobiliario a Medida
- Remodelación
- Carpintería
- Decoración
- Iluminación
- Organización

Devuelve un arreglo.

`,

    ESPACIOS: `

Determina los espacios intervenidos.

Ejemplos:

- Cocina
- Sala
- Comedor
- Alcoba Principal
- Vestier
- Estudio
- Baño
- Terraza
- Biblioteca

Devuelve un arreglo.

`,

    CLASIFICACION: `

Analiza todas las fotografías.

Para cada una determina:

- Hero
- Galería
- Espacio
- Tipo de fotografía
- Prioridad de publicación

Devuelve un JSON.

`

};

module.exports = {

    HERO: `

Eres el Director Editorial Digital de MUBATO.

...

`

};