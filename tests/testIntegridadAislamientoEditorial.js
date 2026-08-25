console.log("testIntegridadAislamientoEditorial.js cargado");

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
console.log("PRUEBA — INTEGRIDAD Y AISLAMIENTO EDITORIAL 3C.2");
console.log("======================================");
console.log("");
console.log("Objetivo: verificar que procesar Araque no modifica Tijo, Rolón ni Quesada.");
console.log("La comparación de aislamiento es campo-a-campo y no realiza llamadas a OpenAI.");
console.log("");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-aislamiento-"));
const rutaEntrada = path.join(tempDir, "entrada.csv");
const rutaSalida = path.join(tempDir, "salida.csv");

try {
    fs.writeFileSync(rutaEntrada, construirCSV(), "utf8");

    const antesFilas = leerFilas(rutaEntrada);
    const antes = mapaPorProyecto(antesFilas);
    const encabezadosAntes = antesFilas[0];

    console.log("1. Preparando cuatro proyectos de control...");
    for (const proyecto of PROJECTS) {
        assert(antes.has(proyecto), `No se encontró el proyecto de control: ${proyecto}`);
    }
    console.log("✓ Tijo, Rolón, Quesada y Araque presentes.");

    console.log("");
    console.log("2. Ejecutando SalidaEditorialCSV exclusivamente para Araque...");

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

    console.log("✓ Exportación editorial ejecutada.");

    const despuesFilas = leerFilas(rutaSalida);
    const despues = mapaPorProyecto(despuesFilas);
    const encabezadosDespues = despuesFilas[0];

    console.log("");
    console.log("3. Verificando aislamiento campo-a-campo...");

    let mutacionesAjenas = 0;

    for (const proyecto of PROJECTS.filter(nombre => nombre !== TARGET)) {
        const cambios = diferencias(antes.get(proyecto), despues.get(proyecto), encabezadosDespues);

        console.log(`--- ${proyecto} ---`);

        if (cambios.length === 0) {
            console.log(`✓ ${proyecto}: sin cambios.`);
            continue;
        }

        mutacionesAjenas += cambios.length;
        console.log(`✗ ${proyecto}: ${cambios.length} mutación(es).`);
        for (const cambio of cambios) {
            console.log(`  Campo: ${cambio.campo}`);
            console.log(`  ANTES:   ${JSON.stringify(cambio.antes)}`);
            console.log(`  DESPUÉS: ${JSON.stringify(cambio.despues)}`);
        }
    }

    assert(mutacionesAjenas === 0, `AISLAMIENTO VIOLADO: ${mutacionesAjenas} mutación(es) detectadas en proyectos ajenos.`);

    console.log("");
    console.log("4. Verificando que Araque sí recibió los cambios editoriales...");

    const araqueAntes = antes.get(TARGET);
    const araqueDespues = despues.get(TARGET);
    const headers = encabezadosDespues;
    const valor = (fila, campo) => fila[headers.indexOf(campo)];

    const editorial = {
        codigo: "MUB-ARAQUE-NUEVO",
        heroTexto: "Hero editorial nuevo Araque",
        descripcion: "Descripción editorial nueva de Araque",
        slug: "hogar-araque",
        seoTitle: "Hogar Araque | MUBATO",
        metaDescription: "Historia de transformación de Hogar Araque."
    };

    assert(valor(araqueDespues, "Código MUBATO") === editorial.codigo, "Araque no recibió Código MUBATO.");
    assert(valor(araqueDespues, "Hero Texto") === editorial.heroTexto, "Araque no recibió Hero Texto.");
    assert(valor(araqueDespues, "Descripción") === editorial.descripcion, "Araque no recibió Descripción.");
    assert(valor(araqueDespues, "Slug") === editorial.slug, "Araque no recibió Slug.");
    assert(valor(araqueDespues, "SEO Title") === editorial.seoTitle, "Araque no recibió SEO Title.");
    assert(valor(araqueDespues, "Meta Description") === editorial.metaDescription, "Araque no recibió Meta Description.");
    console.log("✓ Los campos editoriales de Araque fueron aplicados.");

    console.log("");
    console.log("5. Verificando protección de campos sensibles de Araque...");

    assert(valor(araqueDespues, "Hero Imágen") === valor(araqueAntes, "Hero Imágen"), "Hero Imágen de Araque fue alterada.");
    assert(valor(araqueDespues, "Historias de Transformación") === valor(araqueAntes, "Historias de Transformación"), "Historias de Transformación de Araque fueron alteradas.");
    assert(valor(araqueDespues, "Ciudad") === valor(araqueAntes, "Ciudad"), "Ciudad de Araque fue alterada.");
    assert(valor(araqueDespues, "Categoría") === valor(araqueAntes, "Categoría"), "Categoría de Araque fue alterada.");
    assert(valor(araqueDespues, "Galería General") === valor(araqueAntes, "Galería General"), "Galería General de Araque fue alterada.");
    console.log("✓ Campos CMS protegidos correctamente.");

    console.log("");
    console.log("6. Verificando que el CSV de entrada permanezca intacto...");

    assert(fs.readFileSync(rutaEntrada, "utf8") === construirCSV(), "El CSV de entrada fue modificado silenciosamente.");
    console.log("✓ CSV de entrada intacto.");

    console.log("");
    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ Araque procesado de forma aislada.");
    console.log("✓ Tijo permanece intacto.");
    console.log("✓ Rolón permanece intacto.");
    console.log("✓ Quesada permanece intacto.");
    console.log("✓ Campos protegidos preservados.");
    console.log("✓ CSV de entrada intacto.");
    console.log("✓ No se realizó ninguna llamada a OpenAI.");
} catch (error) {
    console.log("");
    console.log("--------------------------------------");
    console.log("PRUEBA FALLIDA");
    console.log("--------------------------------------");
    console.error(error.message);
    process.exitCode = 1;
} finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
