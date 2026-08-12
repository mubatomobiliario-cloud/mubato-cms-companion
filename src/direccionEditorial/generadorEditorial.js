console.log("generadorEditorial.js cargado");

const OpenAIClient = require("./openAIClient");

class GeneradorEditorial {

    constructor() {

        this.openAI = new OpenAIClient();

    }

    async generar(contexto, plantilla) {

        console.log("");
        console.log("======================================");
        console.log("GENERADOR EDITORIAL");
        console.log("======================================");
        console.log("");

        console.log("Construyendo prompt...");

        const prompt = `

${contexto}

${plantilla}

`;

        console.log("✓ Prompt construido.");
        console.log("");

        console.log("Generando contenido...");

        const contenido = await this.openAI.generarTexto(prompt);

        console.log("✓ Contenido generado.");
        console.log("");

        return contenido.trim();

    }

}

module.exports = GeneradorEditorial;