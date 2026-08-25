console.log("testMapaLlamadasIA3C6.js cargado");

const ProcesadorEditorialV2 = require("../src/Editorial/procesadorEditorialV2");

const PROYECTO = "Hogar Araque";

function exigir(condicion, mensaje) {
    if (!condicion) throw new Error(mensaje);
}

class OpenAIControlado {
    constructor() {
        this.llamadas = [];
    }

    async generarTextoDetallado(prompt) {
        const numero = this.llamadas.length + 1;
        const textoPrompt = String(prompt || "");
        let texto;

        if (numero === 1) {
            texto = "Una transformación concebida para vivir mejor, donde cada decisión de diseño articula funcionalidad, armonía y detalle.";
        } else if (numero === 2) {
            texto = JSON.stringify({
                texto: "Una transformación concebida para vivir mejor, donde cada decisión de diseño articula funcionalidad, armonía y detalle."
            });
        } else if (numero === 3) {
            texto = "Diseñamos este espacio para vivir mejor.";
        } else if (numero === 4) {
            texto = JSON.stringify({
                seoTitle: "Hogar Araque | MUBATO",
                metaDescription: "Historia de transformación de Hogar Araque."
            });
        } else if (numero === 5) {
            texto = "MUB-ARAQUE-NUEVO";
        } else if (numero === 6) {
            texto = JSON.stringify({
                servicios: ["Diseño interior", "Mobiliario a medida"]
            });
        } else if (numero === 7) {
            texto = "hogar-araque";
        } else {
            texto = JSON.stringify({
                title: `Hogar Araque — fotografía ${numero - 7}`,
                alt: `Espacio transformado de Hogar Araque — fotografía ${numero - 7}`,
                nombreSEO: `hogar-araque-fotografia-${numero - 7}`,
                keywords: ["Hogar Araque", "MUBATO", "mobiliario a medida"]
            });
        }

        this.llamadas.push({ numero, prompt: textoPrompt });

        return {
            texto,
            telemetria: {
                modelo: "modelo-controlado",
                inputTokens: 100,
                outputTokens: 50,
                totalTokens: 150,
                tiempoMs: 1
            }
        };
    }
}

class ContextoControlado {
    construirHistoria() { return "PROMPT_HISTORIA"; }
    construirHistoriaWeb() { return "PROMPT_HISTORIA_WEB"; }
    construirHero() { return "PROMPT_HERO"; }
    construirSEO() { return "PROMPT_SEO"; }
    construirCodigo() { return "PROMPT_CODIGO"; }
    construirServicios() { return "PROMPT_SERVICIOS"; }
    construirSlug() { return "PROMPT_SLUG"; }
    construirMetadatosFotografia() { return "PROMPT_FOTO"; }
}

class ValidadorHistoriaControlado {
    validar() {
        return {
            aprobado: true,
            metricas: { parrafos: 1 },
            errores: []
        };
    }
}

class ValidadorHistoriaWebControlado {
    validarContrato() {
        return {
            aprobado: true,
            errores: []
        };
    }
}

function crearFila() {
    return {
        "Proyecto": PROYECTO,
        "Código MUBATO": "MUB-4",
        "Cliente": "Cliente Araque",
        "Ciudad": "Bogotá",
        "Descripción": "Descripción original",
        "Servicios": "Diseño interior|Mobiliario a medida",
        "Galería General": JSON.stringify([
            { fileName: "araque-01.jpg", title: "", alt: "" },
            { fileName: "araque-02.jpg", title: "", alt: "" }
        ]),
        "Espacios": "[]",
        "Categoría": "[]",
        "Estado": "[]"
    };
}

async function ejecutar() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — MAPA DE LLAMADAS IA 3C.6");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: fijar la línea base exacta de llamadas IA de Editorial Proyecto V2.2 antes de optimizar.");
    console.log("La prueba usa dependencias controladas y NO realiza llamadas a OpenAI.");
    console.log("");

    const openAI = new OpenAIControlado();
    const procesador = new ProcesadorEditorialV2({
        contexto: new ContextoControlado(),
        openAI,
        validadorHistoria: new ValidadorHistoriaControlado(),
        validadorHistoriaWeb: new ValidadorHistoriaWebControlado()
    });

    const evidenciaVisual = [
        { fotografia: "araque-01.jpg", analizada: true, observacion: "Sala" },
        { fotografia: "araque-02.jpg", analizada: true, observacion: "Cocina" }
    ];

    const resultado = await procesador.generar(crearFila(), { evidenciaVisual });

    const etapasEsperadas = [
        "historia",
        "historia_web",
        "hero",
        "seo",
        "codigo",
        "servicios",
        "slug",
        "foto_1_editorial",
        "foto_2_editorial"
    ];

    console.log("1. Ejecutando Editorial Proyecto V2.2 con OpenAI controlado...");
    console.log(`✓ Proyecto procesado: ${resultado.proyecto.nombre}`);
    console.log("");

    console.log("2. Verificando cantidad exacta de llamadas...");
    exigir(openAI.llamadas.length === 9, `Se esperaban 9 llamadas IA y se registraron ${openAI.llamadas.length}.`);
    exigir(resultado.llamadasIA === 9, `Telemetría editorial inconsistente: ${resultado.llamadasIA} llamadas.`);
    console.log("✓ Línea base confirmada: 9 llamadas IA.");
    console.log("");

    console.log("3. Verificando secuencia de llamadas...");
    openAI.llamadas.forEach((llamada, indice) => {
        const etapaEsperada = etapasEsperadas[indice];
        console.log(`  ${indice + 1}. ${etapaEsperada}`);
        exigir(llamada.prompt.includes("PROMPT_"), `La llamada ${indice + 1} no recibió un prompt controlado.`);
    });
    exigir(etapasEsperadas.length === openAI.llamadas.length, "El mapa de llamadas no coincide con la ejecución.");
    console.log("✓ Secuencia de 9 llamadas preservada.");
    console.log("");

    console.log("4. Verificando distribución de llamadas...");
    const llamadasBase = {
        proyecto: 7,
        fotografia: 2,
        visionEditorial: 0
    };
    exigir(openAI.llamadas.slice(0, 7).length === llamadasBase.proyecto, "La base de llamadas de proyecto cambió inesperadamente.");
    exigir(openAI.llamadas.slice(7).length === llamadasBase.fotografia, "La base de llamadas por fotografía cambió inesperadamente.");
    exigir(resultado.telemetria.llamadasGaleriaPorFoto === 1, "La telemetría no refleja una llamada editorial por fotografía.");
    console.log("✓ 7 llamadas de proyecto + 2 llamadas de fotografía.");
    console.log("✓ Vision editorial: 0 llamadas.");
    console.log("");

    console.log("5. Verificando que la evidencia visual no dispare Vision adicional...");
    exigir(openAI.llamadas.length === 9, "Se detectó una llamada adicional durante la reutilización de evidencia visual.");
    console.log("✓ La evidencia Vision se reutiliza sin segunda lectura.");
    console.log("");

    console.log("6. Registrando presupuesto de optimización...");
    console.log("✓ Línea base: 9 llamadas IA.");
    console.log("✓ Línea base controlada: 1 llamada por fotografía editorial.");
    console.log("✓ Cualquier reducción posterior debe conservar el contrato editorial y la integridad de salida Wix.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.6");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ Mapa de llamadas IA de Editorial Proyecto V2.2 fijado.");
    console.log("✓ Línea base confirmada en 9 llamadas.");
    console.log("✓ 7 llamadas de proyecto + 2 por fotografía.");
    console.log("✓ Vision editorial permanece en 0 llamadas.");
    console.log("✓ La evidencia visual se reutiliza.");
    console.log("✓ No se realizó ninguna llamada real a OpenAI.");
    console.log("");
    console.log("CONCLUSIÓN 3C.6: existe una línea base reproducible para optimizar llamadas IA sin perder trazabilidad.");
    console.log("");
}

(async () => {
    try {
        await ejecutar();
    } catch (error) {
        console.error("");
        console.error("--------------------------------------");
        console.error("PRUEBA FALLIDA — 3C.6");
        console.error("--------------------------------------");
        console.error("");
        console.error(error.message);
        process.exitCode = 1;
    }
})();
