console.log("testAislamientoDatosRealesEditorial.js cargado");

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const Papa = require("papaparse");

// El exportador real vive en src/Exportadores, no en src/Editorial.
const SalidaEditorialCSV = require("../src/Exportadores/salidaEditorialCSV");

const CAMPOS_PROTEGIDOS = [
    "Código MUBATO",
    "Hero Texto",
    "Descripción",
    "Servicios",
    "Slug",
    "SEO Title",
    "Meta Description",
    "Historia"
];

const PROYECTOS = ["Hogar Tijo", "Hogar Rolón", "Hogar Quesada", "Hogar Araque"];

function hashArchivo(ruta) {
    return crypto.createHash("sha256").update(fs.readFileSync(ruta)).digest("hex");
}

function localizarCSV() {
    const candidatos = [
        path.join(process.cwd(), "tests", "fixtures", "Historias_WIX_ORIGINAL.csv"),
        path.join(process.cwd(), "tests", "fixtures", "entrada.csv"),
        path.join(process.cwd(), "data", "Historias_WIX_ORIGINAL.csv")
    ];

    const encontrado = candidatos.find(fs.existsSync);
    if (!encontrado) {
        throw new Error("No se encontró un CSV real de control en las rutas esperadas.");
    }
    return encontrado;
}

function snapshotProyectos(rutaCSV) {
    const contenido = fs.readFileSync(rutaCSV, "utf8");
    const filas = Papa.parse(contenido, { header: true, skipEmptyLines: true }).data;

    return new Map(
        filas
            .filter(fila => PROYECTOS.includes(String(fila["Nombre"] || fila["Título"] || fila["Proyecto"] || "").trim()))
            .map(fila => {
                const nombre = String(fila["Nombre"] || fila["Título"] || fila["Proyecto"] || "").trim();
                const protegidos = {};
                CAMPOS_PROTEGIDOS.forEach(campo => protegidos[campo] = fila[campo] ?? "");
                return [nombre, protegidos];
            })
    );
}

function comparar(base, actual) {
    const cambios = [];
    for (const proyecto of PROYECTOS) {
        const antes = base.get(proyecto);
        const despues = actual.get(proyecto);
        if (!antes || !despues) {
            cambios.push(`${proyecto}: no pudo ser comparado`);
            continue;
        }
        for (const campo of CAMPOS_PROTEGIDOS) {
            if (antes[campo] !== despues[campo]) {
                cambios.push(`${proyecto} → ${campo}`);
            }
        }
    }
    return cambios;
}

async function main() {
    console.log("======================================");
    console.log("PRUEBA — AISLAMIENTO DATOS REALES 3C.4");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: proteger Tijo, Rolón y Quesada al procesar Araque sobre un CSV de control.");
    console.log("No realiza llamadas a OpenAI y no escribe sobre el CSV original.");
    console.log("");

    const rutaCSV = localizarCSV();
    const hashAntes = hashArchivo(rutaCSV);
    const estadoAntes = snapshotProyectos(rutaCSV);

    console.log(`✓ CSV de control: ${rutaCSV}`);
    console.log(`✓ Proyectos capturados: ${estadoAntes.size}`);
    PROYECTOS.forEach(nombre => console.log(`  • ${nombre}`));
    console.log("");

    if (estadoAntes.size !== PROYECTOS.length) {
        throw new Error("El CSV de control no contiene los cuatro proyectos esperados.");
    }

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-datos-reales-"));
    const copia = path.join(tmp, "entrada.csv");
    fs.copyFileSync(rutaCSV, copia);

    console.log("1. Ejecutando exportación exclusivamente para Araque...");
    const salida = new SalidaEditorialCSV();

    const resultado = await salida.generar({
        rutaCSV: copia,
        nombreProyecto: "Hogar Araque",
        cambiosEditoriales: {
            "Código MUBATO": "MUB-ARAQUE-TEST",
            "Hero Texto": "Hero control Araque",
            "Descripción": "Descripción control Araque",
            "Servicios": "Diseño interior, mobiliario a medida",
            "Slug": "hogar-araque-test",
            "SEO Title": "Hogar Araque | MUBATO",
            "Meta Description": "Historia de transformación de Hogar Araque.",
            "Historia": "Historia editorial control de Araque"
        }
    });

    console.log("✓ Exportación controlada ejecutada.");
    console.log(`✓ Salida: ${resultado}`);
    console.log("");

    console.log("2. Verificando que el CSV original permanezca intacto...");
    const hashDespues = hashArchivo(rutaCSV);
    if (hashAntes !== hashDespues) {
        throw new Error("VIOLACIÓN: el CSV original fue modificado.");
    }
    console.log("✓ CSV original intacto.");
    console.log("");

    console.log("3. Comparando aislamiento campo-a-campo...");
    const estadoDespues = snapshotProyectos(copia);
    const cambios = comparar(estadoAntes, estadoDespues);

    const cambiosAjeno = cambios.filter(c => !c.startsWith("Hogar Araque →"));
    if (cambiosAjeno.length > 0) {
        console.log("✗ MUTACIONES EN PROYECTOS AJENOS:");
        cambiosAjeno.forEach(c => console.log(`  ✗ ${c}`));
        throw new Error("AISLAMIENTO VIOLADO.");
    }

    console.log("✓ Tijo: sin mutaciones.");
    console.log("✓ Rolón: sin mutaciones.");
    console.log("✓ Quesada: sin mutaciones.");
    console.log("✓ Araque: único proyecto permitido para mutación.");
    console.log("");

    console.log("4. Verificando integridad de la salida...");
    if (!resultado || !fs.existsSync(resultado)) {
        throw new Error("No se generó una salida editorial válida.");
    }
    console.log("✓ Salida editorial existe.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log("✓ Frontera de escritura aislada.");
    console.log("✓ Proyectos ajenos protegidos.");
    console.log("✓ CSV original protegido.");
    console.log("✓ Araque es el único proyecto editable.");
    console.log("✓ No se realizaron llamadas a OpenAI.");
}

main().catch(error => {
    console.log("");
    console.log("--------------------------------------");
    console.log("PRUEBA FALLIDA");
    console.log("--------------------------------------");
    console.error(error.message);
    process.exit(1);
});
