console.log("prueba-editorial-v1.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const ConstructorContexto = require("../src/direccionEditorial/ConstructorContexto");
const OpenAIClient = require("../src/direccionEditorial/openAIClient");
const ValidadorHistoria = require("../src/direccionEditorial/validadorHistoria");

const rutaEntrada = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).csv");
const rutaSalida = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).prueba-editorial-v1.csv");

function json(texto, nombre) {
    try { return JSON.parse(texto); }
    catch (error) { throw new Error(`${nombre} no devolvió JSON válido: ${error.message}`); }
}

async function ejecutar() {
    console.log("\n======================================");
    console.log("PRUEBA REAL — EDITORIAL V1");
    console.log("======================================\n");

    if (!fs.existsSync(rutaEntrada)) throw new Error(`No existe el CSV: ${rutaEntrada}`);

    const parsed = Papa.parse(fs.readFileSync(rutaEntrada, "utf8"), { header: true, skipEmptyLines: true });
    if (parsed.errors.length) throw new Error(`Error leyendo CSV: ${JSON.stringify(parsed.errors)}`);

    const fila = parsed.data.find(f => f["Proyecto"] === "Hogar Tijo");
    if (!fila) throw new Error("No se encontró Hogar Tijo.");

    const galeria = JSON.parse(fila["Galería General"] || "[]");
    if (!Array.isArray(galeria) || !galeria.length) throw new Error("Galería vacía.");

    const espacios = json(fila["Espacios"] || "[]", "Espacios");
    const categoria = json(fila["Categoría"] || "[]", "Categoría");
    const estado = json(fila["Estado"] || "[]", "Estado");

    const observacionesVision = galeria.map((foto, i) => ({
        nombre: foto.fileName || `foto-${i + 1}`,
        analizada: true,
        espacio: foto.title || "",
        tipo: "imagen",
        plano: "",
        estilo: "",
        materiales: [],
        colores: [],
        elementos: [],
        iluminacion: "",
        sensacion: "",
        confianza: 1,
        descripcion: foto.description || ""
    }));

    const proyecto = {
        nombre: fila["Proyecto"],
        codigo: fila["Código MUBATO"],
        cliente: fila["Cliente"],
        ciudad: fila["Ciudad"],
        estado,
        categoria,
        descripcion: fila["Descripción"],
        servicios: fila["Servicios"] ? fila["Servicios"].split("|").map(x => x.trim()).filter(Boolean) : [],
        espacios,
        expediente: {
            version: "V1",
            descripcion: fila["Descripción"],
            observacionesVision
        }
    };

    const contexto = new ConstructorContexto();
    const openAI = new OpenAIClient();
    const validador = new ValidadorHistoria();
    let llamadasIA = 0;
    const originalGenerar = openAI.generarTexto.bind(openAI);
    openAI.generarTexto = async (...args) => { llamadasIA++; return originalGenerar(...args); };

    console.log("CASO 1 — HISTORIA");
    const historia = await openAI.generarTexto(contexto.construirHistoria(proyecto));
    const validacionHistoria = validador.validar(historia.trim());
    console.log(`✓ Palabras: ${validacionHistoria.metricas.palabras}`);
    console.log(`✓ Párrafos: ${validacionHistoria.metricas.parrafos}`);
    if (!validacionHistoria.aprobado) throw new Error(`Historia rechazada: ${JSON.stringify(validacionHistoria.errores)}`);
    if (validacionHistoria.metricas.parrafos !== 1) throw new Error("Historia V1 no tiene exactamente un párrafo.");

    console.log("\nCASO 2 — HERO");
    const heroTexto = await openAI.generarTexto(contexto.construirHero(proyecto));
    if (!heroTexto.trim()) throw new Error("Hero vacío.");

    console.log("\nCASO 3 — SEO");
    const seo = json(await openAI.generarTexto(contexto.construirSEO(proyecto, historia)), "SEO");
    if (!seo.seoTitle || !seo.metaDescription) throw new Error("SEO incompleto.");
    if (String(seo.seoTitle).length > 60) throw new Error("SEO Title supera 60 caracteres.");
    if (String(seo.metaDescription).length > 155) throw new Error("Meta Description supera 155 caracteres.");

    console.log("\nCASO 4 — GALERÍA");
    const galeriaEditorial = [];
    for (let i = 0; i < galeria.length; i++) {
        const foto = galeria[i];
        const contextoFoto = { ...foto, nombre: foto.fileName, analizada: true };
        const title = await openAI.generarTexto(contexto.construirTituloFotografia(proyecto, contextoFoto));
        const alt = await openAI.generarTexto(contexto.construirAltText(proyecto, contextoFoto));
        const keywords = json(await openAI.generarTexto(contexto.construirKeywordsFotografia(proyecto, contextoFoto, historia)), "PHOTO_KEYWORDS");
        const nombreSEO = await openAI.generarTexto(contexto.construirNombreSEOFotografia(proyecto, contextoFoto));
        galeriaEditorial.push({
            ...foto,
            title: title.trim(),
            alt: alt.trim(),
            description: foto.description || "",
            keywords: keywords.keywords,
            nombreSEO: nombreSEO.trim()
        });
        if (!foto.src || !foto.slug) throw new Error(`Identidad técnica incompleta en foto ${i + 1}.`);
    }

    fila["Historias de Transformación"] = historia.trim();
    fila["Hero Texto"] = heroTexto.trim();
    fila["Galería General"] = JSON.stringify(galeriaEditorial);
    fila["SEO Title"] = seo.seoTitle;
    fila["Meta Description"] = seo.metaDescription;

    const salida = Papa.unparse(parsed.data, { quotes: false });
    fs.writeFileSync(rutaSalida, salida, "utf8");

    const verificado = Papa.parse(fs.readFileSync(rutaSalida, "utf8"), { header: true, skipEmptyLines: true });
    const filaV = verificado.data.find(f => f["Proyecto"] === "Hogar Tijo");
    const galeriaV = JSON.parse(filaV["Galería General"] || "[]");
    if (galeriaV.length !== galeria.length) throw new Error("Cantidad de fotografías alterada.");
    galeriaV.forEach((foto, i) => {
        const original = galeria[i];
        if (!foto.title || !foto.alt || !foto.nombreSEO || !Array.isArray(foto.keywords) || !foto.keywords.length) {
            throw new Error(`Metadatos editoriales incompletos en foto ${i + 1}.`);
        }
        if (foto.src !== original.src || foto.slug !== original.slug || JSON.stringify(foto.settings) !== JSON.stringify(original.settings)) {
            throw new Error(`Integridad técnica alterada en foto ${i + 1}.`);
        }
    });

    console.log("\n======================================");
    console.log("RESULTADO EDITORIAL V1");
    console.log("======================================");
    console.log(`✓ Historia: ${validacionHistoria.metricas.palabras} palabras / 1 párrafo`);
    console.log(`✓ Hero Texto generado: ${heroTexto.trim().length} caracteres`);
    console.log(`✓ Fotografías procesadas: ${galeriaV.length}`);
    console.log("✓ title + alt + keywords + nombreSEO presentes en cada fotografía.");
    console.log("✓ SEO Title + Meta Description presentes y dentro de límites.");
    console.log("✓ src + slug + settings preservados.");
    console.log(`✓ Llamadas IA: ${llamadasIA}`);
    console.log(`✓ CSV de prueba: ${rutaSalida}`);
    console.log("\n✓ EDITORIAL V1 SUPERADA\n");
}

ejecutar().catch(error => {
    console.error("\n✗ PRUEBA EDITORIAL V1 FALLIDA\n");
    console.error(error.stack || error);
    process.exit(1);
});
