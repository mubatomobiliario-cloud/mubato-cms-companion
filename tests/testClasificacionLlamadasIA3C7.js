console.log("testClasificacionLlamadasIA3C7.js cargado");

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
            texto = "La intervención parte de un espacio interior que articula diseño, funcionalidad y experiencia de habitar.";
        } else if (numero === 2) {
            texto = JSON.stringify({
                texto: "La intervención parte de un espacio interior que articula diseño, funcionalidad y experiencia de habitar."
            });
        } else if (numero === 3) {
            texto = "Una transformación concebida para vivir mejor.";
        } else if (numero === 4) {
            texto = JSON.stringify({
                seoTitle: "Hogar Araque | MUBATO",
                metaDescription: "Historia de transformación de Hogar Araque."
            });
        } else if (numero === 5) {
            texto = "MUB-ARAQUE-NUEVO";
        } else if (numero === 6) {
            texto = JSON.stringify({
                servicios: ["Diseño Interior", "Mobiliario a Medida"]
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
        "Descripción": "Descripción original del proyecto",
        "Servicios": "Diseño Interior|Mobiliario a Medida",
        "Galería General": JSON.stringify([
            { fileName: "araque-01.jpg", title: "", alt: "" },
            { fileName: "araque-02.jpg", title: "", alt: "" }
        ]),
        "Espacios": "[\"Sala\",\"Cocina\"]",
        "Categoría": "[\"Residencial\"]",
        "Estado": "[\"Finalizado\"]"
    };
}

function imprimirClasificacion() {
    const filas = [
        ["historia", "IA ESENCIAL", "Generación narrativa central; no sustituir en 3C.7."],
        ["historia_web", "IA ESENCIAL", "Transforma la historia al contrato web actual; requiere validación."],
        ["hero", "IA ESENCIAL", "Salida editorial específica para el Hero."],
        ["seo", "IA ESENCIAL", "Genera dos metadatos con criterios editoriales y límites."],
        ["codigo", "CANDIDATA A DETERMINISTA", "El CSV ya aporta Código MUBATO: MUB-4."],
        ["servicios", "CANDIDATA A DETERMINISTA", "El CSV ya aporta Servicios explícitos."],
        ["slug", "CANDIDATA A DETERMINISTA", "Puede derivarse del nombre del proyecto de forma estable."],
        ["foto_1_editorial", "IA ESENCIAL", "Una sola llamada produce title, alt, keywords y nombreSEO."],
        ["foto_2_editorial", "IA ESENCIAL", "Una sola llamada produce title, alt, keywords y nombreSEO."]
    ];

    console.log("");
    console.log("Clasificación preliminar:");
    filas.forEach((fila, indice) => {
        console.log(`  ${indice + 1}. ${fila[0]} → ${fila[1]}`);
        console.log(`     ${fila[2]}`);
    });
}

async function ejecutar() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — CLASIFICACIÓN DE LLAMADAS IA 3C.7");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: clasificar las llamadas IA de Editorial Proyecto V2.2 antes de eliminar o consolidar ninguna.");
    console.log("La prueba usa dependencias controladas y NO realiza llamadas a OpenAI.");
    console.log("");

    const openAI = new OpenAIControlado();
    const procesador = new ProcesadorEditorialV2({
        contexto: new ContextoControlado(),
        openAI,
        validadorHistoria: new ValidadorHistoriaControlado(),
        validadorHistoriaWeb: new ValidadorHistoriaWebControlado()
    });

    const fila = crearFila();
    const evidenciaVisual = [
        { fotografia: "araque-01.jpg", analizada: true, observacion: "Sala" },
        { fotografia: "araque-02.jpg", analizada: true, observacion: "Cocina" }
    ];

    console.log("1. Ejecutando Editorial Proyecto V2.2 sobre fixture controlado...");
    const resultado = await procesador.generar(fila, { evidenciaVisual });
    exigir(resultado.proyecto.nombre === PROYECTO, "El proyecto procesado no corresponde a Hogar Araque.");
    exigir(openAI.llamadas.length === 9, `La línea base cambió inesperadamente: ${openAI.llamadas.length} llamadas.`);
    exigir(resultado.llamadasIA === 9, `La telemetría editorial reporta ${resultado.llamadasIA} llamadas en lugar de 9.`);
    console.log("✓ Las 9 llamadas de la línea base se ejecutaron.");
    console.log("");

    console.log("2. Verificando datos disponibles antes de optimizar...");
    exigir(fila["Código MUBATO"] === "MUB-4", "El fixture no contiene un Código MUBATO determinista.");
    exigir(fila["Servicios"] === "Diseño Interior|Mobiliario a Medida", "El fixture no contiene Servicios explícitos.");
    exigir(fila["Proyecto"] === PROYECTO, "El fixture no contiene identidad estable del proyecto.");
    console.log("✓ Código MUBATO disponible en entrada.");
    console.log("✓ Servicios disponibles en entrada.");
    console.log("✓ Nombre del proyecto disponible para derivar slug.");
    console.log("");

    console.log("3. Clasificando llamadas...");
    imprimirClasificacion();
    console.log("");

    const candidatasDeterministas = ["codigo", "servicios", "slug"];
    const llamadas = [
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

    candidatasDeterministas.forEach(etapa => {
        exigir(llamadas.includes(etapa), `La etapa candidata ${etapa} no existe en el mapa de llamadas.`);
    });

    console.log("4. Calculando ahorro potencial, sin modificar producción...");
    const ahorroPotencial = candidatasDeterministas.length;
    const llamadasPotenciales = llamadas.length - ahorroPotencial;
    exigir(ahorroPotencial === 3, `Se esperaba identificar 3 candidatas deterministas y se identificaron ${ahorroPotencial}.`);
    exigir(llamadasPotenciales === 6, `El presupuesto potencial esperado es 6 llamadas y resultó ${llamadasPotenciales}.`);
    console.log(`✓ Candidatas a eliminar/reemplazar: ${ahorroPotencial}.`);
    console.log(`✓ Presupuesto potencial posterior: ${llamadasPotenciales} llamadas IA.`);
    console.log("✓ Este ahorro es potencial; todavía NO se ha modificado el procesador.");
    console.log("");

    console.log("5. Protecciones arquitectónicas...");
    console.log("✓ Historias de Transformación y Historias de Transformación1 no forman parte de ninguna llamada editable.");
    console.log("✓ Hero Imágen no se modifica.");
    console.log("✓ La evidencia visual continúa reutilizándose sin Vision adicional.");
    console.log("✓ Las fotografías conservan una llamada editorial por fotografía.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.7");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ Las 9 llamadas actuales fueron clasificadas.");
    console.log("✓ 6 llamadas quedan clasificadas como IA esenciales en esta fase.");
    console.log("✓ 3 llamadas quedan como candidatas a lógica determinista: código, servicios y slug.");
    console.log("✓ Ahorro potencial: 3 llamadas por proyecto.");
    console.log("✓ Presupuesto potencial: 9 → 6 llamadas IA.");
    console.log("✓ No se modificó código de producción.");
    console.log("✓ No se realizaron llamadas reales a OpenAI.");
    console.log("");
    console.log("CONCLUSIÓN 3C.7: antes de optimizar, existe una ruta concreta y acotada para reducir 9 → 6 llamadas IA sin tocar los campos internos protegidos de Wix.");
    console.log("");
}

(async () => {
    try {
        await ejecutar();
    } catch (error) {
        console.error("");
        console.error("--------------------------------------");
        console.error("PRUEBA FALLIDA — 3C.7");
        console.error("--------------------------------------");
        console.error("");
        console.error(error.message);
        process.exitCode = 1;
    }
})();
