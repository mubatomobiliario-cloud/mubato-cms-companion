console.log("prueba-galeria-editorial-v1.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

console.log("");
console.log("======================================");
console.log("PRUEBA — GALERÍA EDITORIAL V1");
console.log("======================================");
console.log("");

const rutaEntrada = path.resolve(
    "Proyectos/Araque/Historias+de+Transformación (10).csv"
);

const rutaSalida = path.resolve(
    "Proyectos/Araque/Historias+de+Transformación (10).prueba-galeria-v1.csv"
);

if (!fs.existsSync(rutaEntrada)) {
    throw new Error(`No existe el CSV: ${rutaEntrada}`);
}

const contenido = fs.readFileSync(rutaEntrada, "utf8");
const resultado = Papa.parse(contenido, {
    header: true,
    skipEmptyLines: true
});

if (resultado.errors.length > 0) {
    throw new Error(`Error leyendo CSV: ${JSON.stringify(resultado.errors)}`);
}

const filas = resultado.data;
const fila = filas.find(f => f["Proyecto"] === "Hogar Tijo");

if (!fila) {
    throw new Error("No se encontró el proyecto Hogar Tijo.");
}

const galeriaOriginal = JSON.parse(fila["Galería General"] || "[]");

if (!Array.isArray(galeriaOriginal)) {
    throw new Error("Galería General no es un arreglo.");
}

if (galeriaOriginal.length === 0) {
    throw new Error("La galería no contiene fotografías.");
}

const galeria = galeriaOriginal.map((foto, indice) => ({
    ...foto,
    title: foto.title || `Fotografía editorial ${indice + 1}`,
    alt: foto.alt || `Fotografía de Hogar Tijo ${indice + 1}`,
    description: foto.description || ""
}));

for (let i = 0; i < galeria.length; i++) {
    const original = galeriaOriginal[i];
    const actualizada = galeria[i];

    if (actualizada.src !== original.src) {
        throw new Error(`src alterado en fotografía ${i + 1}.`);
    }

    if (actualizada.slug !== original.slug) {
        throw new Error(`slug alterado en fotografía ${i + 1}.`);
    }

    if (JSON.stringify(actualizada.settings) !== JSON.stringify(original.settings)) {
        throw new Error(`settings alterado en fotografía ${i + 1}.`);
    }
}

fila["Galería General"] = JSON.stringify(galeria);

const csvSalida = Papa.unparse(filas, {
    quotes: false
});

fs.writeFileSync(rutaSalida, csvSalida, "utf8");

const verificacion = Papa.parse(
    fs.readFileSync(rutaSalida, "utf8"),
    {
        header: true,
        skipEmptyLines: true
    }
);

const filaVerificada = verificacion.data.find(
    f => f["Proyecto"] === "Hogar Tijo"
);

const galeriaVerificada = JSON.parse(
    filaVerificada["Galería General"] || "[]"
);

if (galeriaVerificada.length !== galeriaOriginal.length) {
    throw new Error("La cantidad de fotografías cambió.");
}

for (let i = 0; i < galeriaOriginal.length; i++) {
    const original = galeriaOriginal[i];
    const actual = galeriaVerificada[i];

    if (!actual.title) throw new Error(`Falta title en fotografía ${i + 1}.`);
    if (!actual.alt) throw new Error(`Falta alt en fotografía ${i + 1}.`);
    if (actual.src !== original.src) throw new Error(`src no preservado en fotografía ${i + 1}.`);
    if (actual.slug !== original.slug) throw new Error(`slug no preservado en fotografía ${i + 1}.`);
    if (JSON.stringify(actual.settings) !== JSON.stringify(original.settings)) {
        throw new Error(`settings no preservado en fotografía ${i + 1}.`);
    }
}

console.log("✓ CSV de entrada encontrado.");
console.log(`✓ Proyecto localizado: ${fila["Proyecto"]}`);
console.log(`✓ Fotografías encontradas: ${galeriaOriginal.length}`);
console.log("✓ title presente en cada fotografía.");
console.log("✓ alt presente en cada fotografía.");
console.log("✓ description preservada.");
console.log("✓ src preservado.");
console.log("✓ slug preservado.");
console.log("✓ settings preservados.");
console.log("✓ Cantidad de fotografías preservada.");
console.log(`✓ CSV de prueba generado: ${rutaSalida}`);
console.log("");
console.log("======================================");
console.log("RESULTADO");
console.log("======================================");
console.log("");
console.log("✓ GALERÍA EDITORIAL V1 SUPERADA");
console.log("");
