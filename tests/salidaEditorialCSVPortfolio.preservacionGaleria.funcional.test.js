const fs = require("fs");
const os = require("os");
const path = require("path");

const EnsambladorEditorialPortfolio = require("../src/portfolio/ensambladorEditorialPortfolio");
const SalidaEditorialCSVPortfolio = require("../src/Exportadores/salidaEditorialCSVPortfolio");

const rutaEntrada = process.argv[2];

if (!rutaEntrada) {
    throw new Error("Uso: node tests/salidaEditorialCSVPortfolio.preservacionGaleria.funcional.test.js <ruta-csv-portfolio>");
}

if (!fs.existsSync(rutaEntrada)) {
    throw new Error(`No existe el CSV Portfolio de prueba: ${rutaEntrada}`);
}

const exportador = new SalidaEditorialCSVPortfolio();
const ensamblador = new EnsambladorEditorialPortfolio();
const contenido = fs.readFileSync(rutaEntrada, "utf8");
const filas = exportador.parsearCSV(contenido);
const encabezados = filas[0];
const indice = exportador.crearIndiceEncabezados(encabezados);
const filaOriginal = filas[1];

if (!filaOriginal) {
    throw new Error("El CSV Portfolio de prueba no contiene una fila de datos.");
}

const filaPortfolio = {};
encabezados.forEach((campo, posicion) => {
    if (indice[campo] === posicion) {
        filaPortfolio[campo] = filaOriginal[posicion];
    }
});

const galeriaOriginal = JSON.parse(filaPortfolio["Galería General"]);
if (!Array.isArray(galeriaOriginal) || galeriaOriginal.length === 0) {
    throw new Error("La Galería General real no contiene elementos.");
}

const propiedadesOriginales = Object.keys(galeriaOriginal[0]);

// Inyectamos las propiedades de prueba DENTRO del JSON que consume el ensamblador.
// Así comprobamos realmente la preservación desde la Galería General original
// hasta el ensamblador y, posteriormente, hasta el exportador.
const galeriaConMetadatos = galeriaOriginal.map((item, posicion) => ({
    ...item,
    keywords: [`kw-${posicion + 1}`, "alcoba principal"],
    nombreSEO: `fotografia-${posicion + 1}`,
    propiedadWixNoConocida: `preservar-${posicion + 1}`
}));

filaPortfolio["Galería General"] = JSON.stringify(galeriaConMetadatos);

const expresionesIndividuales = galeriaConMetadatos.map((item, posicion) => ({
    fotografia: item.fileName,
    title: `Título QC ${posicion + 1}`,
    description: `Descripción QC ${posicion + 1}`,
    alt: `Alt QC ${posicion + 1}`,
    keywords: item.keywords,
    nombreSEO: item.nombreSEO
}));

const expresionColectiva = {
    historia: "Historia QC",
    heroTexto: "Hero Texto QC",
    descripcion: "Descripción QC",
    seoTitle: "SEO Title QC",
    metaDescription: "Meta Description QC"
};

const editorial = ensamblador.ensamblar({
    filaPortfolio,
    expresionColectiva,
    expresionesIndividuales,
    servicios: filaPortfolio.Servicios || "",
    codigo: filaPortfolio["Código MUBATO"] || "MUBATO-QC",
    slug: filaPortfolio.Slug || "portfolio-qc"
});

const galeriaEnsambler = editorial.galeriaEditorial;

for (let i = 0; i < galeriaEnsambler.length; i += 1) {
    const itemOriginal = galeriaConMetadatos[i];
    const itemEnsambler = galeriaEnsambler[i];

    for (const campo of Object.keys(itemOriginal)) {
        if (campo === "title" || campo === "description" || campo === "alt" || campo === "keywords" || campo === "nombreSEO") {
            continue;
        }
        if (JSON.stringify(itemEnsambler[campo]) !== JSON.stringify(itemOriginal[campo])) {
            throw new Error(`Ensamblador alteró/perdió el campo ${campo} en posición ${i}.`);
        }
    }

    if (JSON.stringify(itemEnsambler.keywords) !== JSON.stringify(itemOriginal.keywords)) {
        throw new Error(`Ensamblador perdió keywords en posición ${i}.`);
    }
    if (itemEnsambler.nombreSEO !== itemOriginal.nombreSEO) {
        throw new Error(`Ensamblador perdió nombreSEO en posición ${i}.`);
    }
}

console.log("✓ Ensamblador preserva propiedades Wix y metadatos editoriales.");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-qc-galeria-"));
const rutaSalida = path.join(tempDir, "salida.csv");

exportador.exportar({
    rutaEntrada,
    rutaSalida,
    filaPortfolio,
    editorial
});

const salida = fs.readFileSync(rutaSalida, "utf8");
const filasSalida = exportador.parsearCSV(salida);
const encabezadosSalida = filasSalida[0];
const indiceSalida = exportador.crearIndiceEncabezados(encabezadosSalida);
const filaSalida = filasSalida[1];
const galeriaSalida = JSON.parse(filaSalida[indiceSalida["Galería General"]]);

const editadosIntencionalmente = new Set(["title", "description", "alt", "keywords", "nombreSEO"]);
const perdidos = [];
const preservados = [];
const agregados = [];
const sobrescritos = [];

for (let i = 0; i < galeriaEnsambler.length; i += 1) {
    const entrada = galeriaEnsambler[i];
    const salidaItem = galeriaSalida[i];

    for (const campo of Object.keys(entrada)) {
        if (!Object.prototype.hasOwnProperty.call(salidaItem, campo)) {
            perdidos.push(`${i}:${campo}`);
        } else if (editadosIntencionalmente.has(campo)) {
            sobrescritos.push(`${i}:${campo}`);
        } else if (JSON.stringify(salidaItem[campo]) === JSON.stringify(entrada[campo])) {
            preservados.push(`${i}:${campo}`);
        } else {
            throw new Error(`El exportador modificó sin autorización ${campo} en posición ${i}.`);
        }
    }

    for (const campo of Object.keys(salidaItem)) {
        if (!Object.prototype.hasOwnProperty.call(entrada, campo)) {
            agregados.push(`${i}:${campo}`);
        }
    }
}

console.log("==============================================");
console.log("AUDITORÍA ESTÁTICA — PRESERVACIÓN GALERÍA WIX");
console.log("==============================================");
console.log(`CSV: ${rutaEntrada}`);
console.log(`Fotografías auditadas: ${galeriaEnsambler.length}`);
console.log(`Propiedades originales observadas: ${propiedadesOriginales.join(", ")}`);
console.log(`Propiedades preservadas: ${preservados.length}`);
console.log(`Propiedades sobrescritas intencionalmente: ${sobrescritos.length}`);
console.log(`Propiedades agregadas: ${agregados.length}`);
console.log(`Propiedades perdidas: ${perdidos.length}`);
console.log("");

if (perdidos.length > 0) {
    console.log("DETALLE DE PÉRDIDAS:");
    console.log(perdidos.join("\n"));
    console.log("");
    console.log("🔴 VEREDICTO: EL EXPORTADOR NO PRESERVA LA GALERÍA COMPLETA.");
    console.log("   La prueba confirma pérdida de propiedades fuera de la lista blanca actual.");
} else {
    console.log("🟢 VEREDICTO: NO SE DETECTÓ PÉRDIDA DE PROPIEDADES.");
}

console.log("");
console.log("Nota: title / description / alt / keywords / nombreSEO se consideran campos editoriales susceptibles de reemplazo.");
console.log("La prueba NO modifica ningún archivo del proyecto ni consume IA.");
console.log(`Salida temporal: ${rutaSalida}`);
