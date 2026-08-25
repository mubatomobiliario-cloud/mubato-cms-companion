const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("testConsolidacionFlujoEditorial4_3_1.js cargado");

console.log("\n======================================");
console.log("AUDITORÍA — CONSOLIDACIÓN FLUJO EDITORIAL 4.3.1");
console.log("======================================\n");
console.log("Objetivo: fijar el flujo editorial V2.2 real después de la consolidación de ConstructorContexto, sin modificar producción ni ejecutar OpenAI.\n");

const root = path.resolve(__dirname, "..");
const procesadorPath = path.join(root, "src/Editorial/procesadorEditorialV2.js");
const contextoPath = path.join(root, "src/direccionEditorial/ConstructorContexto.js");

const procesador = fs.readFileSync(procesadorPath, "utf8");
const contexto = fs.readFileSync(contextoPath, "utf8");

console.log("1. Verificando frontera de entrada...");
assert.ok(procesador.includes('fila["Galería General"]'), "Galería General no entra al flujo V2.2");
assert.ok(procesador.includes('fila["Proyecto"]'), "Proyecto no entra al flujo V2.2");
assert.ok(procesador.includes('fila["Código MUBATO"]'), "Código MUBATO no entra al flujo V2.2");
assert.ok(procesador.includes('fila["Servicios"]'), "Servicios no entra al flujo V2.2");
console.log("✓ CSV maestro aporta proyecto, código, servicios y galería.");

console.log("2. Verificando evidencia visual como precondición...");
assert.ok(procesador.includes("V2.2 exige evidencia Vision previa"), "No existe protección de evidencia visual previa");
assert.ok(procesador.includes("Vision no se ejecutará en esta fase"), "El flujo no declara reutilización de Vision");
console.log("✓ Evidencia Vision previa es obligatoria y no se duplica en Editorial V2.2.");

console.log("3. Verificando secuencia editorial base...");
const etapas = ["historia", "historia_web", "hero", "seo"];
let posicionAnterior = -1;
etapas.forEach(etapa => {
    const posicion = procesador.indexOf(`generar(\"${etapa}\"`);
    assert.ok(posicion > posicionAnterior, `Orden editorial inválido en ${etapa}`);
    posicionAnterior = posicion;
});
console.log("✓ Historia → Historia Web → Hero → SEO conserva el orden contractual.");

console.log("4. Verificando reutilización editorial...");
assert.ok(procesador.includes("construirHistoriaWeb(historia.trim())"), "Historia no alimenta Historia Web");
assert.ok(procesador.includes("construirSEO(proyecto, historiaWeb)"), "Historia Web no alimenta SEO");
assert.ok(procesador.includes("construirMetadatosFotografia(proyecto, contextoFoto, historiaWeb)"), "Historia Web no alimenta fotografía editorial");
console.log("✓ Historia Web se reutiliza en SEO y fotografía editorial.");

console.log("5. Verificando frontera determinista...");
assert.ok(procesador.includes("const codigo = String(proyecto.codigo || \"\").trim();"), "Código dejó de ser determinista");
assert.ok(procesador.includes("const servicios = Array.isArray(proyecto.servicios) ? proyecto.servicios : [];"), "Servicios dejó de ser determinista");
assert.ok(procesador.includes("const slug = slugDeterminista(proyecto.nombre);"), "Slug dejó de ser determinista");
assert.ok(!procesador.includes('generar("codigo"'), "Código volvió a IA");
assert.ok(!procesador.includes('generar("servicios"'), "Servicios volvió a IA");
assert.ok(!procesador.includes('generar("slug"'), "Slug volvió a IA");
console.log("✓ Código, Servicios y Slug permanecen fuera de IA.");

console.log("6. Verificando frontera fotográfica...");
assert.ok(procesador.includes("for (let i = 0; i < galeria.length; i++)"), "La galería no se procesa por fotografía");
assert.ok(procesador.includes("generar(`foto_${i + 1}_editorial`"), "No existe llamada editorial por fotografía");
assert.ok(procesador.includes("llamadasGaleriaPorFoto: 1"), "No existe contrato de una llamada por fotografía");
console.log("✓ Cada fotografía de galería recibe una única llamada editorial y reutiliza evidencia previa.");

console.log("7. Verificando frontera de ConstructorContexto consolidado...");
const activos = ["construirHero", "construirHistoria", "construirHistoriaWeb", "construirSEO", "construirMetadatosFotografia"];
activos.forEach(metodo => assert.ok(new RegExp(`\\b${metodo}\\s*\\(`).test(contexto), `${metodo} no está disponible`));
["construirKeywords", "construirCategoria", "construirEspacios"].forEach(metodo => {
    const exacto = new RegExp(`\\b${metodo}\\s*\\(`);
    assert.ok(!exacto.test(contexto), `${metodo} reapareció en ConstructorContexto`);
});
console.log("✓ ConstructorContexto conserva únicamente el contrato V2.2 activo y las superficies heredadas autorizadas.");

console.log("8. Verificando frontera de salida...");
assert.ok(procesador.includes("versionEditorial: \"V2.2\""), "La versión editorial no está fijada");
assert.ok(procesador.includes("historiaWeb"), "Historia Web no llega a salida");
assert.ok(procesador.includes("heroTexto"), "Hero no llega a salida");
assert.ok(procesador.includes("seo"), "SEO no llega a salida");
assert.ok(procesador.includes("galeriaEditorial"), "Galería editorial no llega a salida");
console.log("✓ La salida conserva Historia, Historia Web, Hero, SEO y galería editorial.");

console.log("9. Regla de consolidación...");
console.log("✓ No se modifica producción en 4.3.1.");
console.log("✓ No se realizan llamadas a OpenAI.");
console.log("✓ Esta prueba fija el mapa del flujo antes de pasar a la consolidación ejecutable.");

console.log("\n--------------------------------------");
console.log("AUDITORÍA SUPERADA — 4.3.1");
console.log("--------------------------------------\n");
console.log("✓ Entrada CSV identificada.");
console.log("✓ Evidencia visual previa protegida.");
console.log("✓ Flujo base Historia → Historia Web → Hero → SEO confirmado.");
console.log("✓ Reutilización de Historia Web confirmada.");
console.log("✓ Código, Servicios y Slug deterministas.");
console.log("✓ Galería procesada con una llamada editorial por fotografía.");
console.log("✓ ConstructorContexto consolidado sin reintroducir candidatos eliminados.");
console.log("✓ Salida editorial V2.2 identificada.");
console.log("\nCONCLUSIÓN 4.3.1: el flujo editorial V2.2 queda formalmente trazado de entrada a salida y preparado para la siguiente consolidación ejecutable.\n");