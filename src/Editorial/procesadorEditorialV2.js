console.log("procesadorEditorialV2.js cargado");

const ConstructorContexto = require("../direccionEditorial/ConstructorContexto");
const OpenAIClient = require("../direccionEditorial/openAIClient");
const ValidadorHistoriaV2 = require("../direccionEditorial/validadorHistoriaV2");
const ValidadorHistoriaWebV2 = require("../direccionEditorial/validadorHistoriaWebV2");

function json(texto, nombre) {
    try { return JSON.parse(texto); }
    catch (error) { throw new Error(`${nombre} no devolvió JSON válido: ${error.message}`); }
}

class ProcesadorEditorialV2 {
    constructor({ contexto = new ConstructorContexto(), openAI = new OpenAIClient(), validadorHistoria = new ValidadorHistoriaV2(), validadorHistoriaWeb = new ValidadorHistoriaWebV2() } = {}) {
        this.contexto = contexto;
        this.openAI = openAI;
        this.validadorHistoria = validadorHistoria;
        this.validadorHistoriaWeb = validadorHistoriaWeb;
    }

    construirProyecto(fila, evidenciaVisual) {
        const galeria = json(fila["Galería General"] || "[]", "Galería General");
        const espacios = json(fila["Espacios"] || "[]", "Espacios");
        const categoria = json(fila["Categoría"] || "[]", "Categoría");
        const estado = json(fila["Estado"] || "[]", "Estado");
        if (!Array.isArray(galeria) || !galeria.length) throw new Error(`El proyecto "${fila["Proyecto"] || "(sin nombre)"}" no tiene galería.`);
        if (!Array.isArray(evidenciaVisual) || !evidenciaVisual.length) throw new Error("No existe evidencia visual válida. V2.2 exige evidencia Vision previa.");
        if (evidenciaVisual.some((x) => !x || x.analizada !== true)) throw new Error("La evidencia visual contiene fotografías no analizadas. V2.2 exige evidencia Vision previa.");

        return {
            nombre: fila["Proyecto"], codigo: fila["Código MUBATO"], cliente: fila["Cliente"], ciudad: fila["Ciudad"],
            estado, categoria, descripcion: fila["Descripción"],
            servicios: fila["Servicios"] ? fila["Servicios"].split("|").map(x => x.trim()).filter(Boolean) : [],
            espacios,
            expediente: { version: "V2.2", descripcion: fila["Descripción"], observacionesVision: evidenciaVisual },
            galeria
        };
    }

    async generar(fila, opciones = {}) {
        const proyecto = this.construirProyecto(fila, opciones.evidenciaVisual);
        const galeria = proyecto.galeria;
        const llamadas = [];
        const generar = async (etapa, prompt) => {
            const resultado = await this.openAI.generarTextoDetallado(prompt);
            llamadas.push({ etapa, ...resultado.telemetria });
            return resultado.texto;
        };
        const resumenTelemetria = () => {
            const total = llamadas.reduce((a, x) => a + Number(x.totalTokens || 0), 0);
            const input = llamadas.reduce((a, x) => a + Number(x.inputTokens || 0), 0);
            const output = llamadas.reduce((a, x) => a + Number(x.outputTokens || 0), 0);
            const tiempoMs = llamadas.reduce((a, x) => a + Number(x.tiempoMs || 0), 0);
            return { modelo: llamadas[0]?.modelo || "desconocido", llamadas, inputTokens: input, outputTokens: output, totalTokens: total, tiempoAcumuladoMs: tiempoMs, llamadasGaleriaPorFoto: 1, costoEstimadoUSD: null };
        };
        try {
            console.log("\n======================================");
            console.log("EDITORIAL V2.2 — EVIDENCIA VISUAL REUTILIZADA");
            console.log("======================================\n");
            console.log(`✓ Evidencia visual recibida: ${proyecto.expediente.observacionesVision.length} fotografías`);
            console.log("✓ Vision no se ejecutará en esta fase.");

            const historia = await generar("historia", this.contexto.construirHistoria(proyecto));
            const validacionHistoria = this.validadorHistoria.validar(historia.trim(), proyecto);
            if (!validacionHistoria.aprobado) {
                const detalle = validacionHistoria.errores.map(error => typeof error === "string" ? error : `${error.regla}: ${error.mensaje}`).join(" | ");
                throw new Error(`Historia maestra rechazada: ${detalle}`);
            }
            if (validacionHistoria.metricas.parrafos !== 1) throw new Error("La Historia Editorial maestra no tiene exactamente un párrafo.");

            const historiaWeb = await generar("historia_web", this.contexto.construirHistoriaWeb(historia.trim()));
            const validacionHistoriaWeb = this.validadorHistoriaWeb.validar(historiaWeb.trim(), proyecto);
            if (!validacionHistoriaWeb.aprobado) {
                throw new Error(`Historia Web rechazada: ${validacionHistoriaWeb.errores.join(" | ")}`);
            }

            const heroTexto = await generar("hero", this.contexto.construirHero(proyecto));
            if (!heroTexto.trim()) throw new Error("Hero vacío.");

            const seo = json(await generar("seo", this.contexto.construirSEO(proyecto, historiaWeb)), "SEO");
            if (!seo.seoTitle || !seo.metaDescription) throw new Error("SEO incompleto.");
            if (String(seo.seoTitle).length > 60) throw new Error("SEO Title supera 60 caracteres.");
            if (String(seo.metaDescription).length > 155) throw new Error("Meta Description supera 155 caracteres.");

            const codigo = String(await generar("codigo", this.contexto.construirCodigo(proyecto))).trim();
            if (!codigo) throw new Error("Código MUBATO vacío.");

            const servicios = json(await generar("servicios", this.contexto.construirServicios(proyecto)), "SERVICIOS");
            if (!Array.isArray(servicios.servicios)) throw new Error("SERVICIOS no devolvió un arreglo válido.");

            const slug = String(await generar("slug", this.contexto.construirSlug(proyecto))).trim();
            if (!slug) throw new Error("Slug vacío.");

            const galeriaEditorial = [];
            for (let i = 0; i < galeria.length; i++) {
                const foto = galeria[i];
                const evidenciaFoto = proyecto.expediente.observacionesVision.find(x => x.fotografia === foto.fileName);
                if (!evidenciaFoto) throw new Error(`No existe evidencia Vision para la fotografía "${foto.fileName}".`);
                const contextoFoto = { ...foto, ...evidenciaFoto, nombre: foto.fileName, analizada: true };
                const metadatos = json(await generar(`foto_${i + 1}_editorial`, this.contexto.construirMetadatosFotografia(proyecto, contextoFoto, historiaWeb)), "PHOTO_EDITORIAL");
                if (!metadatos.title || !metadatos.alt || !metadatos.nombreSEO || !Array.isArray(metadatos.keywords) || !metadatos.keywords.length) throw new Error(`Metadatos editoriales incompletos en foto ${i + 1}.`);
                galeriaEditorial.push({ ...foto, title: String(metadatos.title).trim(), alt: String(metadatos.alt).trim(), description: foto.description || "", keywords: metadatos.keywords, nombreSEO: String(metadatos.nombreSEO).trim() });
            }

            const telemetria = resumenTelemetria();
            return {
                proyecto,
                historia: historia.trim(),
                historiaWeb: historiaWeb.trim(),
                heroTexto: heroTexto.trim(),
                descripcion: historiaWeb.trim(),
                codigo,
                servicios: servicios.servicios,
                slug,
                seo,
                galeriaEditorial,
                validacionHistoria,
                validacionHistoriaWeb,
                llamadasIA: llamadas.length,
                telemetria,
                forzado: Boolean(opciones.forzar),
                versionEditorial: "V2.2"
            };
        } catch (error) {
            const telemetria = resumenTelemetria();
            console.log("\n--------------------------------------");
            console.log("TELEMETRÍA HASTA EL FALLO");
            console.log("--------------------------------------");
            console.log(`✓ Llamadas IA: ${telemetria.llamadas.length}`);
            console.log(`✓ Input tokens: ${telemetria.inputTokens || "no informado"}`);
            console.log(`✓ Output tokens: ${telemetria.outputTokens || "no informado"}`);
            console.log(`✓ Total tokens: ${telemetria.totalTokens || "no informado"}`);
            console.log(`✓ Tiempo acumulado: ${telemetria.tiempoAcumuladoMs} ms`);
            throw error;
        }
    }
}

module.exports = ProcesadorEditorialV2;
