const Parser = require("../src/core/parser");
const ExpedienteProyecto = require("../src/direccionEditorial/expedienteProyecto");
const ConstructorContexto = require("../src/direccionEditorial/ConstructorContexto");
const OpenAIClient = require("../src/direccionEditorial/openAIClient");

async function ejecutar() {
    const rutaAraque = "Proyectos/Araque";
    const parser = new Parser();
    const proyecto = parser.importarCarpeta(rutaAraque);

    // Reutilizamos exactamente las observaciones Vision obtenidas
    // en la prueba controlada de hoy para NO volver a pagar Vision.
    const observaciones = {
        "IMG_1072.jpeg": {
            espacio: "Alcoba Principal",
            tipo: "",
            plano: "General",
            estilo: "Contemporáneo",
            materiales: ["Madera Natural", "Mármol", "Vidrio", "Metal Negro"],
            colores: ["Blanco", "Beige", "Gris", "Marrón", "Negro"],
            elementos: ["Cama", "Almohada", "Televisor", "Persiana", "Ventana", "Mesa de noche", "Lámpara", "Gabinete"],
            iluminacion: "Mixta",
            sensacion: "Calidez",
            confianza: 94
        },
        "IMG_1073.jpeg": {
            espacio: "Alcoba Principal",
            tipo: "",
            plano: "General",
            estilo: "Contemporáneo",
            materiales: ["Madera Natural", "Vidrio", "Tela"],
            colores: ["Blanco", "Beige", "Negro", "Marrón", "Gris"],
            elementos: ["Cama", "Televisor", "Persiana", "Ventana", "Mueble suspendido", "Armario", "Lámpara", "Panel"],
            iluminacion: "Mixta",
            sensacion: "Calma",
            confianza: 90
        },
        "IMG_1076.jpeg": {
            espacio: "Alcoba Principal",
            tipo: "",
            plano: "General",
            estilo: "Contemporáneo",
            materiales: ["Madera Natural", "Piedra", "Textil", "Vidrio", "Metal"],
            colores: ["Blanco", "Beige", "Gris", "Marrón"],
            elementos: ["Cama", "Almohada", "Armario", "Mesa de noche", "Repisa", "Lámpara", "Persiana", "Ventana", "Cabecero", "Interruptor", "Control remoto"],
            iluminacion: "Mixta",
            sensacion: "Calma",
            confianza: 90
        }
    };

    proyecto.fotografias.forEach(foto => {
        const datos = observaciones[foto.nombre];
        if (!datos) return;
        Object.assign(foto, datos, { analizada: true });
    });

    proyecto.expediente = new ExpedienteProyecto().construir(proyecto);

    const constructor = new ConstructorContexto();
    const prompt = constructor.construirHistoria(proyecto);

    console.log("\n======================================");
    console.log("PRIMERA GENERACIÓN EDITORIAL CONTROLADA");
    console.log("HISTORIA — HOGAR ARAQUE");
    console.log("======================================\n");
    console.log("Vision llamada en esta prueba: NO");
    console.log("Generación de texto IA: SÍ — 1 llamada");
    console.log("\nContexto construido:", prompt.length, "caracteres");
    console.log("\nSolicitando HISTORIA...\n");

    const openAI = new OpenAIClient();
    const historia = (await openAI.generarTexto(prompt)).trim();

    console.log("\n======================================");
    console.log("HISTORIA GENERADA");
    console.log("======================================\n");
    console.log(historia);
    console.log("\n======================================");
    console.log("FIN — No se actualizó CSV ni Wix");
    console.log("======================================\n");
}

ejecutar().catch(error => {
    console.error("\nERROR EN LA PRUEBA:\n", error);
    process.exit(1);
});
