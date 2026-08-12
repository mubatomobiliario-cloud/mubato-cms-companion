console.log("expedienteProyecto.js cargado");

const NormalizadorVocabulario = require("./normalizadorVocabulario");

class ExpedienteProyecto {

    constructor() {

        this.normalizador = new NormalizadorVocabulario();

    }

    construir(proyecto) {

        console.log("");
        console.log("======================================");
        console.log("EXPEDIENTE DEL PROYECTO");
        console.log("======================================");
        console.log("");

        const expediente = {

            proyecto: proyecto.nombre,

            cliente: proyecto.cliente,

            ciudad: proyecto.ciudad,

            categoria: proyecto.categoria,

            espacios: this.obtenerUnicos(
                proyecto.fotografias,
                "espacio"
            ),

            materiales: this.obtenerListaUnica(
                proyecto.fotografias,
                "materiales",
                "material"
            ),

            colores: this.obtenerListaUnica(
                proyecto.fotografias,
                "colores",
                "color"
            ),

            elementos: this.obtenerListaUnica(
                proyecto.fotografias,
                "elementos",
                "elemento"
            ),

            estilos: this.obtenerUnicos(
                proyecto.fotografias,
                "estilo"
            ),

            iluminacion: this.obtenerUnicos(
                proyecto.fotografias,
                "iluminacion"
            ),

            sensaciones: this.obtenerUnicos(
                proyecto.fotografias,
                "sensacion"
            )

        };

        proyecto.expediente = expediente;

        console.log("✓ Expediente construido.");
        console.log("");

        return expediente;

    }

    //--------------------------------------------------
    // CAMPOS SIMPLES
    //--------------------------------------------------

    obtenerUnicos(fotografias, propiedad) {

        const valores = new Set();

        fotografias.forEach(foto => {

            const valor = foto[propiedad];

            if (
                valor &&
                valor !== "" &&
                valor !== "Otro"
            ) {

                valores.add(valor);

            }

        });

        return Array.from(valores).sort();

    }

    //--------------------------------------------------
    // LISTAS
    //--------------------------------------------------

    obtenerListaUnica(fotografias, propiedad, tipo) {

        const valores = new Set();

        fotografias.forEach(foto => {

            const lista = foto[propiedad];

            if (!Array.isArray(lista)) {

                return;

            }

            lista.forEach(item => {

                if (
                    item &&
                    item !== "" &&
                    item !== "Otro"
                ) {

                    valores.add(item);

                }

            });

        });

        let resultado = Array.from(valores);

        resultado = this.normalizador.normalizarLista(

            resultado,

            tipo

        );

        return resultado.sort();

    }

}

module.exports = ExpedienteProyecto;