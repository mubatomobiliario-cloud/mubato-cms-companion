const fs = require("fs");
const path = require("path");

const Parser = require("../../src/core/parser");
const OpenAIClient = require("../../src/direccionEditorial/openAIClient");
const PromptVision = require("../../src/vision/promptVision");

function obtenerArgumentos() {
    const carpeta = process.argv[2];
    const rutaCSV = process.argv[3];

    if (!carpeta || !rutaCSV) {
        throw new Error(
            'Uso: node tests/laboratorio/runVisionPortfolio.js "/ruta/a/carpeta" "/ruta/a/carpeta/archivo.csv"'
        );
    }

    return {
        carpeta: path.resolve(carpeta),
        rutaCSV: path.resolve(rutaCSV)
    };
}

async function main() {
    const { carpeta, rutaCSV } = obtenerArgumentos();

    if (!fs.existsSync(carpeta)) {
        throw new Error(`No existe la carpeta: ${carpeta}`);
    }

    if (!fs.existsSync(rutaCSV)) {
        throw new Error(`No existe el CSV: ${rutaCSV}`);
    }

    const parser = new Parser();
    const proyecto = parser.importarCarpeta(carpeta, rutaCSV);

    if (proyecto.flujoEditorial !== "EDITORIAL_PORTFOLIO") {
        throw new Error(
            `El CSV no corresponde a Portfolio. Flujo detectado: ${proyecto.flujoEditorial}`
        );
    }

    const fotografias = proyecto.obtenerGaleria().map(foto => ({
        nombre: foto.nombre,
        ruta: foto.ruta
    }));

    if (fotografias.length === 0) {
        throw new Error("La galería Portfolio no contiene fotografías.");
    }

    const openAI = new OpenAIClient();
    const promptVision = new PromptVision();
    const prompt = promptVision.construir();
    const observacionesVision = [];

    console.log("======================================");
    console.log("LABORATORIO VISION — PORTFOLIO");
    console.log("======================================");
    console.log(`Proyecto: ${proyecto.nombre}`);
    console.log(`CSV: ${rutaCSV}`);
    console.log(`Fotografías de galería: ${fotografias.length}`);
    console.log(`Hero independiente: ${proyecto.obtenerHero()?.nombre || "NINGUNO"}`);
    console.log("");

    for (let i = 0; i < fotografias.length; i++) {
        const foto = fotografias[i];
        console.log(`[${i + 1}/${fotografias.length}] ${foto.nombre}`);

        const resultado = await openAI.analizarImagen(foto.ruta, prompt);

        let datos;
        try {
            datos = JSON.parse(resultado.texto);
        } catch (error) {
            throw new Error(
                `Vision devolvió JSON inválido para ${foto.nombre}: ${error.message}`
            );
        }

        observacionesVision.push({
            fotografia: foto.nombre,
            analizada: true,
            espacio: datos.espacio || null,
            tipo: datos.tipo || null,
            plano: datos.plano || null,
            estilo: datos.estilo || null,
            materiales: Array.isArray(datos.materiales) ? datos.materiales : [],
            colores: Array.isArray(datos.colores) ? datos.colores : [],
            elementos: Array.isArray(datos.elementos) ? datos.elementos : [],
            iluminacion: datos.iluminacion || null,
            sensacion: datos.sensacion || null,
            observaciones: datos.observaciones || "",
            confianza: typeof datos.confianza === "number" ? datos.confianza : null,
            telemetria: resultado.telemetria || null
        });

        console.log("✓ Evidencia capturada");
        console.log("");
    }

    const evidencia = {
        version: "LAB-V1",
        proyecto: {
            nombre: proyecto.nombre,
            ciudad: proyecto.ciudad,
            categoria: proyecto.categoria,
            cliente: proyecto.cliente,
            observaciones: proyecto.observaciones
        },
        seleccionEditorial: {
            galeria: fotografias.map(foto => ({ nombre: foto.nombre }))
        },
        observacionesVision
    };

    const salida = path.join(
        carpeta,
        `${proyecto.nombre}.evidencia-visual.json`
    );

    fs.writeFileSync(
        salida,
        JSON.stringify(evidencia, null, 2),
        "utf8"
    );

    console.log("======================================");
    console.log("VISION LABORATORIO FINALIZADO");
    console.log("======================================");
    console.log(`✓ Evidencia: ${salida}`);
    console.log(`✓ Fotografías analizadas: ${observacionesVision.length}`);
    console.log(`✓ Llamadas Vision: ${openAI.obtenerTelemetria().llamadas}`);
    console.log("");
    console.log("IMPORTANTE: este runner no ejecuta Editorial IA.");
}

main().catch(error => {
    console.error("✗ Laboratorio Vision detenido:", error.message);
    process.exit(1);
});
