const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

console.log("testAuditoriaConsumidoresEditorial4_2.js cargado");

const root = path.resolve(__dirname, "..");
const processorPath = path.join(root, "src", "Editorial", "procesadorEditorialV2.js");
const contextoPath = path.join(root, "src", "direccionEditorial", "ConstructorContexto.js");

const processorSource = fs.readFileSync(processorPath, "utf8");
const contextoSource = fs.readFileSync(contextoPath, "utf8");

const contextoMethods = [
    "construirHero",
    "construirHistoria",
    "construirHistoriaWeb",
    "construirSEO",
    "construirKeywords",
    "construirSlug",
    "construirCodigo",
    "construirCategoria",
    "construirServicios",
    "construirEspacios",
    "construirAltText",
    "construirTituloFotografia",
    "construirKeywordsFotografia",
    "construirNombreSEOFotografia",
    "construirMetadatosFotografia"
];

const processorCalls = contextoMethods.filter(method =>
    new RegExp(`this\\.contexto\\.${method}\\s*\\(`).test(processorSource)
);

const directConsumers = [
    "construirHero",
    "construirHistoria",
    "construirHistoriaWeb",
    "construirSEO",
    "construirMetadatosFotografia"
];

const deterministicOrLegacyCandidates = [
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

console.log("======================================");
console.log("AUDITORÍA — CONSUMIDORES EDITORIALES 4.2");
console.log("======================================\n");

console.log("Objetivo: identificar consumidores reales de ConstructorContexto antes de modificar o eliminar arquitectura heredada.");
console.log("La auditoría es estática: no ejecuta OpenAI ni modifica producción.\n");

console.log("1. Verificando que ConstructorContexto exista y declare sus métodos...");
assert.ok(contextoSource.includes("class ConstructorContexto"));
for (const method of contextoMethods) {
    assert.ok(new RegExp(`\\b${method}\\s*\\(`).test(contextoSource), `No se encontró ${method} en ConstructorContexto.`);
}
console.log(`✓ ${contextoMethods.length} métodos declarados detectados.`);

console.log("\n2. Buscando consumidores directos en Editorial V2.2...");
console.log(`✓ Métodos realmente invocados por procesadorEditorialV2: ${processorCalls.length}`);
for (const method of processorCalls) console.log(`  • ${method}`);

console.log("\n3. Verificando contrato activo de Editorial V2.2...");
for (const method of directConsumers) {
    assert.ok(processorCalls.includes(method), `${method} debe permanecer como consumidor activo de V2.2.`);
}
console.log("✓ Historia, Historia Web, Hero, SEO y fotografía editorial están conectados al procesador.");

console.log("\n4. Clasificando métodos no consumidos directamente por V2.2...");
const unusedByProcessor = deterministicOrLegacyCandidates.filter(method => !processorCalls.includes(method));
for (const method of unusedByProcessor) console.log(`  • ${method} → candidato heredado/determinista; no invocado directamente por V2.2.`);

console.log("\n5. Protegiendo una regla arquitectónica...");
assert.ok(!processorCalls.includes("construirSlug"), "Slug no debe volver a depender de IA en V2.2.");
assert.ok(!processorCalls.includes("construirCodigo"), "Código no debe volver a depender de IA en V2.2.");
assert.ok(!processorCalls.includes("construirServicios"), "Servicios no debe volver a depender de IA en V2.2.");
console.log("✓ Código, Servicios y Slug permanecen fuera del flujo IA.");

console.log("\n6. Resultado de auditoría...");
console.log("--------------------------------------");
console.log("✓ Consumidores activos de ConstructorContexto identificados.");
console.log("✓ Métodos heredados/deterministas identificados sin eliminarlos.");
console.log("✓ No se modificó código de producción.");
console.log("✓ No se realizaron llamadas a OpenAI.");
console.log("--------------------------------------");
console.log("AUDITORÍA SUPERADA — 4.2.1");
console.log("--------------------------------------");
console.log("Conclusión: ya existe evidencia suficiente para decidir qué arquitectura pertenece al contrato V2.2 y qué métodos pueden pasar a revisión de limpieza sin asumir que están en uso.");
