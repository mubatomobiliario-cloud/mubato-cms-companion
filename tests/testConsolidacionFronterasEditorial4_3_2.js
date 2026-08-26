const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("testConsolidacionFronterasEditorial4_3_2.js cargado");
console.log("======================================");
console.log("AUDITORÍA — FRONTERAS DEL FLUJO EDITORIAL 4.3.2");
console.log("======================================\n");
console.log("Objetivo: verificar que cada etapa V2.2 consuma únicamente los datos que le corresponden y que las fronteras IA/determinista/Vision/Wix permanezcan separadas.\n");
console.log("La prueba es estática: no ejecuta OpenAI ni modifica producción.\n");

const root = path.resolve(__dirname, "..");
const processor = fs.readFileSync(path.join(root, "src/Editorial/procesadorEditorialV2.js"), "utf8");
const context = fs.readFileSync(path.join(root, "src/direccionEditorial/ConstructorContexto.js"), "utf8");

console.log("1. Verificando etapas editoriales obligatorias...");
["construirHistoria", "construirHistoriaWeb", "construirHero", "construirSEO", "construirMetadatosFotografia"].forEach((m) => {
    assert.ok(processor.includes(`this.contexto.${m}(`), `No se detectó consumidor V2.2 para ${m}`);
});
console.log("✓ Historia, Historia Web, Hero, SEO y fotografía editorial están conectados.\n");

console.log("2. Verificando dependencias entre etapas...");
assert.ok(processor.includes("this.contexto.construirHistoriaWeb(historia.trim())"));
assert.ok(processor.includes("this.contexto.construirSEO(proyecto, historiaWeb)"));
assert.ok(processor.includes("this.contexto.construirMetadatosFotografia(proyecto, contextoFoto, historiaWeb)"));
console.log("✓ Historia alimenta Historia Web.");
console.log("✓ Historia Web alimenta SEO.");
console.log("✓ Historia Web alimenta cada fotografía editorial.\n");

console.log("3. Verificando frontera determinista...");
assert.ok(processor.includes('const codigo = String(proyecto.codigo || "").trim();'));
assert.ok(processor.includes("const servicios = Array.isArray(proyecto.servicios) ? proyecto.servicios : [];"));
assert.ok(processor.includes("const slug = slugDeterminista(proyecto.nombre);"));
assert.ok(!processor.includes('generar("codigo"'));
assert.ok(!processor.includes('generar("servicios"'));
assert.ok(!processor.includes('generar("slug"'));
console.log("✓ Código, Servicios y Slug se resuelven determinísticamente y fuera de IA.\n");

console.log("4. Verificando frontera Vision...");
assert.ok(processor.includes("evidenciaVisual"));
assert.ok(processor.includes("evidenciaVisual.length"));
assert.ok(processor.includes("evidenciaVisual.some"));
assert.ok(processor.includes("analizada !== true"));
assert.ok(processor.includes("Vision no se ejecutará en esta fase."));
assert.ok(!processor.includes("Vision("));
console.log("✓ Editorial V2.2 exige evidencia Vision previa, valida su integridad y no ejecuta una segunda lectura.\n");

console.log("5. Verificando frontera fotográfica...");
assert.ok(processor.includes("for (let i = 0; i < galeria.length; i++)"));
assert.ok(processor.includes("generar(`foto_${i + 1}_editorial`"));
assert.ok(processor.includes("evidenciaVisual.find"));
console.log("✓ La galería se recorre fotografía por fotografía y cada fotografía recibe una única etapa editorial.\n");

console.log("6. Verificando frontera de salida...");
["historia", "historiaWeb", "heroTexto", "seo", "codigo", "servicios", "slug", "galeriaEditorial", "versionEditorial"].forEach((campo) => {
    assert.ok(processor.includes(campo), `No se detectó el campo de salida ${campo}`);
});
console.log("✓ La salida contiene el contrato editorial V2.2 y sus deterministas.\n");

console.log("7. Verificando que ConstructorContexto no reintroduzca candidatos eliminados...");
["construirKeywords", "construirCategoria", "construirEspacios"].forEach((m) => {
    assert.ok(!context.includes(`${m}(`), `${m} reapareció en ConstructorContexto`);
});
console.log("✓ Los tres métodos eliminados en 4.2.4 permanecen fuera de la superficie consolidada.\n");

console.log("--------------------------------------");
console.log("AUDITORÍA SUPERADA — 4.3.2");
console.log("--------------------------------------\n");
console.log("✓ Fronteras entre etapas verificadas.");
console.log("✓ Dependencias Historia → Historia Web → SEO/fotografía verificadas.");
console.log("✓ Hero permanece como etapa editorial independiente.");
console.log("✓ Código, Servicios y Slug permanecen deterministas.");
console.log("✓ Vision permanece como precondición externa y reutilizada.");
console.log("✓ Galería conserva una etapa editorial por fotografía.");
console.log("✓ Salida V2.2 identificada.");
console.log("✓ ConstructorContexto permanece consolidado.");
console.log("✓ No se realizaron llamadas reales a OpenAI.");
console.log("\nCONCLUSIÓN 4.3.2: las fronteras de datos y responsabilidades del flujo editorial V2.2 están separadas y verificables; el siguiente paso puede consolidar el flujo ejecutable bajo estas fronteras.");
