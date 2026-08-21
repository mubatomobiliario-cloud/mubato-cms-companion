console.log("prueba-editorial-v2.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const ProcesadorEditorialV2 = require("../src/Editorial/procesadorEditorialV2");
const SelectorProyectoEditorialV1 = require("../src/Editorial/selectorProyectoEditorialV1");

function nombreSeguro(nombre) {
    return String(nombre || "proyecto").trim().replace(/[\\/:*?"<>|]/g, "-");
}

async function ejecutar() {
    console.log("\n======================================");
    console.log("PRUEBA REAL — EDITORIAL V2.1 DESACOPLADA");
    console.log("======================================\n");

    const rutaEntrada = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).csv");
    const rutaSalida = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).prueba-editorial-v2.csv");
    if (!fs.existsSync(rutaEntrada)) throw new Error(`No existe el CSV: ${rutaEntrada}`);

    const parsed = Papa.parse(fs.readFileSync(rutaEntrada, "utf8"), { header: true, skipEmptyLines: true });
    if (parsed.errors.length) throw new Error(`Error leyendo CSV: ${JSON.stringify(parsed.errors)}`);

    const selector = new SelectorProyectoEditorialV1();
    const nombre = process.env.MUBATO_PROYECTO || "Hogar Tijo";
    const seleccion = selector.seleccionar(parsed.data, { nombre });
    const fila = seleccion.fila;
    const galeriaOriginal = JSON.parse(fila["Galería General"] || "[]").map(f => JSON.parse(JSON.stringify(f)));

    console.log(`✓ Proyecto seleccionado: ${fila["Proyecto"]}`);
    console.log(`✓ Modo de selección: ${seleccion.modo}`);

    const rutaEvidencia = process.env.MUBATO_EVIDENCIA_VISUAL || path.resolve(
        path.dirname(rutaEntrada),
        `${nombreSeguro(fila["Proyecto"])}.evidencia-visual.json`
    );

    if (!fs.existsSync(rutaEvidencia)) {
        throw new Error(`No existe evidencia visual persistida: ${rutaEvidencia}. Ejecuta primero el análisis del proyecto; V2.1 no vuelve a analizar fotografías.`);
    }

    const evidencia = JSON.parse(fs.readFileSync(rutaEvidencia, "utf8"));
    const observacionesVision = evidencia.observacionesVision;
    console.log(`✓ Evidencia visual cargada: ${observacionesVision.length} fotografías`);
    console.log("✓ Segunda lectura Vision: DESACTIVADA");

    const procesador = new ProcesadorEditorialV2();
    const resultado = await procesador.generar(fila, { evidenciaVisual: observacionesVision });

    fila["Historias de Transformación"] = resultado.historia;
    fila["Hero Texto"] = resultado.heroTexto;
    fila["Galería General"] = JSON.stringify(resultado.galeriaEditorial);
    fila["SEO Title"] = resultado.seo.seoTitle;
    fila["Meta Description"] = resultado.seo.metaDescription;

    const salida = Papa.unparse(parsed.data, { quotes: false });
    fs.writeFileSync(rutaSalida, salida, "utf8");

    const verificado = Papa.parse(fs.readFileSync(rutaSalida, "utf8"), { header: true, skipEmptyLines: true });
    const filaV = verificado.data.find(f => f["Proyecto"] === fila["Proyecto"]);
    if (!filaV) throw new Error("El proyecto desapareció del CSV de salida.");

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

    const t = resultado.telemetria;
    console.log("\n======================================");
    console.log("RESULTADO EDITORIAL V2.1 DESACOPLADA");
    console.log("======================================");
    console.log(`✓ Historia: ${resultado.validacionHistoria.metricas.palabras} palabras / 1 párrafo`);
    console.log(`✓ Reglas editoriales evaluadas: ${resultado.validacionHistoria.reglas.length}`);
    console.log(`✓ Advertencias no bloqueantes: ${resultado.validacionHistoria.advertencias.length}`);
    console.log(`✓ Hero Texto generado: ${resultado.heroTexto.length} caracteres`);
    console.log(`✓ Fotografías procesadas: ${resultado.galeriaEditorial.length}`);
    console.log("✓ title + alt + keywords + nombreSEO presentes en cada fotografía.");
    console.log("✓ SEO Title + Meta Description presentes y dentro de límites.");
    console.log("✓ src + slug + settings preservados contra la entrada original.");

    console.log("\n--------------------------------------");
    console.log("TELEMETRÍA Y EFICIENCIA");
    console.log("--------------------------------------");
    console.log(`✓ Modelo: ${t.modelo}`);
    console.log(`✓ Llamadas IA: ${t.llamadas.length}`);
    console.log(`✓ Llamadas Vision en fase editorial: 0`);
    console.log(`✓ Llamadas editoriales por fotografía: ${t.llamadasGaleriaPorFoto}`);
    console.log(`✓ Input tokens: ${t.inputTokens || "no informado"}`);
    console.log(`✓ Output tokens: ${t.outputTokens || "no informado"}`);
    console.log(`✓ Total tokens: ${t.totalTokens || "no informado"}`);
    console.log(`✓ Tiempo acumulado de llamadas: ${t.tiempoAcumuladoMs} ms`);
    console.log(`✓ Costo estimado: ${t.costoEstimadoUSD === null ? "pendiente de tarifa configurada" : `$${t.costoEstimadoUSD.toFixed(4)} USD`}`);

    if (t.llamadas.length !== 3 + galeriaOriginal.length) {
        throw new Error(`Eficiencia inesperada: se esperaban ${3 + galeriaOriginal.length} llamadas editoriales y se registraron ${t.llamadas.length}.`);
    }

    console.log(`✓ CSV de prueba: ${rutaSalida}`);
    console.log("\n✓ EDITORIAL V2.1 DESACOPLADA SUPERADA\n");
}

ejecutar().catch(error => {
    console.error("\n✗ PRUEBA EDITORIAL V2.1 DESACOPLADA FALLIDA\n");
    console.error(error.stack || error);
    process.exit(1);
});
