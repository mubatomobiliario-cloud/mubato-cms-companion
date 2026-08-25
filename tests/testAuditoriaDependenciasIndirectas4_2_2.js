const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

console.log("testAuditoriaDependenciasIndirectas4_2_2.js cargado");

const root = path.resolve(__dirname, "..");
const contextoPath = path.join(root, "src", "direccionEditorial", "ConstructorContexto.js");
const processorV2Path = path.join(root, "src", "Editorial", "procesadorEditorialV2.js");
const processorV1Path = path.join(root, "src", "Editorial", "procesadorEditorialV1.js");

const candidatos = [
    "construirKeywords",
    "construirSlug",
    "construirCodigo",
    "construirCategoria",
    "construirServicios",
    "construirEspacios",
    "construirAltText",
    "construirTituloFotografia",
    "construirKeywordsFotografia",
    "construirNombreSEOFotografia"
];

const excluirDirectorios = new Set(["node_modules", ".git", "Proyectos", "dist", "build", "out"]);
const extensiones = new Set([".js", ".json", ".md"]);

function listarArchivos(dir) {
    const salida = [];
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
        if (excluirDirectorios.has(entrada.name)) continue;
        const absoluta = path.join(dir, entrada.name);
        if (entrada.isDirectory()) salida.push(...listarArchivos(absoluta));
        else if (extensiones.has(path.extname(entrada.name))) salida.push(absoluta);
    }
    return salida;
}

function referenciasExternas(method) {
    const patron = new RegExp(`\\b${method}\\s*\\(`, "g");
    const resultados = [];
    for (const archivo of listarArchivos(root)) {
        if (archivo === contextoPath || archivo === __filename) continue;
        const texto = fs.readFileSync(archivo, "utf8");
        if (!patron.test(texto)) continue;
        const lineas = texto.split(/\\r?\\n/);
        lineas.forEach((linea, indice) => {
            if (new RegExp(`\\b${method}\\s*\\(`).test(linea)) {
                resultados.push({ archivo: path.relative(root, archivo), linea: indice + 1, texto: linea.trim() });
            }
        });
    }
    return resultados;
}

function clasificar(method, refs) {
    if (refs.some(r => r.archivo === path.relative(root, processorV2Path))) return "V2.2 ACTIVO";
    if (refs.some(r => r.archivo === path.relative(root, processorV1Path))) return "V1 LEGADO";
    if (refs.length) return "CONSUMIDOR INDIRECTO / REVISAR";
    return "SIN CONSUMIDOR DETECTADO";
}

console.log("======================================");
console.log("AUDITORÍA — DEPENDENCIAS INDIRECTAS 4.2.2");
console.log("======================================\\n");
console.log("Objetivo: recorrer el repositorio y determinar si los 10 métodos no consumidos directamente por V2.2 siguen teniendo consumidores fuera del procesador actual.");
console.log("La auditoría es estática: no ejecuta OpenAI ni modifica producción.\\n");

assert.ok(fs.existsSync(contextoPath), "ConstructorContexto no existe.");
assert.ok(fs.existsSync(processorV2Path), "procesadorEditorialV2.js no existe.");

console.log("1. Escaneando consumidores fuera de ConstructorContexto...");
const resultados = {};
for (const method of candidatos) {
    resultados[method] = referenciasExternas(method);
    console.log(`\\n• ${method} → ${clasificar(method, resultados[method])}`);
    if (resultados[method].length) {
        for (const ref of resultados[method]) console.log(`    ${ref.archivo}:${ref.linea}`);
    }
}

console.log("\\n2. Protegiendo el contrato V2.2...");
assert.equal(resultados.construirSlug.some(r => r.archivo === path.relative(root, processorV2Path)), false, "Slug volvió al procesador V2.2.");
assert.equal(resultados.construirCodigo.some(r => r.archivo === path.relative(root, processorV2Path)), false, "Código volvió al procesador V2.2.");
assert.equal(resultados.construirServicios.some(r => r.archivo === path.relative(root, processorV2Path)), false, "Servicios volvió al procesador V2.2.");
console.log("✓ Código, Servicios y Slug continúan fuera de V2.2.");

console.log("\\n3. Diferenciando legado de dependencia real...");
const legado = candidatos.filter(m => clasificar(m, resultados[m]) === "V1 LEGADO");
const indirectos = candidatos.filter(m => clasificar(m, resultados[m]) === "CONSUMIDOR INDIRECTO / REVISAR");
const sinConsumidor = candidatos.filter(m => clasificar(m, resultados[m]) === "SIN CONSUMIDOR DETECTADO");
console.log(`✓ Métodos vinculados a V1: ${legado.length}`);
console.log(`✓ Consumidores indirectos a revisar: ${indirectos.length}`);
console.log(`✓ Métodos sin consumidor detectado: ${sinConsumidor.length}`);

console.log("\\n4. Regla de consolidación...");
console.log("✓ Ningún método será eliminado por esta prueba.");
console.log("✓ Los métodos con consumidor externo deben conservarse hasta revisar su pipeline.");
console.log("✓ Los métodos sin consumidor pasan a candidato formal de limpieza, sujeto a regresión.");

console.log("\\n--------------------------------------");
console.log("AUDITORÍA SUPERADA — 4.2.2");
console.log("--------------------------------------");
console.log("✓ Dependencias indirectas identificadas.");
console.log("✓ Legado V1 separado de consumidores actuales.");
console.log("✓ V2.2 protegido.");
console.log("✓ No se modificó código de producción.");
console.log("✓ No se realizaron llamadas a OpenAI.");
console.log("\\nCONCLUSIÓN 4.2.2: ya podemos decidir la consolidación de ConstructorContexto con evidencia de consumidores reales, legado V1 y métodos sin uso detectado.");
