const Parser = require("../src/core/parser");
const DirectorEditorial = require("../src/ai/directorEditorial");

async function main() {

    const parser = new Parser();

    const proyecto = parser.importarCarpeta(

        "./Proyectos/Andrés Giraldo"

    );

    const director = new DirectorEditorial();


    console.log("");
    console.log(proyecto);
    console.log("");

    await director.generarHero(proyecto);

    console.log("");

    console.log("======================================");

    console.log("HERO GENERADO");

    console.log("======================================");

    console.log("");

    console.log(proyecto.hero);

}

main();