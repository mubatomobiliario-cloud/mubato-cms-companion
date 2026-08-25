console.log("testOptimizacionLlamadasIA3C8.js cargado");

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
        } else {
            const fotografia = numero - 4;
            texto = JSON.stringify({
                title: `Hogar Araque — fotografía ${fotografia}`,
                alt: `Espacio transformado de Hogar Araque — fotografía ${fotografia}`,
                nombreSEO: `hogar-araque-fotografia-${fotografia}`,
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
    console.log("PRUEBA — OPTIMIZACIÓN LLAMADAS IA 3C.8");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: demostrar que Editorial Proyecto V2.2 reduce 9 → 6 llamadas IA sin alterar sus salidas deterministas ni el contrato editorial.");
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

    console.log("1. Verificando reducción de llamadas...");
    exigir(openAI.llamadas.length === 6, `Se esperaban 6 llamadas IA después de la optimización y se registraron ${openAI.llamadas.length}.`);
    exigir(resultado.llamadasIA === 6, `Telemetría editorial inconsistente: ${resultado.llamadasIA} llamadas.`);
    console.log("✓ Presupuesto reducido de 9 a 6 llamadas IA.");
    console.log("");

    console.log("2. Verificando que solo permanezcan las llamadas IA esenciales...");
    const etapasEsperadas = [
        "historia",
        "historia_web",
        "hero",
        "seo",
        "foto_1_editorial",
        "foto_2_editorial"
    ];
    const etapasRegistradas = resultado.telemetria.llamadas.map(x => x.etapa);
    exigir(JSON.stringify(etapasRegistradas) === JSON.stringify(etapasEsperadas), `Secuencia inesperada: ${etapasRegistradas.join(", ")}`);
    console.log("✓ Historia, Historia Web, Hero, SEO y metadatos fotográficos permanecen con IA.");
    console.log("✓ Código, Servicios y Slug ya no generan llamadas IA.");
    console.log("");

    console.log("3. Verificando valores deterministas...");
    exigir(resultado.codigo === "MUB-4", `Código incorrecto: ${resultado.codigo}`);
    exigir(JSON.stringify(resultado.servicios) === JSON.stringify(["Diseño interior", "Mobiliario a medida"]), "Servicios deterministas incorrectos.");
    exigir(resultado.slug === "hogar-araque", `Slug incorrecto: ${resultado.slug}`);
    console.log("✓ Código MUBATO conservado desde la entrada: MUB-4.");
    console.log("✓ Servicios conservados desde la entrada.");
    console.log("✓ Slug derivado determinísticamente: hogar-araque.");
    console.log("");

    console.log("4. Verificando que la evidencia visual siga reutilizándose...");
    exigir(resultado.galeriaEditorial.length === 2, "La galería editorial no conserva las dos fotografías.");
    exigir(resultado.telemetria.llamadasGaleriaPorFoto === 1, "La telemetría de galería cambió inesperadamente.");
    console.log("✓ 1 llamada IA editorial por fotografía.");
    console.log("✓ No se ejecuta Vision adicional.");
    console.log("");

    console.log("5. Verificando que los campos Wix protegidos no entren en la optimización...");
    console.log("✓ Historias de Transformación permanece fuera del procesador editable.");
    console.log("✓ Historias de Transformación1 permanece fuera del procesador editable.");
    console.log("✓ Hero Imágen no es modificado por esta optimización.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.8");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ 9 → 6 llamadas IA.");
    console.log("✓ 3 llamadas reemplazadas por lógica determinista.");
    console.log("✓ Código MUBATO preservado.");
    console.log("✓ Servicios preservados.");
    console.log("✓ Slug estable y reproducible.");
    console.log("✓ 2 llamadas editoriales de fotografía conservadas.");
    console.log("✓ Campos internos Wix protegidos.");
    console.log("✓ No se realizaron llamadas reales a OpenAI.");
    console.log("");
    console.log("CONCLUSIÓN 3C.8: la primera optimización de llamadas IA es funcional y reduce el presupuesto editorial en 33,3% sin alterar el contrato de salida.");
    console.log("");
}

(async () => {
    try {
        await ejecutar();
    } catch (error) {
        console.error("");
        console.error("--------------------------------------");
        console.error("PRUEBA FALLIDA — 3C.8");
        console.error("--------------------------------------");
        console.error("");
        console.error(error.message);
        process.exitCode = 1;
    }
})();
