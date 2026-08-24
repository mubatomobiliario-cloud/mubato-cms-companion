console.log("testDiagnosticoMutacionEditorial.js cargado");

const fs = require("fs");
const os = require("os");
const path = require("path");
const Papa = require("papaparse");
const SalidaEditorialCSV = require("../src/Exportadores/salidaEditorialCSV");

const PROJECTS = ["Hogar Tijo", "Hogar Rolón", "Hogar Quesada", "Hogar Araque"];
const TARGET = "Hogar Araque";

function construirCSV() {
    const encabezados = [
        "ID", "Proyecto", "Código MUBATO", "Hero Texto", "Descripción",
        "Servicios", "Slug", "SEO Title", "Meta Description",
        "Historias de Transformación", "Historias de Transformación",
        "Hero Imágen", "Ciudad", "Categoría", "Galería General"
    ];

    const filas = PROJECTS.map((proyecto, indice) => [
        `id-${indice + 1}`, proyecto, `MUB-${indice + 1}`,
        `Hero original ${proyecto}`, `Descripción original ${proyecto}`,
        `Servicios originales ${proyecto}`, `slug-${indice + 1}`,
        `SEO original ${proyecto}`, `Meta original ${proyecto}`,
        `historia-a-${proyecto}`, `historia-b-${proyecto}`,
        `hero-${proyecto}.jpg`, "Bogotá", "Vivienda",
        `galeria-${proyecto}.json`
    ]);

    return Papa.unparse([encabezados, ...filas], { quotes: false });
}

function leerFilas(ruta) {
    return Papa.parse(fs.readFileSync(ruta, "utf8"), {
        header: false,
        skipEmptyLines: true
    }).data;
}

function mapaPorProyecto(filas) {
    const encabezados = filas[0];
    const proyectoIndex = encabezados.indexOf("Proyecto");
    return new Map(filas.slice(1).map(fila => [fila[proyectoIndex], fila]));
}

function diferencias(filaAntes, filaDespues, encabezados) {
    const cambios = [];
    const ancho = Math.max(filaAntes?.length || 0, filaDespues?.length || 0, encabezados.length);

    for (let i = 0; i < ancho; i++) {
        const antes = filaAntes?.[i] ?? "";
        const despues = filaDespues?.[i] ?? "";
        if (String(antes) !== String(despues)) {
            cambios.push({
                posicion: i + 1,
                campo: encabezados[i] ?? `(columna ${i + 1})`,
                antes: String(antes),
                despues: String(despues)
            });
        }
    }

    return cambios;
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

console.log("");
console.log("======================================");
console.log("PRUEBA — DIAGNÓSTICO DE MUTACIÓN EDITORIAL 3C.1");
console.log("======================================");
console.log("");
console.log("Objetivo: identificar exactamente qué cambia en un proyecto ajeno al procesar Araque.");
console.log("No realiza llamadas a OpenAI ni modifica archivos originales.");
console.log("");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-mutacion-"));
const rutaEntrada = path.join(tempDir, "entrada.csv");
const rutaSalida = path.join(tempDir, "salida.csv");

try {
    fs.writeFileSync(rutaEntrada, construirCSV(), "utf8");

    console.log("1. Capturando estado BASE...");
    const antesFilas = leerFilas(rutaEntrada);
    const antes = mapaPorProyecto(antesFilas);
    const encabezadosAntes = antesFilas[0];

    for (const proyecto of PROJECTS) {
        assert(antes.has(proyecto), `No se encontró el proyecto de control: ${proyecto}`);
    }
    console.log("✓ Estado BASE capturado para Tijo, Rolón, Quesada y Araque.");

    console.log("");
    console.log("2. Ejecutando exclusivamente Araque...");

    const exportador = new SalidaEditorialCSV();
    exportador.exportar({
        rutaEntrada,
        rutaSalida,
        filaProyecto: { ID: "id-4", Proyecto: TARGET },
        editorial: {
            codigo: "MUB-ARAQUE-NUEVO",
            heroTexto: "Hero editorial nuevo Araque",
            historia: "Historia editorial nueva de Araque",
            descripcion: "Descripción editorial nueva de Araque",
            servicios: "Diseño interior, mobiliario a medida",
            slug: "hogar-araque",
            seoTitle: "Hogar Araque | MUBATO",
            metaDescription: "Historia de transformación de Hogar Araque."
        }
    });
    console.log("✓ Exportación terminada.");

    console.log("");
    console.log("3. Comparando proyecto por proyecto...");

    const despuesFilas = leerFilas(rutaSalida);
    const despues = mapaPorProyecto(despuesFilas);
    const encabezadosDespues = despuesFilas[0];

    for (const proyecto of PROJECTS) {
        const cambios = diferencias(antes.get(proyecto), despues.get(proyecto), encabezadosDespues);

        console.log("");
        console.log(`--- ${proyecto} ---`);

        if (cambios.length === 0) {
            console.log("✓ SIN MUTACIONES");
            continue;
        }

        console.log(`✗ MUTACIONES DETECTADAS: ${cambios.length}`);
        for (const cambio of cambios) {
            console.log(`  Campo: ${cambio.campo}`);
            console.log(`  Posición: ${cambio.posicion}`);
            console.log(`  ANTES:    ${JSON.stringify(cambio.antes)}`);
            console.log(`  DESPUÉS:  ${JSON.stringify(cambio.despues)}`);
            console.log("");
        }
    }

    console.log("======================================");
    console.log("DIAGNÓSTICO FINAL");
    console.log("======================================");

    const mutacionesAjenas = PROJECTS
        .filter(proyecto => proyecto !== TARGET)
        .flatMap(proyecto => diferencias(antes.get(proyecto), despues.get(proyecto), encabezadosDespues)
            .map(cambio => ({ proyecto, ...cambio })));

    const mutacionesAraque = diferencias(antes.get(TARGET), despues.get(TARGET), encabezadosDespues);

    console.log(`✓ Mutaciones legítimas en Araque: ${mutacionesAraque.length}`);
    console.log(`✓ Mutaciones detectadas en proyectos ajenos: ${mutacionesAjenas.length}`);

    if (mutacionesAjenas.length > 0) {
        console.log("");
        console.log("⚠ LA MUTACIÓN NO ES TEÓRICA: ESTOS SON LOS CAMBIOS EXACTOS");
        for (const mutacion of mutacionesAjenas) {
            console.log(`• ${mutacion.proyecto} → ${mutacion.campo} | ${JSON.stringify(mutacion.antes)} → ${JSON.stringify(mutacion.despues)}`);
        }
        console.log("");
        console.log("CONCLUSIÓN: existe una mutación fuera del proyecto objetivo.");
        console.log("No se debe modificar el exportador hasta determinar su origen.");
    } else {
        console.log("");
        console.log("✓ No se reproduce ninguna mutación ajena en este escenario.");
        console.log("CONCLUSIÓN: el fallo anterior debe investigarse como posible problema del fixture o de la comparación.");
    }
} catch (error) {
    console.log("");
    console.log("--------------------------------------");
    console.log("DIAGNÓSTICO INTERRUMPIDO");
    console.log("--------------------------------------");
    console.error(error.message);
    process.exitCode = 1;
} finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
