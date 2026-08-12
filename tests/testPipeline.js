const path = require("path");

const Parser = require("../src/core/parser");

const DirectorProyecto = require("../src/workflow/directorProyecto");


async function main() {

    console.clear();

    console.log("");
    console.log("======================================");
    console.log("MUBATO COMPANION");
    console.log("PIPELINE DE PRUEBA");
    console.log("======================================");
    console.log("");

    //--------------------------------------------------
    // 1. Importar proyecto
    //--------------------------------------------------

    const parser = new Parser();

        const carpetaProyecto = path.join(
        __dirname,
        "..",
        "Proyectos",
        "Andrés Giraldo"
    );

    console.log("Importando proyecto...");

        const proyecto = parser.importarCarpeta(
    carpetaProyecto
    );

    console.log("✓ Proyecto importado.");
    console.log("");



    console.log("✓ Proyecto importado.");
    console.log("");

    //--------------------------------------------------
    // 2. Ejecutar Companion
    //--------------------------------------------------

    const directorProyecto = new DirectorProyecto();

    const resultado = await directorProyecto.ejecutar(

        proyecto

    );

    //--------------------------------------------------
    // 3. Resumen
    //--------------------------------------------------

    console.log("");
    console.log("======================================");
    console.log("RESUMEN");
    console.log("======================================");
    console.log("");

    console.log("Proyecto:");
    console.log(resultado.nombre);

    console.log("");

    console.log("Cliente:");
    console.log(resultado.cliente);

    console.log("");

    console.log("Ciudad:");
    console.log(resultado.ciudad);

    console.log("");

    console.log("Fotografías:");
    console.log(resultado.fotografias.length);

    console.log("");

    console.log("======================================");
    console.log("EXPEDIENTE");
    console.log("======================================");
    console.log("");

    console.log(resultado.expediente);

    console.log("");

    console.log("======================================");
    console.log("HERO");
    console.log("======================================");
    console.log("");

    console.log(resultado.hero);

    console.log("");

    console.log("======================================");
    console.log("FIN");
    console.log("======================================");
    console.log("");

}

main().catch(error => {

    console.error("");

    console.error("======================================");

    console.error("ERROR");

    console.error("======================================");

    console.error("");

    console.error(error);

});