console.log("analizadorFotografias.js cargado");

const OpenAIClient = require("../direccionEditorial/openAIClient");
const PromptVision = require("./promptVision");

class AnalizadorFotografias {

    constructor() {

        this.openAI = new OpenAIClient();
        this.promptVision = new PromptVision();

    }

    async analizar(proyecto) {

        console.log("");
        console.log("======================================");
        console.log("ANALIZADOR DE FOTOGRAFÍAS");
        console.log("======================================");
        console.log("");

        console.log(
            `Fotografías encontradas: ${proyecto.fotografias.length}`
        );

        console.log("");

        for (let i = 0; i < proyecto.fotografias.length; i++) {

            const foto = proyecto.fotografias[i];

            console.log(
                `[${i + 1}/${proyecto.fotografias.length}] ${foto.nombre}`
            );

            await this.analizarFotografia(foto);

            console.log("✓ Análisis completado");
            console.log("");

        }

        console.log("======================================");
        console.log("ANÁLISIS FINALIZADO");
        console.log("======================================");
        console.log("");

        return proyecto;

    }

    async analizarFotografia(foto) {

        const prompt = this.promptVision.construir();

        const datos = await this.openAI.analizarImagenJSON(

            foto.ruta,

            prompt

        );

        foto.espacio = datos.espacio || "";
        foto.tipo = datos.tipo || "";
        foto.plano = datos.plano || "";
        foto.estilo = datos.estilo || "";
        foto.materiales = datos.materiales || [];
        foto.colores = datos.colores || [];
        foto.elementos = datos.elementos || [];
        foto.iluminacion = datos.iluminacion || "";
        foto.sensacion = datos.sensacion || "";
        foto.confianza = datos.confianza || 0;

        foto.analizada = true;

        return foto;

    }

}

module.exports = AnalizadorFotografias;