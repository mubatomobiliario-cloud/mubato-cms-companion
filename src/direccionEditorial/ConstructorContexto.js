console.log("ConstructorContexto.js cargado");

const contextoMarca = require("./contextoMarca");
const promptTemplates = require("./promptTemplates");

class ConstructorContexto {

    construirHero(proyecto) {

        const expediente = proyecto.expediente;

        return `

${contextoMarca}

${promptTemplates.HERO}

====================================================
EXPEDIENTE DEL PROYECTO
====================================================

Proyecto

${proyecto.nombre}

Código

${proyecto.codigo || "Pendiente"}

Cliente

${proyecto.cliente}

Ciudad

${proyecto.ciudad}

Estado

${proyecto.estado}

Categoría

${proyecto.categoria}

====================================================
IDENTIDAD DEL PROYECTO
====================================================

Espacios

${this.lista(expediente.espacios)}

Materiales

${this.lista(expediente.materiales)}

Colores

${this.lista(expediente.colores)}

Elementos

${this.lista(expediente.elementos)}

Estilos

${this.lista(expediente.estilos)}

Iluminación

${this.lista(expediente.iluminacion)}

Sensaciones

${this.lista(expediente.sensaciones)}

====================================================
INSTRUCCIÓN
====================================================

Redacta únicamente el HERO.

No describas cada fotografía.

No enumeres espacios.

Interpreta el proyecto completo.

Escribe como el Director Editorial de MUBATO.

`;

    }

    lista(valores) {

        if (!valores || valores.length === 0) {

            return "Sin información";

        }

        return valores
            .map(item => `• ${item}`)
            .join("\n");

    }

}

module.exports = ConstructorContexto;