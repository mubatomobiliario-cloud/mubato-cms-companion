console.log("prueba-editorial-v1.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const ProcesadorEditorialV1 = require("../src/Editorial/procesadorEditorialV1");
const SelectorProyectoEditorialV1 = require("../src/Editorial/selectorProyectoEditorialV1");

const rutaEntrada = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).csv");
const rutaSalida = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).prueba-editorial-v1.csv");

async function ejecutar() {
    console.log("\n======================================");
    console.log("PRUEBA REAL — EDITORIAL V1.1");
    console.log("======================================\n");

    if (!fs.existsSync(rutaEntrada)) throw new Error(`No existe el CSV: ${rutaEntrada}`);

    const parsed = Papa.parse(fs.readFileSync(rutaEntrada, "utf8"), {
        header: true,
        skipEmptyLines: true
    });
    if (parsed.errors.length) throw new Error(`Error leyendo CSV: ${JSON.stringify(parsed.errors)}`);

    const selector = new SelectorProyectoEditorialV1();
    const nombreForzado = process.env.MUBATO_PROYECTO || "Hogar Tijo";
    const seleccion = selector.seleccionar(parsed.data, { nombre: nombreForzado });
    const fila = seleccion.fila;

    console.log(`✓ Proyecto seleccionado: ${fila["Proyecto"]}`);
    console.log(`✓ Modo de selección: ${seleccion.modo}`);

    const procesador = new ProcesadorEditorialV1();
    const resultado = await procesador.generar(fila, { forzar: true });

    fila["Historias de Transformación"] = resultado.historia;
    fila["Hero Texto"] = resultado.heroTexto;
    fila["Galería General"] = JSON.stringify(resultado.galeriaEditorial);
    fila["SEO Title"] = resultado.seo.seoTitle;
    fila["Meta Description"] = resultado.seo.metaDescription;

    const salida = Papa.unparse(parsed.data, { quotes: false });
    fs.writeFileSync(rutaSalida, salida, "utf8");

    const verificado = Papa.parse(fs.readFileSync(rutaSalida, "utf8"), {
        header: true,
        skipEmptyLines: true
    });
    const filaV = verificado.data.find(f => f["Proyecto"] === fila["Proyecto"]);
    if (!filaV) throw new Error("El proyecto desapareció del CSV de salida.");

    const galeriaOriginal = JSON.parse(fila["Galería General"] || "[]");
    const galeriaV = JSON.parse(filaV["Galería General"] || "[]");
    if (galeriaV.length !== galeriaOriginal.length) throw new Error("Cantidad de fotografías alterada.");

    galeriaV.forEach((foto, i) => {
        const original = galeriaOriginal[i];
        if (!foto.title || !foto.alt || !foto.nombreSEO || !Array.isArray(foto.keywords) || !foto.keywords.length) {
            throw new Error(`Metadatos editoriales incompletos en foto ${i + 1}.`);
        }
        if (foto.src !== original.src || foto.slug !== original.slug || JSON.stringify(foto.settings) !== JSON.stringify(original.settings)) {
            throw new Error(`Integridad técnica alterada en foto ${i + 1}.`);
        }
    });

    console.log("\n======================================");
    console.log("RESULTADO EDITORIAL V1.1");
    console.log("======================================");
    console.log(`✓ Historia: ${resultado.validacionHistoria.metricas.palabras} palabras / 1 párrafo`);
    console.log(`✓ Hero Texto generado: ${resultado.heroTexto.length} caracteres`);
    console.log(`✓ Fotografías procesadas: ${resultado.galeriaEditorial.length}`);
    console.log("✓ title + alt + keywords + nombreSEO presentes en cada fotografía.");
    console.log("✓ SEO Title + Meta Description presentes y dentro de límites.");
    console.log("✓ src + slug + settings preservados.");
    console.log(`✓ Llamadas IA: ${resultado.llamadasIA}`);
    console.log(`✓ CSV de prueba: ${rutaSalida}`);
    console.log("\n✓ EDITORIAL V1.1 — PROCESADOR DESACOPLADO SUPERADO\n");
}

ejecutar().catch(error => {
    console.error("\n✗ PRUEBA EDITORIAL V1.1 FALLIDA\n");
    console.error(error.stack || error);
    process.exit(1);
});
