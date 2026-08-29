const Parser = require("../src/core/parser");

const DirectorProyecto = require("../src/workflow/directorProyecto");

async function ejecutar() {

    const carpeta = process.argv[2];

    if (!carpeta) {

        throw new Error(
            'Uso: node scripts/analizar-proyecto.js "RUTA_DE_LA_CARPETA"'
        );

    }

    console.log("======================================");
    console.log("PROCESAMIENTO REAL DEL PROYECTO");
    console.log("======================================");
    console.log("Carpeta:", carpeta);

    const parser = new Parser();

    const proyecto = parser.importarCarpeta(carpeta);

    console.log("✓ Proyecto importado:", proyecto.nombre);

    console.log(
        "✓ Fotografías:",
        proyecto.obtenerFotografias().length
    );

    console.log("");

    const director = new DirectorProyecto();

    const resultado = await director.ejecutar(proyecto);

    console.log("");

    console.log("======================================");
    console.log("PROYECTO PROCESADO COMPLETAMENTE");
    console.log("======================================");

    console.log("✓ Proyecto:", resultado.nombre);

    console.log(
        "✓ Fotografías analizadas:",
        resultado.obtenerFotografias().filter(f => f.analizada).length
    );

    console.log(
        "✓ Editorial V2.2 completada."
    );

    console.log(
        "✓ Salida editorial:",
        resultado.salidaEditorialCSV.rutaSalida
    );

    console.log("");

    console.log("✓ FLUJO COMPLETO SUPERADO");

}

ejecutar().catch(error => {

    console.error("");

    console.error("✗ PROCESAMIENTO DEL PROYECTO FALLIDO");

    console.error("");

    console.error(error);

    process.exit(1);

});