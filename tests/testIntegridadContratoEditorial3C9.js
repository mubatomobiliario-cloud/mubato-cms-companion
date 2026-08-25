console.log("testIntegridadContratoEditorial3C9.js cargado");

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
        this.llamadas.push(String(prompt || ""));

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
        return { aprobado: true, metricas: { parrafos: 1 }, errores: [] };
    }
}

class ValidadorHistoriaWebControlado {
    validarContrato() {
        return { aprobado: true, errores: [] };
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
            { fileName: "araque-01.jpg", title: "", alt: "", description: "" },
            { fileName: "araque-02.jpg", title: "", alt: "", description: "" }
        ]),
        "Espacios": "[]",
        "Categoría": "[]",
        "Estado": "[]"
    };
}

async function ejecutar() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — INTEGRIDAD CONTRATO EDITORIAL 3C.9");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: demostrar que la optimización 9 → 6 conserva el contrato editorial completo de Editorial Proyecto V2.2.");
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

    console.log("1. Verificando presupuesto IA post-optimización...");
    exigir(openAI.llamadas.length === 6, `Se esperaban 6 llamadas IA y se registraron ${openAI.llamadas.length}.`);
    exigir(resultado.llamadasIA === 6, `El resultado declara ${resultado.llamadasIA} llamadas IA.`);
    console.log("✓ Contrato de optimización 9 → 6 confirmado.");
    console.log("");

    console.log("2. Verificando contrato de salida editorial...");
    const camposObligatorios = [
        "proyecto", "historia", "historiaWeb", "contratoHistoriaWeb", "heroTexto",
        "descripcion", "codigo", "servicios", "slug", "seo", "galeriaEditorial",
        "validacionHistoria", "validacionHistoriaWeb", "llamadasIA", "telemetria", "versionEditorial"
    ];
    for (const campo of camposObligatorios) {
        exigir(Object.prototype.hasOwnProperty.call(resultado, campo), `Falta campo obligatorio de salida: ${campo}.`);
    }
    exigir(resultado.versionEditorial === "V2.2", `Versión editorial inesperada: ${resultado.versionEditorial}`);
    exigir(resultado.proyecto.nombre === PROYECTO, "La identidad del proyecto no se conserva.");
    exigir(resultado.historia.trim().length > 0, "Historia vacía.");
    exigir(resultado.historiaWeb.trim().length > 0, "Historia Web vacía.");
    exigir(resultado.heroTexto.trim().length > 0, "Hero vacío.");
    exigir(resultado.descripcion === resultado.historiaWeb, "Descripción editorial no coincide con Historia Web.");
    exigir(resultado.seo && resultado.seo.seoTitle && resultado.seo.metaDescription, "SEO incompleto.");
    console.log("✓ Contrato de salida editorial completo y consistente.");
    console.log("");

    console.log("3. Verificando valores deterministas y su frontera con IA...");
    exigir(resultado.codigo === "MUB-4", `Código MUBATO alterado: ${resultado.codigo}`);
    exigir(JSON.stringify(resultado.servicios) === JSON.stringify(["Diseño interior", "Mobiliario a medida"]), "Servicios alterados.");
    exigir(resultado.slug === "hogar-araque", `Slug alterado: ${resultado.slug}`);
    const etapas = resultado.telemetria.llamadas.map(x => x.etapa);
    exigir(!etapas.includes("codigo"), "Código todavía dispara una llamada IA.");
    exigir(!etapas.includes("servicios"), "Servicios todavía dispara una llamada IA.");
    exigir(!etapas.includes("slug"), "Slug todavía dispara una llamada IA.");
    console.log("✓ Código, Servicios y Slug permanecen deterministas y fuera de IA.");
    console.log("");

    console.log("4. Verificando contrato fotográfico...");
    exigir(Array.isArray(resultado.galeriaEditorial), "Galería editorial inválida.");
    exigir(resultado.galeriaEditorial.length === 2, "La salida perdió fotografías.");
    for (let i = 0; i < resultado.galeriaEditorial.length; i++) {
        const foto = resultado.galeriaEditorial[i];
        exigir(foto.fileName, `Foto ${i + 1} perdió fileName.`);
        exigir(foto.title, `Foto ${i + 1} perdió title.`);
        exigir(foto.alt, `Foto ${i + 1} perdió alt.`);
        exigir(foto.nombreSEO, `Foto ${i + 1} perdió nombreSEO.`);
        exigir(Array.isArray(foto.keywords) && foto.keywords.length > 0, `Foto ${i + 1} perdió keywords.`);
    }
    exigir(resultado.telemetria.llamadasGaleriaPorFoto === 1, "Cambió la regla de una llamada IA por fotografía.");
    console.log("✓ Las dos fotografías conservan todos sus metadatos editoriales.");
    console.log("✓ Una llamada IA por fotografía permanece vigente.");
    console.log("");

    console.log("5. Verificando campos Wix protegidos...");
    exigir(!Object.prototype.hasOwnProperty.call(resultado, "Historias de Transformación"), "Historias de Transformación entró indebidamente en la salida editable.");
    exigir(!Object.prototype.hasOwnProperty.call(resultado, "Historias de Transformación1"), "Historias de Transformación1 entró indebidamente en la salida editable.");
    exigir(!Object.prototype.hasOwnProperty.call(resultado, "Hero Imágen"), "Hero Imágen entró indebidamente en la salida editable.");
    console.log("✓ Historias de Transformación permanece fuera del procesador editable.");
    console.log("✓ Historias de Transformación1 permanece fuera del procesador editable.");
    console.log("✓ Hero Imágen permanece fuera del procesador editable.");
    console.log("");

    console.log("6. Verificando telemetría y trazabilidad...");
    exigir(Array.isArray(resultado.telemetria.llamadas), "Telemetría de llamadas inválida.");
    exigir(resultado.telemetria.llamadas.length === 6, "Telemetría no coincide con el presupuesto IA.");
    exigir(resultado.telemetria.totalTokens === 900, `Total de tokens inesperado: ${resultado.telemetria.totalTokens}`);
    console.log("✓ Telemetría coincide con las 6 llamadas IA ejecutadas.");
    console.log("✓ La trazabilidad de etapas permanece completa.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.9");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ 9 → 6 llamadas IA sin pérdida de contrato.");
    console.log("✓ Historia, Historia Web, Hero y SEO preservados.");
    console.log("✓ Código, Servicios y Slug preservados como deterministas.");
    console.log("✓ Metadatos de fotografías preservados.");
    console.log("✓ Una llamada IA por fotografía preservada.");
    console.log("✓ Campos internos Wix fuera de la frontera editable.");
    console.log("✓ Telemetría y trazabilidad preservadas.");
    console.log("✓ No se realizaron llamadas reales a OpenAI.");
    console.log("");
    console.log("CONCLUSIÓN 3C.9: la optimización 9 → 6 conserva el contrato editorial completo de Editorial Proyecto V2.2 y queda lista para continuar hacia las siguientes optimizaciones.");
    console.log("");
}

(async () => {
    try {
        await ejecutar();
    } catch (error) {
        console.error("");
        console.error("--------------------------------------");
        console.error("PRUEBA FALLIDA — 3C.9");
        console.error("--------------------------------------");
        console.error("");
        console.error(error.message);
        process.exitCode = 1;
    }
})();
