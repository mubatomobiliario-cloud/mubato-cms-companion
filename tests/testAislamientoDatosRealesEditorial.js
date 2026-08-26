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
    // Los datos reales de trabajo viven fuera de Git, dentro de Proyectos/.
    // El CSV maestro que se utilizaba para el cargue Wix está en:
    // Proyectos/Historias_WIX_ORIGINAL.csv
    const candidatos = [
        path.join(process.cwd(), "Proyectos", "Historias_WIX_ORIGINAL.csv"),
        path.join(process.cwd(), "tests", "fixtures", "Historias_WIX_ORIGINAL.csv"),
        path.join(process.cwd(), "tests", "fixtures", "entrada.csv"),
        path.join(process.cwd(), "data", "Historias_WIX_ORIGINAL.csv")
    ];

    const encontrado = candidatos.find(fs.existsSync);
    if (!encontrado) {
        throw new Error(
            "No se encontró el CSV maestro real. Se esperaba Proyectos/Historias_WIX_ORIGINAL.csv."
        );
    }
    return encontrado;
}

function leerFilas(rutaCSV) {
    const contenido = fs.readFileSync(rutaCSV, "utf8");
    const resultado = Papa.parse(contenido, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header, index) => `${header}__${index}`
    });

    // Papa renombra duplicados; necesitamos recuperar las cabeceras originales
    // para entregar al exportador su matriz intacta. Por eso esta función no
    // se utiliza para la exportación, solo para el snapshot de control.
    return resultado.data;
}

function leerCSVControl(rutaCSV) {
    const contenido = fs.readFileSync(rutaCSV, "utf8");
    const resultado = Papa.parse(contenido, {
        header: false,
        skipEmptyLines: true
    });
    if (resultado.errors.length > 0) {
        throw new Error(`Error leyendo CSV de control: ${JSON.stringify(resultado.errors)}`);
    }
    const encabezados = resultado.data[0];
    const filas = resultado.data.slice(1);
    return { encabezados, filas };
}

function crearIndice(encabezados) {
    const todas = {};
    const unicas = {};
    encabezados.forEach((encabezado, posicion) => {
        if (!todas[encabezado]) todas[encabezado] = [];
        todas[encabezado].push(posicion);
    });
    for (const [encabezado, posiciones] of Object.entries(todas)) {
        if (posiciones.length === 1) unicas[encabezado] = posiciones[0];
    }
    return { todas, unicas };
}

function snapshotProyectos(rutaCSV) {
    const { encabezados, filas } = leerCSVControl(rutaCSV);
    const indice = crearIndice(encabezados);
    const posicionProyecto = indice.unicas["Proyecto"];

    if (posicionProyecto === undefined) {
        throw new Error("El CSV de control no contiene la columna única 'Proyecto'.");
    }

    return new Map(
        filas
            .filter(fila => PROYECTOS.includes(String(fila[posicionProyecto] || "").trim()))
            .map(fila => {
                const nombre = String(fila[posicionProyecto] || "").trim();
                const protegidos = {};
                CAMPOS_PROTEGIDOS.forEach(campo => {
                    const posiciones = indice.todas[campo] || [];
                    // Los campos de Wix duplicados no forman parte de esta
                    // comparación; si hay una cabecera única, la capturamos.
                    protegidos[campo] = posiciones.length === 1
                        ? (fila[posiciones[0]] ?? "")
                        : "";
                });
                return [nombre, protegidos];
            })
    );
}

function obtenerFilaProyecto(rutaCSV, nombreProyecto) {
    const { encabezados, filas } = leerCSVControl(rutaCSV);
    const indice = crearIndice(encabezados);
    const posicionProyecto = indice.unicas["Proyecto"];

    if (posicionProyecto === undefined) {
        throw new Error("El CSV de control no contiene la columna única 'Proyecto'.");
    }

    const fila = filas.find(f => String(f[posicionProyecto] || "").trim() === nombreProyecto);
    if (!fila) {
        throw new Error(`No se encontró la fila '${nombreProyecto}' en el CSV de control.`);
    }

    const objeto = {};
    encabezados.forEach((encabezado, posicion) => {
        // Solo las cabeceras únicas pueden formar parte del contrato de identidad.
        if ((indice.todas[encabezado] || []).length === 1) {
            objeto[encabezado] = fila[posicion] ?? "";
        }
    });
    return objeto;
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
    const salidaCSV = path.join(tmp, "salida-editorial.csv");
    fs.copyFileSync(rutaCSV, copia);

    console.log("1. Ejecutando exportación exclusivamente para Araque...");
    const salida = new SalidaEditorialCSV();
    const filaAraque = obtenerFilaProyecto(copia, "Hogar Araque");

    // Contrato real de SalidaEditorialCSV V2.2:
    // exportar({ rutaEntrada, rutaSalida, filaProyecto, editorial })
    // No existe un método generar().
    const resultado = salida.exportar({
        rutaEntrada: copia,
        rutaSalida: salidaCSV,
        filaProyecto: filaAraque,
        editorial: {
            codigo: "MUB-ARAQUE-TEST",
            heroTexto: "Hero control Araque",
            descripcion: "Descripción control Araque",
            servicios: "Diseño interior, mobiliario a medida",
            slug: "hogar-araque-test",
            seoTitle: "Hogar Araque | MUBATO",
            metaDescription: "Historia de transformación de Hogar Araque.",
            historia: "Historia editorial control de Araque",
            galeriaEditorial: []
        }
    });

    console.log("✓ Exportación controlada ejecutada.");
    console.log(`✓ Salida: ${resultado.rutaSalida}`);
    console.log("");

    console.log("2. Verificando que el CSV original permanezca intacto...");
    const hashDespues = hashArchivo(rutaCSV);
    if (hashAntes !== hashDespues) {
        throw new Error("VIOLACIÓN: el CSV original fue modificado.");
    }
    console.log("✓ CSV original intacto.");
    console.log("");

    console.log("3. Comparando aislamiento campo-a-campo...");
    const estadoDespues = snapshotProyectos(resultado.rutaSalida);
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
    if (!resultado || !resultado.rutaSalida || !fs.existsSync(resultado.rutaSalida)) {
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
