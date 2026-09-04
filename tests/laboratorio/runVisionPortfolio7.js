const fs = require("fs");
const path = require("path");

const OpenAIClient = require("../../src/direccionEditorial/openAIClient");
const PromptVision = require("../../src/vision/promptVision");

const FOTOGRAFIAS = [
    "CentrosEntretenimiento_004.JPG",
    "CentrosEntretenimiento_005.JPG",
    "CentrosEntretenimiento_003.JPG",
    "CentrosEntretenimiento_007.JPG",
    "CentrosEntretenimiento_006.JPG",
    "CentrosEntretenimiento_001.JPG",
    "CentrosEntretenimiento_002.JPG"
];

function obtenerCarpeta() {
    const carpeta = process.argv[2];
    if (!carpeta) {
        throw new Error("Uso: node tests/laboratorio/runVisionPortfolio7.js \"/ruta/a/MUBATO - Centros de entretenimiento\"");
    }
    return path.resolve(carpeta);
}

function validarFotografias(carpeta) {
    return FOTOGRAFIAS.map(nombre => {
        const ruta = path.join(carpeta, nombre);
        if (!fs.existsSync(ruta)) {
            throw new Error(`No existe la fotografía requerida: ${ruta}`);
        }
        return { nombre, ruta };
    });
}

async function main() {
    const carpeta = obtenerCarpeta();
    const fotografias = validarFotografias(carpeta);
    const openAI = new OpenAIClient();
    const promptVision = new PromptVision();
    const prompt = promptVision.construir();

    const observacionesVision = [];

    console.log("======================================");
    console.log("LABORATORIO VISION — PORTFOLIO");
    console.log("======================================");
    console.log(`Carpeta: ${carpeta}`);
    console.log(`Fotografías: ${fotografias.length}`);
    console.log("");

    for (let i = 0; i < fotografias.length; i++) {
        const foto = fotografias[i];
        console.log(`[${i + 1}/${fotografias.length}] ${foto.nombre}`);

        const resultado = await openAI.analizarImagen(foto.ruta, prompt);

        let datos;
        try {
            datos = JSON.parse(resultado.texto);
        } catch (error) {
            throw new Error(`Vision devolvió JSON inválido para ${foto.nombre}: ${error.message}`);
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
            nombre: "Centros de Entretenimiento",
            ciudad: "Bogotá",
            categoria: ["Residencial"],
            cliente: "Varios",
            observaciones: "Centros de Entretenimiento"
        },
        seleccionEditorial: {
            galeria: FOTOGRAFIAS.map(nombre => ({ nombre }))
        },
        observacionesVision
    };

    const salida = path.join(carpeta, "Centros de Entretenimiento.evidencia-visual.PORTFOLIO-LAB.json");
    fs.writeFileSync(salida, JSON.stringify(evidencia, null, 2), "utf8");

    console.log("======================================");
    console.log("VISION LABORATORIO FINALIZADO");
    console.log("======================================");
    console.log(`✓ Evidencia: ${salida}`);
    console.log(`✓ Fotografías analizadas: ${observacionesVision.length}`);
    console.log("");
    console.log("IMPORTANTE: este runner no ejecuta Editorial IA.");
}

main().catch(error => {
    console.error("✗ Laboratorio Vision detenido:", error.message);
    process.exit(1);
});
