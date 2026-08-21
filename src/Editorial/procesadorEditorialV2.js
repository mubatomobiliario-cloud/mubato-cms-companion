console.log("procesadorEditorialV2.js cargado");

const ConstructorContexto = require("../direccionEditorial/ConstructorContexto");
const OpenAIClient = require("../direccionEditorial/openAIClient");
const ValidadorHistoriaV2 = require("../direccionEditorial/validadorHistoriaV2");

function json(texto, nombre) {
    try { return JSON.parse(texto); }
    catch (error) { throw new Error(`${nombre} no devolvió JSON válido: ${error.message}`); }
}

class ProcesadorEditorialV2 {
    constructor({ contexto = new ConstructorContexto(), openAI = new OpenAIClient(), validadorHistoria = new ValidadorHistoriaV2() } = {}) {
        this.contexto = contexto;
        this.openAI = openAI;
        this.validadorHistoria = validadorHistoria;
    }

    construirProyecto(fila) {
        const galeria = json(fila["Galería General"] || "[]", "Galería General");
        const espacios = json(fila["Espacios"] || "[]", "Espacios");
        const categoria = json(fila["Categoría"] || "[]", "Categoría");
        const estado = json(fila["Estado"] || "[]", "Estado");
        if (!Array.isArray(galeria) || !galeria.length) throw new Error(`El proyecto "${fila["Proyecto"] || "(sin nombre)"}" no tiene galería.`);

        const observacionesVision = galeria.map((foto, i) => ({
            nombre: foto.fileName || `foto-${i + 1}`,
            analizada: true,
            espacio: foto.title || "",
            tipo: "imagen",
            plano: "",
            estilo: "",
            materiales: [],
            colores: [],
            elementos: [],
            iluminacion: "",
            sensacion: "",
            confianza: 1,
            descripcion: foto.description || ""
        }));

        return {
            nombre: fila["Proyecto"], codigo: fila["Código MUBATO"], cliente: fila["Cliente"], ciudad: fila["Ciudad"],
            estado, categoria, descripcion: fila["Descripción"],
            servicios: fila["Servicios"] ? fila["Servicios"].split("|").map(x => x.trim()).filter(Boolean) : [],
            espacios,
            expediente: { version: "V2.1", descripcion: fila["Descripción"], observacionesVision },
            galeria
        };
    }

    async generar(fila, opciones = {}) {
        const proyecto = this.construirProyecto(fila);
        const galeria = proyecto.galeria;
        const llamadas = [];

        const generar = async (etapa, prompt) => {
            const resultado = await this.openAI.generarTextoDetallado(prompt);
            llamadas.push({ etapa, ...resultado.telemetria });
            return resultado.texto;
        };

        const historia = await generar("historia", this.contexto.construirHistoria(proyecto));
        const validacionHistoria = this.validadorHistoria.validar(historia.trim(), proyecto);
        if (!validacionHistoria.aprobado) {
            const detalle = validacionHistoria.errores.map(error => typeof error === "string" ? error : `${error.regla}: ${error.mensaje}`).join(" | ");
            throw new Error(`Historia rechazada: ${detalle}`);
        }
        if (validacionHistoria.metricas.parrafos !== 1) throw new Error("La Historia Editorial no tiene exactamente un párrafo.");

        const heroTexto = await generar("hero", this.contexto.construirHero(proyecto));
        if (!heroTexto.trim()) throw new Error("Hero vacío.");

        const seo = json(await generar("seo", this.contexto.construirSEO(proyecto, historia)), "SEO");
        if (!seo.seoTitle || !seo.metaDescription) throw new Error("SEO incompleto.");
        if (String(seo.seoTitle).length > 60) throw new Error("SEO Title supera 60 caracteres.");
        if (String(seo.metaDescription).length > 155) throw new Error("Meta Description supera 155 caracteres.");

        const galeriaEditorial = [];
        for (let i = 0; i < galeria.length; i++) {
            const foto = galeria[i];
            if (!foto.src || !foto.slug) throw new Error(`Identidad técnica incompleta en foto ${i + 1}.`);
            const contextoFoto = { ...foto, nombre: foto.fileName, analizada: true };
            const metadatos = json(await generar(`foto_${i + 1}_editorial`, this.contexto.construirMetadatosFotografia(proyecto, contextoFoto, historia)), "PHOTO_EDITORIAL");

            if (!metadatos.title || !metadatos.alt || !metadatos.nombreSEO || !Array.isArray(metadatos.keywords) || !metadatos.keywords.length) {
                throw new Error(`Metadatos editoriales incompletos en foto ${i + 1}.`);
            }
            galeriaEditorial.push({
                ...foto,
                title: String(metadatos.title).trim(),
                alt: String(metadatos.alt).trim(),
                description: foto.description || "",
                keywords: metadatos.keywords,
                nombreSEO: String(metadatos.nombreSEO).trim()
            });
        }

        const total = llamadas.reduce((a, x) => a + x.totalTokens, 0);
        const input = llamadas.reduce((a, x) => a + x.inputTokens, 0);
        const output = llamadas.reduce((a, x) => a + x.outputTokens, 0);
        const tiempoMs = llamadas.reduce((a, x) => a + x.tiempoMs, 0);

        return {
            proyecto,
            historia: historia.trim(),
            heroTexto: heroTexto.trim(),
            seo,
            galeriaEditorial,
            validacionHistoria,
            llamadasIA: llamadas.length,
            telemetria: {
                modelo: llamadas[0]?.modelo || "desconocido",
                llamadas,
                inputTokens: input,
                outputTokens: output,
                totalTokens: total,
                tiempoAcumuladoMs: tiempoMs,
                llamadasGaleriaPorFoto: galeria.length ? 1 : 0,
                costoEstimadoUSD: null
            },
            forzado: Boolean(opciones.forzar),
            versionEditorial: "V2.1"
        };
    }
}

module.exports = ProcesadorEditorialV2;
