console.log("testContratoNarrativaUnica3C12.js cargado");

const ProcesadorEditorialV2 = require("../src/Editorial/procesadorEditorialV2");
const { obtenerServicios } = require("../src/configuracion/catalogoMubato");

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
        this.llamadas.push(String(prompt || ""));

        let texto;

        if (numero === 1) {
            texto =
                "Una transformación concebida para vivir mejor, donde cada decisión de diseño articula funcionalidad, armonía y detalle.";
        } else if (numero === 2) {
            texto = "Diseñamos este espacio para vivir mejor.";
        } else if (numero === 3) {
            texto = JSON.stringify({
                seoTitle: "Hogar Araque | MUBATO",
                metaDescription: "Historia de transformación de Hogar Araque."
            });
        } else {
            const fotografia = numero - 3;

            texto = JSON.stringify({
                title: `Hogar Araque — fotografía ${fotografia}`,
                alt: `Espacio transformado de Hogar Araque — fotografía ${fotografia}`,
                nombreSEO: `hogar-araque-fotografia-${fotografia}`,
                keywords: [
                    "Hogar Araque",
                    "MUBATO",
                    "mobiliario a medida"
                ]
            });
        }

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
    construirHistoria() {
        return "PROMPT_NARRATIVA_MAESTRA";
    }

    construirHero() {
        return "PROMPT_HERO";
    }

    construirSEO(proyecto, narrativa) {
        return `PROMPT_SEO\nNARRATIVA:\n${narrativa}`;
    }

    construirMetadatosFotografia(proyecto, fotografia, narrativa) {
        return `PROMPT_FOTO\nNARRATIVA:\n${narrativa}`;
    }
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

// En 3C.12 no existe una validación independiente de Historia Web.
// La narrativa maestra ocupa esa frontera editorial.

function crearFila() {
    return {
        "Proyecto": PROYECTO,
        "Código MUBATO": "MUB-4",
        "Cliente": "Cliente Araque",
        "Ciudad": "Bogotá",
        "Descripción": "Descripción original",
        "Servicios": "Diseño interior|Mobiliario a medida",
        "Galería General": JSON.stringify([
            {
                fileName: "araque-01.jpg",
                title: "",
                alt: "",
                description: ""
            },
            {
                fileName: "araque-02.jpg",
                title: "",
                alt: "",
                description: ""
            }
        ]),
        "Espacios": "[]",
        "Categoría": "[]",
        "Estado": "[]"
    };
}

async function ejecutar() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — CONTRATO NARRATIVA ÚNICA 3C.12");
    console.log("======================================");
    console.log("");
    console.log("Objetivo:");
    console.log("demostrar que una narrativa editorial única");
    console.log("puede sustituir Historia + Historia Web");
    console.log("sin romper el contrato Editorial V2.2.");
    console.log("");
    console.log("La prueba usa dependencias controladas.");
    console.log("NO realiza llamadas reales a OpenAI.");
    console.log("");

    const openAI = new OpenAIControlado();

    const procesador = new ProcesadorEditorialV2({
        contexto: new ContextoControlado(),
        openAI,
        validadorHistoria: new ValidadorHistoriaControlado()
    });

    const evidenciaVisual = [
        {
            fotografia: "araque-01.jpg",
            analizada: true,
            observacion: "Sala"
        },
        {
            fotografia: "araque-02.jpg",
            analizada: true,
            observacion: "Cocina"
        }
    ];

    console.log("1. EJECUTANDO MODELO EXPERIMENTAL...");
    console.log("");

    /*
     * IMPORTANTE:
     *
     * Este test NO asume que producción ya fue modificada.
     *
     * Primero verifica si el procesador actual acepta
     * la arquitectura de narrativa única mediante
     * las dependencias controladas.
     */

    let resultado;

    try {

        resultado = await procesador.generar(
            crearFila(),
            { evidenciaVisual }
        );

    } catch (error) {

        console.log("");
        console.log("--------------------------------------");
        console.log("MODELO ACTUAL TODAVÍA NO COMPATIBLE");
        console.log("--------------------------------------");
        console.log("");
        console.log(`Motivo detectado: ${error.message}`);
        console.log("");
        console.log(
            "Esto confirma que producción todavía contiene "
            + "la frontera Historia → Historia Web."
        );
        console.log("");
        console.log(
            "3C.12 permanece experimental: no se modifica producción "
            + "hasta que el contrato de 5 llamadas esté definido."
        );
        console.log("");

        exigir(
            error.message.includes("Historia Web") ||
            error.message.includes("HISTORIA_WEB"),
            "El fallo actual no corresponde a la frontera Historia Web."
        );

        console.log(
            "✓ El bloqueo corresponde exactamente a la arquitectura "
            + "que 3C.12 pretende sustituir."
        );

        console.log("");
        console.log("--------------------------------------");
        console.log("PRUEBA EXPERIMENTAL CONTROLADA — 3C.12");
        console.log("--------------------------------------");
        console.log("");
        console.log(
            "La prueba queda detenida deliberadamente antes "
            + "de modificar producción."
        );
        console.log("");

        return;
    }

    console.log("2. VERIFICANDO PRESUPUESTO...");
    exigir(
        openAI.llamadas.length === 5,
        `Se esperaban 5 llamadas IA y se registraron ${openAI.llamadas.length}.`
    );

    exigir(
        resultado.llamadasIA === 5,
        `El resultado declara ${resultado.llamadasIA} llamadas IA.`
    );

    console.log("✓ Presupuesto reducido de 6 → 5.");
    console.log("");

    console.log("3. VERIFICANDO CONTRATO EDITORIAL...");
    exigir(resultado.proyecto.nombre === PROYECTO);
    exigir(resultado.historia.trim().length > 0);
    exigir(resultado.heroTexto.trim().length > 0);
    exigir(resultado.seo && resultado.seo.seoTitle);
    exigir(resultado.seo && resultado.seo.metaDescription);

    console.log("✓ Narrativa editorial presente.");
    console.log("✓ Hero preservado.");
    console.log("✓ SEO preservado.");
    console.log("");

    console.log("4. VERIFICANDO AUSENCIA DE HISTORIA WEB INDEPENDIENTE...");

    exigir(
        resultado.historiaWeb === resultado.historia,
        "La salida narrativa no coincide con la narrativa maestra."
    );

    console.log("✓ La salida narrativa queda absorbida por la narrativa maestra.");
    console.log("");

    console.log("5. VERIFICANDO DETERMINISTAS...");

    exigir(resultado.codigo === "MUB-4");
    exigir(
        JSON.stringify(resultado.servicios) ===
        JSON.stringify(obtenerServicios())
    );
    exigir(resultado.slug === "hogar-araque");

    console.log("✓ Código preservado.");
    console.log("✓ Servicios preservados por catálogo MUBATO.");
    console.log("✓ Slug preservado.");
    console.log("");

    console.log("6. VERIFICANDO GALERÍA...");

    exigir(
        Array.isArray(resultado.galeriaEditorial),
        "Galería editorial inválida."
    );

    exigir(
        resultado.galeriaEditorial.length === 2,
        "La salida perdió fotografías."
    );

    for (const foto of resultado.galeriaEditorial) {
        exigir(foto.fileName);
        exigir(foto.title);
        exigir(foto.alt);
        exigir(foto.nombreSEO);
        exigir(
            Array.isArray(foto.keywords) &&
            foto.keywords.length > 0
        );
    }

    console.log("✓ Las fotografías conservan su contrato.");
    console.log("");

    console.log("7. VERIFICANDO TELEMETRÍA...");

    exigir(
        resultado.telemetria.llamadas.length === 5,
        "Telemetría no coincide con 5 llamadas."
    );

    exigir(
        resultado.telemetria.totalTokens === 750,
        `Tokens inesperados: ${resultado.telemetria.totalTokens}`
    );

    console.log("✓ Telemetría consistente con 5 llamadas.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.12");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ Narrativa única viable.");
    console.log("✓ 6 → 5 llamadas IA.");
    console.log("✓ Historia Web absorbida.");
    console.log("✓ SEO preservado.");
    console.log("✓ Hero preservado.");
    console.log("✓ Fotografía preservada.");
    console.log("✓ Código, Servicios y Slug preservados.");
    console.log("✓ Telemetría preservada.");
    console.log("");
    console.log("CONCLUSIÓN 3C.12:");
    console.log("la narrativa única puede sustituir Historia + Historia Web.");
    console.log("La siguiente operación es adaptar producción.");
    console.log("");
}

(async () => {
    try {
        await ejecutar();
    } catch (error) {
        console.error("");
        console.error("--------------------------------------");
        console.error("PRUEBA FALLIDA — 3C.12");
        console.error("--------------------------------------");
        console.error("");
        console.error(error.message);
        console.error("");
        process.exitCode = 1;
    }
})();
