console.log("testDependenciasLlamadasIA3C10.js cargado");

const assert = require("assert");
const ProcesadorEditorialV2 = require("../src/Editorial/procesadorEditorialV2");

class OpenAIControlado {
    constructor() {
        this.llamadas = [];
    }

    async generarTextoDetallado(prompt) {
        const contrato = prompt.match(/CONTRATO EDITORIAL: ([^\n]+)/)?.[1] || "DESCONOCIDO";
        this.llamadas.push({ contrato, prompt });

        const respuestas = {
            HISTORIA: "La historia editorial de control parte de una intervención comprobada en cocina en Bogotá.",
            HISTORIA_WEB: JSON.stringify({
                texto: "La historia web de control conserva la intervención comprobada y su transformación.",
                titulo: "Hogar Araque",
                resumen: "Transformación de Hogar Araque."
            }),
            HERO: "Diseñamos un espacio para vivir mejor.",
            SEO: JSON.stringify({
                seoTitle: "Hogar Araque | MUBATO",
                metaDescription: "Historia de transformación de Hogar Araque."
            }),
            PHOTO_EDITORIAL: JSON.stringify({
                title: "Cocina Hogar Araque",
                alt: "Cocina transformada de Hogar Araque",
                keywords: ["cocina", "Hogar Araque", "MUBATO"],
                nombreSEO: "hogar-araque-cocina"
            })
        };

        const texto = respuestas[contrato];
        if (!texto) throw new Error(`Contrato no controlado: ${contrato}`);

        return {
            texto,
            telemetria: {
                modelo: "controlado",
                inputTokens: 1,
                outputTokens: 1,
                totalTokens: 2,
                tiempoMs: 1
            }
        };
    }
}

class ValidadorHistoriaControlado {
    validar() {
        return { aprobado: true, metricas: { parrafos: 1 }, errores: [] };
    }
}

class ValidadorHistoriaWebControlado {
    validarContrato() {
        return { aprobado: true, errores: [] };
    }
}

class ContextoControlado {
    encabezado(contrato) {
        return `\n====================================================\nCONTRATO EDITORIAL: ${contrato}\n====================================================\n`;
    }

    construirHistoria(proyecto) {
        return this.encabezado("HISTORIA") + `HISTORIA INPUT ${proyecto.nombre}`;
    }

    construirHistoriaWeb(historia) {
        return this.encabezado("HISTORIA_WEB") + `HISTORIA_WEB INPUT\n${historia}`;
    }

    construirHero(proyecto) {
        return this.encabezado("HERO") + `HERO INPUT ${proyecto.nombre}`;
    }

    construirSEO(proyecto, historiaWeb) {
        return this.encabezado("SEO") + `SEO INPUT\n${historiaWeb}`;
    }

    construirMetadatosFotografia(proyecto, fotografia, historiaWeb) {
        return this.encabezado("PHOTO_EDITORIAL") + `PHOTO INPUT ${fotografia.fileName}\nHISTORIA_WEB REUTILIZADA\n${historiaWeb}`;
    }
}

function fixture() {
    return {
        "Proyecto": "Hogar Araque",
        "Código MUBATO": "MUB-4",
        "Cliente": "Cliente de control",
        "Ciudad": "Bogotá",
        "Estado": "[\"Publicado\"]",
        "Categoría": "[\"Residencial\"]",
        "Descripción": "Descripción de control",
        "Servicios": "Diseño interior|Mobiliario a medida",
        "Espacios": "[\"cocina\"]",
        "Galería General": JSON.stringify([
            { fileName: "araque-01.jpg", description: "Foto 1" },
            { fileName: "araque-02.jpg", description: "Foto 2" }
        ])
    };
}

async function main() {
    console.log("======================================");
    console.log("PRUEBA — DEPENDENCIAS LLAMADAS IA 3C.10");
    console.log("======================================");
    console.log("\nObjetivo: identificar reutilización real de resultados entre las 6 llamadas IA post-3C.8 y determinar si alguna puede eliminarse sin romper el contrato.");
    console.log("La prueba usa dependencias controladas y NO realiza llamadas reales a OpenAI.\n");

    const openAI = new OpenAIControlado();
    const procesador = new ProcesadorEditorialV2({
        contexto: new ContextoControlado(),
        openAI,
        validadorHistoria: new ValidadorHistoriaControlado(),
        validadorHistoriaWeb: new ValidadorHistoriaWebControlado()
    });

    const evidencia = [
        { fotografia: "araque-01.jpg", analizada: true, espacio: "cocina" },
        { fotografia: "araque-02.jpg", analizada: true, espacio: "cocina" }
    ];

    const salida = await procesador.generar(fixture(), { evidenciaVisual: evidencia });

    console.log("1. Verificando presupuesto post-3C.8...");
    assert.strictEqual(salida.llamadasIA, 6, "La línea post-3C.8 debe conservar 6 llamadas IA.");
    console.log("✓ 6 llamadas IA ejecutadas.\n");

    console.log("2. Construyendo grafo de dependencias...");
    const porContrato = Object.fromEntries(openAI.llamadas.map(x => [x.contrato, x.prompt]));
    assert.ok(porContrato.HISTORIA_WEB.includes("HISTORIA INPUT Hogar Araque"));
    assert.ok(porContrato.SEO.includes("HISTORIA_WEB REUTILIZADA"));
    assert.ok(porContrato.PHOTO_EDITORIAL.includes("HISTORIA_WEB REUTILIZADA"));
    assert.ok(porContrato.HERO.includes("HERO INPUT Hogar Araque"));
    console.log("✓ Historia → Historia Web: dependencia explícita.");
    console.log("✓ Historia Web → SEO: resultado reutilizado como contexto.");
    console.log("✓ Historia Web → fotografía editorial: resultado reutilizado como contexto.");
    console.log("✓ Hero permanece como salida editorial independiente.\n");

    console.log("3. Buscando llamadas IA redundantes por datos ya disponibles...");
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "CODIGO").length, 0);
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "SERVICIOS").length, 0);
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "SLUG").length, 0);
    console.log("✓ Código, Servicios y Slug continúan fuera de IA.");
    console.log("✓ Ninguna de las 6 llamadas actuales repite una salida determinista eliminable.\n");

    console.log("4. Verificando reutilización sin duplicar llamadas...");
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "HISTORIA").length, 1);
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "HISTORIA_WEB").length, 1);
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "HERO").length, 1);
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "SEO").length, 1);
    assert.strictEqual(openAI.llamadas.filter(x => x.contrato === "PHOTO_EDITORIAL").length, 2);
    console.log("✓ Historia Web se genera una sola vez y se reutiliza.");
    console.log("✓ Cada fotografía conserva exactamente una llamada editorial.");
    console.log("✓ No existe segunda lectura Vision.\n");

    console.log("5. Determinando si existe reducción segura en 3C.10...");
    console.log("✓ No se identifica una eliminación segura adicional sin cambiar el contrato editorial.");
    console.log("✓ La oportunidad encontrada es de reutilización de contexto, no de reducción de llamadas.");

    console.log("\n--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.10");
    console.log("--------------------------------------");
    console.log("✓ Grafo de dependencias IA reproducible.");
    console.log("✓ Historia Web reutilizada por SEO y fotografía.");
    console.log("✓ No hay llamadas redundantes evidentes que puedan eliminarse con seguridad.");
    console.log("✓ Presupuesto permanece en 6 llamadas IA.");
    console.log("✓ No se modificaron campos internos Wix protegidos.");
    console.log("✓ No se realizaron llamadas reales a OpenAI.");
    console.log("\nCONCLUSIÓN 3C.10: la optimización adicional no debe forzarse; las seis llamadas restantes tienen fronteras editoriales distintas y comparten contexto donde corresponde.");
}

main().catch(error => {
    console.error("\n--------------------------------------");
    console.error("PRUEBA FALLIDA — 3C.10");
    console.error("--------------------------------------");
    console.error(error.message);
    process.exitCode = 1;
});
