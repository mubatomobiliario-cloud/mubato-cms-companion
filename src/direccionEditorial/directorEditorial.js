console.log("directorEditorial.js cargado");

const ConstructorContexto = require("./ConstructorContexto");
const OpenAIClient = require("./openAIClient");

class DirectorEditorial {

    constructor() {

        this.ConstructorContexto = new ConstructorContexto();

        this.openAI = new OpenAIClient();

    }

    async generarHero(proyecto) {

        console.log("");
        console.log("======================================");
        console.log("DIRECTOR EDITORIAL");
        console.log("======================================");
        console.log("");

        console.log("Construyendo prompt...");

        const prompt = this.ConstructorContexto.construirHero(proyecto);

        console.log("✓ Prompt construido.");
        console.log("");

        console.log("Solicitando Hero a OpenAI...");

        const hero = await this.openAI.generarTexto(prompt);

        console.log("✓ Hero generado.");
        console.log("");

        proyecto.hero = hero.trim();

        return proyecto;

    }

}

module.exports = DirectorEditorial;