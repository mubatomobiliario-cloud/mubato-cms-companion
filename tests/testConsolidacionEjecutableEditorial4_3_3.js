const assert = require("assert");
const ProcesadorEditorialV2 = require("../src/Editorial/procesadorEditorialV2");

console.log("testConsolidacionEjecutableEditorial4_3_3.js cargado");
console.log("======================================");
console.log("PRUEBA — CONSOLIDACIÓN EJECUTABLE EDITORIAL 4.3.3");
console.log("======================================\n");
console.log("Objetivo: ejecutar el flujo V2.2 completo con dependencias controladas y demostrar que el recorrido real coincide con el mapa consolidado, sin llamadas reales a OpenAI.\n");

class ContextoControlado {
    construirHistoria(proyecto) { return `HISTORIA:${proyecto.nombre}`; }
    construirHistoriaWeb(historia) { return `HISTORIA_WEB:${historia}`; }
    construirHero(proyecto) { return `HERO:${proyecto.nombre}`; }
    construirSEO(proyecto, historiaWeb) { return `SEO:${proyecto.nombre}:${historiaWeb}`; }
    construirMetadatosFotografia(proyecto, foto, historiaWeb) {
        return `FOTO:${proyecto.nombre}:${foto.nombre}:${historiaWeb}`;
    }
}

class OpenAIControlado {
    constructor() { this.etapas = []; }
    async generarTextoDetallado(prompt) {
        const texto = String(prompt);
        this.etapas.push(texto);
        if (texto.startsWith("HISTORIA:")) return { texto: "Historia editorial válida en un único párrafo.", telemetria: {} };
        if (texto.startsWith("HISTORIA_WEB:")) return { texto: JSON.stringify({ texto: "Historia web válida." }), telemetria: {} };
        if (texto.startsWith("HERO:")) return { texto: "Hero editorial válido.", telemetria: {} };
        if (texto.startsWith("SEO:")) return { texto: JSON.stringify({ seoTitle: "Título SEO", metaDescription: "Descripción SEO" }), telemetria: {} };
        if (texto.startsWith("FOTO:")) return { texto: JSON.stringify({ title: "Título foto", alt: "Alt foto", nombreSEO: "foto-seo", keywords: ["mubato"] }), telemetria: {} };
        throw new Error(`Etapa inesperada: ${texto}`);
    }
}

class ValidadorHistoriaControlado { validar() { return { aprobado: true, metricas: { parrafos: 1 }, errores: [] }; } }
class ValidadorHistoriaWebControlado { validarContrato() { return { aprobado: true, errores: [] }; } }

const contexto = new ContextoControlado();
const openAI = new OpenAIControlado();
const procesador = new ProcesadorEditorialV2({
    contexto,
    openAI,
    validadorHistoria: new ValidadorHistoriaControlado(),
    validadorHistoriaWeb: new ValidadorHistoriaWebControlado()
});

const fila = {
    "Proyecto": "Proyecto Control 4.3.3",
    "Código MUBATO": "MUB-001",
    "Servicios": "Diseño|Mobiliario",
    "Galería General": JSON.stringify([
        { fileName: "foto-01.jpg", description: "Foto 1" },
        { fileName: "foto-02.jpg", description: "Foto 2" },
        { fileName: "foto-03.jpg", description: "Foto 3" }
    ]),
    "Espacios": "[]",
    "Categoría": "[]",
    "Estado": "[]",
    "Descripción": "Proyecto de prueba"
};

const evidenciaVisual = [
    { fotografia: "foto-01.jpg", analizada: true, observacion: "evidencia 1" },
    { fotografia: "foto-02.jpg", analizada: true, observacion: "evidencia 2" },
    { fotografia: "foto-03.jpg", analizada: true, observacion: "evidencia 3" }
];

(async () => {
    console.log("1. Ejecutando recorrido completo con dependencias controladas...");
    const salida = await procesador.generar(fila, { evidenciaVisual });
    console.log("✓ Flujo V2.2 ejecutado de entrada a salida.\n");

    console.log("2. Verificando orden de etapas...");
    assert.deepStrictEqual(openAI.etapas.map((x) => x.split(":")[0]), [
        "HISTORIA", "HISTORIA_WEB", "HERO", "SEO", "FOTO", "FOTO", "FOTO"
    ]);
    console.log("✓ Orden confirmado: Historia → Historia Web → Hero → SEO → galería.\n");

    console.log("3. Verificando reutilización de contexto...");
    assert.ok(openAI.etapas[1].includes("HISTORIA:Proyecto Control 4.3.3"));
    assert.ok(openAI.etapas[3].includes("HISTORIA_WEB:"));
    assert.ok(openAI.etapas[4].includes("HISTORIA_WEB:"));
    assert.ok(openAI.etapas[5].includes("HISTORIA_WEB:"));
    assert.ok(openAI.etapas[6].includes("HISTORIA_WEB:"));
    console.log("✓ Historia alimenta Historia Web; Historia Web se reutiliza en SEO y las fotografías.\n");

    console.log("4. Verificando frontera de galería...");
    assert.strictEqual(salida.galeriaEditorial.length, 3);
    assert.strictEqual(salida.llamadasIA, 7);
    assert.strictEqual(salida.telemetria.llamadasGaleriaPorFoto, 1);
    console.log("✓ 4 llamadas base + 3 llamadas de galería = 7 llamadas IA.");
    console.log("✓ Una llamada editorial por fotografía.\n");

    console.log("5. Verificando deterministas y contrato de salida...");
    assert.strictEqual(salida.codigo, "MUB-001");
    assert.deepStrictEqual(salida.servicios, ["Diseño", "Mobiliario"]);
    assert.strictEqual(salida.slug, "proyecto-control-4-3-3");
    assert.strictEqual(salida.versionEditorial, "V2.2");
    assert.ok(salida.historia);
    assert.ok(salida.historiaWeb);
    assert.ok(salida.heroTexto);
    assert.ok(salida.seo.seoTitle);
    console.log("✓ Código, Servicios y Slug permanecen deterministas.");
    console.log("✓ Salida editorial V2.2 completa.\n");

    console.log("6. Verificando que Vision no se ejecute dentro del flujo...");
    assert.ok(!openAI.etapas.some((x) => x.includes("VISION")));
    console.log("✓ Vision permanece como evidencia previa y no se duplica.\n");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 4.3.3");
    console.log("--------------------------------------\n");
    console.log("✓ Flujo ejecutable V2.2 reproducible.");
    console.log("✓ Orden editorial confirmado.");
    console.log("✓ Reutilización de contexto confirmada.");
    console.log("✓ Galería confirmada como N llamadas, una por fotografía.");
    console.log("✓ Deterministas preservados.");
    console.log("✓ Vision no duplicada.");
    console.log("✓ Contrato de salida V2.2 preservado.");
    console.log("✓ No se realizaron llamadas reales a OpenAI.");
    console.log("\nCONCLUSIÓN 4.3.3: el flujo editorial V2.2 consolidado coincide con el mapa y puede ejecutarse de forma reproducible bajo dependencias controladas.");
})().catch((error) => {
    console.error("\nPRUEBA FALLIDA — 4.3.3\n");
    console.error(error);
    process.exitCode = 1;
});
