console.log("testMapaLlamadasIA.js cargado");

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const ARCHIVOS_RELEVANTES = [
    "src/direccionEditorial/openAIClient.js",
    "src/vision/analizadorFotografias.js",
    "src/direccionEditorial/directorEditorial.js",
    "src/direccionEditorial/generadorEditorial.js",
    "src/Editorial/procesadorEditorialV2.js",
    "src/workflow/directorProyecto.js"
];

function leer(relativa) {
    const archivo = path.join(ROOT, relativa);
    if (!fs.existsSync(archivo)) {
        throw new Error(`No existe el archivo esperado: ${relativa}`);
    }
    return fs.readFileSync(archivo, "utf8");
}

function contar(texto, expresion) {
    return (texto.match(expresion) || []).length;
}

console.log("");
console.log("======================================");
console.log("PRUEBA — MAPA DE LLAMADAS IA 3B");
console.log("======================================");
console.log("");

const contenidos = Object.fromEntries(
    ARCHIVOS_RELEVANTES.map(archivo => [archivo, leer(archivo)])
);

console.log("1. Localizando llamadas directas a OpenAI...");
const respuestas = contar(contenidos["src/direccionEditorial/openAIClient.js"], /responses\.create\s*\(/g);
console.log(`✓ openAIClient.js contiene ${respuestas} llamada(s) responses.create.`);

for (const archivo of ARCHIVOS_RELEVANTES.slice(1)) {
    const directas = contar(contenidos[archivo], /responses\.create\s*\(/g);
    if (directas > 0) {
        throw new Error(`Llamada directa a OpenAI fuera de openAIClient.js: ${archivo}`);
    }
}
console.log("✓ No hay llamadas directas fuera de la frontera IA.");
console.log("");

console.log("2. Identificando consumidores de la frontera IA...");
const consumidores = ARCHIVOS_RELEVANTES.slice(1).filter(archivo => {
    return /openAIClient|OpenAIClient/.test(contenidos[archivo]);
});

if (consumidores.length === 0) {
    throw new Error("No se encontró ningún consumidor explícito de la frontera IA.");
}

consumidores.forEach(archivo => console.log(`✓ ${archivo}`));
console.log("");

console.log("3. Mapeando operaciones del cliente...");
const cliente = contenidos["src/direccionEditorial/openAIClient.js"];
const operaciones = [
    ["texto", /async\s+generarTexto\s*\(/],
    ["visión", /async\s+analizarImagen\s*\(/]
];

for (const [nombre, expresion] of operaciones) {
    if (expresion.test(cliente)) {
        console.log(`✓ Operación de ${nombre} expuesta por openAIClient.js.`);
    } else {
        console.log(`• No se detectó operación explícita de ${nombre} con el nombre esperado.`);
    }
}
console.log("");

console.log("4. Revisando DirectorProyecto...");
const director = contenidos["src/workflow/directorProyecto.js"];
if (!/Editorial Proyecto V2\.2|EDITORIAL_PROYECTO_V2\.2/.test(director)) {
    throw new Error("DirectorProyecto no contiene la ruta Editorial Proyecto V2.2 esperada.");
}
console.log("✓ DirectorProyecto mantiene la ruta Editorial Proyecto V2.2.");
console.log("✓ Este test no ejecuta el pipeline ni consume OpenAI.");
console.log("");

console.log("5. Resumen cuantitativo...");
console.log(`✓ Llamadas responses.create detectadas en la frontera: ${respuestas}`);
console.log(`✓ Consumidores explícitos revisados: ${consumidores.length}`);
console.log(`✓ Archivos del pipeline revisados: ${ARCHIVOS_RELEVANTES.length}`);
console.log("");

console.log("--------------------------------------");
console.log("MAPA 3B COMPLETADO");
console.log("--------------------------------------");
console.log("");
console.log("✓ Las llamadas API siguen encapsuladas.");
console.log("✓ El pipeline Proyecto fue inspeccionado sin llamadas reales.");
console.log("✓ Tenemos la base para decidir dónde optimizar.");
console.log("");
