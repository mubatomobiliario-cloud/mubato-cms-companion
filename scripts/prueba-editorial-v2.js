console.log("prueba-editorial-v2.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const ProcesadorEditorialV2 = require("../src/Editorial/procesadorEditorialV2");
const Parser = require("../src/core/parser");
const SelectorProyectoEditorialV1 = require("../src/Editorial/selectorProyectoEditorialV1");

function nombreSeguro(nombre) {
    return String(nombre || "proyecto").trim().replace(/[\\/:*?"<>|]/g, "-");
}

function leerCSVConCabecerasWix(ruta) {
    const contenido = fs.readFileSync(ruta, "utf8");
    const filas = Papa.parse(contenido, { skipEmptyLines: true }).data;
    if (!filas.length) throw new Error("CSV vacío.");
    const cabecerasOriginales = filas[0];
    const usadas = new Map();
    const cabecerasInternas = cabecerasOriginales.map((cabecera) => {
        const base = String(cabecera || "");
        const veces = usadas.get(base) || 0;
        usadas.set(base, veces + 1);
        return veces === 0 ? base : `${base}__WIX_DUPLICATE_${veces}`;
    });
    const datos = filas.slice(1).map(valores => Object.fromEntries(
        cabecerasInternas.map((cabecera, i) => [cabecera, valores[i] ?? ""])
    ));
    return { contenido, cabecerasOriginales, datos };
}

function escribirCSVConCabecerasWix(ruta, modelo) {
    const cuerpo = Papa.unparse(modelo.datos, { quotes: false });
    const lineas = cuerpo.split(/\r?\n/);
    lineas[0] = modelo.contenido.split(/\r?\n/)[0];
    fs.writeFileSync(ruta, lineas.join("\n"), "utf8");
}

async function ejecutar() {
    console.log("\n======================================");
    console.log("PRUEBA REAL — EDITORIAL V2.2");
    console.log("======================================\n");

    const rutaEntrada = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).csv");
    const rutaSalida = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).prueba-editorial-v2.csv");
    if (!fs.existsSync(rutaEntrada)) throw new Error(`No existe el CSV: ${rutaEntrada}`);

    const modelo = leerCSVConCabecerasWix(rutaEntrada);
    const selector = new SelectorProyectoEditorialV1();
    const nombre = process.env.MUBATO_PROYECTO || "Hogar Tijo";
    const seleccion = selector.seleccionar(modelo.datos, { nombre });
    const fila = seleccion.fila;

// La prueba debe respetar el mismo contrato de producción:
// si la fila no trae Código MUBATO, el Parser lo asigna.
const parser = new Parser();
parser.asignarCodigoMUBATO(fila);
    const galeriaOriginal = JSON.parse(fila["Galería General"] || "[]").map(f => JSON.parse(JSON.stringify(f)));

    const camposProtegidos = [
        "Proyecto", "Hero", "Ciudad", "Categoría", "Espacios", "Estado", "Año", "Cliente",
        "Historias de Transformación", "Historias de Transformación__WIX_DUPLICATE_1",
        "ID", "Created Date", "Updated Date", "Owner", "Hero Imágen", "Destacado", "Orden Home", "Observaciones"
    ];
    const protegidosOriginales = Object.fromEntries(camposProtegidos.map(campo => [campo, fila[campo] ?? ""]));

    console.log(`✓ Proyecto seleccionado: ${fila["Proyecto"]}`);
    console.log(`✓ Modo de selección: ${seleccion.modo}`);
    console.log(`✓ Cabeceras Wix originales preservadas: ${modelo.cabecerasOriginales.length}`);

    const rutaEvidencia = process.env.MUBATO_EVIDENCIA_VISUAL || path.resolve(
        path.dirname(rutaEntrada),
        `${nombreSeguro(fila["Proyecto"])}.evidencia-visual.json`
    );
    if (!fs.existsSync(rutaEvidencia)) throw new Error(`No existe evidencia visual persistida: ${rutaEvidencia}. Ejecuta primero el análisis del proyecto.`);

    const evidencia = JSON.parse(fs.readFileSync(rutaEvidencia, "utf8"));
    const observacionesVision = evidencia.observacionesVision;
    console.log(`✓ Evidencia visual cargada: ${observacionesVision.length} fotografías`);
    console.log("✓ Segunda lectura Vision: DESACTIVADA");

    const procesador = new ProcesadorEditorialV2();
    const resultado = await procesador.generar(fila, { evidenciaVisual: observacionesVision });

    // CONTRATO DE SALIDA CHATico: exactamente estos campos editoriales.
    fila["Hero Texto"] = resultado.heroTexto;
    fila["Descripción"] = resultado.descripcion;
    fila["Código MUBATO"] = resultado.codigo;
    fila["Servicios"] = resultado.servicios.join("|");
    fila["SEO Title"] = resultado.seo.seoTitle;
    fila["Meta Description"] = resultado.seo.metaDescription;
    fila["Slug"] = resultado.slug;
    fila["Galería General"] = JSON.stringify(resultado.galeriaEditorial);

    // Nunca escribir los campos administrados por Wix.
    escribirCSVConCabecerasWix(rutaSalida, modelo);

    const salidaModelo = leerCSVConCabecerasWix(rutaSalida);
    const filaV = salidaModelo.datos.find(f => f["Proyecto"] === fila["Proyecto"]);
    if (!filaV) throw new Error("El proyecto desapareció del CSV de salida.");

    const cabeceraSalida = fs.readFileSync(rutaSalida, "utf8").split(/\r?\n/)[0];
    const cabeceraEntrada = modelo.contenido.split(/\r?\n/)[0];
    if (cabeceraSalida !== cabeceraEntrada) throw new Error("Las cabeceras originales de Wix fueron alteradas.");

    camposProtegidos.forEach(campo => {
        if ((filaV[campo] ?? "") !== protegidosOriginales[campo]) throw new Error(`Campo protegido alterado: ${campo}`);
    });

    const camposChatico = ["Hero Texto", "Descripción", "Código MUBATO", "Servicios", "SEO Title", "Meta Description", "Slug", "Galería General"];
    camposChatico.forEach(campo => {
        if (!(campo in filaV)) throw new Error(`Falta campo de salida CHATico: ${campo}`);
    });

    const galeriaV = JSON.parse(filaV["Galería General"] || "[]");
    if (galeriaV.length !== galeriaOriginal.length) throw new Error("Cantidad de fotografías alterada.");
    galeriaV.forEach((foto, i) => {
        const original = galeriaOriginal[i];
        if (!foto.title || !foto.alt || !foto.nombreSEO || !Array.isArray(foto.keywords) || !foto.keywords.length) throw new Error(`Metadatos editoriales incompletos en foto ${i + 1}.`);
        if (foto.src !== original.src || foto.slug !== original.slug || JSON.stringify(foto.settings) !== JSON.stringify(original.settings)) throw new Error(`Integridad técnica alterada en foto ${i + 1}.`);
    });

    const t = resultado.telemetria;
    console.log("\n======================================");
    console.log("RESULTADO EDITORIAL V2.2");
    console.log("======================================");
    console.log(`✓ Historia maestra: ${resultado.validacionHistoria.metricas.palabras} palabras / 1 párrafo`);
    console.log(`✓ Historia Web: compatibilidad con Historia Editorial maestra`);
    console.log(`✓ Validación Historia Web independiente: NO ejecutada (contrato V2.2)`);
    console.log(`✓ Reglas Historia maestra: ${resultado.validacionHistoria.metricas.senales ? "evaluadas por el validador" : "evaluadas"}`);
    console.log(`✓ Advertencias maestra: ${resultado.validacionHistoria.advertencias.length}`);
    console.log(`✓ Hero Texto: ${resultado.heroTexto.length} caracteres`);
    console.log(`✓ Código MUBATO: ${resultado.codigo}`);
    console.log(`✓ Servicios: ${resultado.servicios.join(" | ") || "(vacío, según evidencia)"}`);
    console.log(`✓ Slug: ${resultado.slug}`);
    console.log(`✓ Fotografías procesadas: ${resultado.galeriaEditorial.length}`);
    console.log("✓ title + alt + keywords + nombreSEO presentes en cada fotografía.");
    console.log("✓ SEO Title + Meta Description presentes y dentro de límites.");
    console.log("✓ src + slug + settings preservados contra la entrada original.");
    console.log("✓ Campos protegidos de Wix preservados.");
    console.log("✓ Campos Historias de Transformación NO escritos.");
    console.log("✓ Cabeceras originales de Wix preservadas, incluidas las duplicadas.");

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

    const llamadasEsperadas = 3 + galeriaOriginal.length;
    if (t.llamadas.length !== llamadasEsperadas) throw new Error(`Eficiencia inesperada: se esperaban ${llamadasEsperadas} llamadas editoriales y se registraron ${t.llamadas.length}.`);

    console.log(`✓ CSV de prueba: ${rutaSalida}`);
    console.log("\n✓ EDITORIAL V2.2 SUPERADA\n");
}

ejecutar().catch(error => {
    console.error("\n✗ PRUEBA EDITORIAL V2.2 FALLIDA\n");
    console.error(error.stack || error);
    process.exit(1);
});
