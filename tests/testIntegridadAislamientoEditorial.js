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
        "ID",
        "Proyecto",
        "Código MUBATO",
        "Hero Texto",
        "Descripción",
        "Servicios",
        "Slug",
        "SEO Title",
        "Meta Description",
        "Historias de Transformación",
        "Historias de Transformación",
        "Hero Imágen",
        "Ciudad",
        "Categoría",
        "Galería General"
    ];

    const filas = PROJECTS.map((proyecto, indice) => [
        `id-${indice + 1}`,
        proyecto,
        `MUB-${indice + 1}`,
        `Hero original ${proyecto}`,
        `Descripción original ${proyecto}`,
        `Servicios originales ${proyecto}`,
        `slug-${indice + 1}`,
        `SEO original ${proyecto}`,
        `Meta original ${proyecto}`,
        `historia-a-${proyecto}`,
        `historia-b-${proyecto}`,
        `hero-${proyecto}.jpg`,
        "Bogotá",
        "Vivienda",
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

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

console.log("");
console.log("======================================");
console.log("PRUEBA — INTEGRIDAD Y AISLAMIENTO EDITORIAL 3C");
console.log("======================================");
console.log("");
console.log("Objetivo: verificar que procesar Araque no modifica Tijo, Rolón ni Quesada.");
console.log("La prueba utiliza el exportador real y no realiza llamadas a OpenAI.");
console.log("");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-aislamiento-"));
const rutaEntrada = path.join(tempDir, "entrada.csv");
const rutaSalida = path.join(tempDir, "salida.csv");

try {
    fs.writeFileSync(rutaEntrada, construirCSV(), "utf8");

    const antes = mapaPorProyecto(leerFilas(rutaEntrada));

    console.log("1. Preparando cuatro proyectos de control...");
    for (const proyecto of PROJECTS) {
        assert(antes.has(proyecto), `No se encontró el proyecto de control: ${proyecto}`);
    }
    console.log("✓ Tijo, Rolón, Quesada y Araque presentes.");

    console.log("");
    console.log("2. Ejecutando SalidaEditorialCSV exclusivamente para Araque...");

    const filaAraque = {
        ID: "id-4",
        Proyecto: TARGET
    };

    const editorialAraque = {
        codigo: "MUB-ARAQUE-NUEVO",
        heroTexto: "Hero editorial nuevo Araque",
        historia: "Historia editorial nueva de Araque",
        descripcion: "Descripción editorial nueva de Araque",
        servicios: "Diseño interior, mobiliario a medida",
        slug: "hogar-araque",
        seoTitle: "Hogar Araque | MUBATO",
        metaDescription: "Historia de transformación de Hogar Araque."
    };

    const exportador = new SalidaEditorialCSV();
    exportador.exportar({
        rutaEntrada,
        rutaSalida,
        filaProyecto: filaAraque,
        editorial: editorialAraque
    });

    console.log("✓ Exportación editorial ejecutada.");

    const despues = mapaPorProyecto(leerFilas(rutaSalida));

    console.log("");
    console.log("3. Verificando aislamiento de los tres proyectos ajenos...");

    for (const proyecto of PROJECTS.filter(nombre => nombre !== TARGET)) {
        const original = JSON.stringify(antes.get(proyecto));
        const resultado = JSON.stringify(despues.get(proyecto));
        assert(original === resultado, `AISLAMIENTO VIOLADO: ${proyecto} fue modificado.`);
        console.log(`✓ ${proyecto}: sin cambios.`);
    }

    console.log("");
    console.log("4. Verificando que Araque sí recibió los cambios editoriales...");

    const araqueAntes = antes.get(TARGET);
    const araqueDespues = despues.get(TARGET);
    const headers = leerFilas(rutaSalida)[0];

    const valor = (fila, campo) => fila[headers.indexOf(campo)];

    assert(valor(araqueDespues, "Código MUBATO") === editorialAraque.codigo, "Araque no recibió Código MUBATO.");
    assert(valor(araqueDespues, "Hero Texto") === editorialAraque.heroTexto, "Araque no recibió Hero Texto.");
    assert(valor(araqueDespues, "Descripción") === editorialAraque.descripcion, "Araque no recibió Descripción.");
    assert(valor(araqueDespues, "Slug") === editorialAraque.slug, "Araque no recibió Slug.");
    assert(valor(araqueDespues, "SEO Title") === editorialAraque.seoTitle, "Araque no recibió SEO Title.");
    assert(valor(araqueDespues, "Meta Description") === editorialAraque.metaDescription, "Araque no recibió Meta Description.");
    console.log("✓ Los campos editoriales de Araque fueron aplicados.");

    console.log("");
    console.log("5. Verificando protección de campos sensibles de Araque...");

    assert(valor(araqueDespues, "Hero Imágen") === valor(araqueAntes, "Hero Imágen"), "Hero Imágen de Araque fue alterada.");
    assert(valor(araqueDespues, "Historias de Transformación") === valor(araqueAntes, "Historias de Transformación"), "Historias de Transformación de Araque fueron alteradas.");
    assert(valor(araqueDespues, "Ciudad") === valor(araqueAntes, "Ciudad"), "Ciudad de Araque fue alterada.");
    assert(valor(araqueDespues, "Categoría") === valor(araqueAntes, "Categoría"), "Categoría de Araque fue alterada.");
    assert(valor(araqueDespues, "Galería General") === valor(araqueAntes, "Galería General"), "Galería General de Araque fue alterada.");
    console.log("✓ Hero Imágen protegida.");
    console.log("✓ Historias de Transformación protegidas.");
    console.log("✓ Campos CMS no autorizados protegidos.");

    console.log("");
    console.log("6. Verificando que la entrada original permanezca intacta...");

    const entradaDespues = fs.readFileSync(rutaEntrada, "utf8");
    const entradaOriginal = construirCSV();
    assert(entradaDespues === entradaOriginal, "El CSV de entrada fue modificado silenciosamente.");
    console.log("✓ CSV de entrada intacto.");

    console.log("");
    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ Araque puede ser procesado de forma aislada.");
    console.log("✓ Tijo permanece intacto.");
    console.log("✓ Rolón permanece intacto.");
    console.log("✓ Quesada permanece intacto.");
    console.log("✓ Hero Imágen no fue sustituida.");
    console.log("✓ Historias de Transformación no fueron sustituidas.");
    console.log("✓ Galería General no fue sustituida.");
    console.log("✓ El CSV de entrada no fue modificado.");
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
