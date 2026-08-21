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
    console.log("ANÁLISIS DEL PROYECTO — FASE 1");
    console.log("======================================");
    console.log("Carpeta:", carpeta);

    const parser = new Parser();

    const proyecto = parser.importarCarpeta(carpeta);

    console.log("✓ Proyecto importado:", proyecto.nombre);
    console.log(
        "✓ Fotografías:",
        proyecto.obtenerFotografias().length
    );

    const director = new DirectorProyecto();

    console.log("");
    console.log("VISION");
    console.log("");

    const resultado = await director.analizar(proyecto);

    console.log("");
    console.log("======================================");
    console.log("ANÁLISIS VISUAL COMPLETADO");
    console.log("======================================");

    console.log("✓ Proyecto:", resultado.nombre);
    console.log(
        "✓ Fotografías analizadas:",
        resultado.obtenerFotografias().filter(f => f.analizada).length
    );

    console.log("");
    console.log("Ahora podemos ejecutar Editorial V2.1.");
}

ejecutar().catch(error => {

    console.error("");
    console.error("✗ ANÁLISIS DEL PROYECTO FALLIDO");
    console.error("");
    console.error(error);

    process.exit(1);
});
