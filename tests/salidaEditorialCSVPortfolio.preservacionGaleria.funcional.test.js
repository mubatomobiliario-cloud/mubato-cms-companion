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

// Los metadatos editoriales internos y el identificador Companion no forman
// parte de la proyección física Wix de Galería General.
const galeriaConMetadatos = galeriaOriginal.map((item, posicion) => ({
    ...item,
    keywords: [`kw-${posicion + 1}`, "alcoba principal"],
    nombreSEO: `fotografia-${posicion + 1}`,
    propiedadInternaCompanion: `interno-${posicion + 1}`
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
const camposEditoriales = new Set(["title", "description", "alt"]);

for (let i = 0; i < galeriaEnsambler.length; i += 1) {
    const itemOriginal = galeriaConMetadatos[i];
    const itemEnsambler = galeriaEnsambler[i];

    for (const campo of Object.keys(itemOriginal)) {
        if (camposEditoriales.has(campo)) {
            continue;
        }
        if (JSON.stringify(itemEnsambler[campo]) !== JSON.stringify(itemOriginal[campo])) {
            throw new Error(`Ensamblador alteró/perdió el campo ${campo} en posición ${i}.`);
        }
    }

    for (const campo of camposEditoriales) {
        if (typeof itemEnsambler[campo] !== "string" || !itemEnsambler[campo].trim()) {
            throw new Error(`Ensamblador no produjo el campo editorial ${campo} en posición ${i}.`);
        }
    }

    if (JSON.stringify(itemEnsambler.keywords) !== JSON.stringify(itemOriginal.keywords)) {
        throw new Error(`Ensamblador perdió keywords en posición ${i}.`);
    }
    if (itemEnsambler.nombreSEO !== itemOriginal.nombreSEO) {
        throw new Error(`Ensamblador perdió nombreSEO en posición ${i}.`);
    }
}

console.log("✓ Ensamblador preserva la galería y genera los campos editoriales.");

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

if (galeriaSalida.length !== galeriaEnsambler.length) {
    throw new Error("El exportador alteró la cantidad de fotografías de la galería.");
}

const camposFisicosWix = [
    "description",
    "fileName",
    "slug",
    "alt",
    "src",
    "title",
    "type",
    "settings"
];

const camposInternos = ["keywords", "nombreSEO", "fotografia", "propiedadInternaCompanion"];
const perdidosFisicos = [];
const preservadosFisicos = [];
const sobrescritosFisicos = [];
const internosFueraWix = [];

for (let i = 0; i < galeriaEnsambler.length; i += 1) {
    const entrada = galeriaEnsambler[i];
    const salidaItem = galeriaSalida[i];

    for (const campo of camposFisicosWix) {
        if (!Object.prototype.hasOwnProperty.call(salidaItem, campo)) {
            perdidosFisicos.push(`${i}:${campo}`);
            continue;
        }

        if (["title", "description", "alt"].includes(campo)) {
            if (salidaItem[campo] !== entrada[campo]) {
                throw new Error(`El exportador no conservó el valor editorial de ${campo} en posición ${i}.`);
            }
            sobrescritosFisicos.push(`${i}:${campo}`);
        } else if (JSON.stringify(salidaItem[campo]) === JSON.stringify(entrada[campo])) {
            preservadosFisicos.push(`${i}:${campo}`);
        } else {
            throw new Error(`El exportador modificó sin autorización ${campo} en posición ${i}.`);
        }
    }

    for (const campo of camposInternos) {
        if (Object.prototype.hasOwnProperty.call(salidaItem, campo)) {
            throw new Error(`El metadato interno ${campo} fue exportado indebidamente en posición ${i}.`);
        }
        internosFueraWix.push(`${i}:${campo}`);
    }

    const camposSalidaNoEsperados = Object.keys(salidaItem).filter(
        campo => !camposFisicosWix.includes(campo)
    );

    if (camposSalidaNoEsperados.length > 0) {
        throw new Error(
            `El exportador agregó propiedades no previstas en Galería General: ${camposSalidaNoEsperados.join(", ")}.`
        );
    }
}

console.log("==============================================");
console.log("AUDITORÍA — CONTRATO FÍSICO GALERÍA WIX");
console.log("==============================================");
console.log(`CSV: ${rutaEntrada}`);
console.log(`Fotografías auditadas: ${galeriaEnsambler.length}`);
console.log(`Campos físicos Wix preservados: ${preservadosFisicos.length}`);
console.log(`Campos físicos Wix sobrescritos editorialmente: ${sobrescritosFisicos.length}`);
console.log(`Metadatos internos mantenidos fuera de Wix: ${internosFueraWix.length}`);
console.log(`Campos físicos Wix perdidos: ${perdidosFisicos.length}`);
console.log("");

if (perdidosFisicos.length > 0) {
    console.log("DETALLE DE PÉRDIDAS FÍSICAS:");
    console.log(perdidosFisicos.join("\n"));
    console.log("");
    console.log("🔴 VEREDICTO: EL CONTRATO FÍSICO DE GALERÍA WIX NO SE CUMPLE.");
} else {
    console.log("🟢 VEREDICTO: CONTRATO FÍSICO DE GALERÍA WIX CUMPLIDO.");
}

console.log("");
console.log("✓ keywords / nombreSEO permanecen fuera de Galería General.");
console.log("✓ fotografia / propiedadInternaCompanion permanecen fuera de Galería General.");
console.log("✓ La prueba NO consume IA.");
console.log("✓ La prueba NO modifica el CSV original.");
console.log(`Salida temporal: ${rutaSalida}`);
