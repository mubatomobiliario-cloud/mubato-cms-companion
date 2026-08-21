console.log("procesadorEditorialV2.js cargado");

const ConstructorContexto = require("../direccionEditorial/ConstructorContexto");
const OpenAIClient = require("../direccionEditorial/openAIClient");
const ValidadorHistoriaV2 = require("../direccionEditorial/validadorHistoriaV2");

function json(texto, nombre) {
    try {
        return JSON.parse(texto);
    } catch (error) {
        throw new Error(`${nombre} no devolvió JSON válido: ${error.message}`);
    }
}

/**
 * Procesador Editorial V2.
 *
 * V2 no hereda ni instancia ProcesadorEditorialV1.
 * La tubería editorial se implementa de forma independiente y utiliza
 * exclusivamente sus contratos V2 y dependencias compartidas.
 */
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

        if (!Array.isArray(galeria) || galeria.length === 0) {
            throw new Error(`El proyecto "${fila["Proyecto"] || "(sin nombre)"}" no tiene galería.`);
        }

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
            nombre: fila["Proyecto"],
            codigo: fila["Código MUBATO"],
            cliente: fila["Cliente"],
            ciudad: fila["Ciudad"],
            estado,
            categoria,
            descripcion: fila["Descripción"],
            servicios: fila["Servicios"]
                ? fila["Servicios"].split("|").map(x => x.trim()).filter(Boolean)
                : [],
            espacios,
            expediente: {
                version: "V2",
                descripcion: fila["Descripción"],
                observacionesVision
            },
            galeria
        };
    }

    async generar(fila, opciones = {}) {
        const proyecto = this.construirProyecto(fila);
        const galeria = proyecto.galeria;

        let llamadasIA = 0;
        const originalGenerar = this.openAI.generarTexto.bind(this.openAI);
        this.openAI.generarTexto = async (...args) => {
            llamadasIA++;
            return originalGenerar(...args);
        };

        const historia = await this.openAI.generarTexto(
            this.contexto.construirHistoria(proyecto)
        );
        const validacionHistoria = this.validadorHistoria.validar(historia.trim(), proyecto);
        if (!validacionHistoria.aprobado) {
            const detalle = validacionHistoria.errores
                .map(error => typeof error === "string" ? error : `${error.regla}: ${error.mensaje}`)
                .join(" | ");
            throw new Error(`Historia rechazada: ${detalle}`);
        }
        if (validacionHistoria.metricas.parrafos !== 1) {
            throw new Error("La Historia Editorial no tiene exactamente un párrafo.");
        }

        const heroTexto = await this.openAI.generarTexto(
            this.contexto.construirHero(proyecto)
        );
        if (!heroTexto.trim()) throw new Error("Hero vacío.");

        const seo = json(
            await this.openAI.generarTexto(
                this.contexto.construirSEO(proyecto, historia)
            ),
            "SEO"
        );
        if (!seo.seoTitle || !seo.metaDescription) throw new Error("SEO incompleto.");
        if (String(seo.seoTitle).length > 60) throw new Error("SEO Title supera 60 caracteres.");
        if (String(seo.metaDescription).length > 155) throw new Error("Meta Description supera 155 caracteres.");

        const galeriaEditorial = [];
        for (let i = 0; i < galeria.length; i++) {
            const foto = galeria[i];
            if (!foto.src || !foto.slug) {
                throw new Error(`Identidad técnica incompleta en foto ${i + 1}.`);
            }

            const contextoFoto = {
                ...foto,
                nombre: foto.fileName,
                analizada: true
            };

            const title = await this.openAI.generarTexto(
                this.contexto.construirTituloFotografia(proyecto, contextoFoto)
            );
            const alt = await this.openAI.generarTexto(
                this.contexto.construirAltText(proyecto, contextoFoto)
            );
            const keywords = json(
                await this.openAI.generarTexto(
                    this.contexto.construirKeywordsFotografia(proyecto, contextoFoto, historia)
                ),
                "PHOTO_KEYWORDS"
            );
            const nombreSEO = await this.openAI.generarTexto(
                this.contexto.construirNombreSEOFotografia(proyecto, contextoFoto)
            );

            galeriaEditorial.push({
                ...foto,
                title: title.trim(),
                alt: alt.trim(),
                description: foto.description || "",
                keywords: keywords.keywords,
                nombreSEO: nombreSEO.trim()
            });
        }

        return {
            proyecto,
            historia: historia.trim(),
            heroTexto: heroTexto.trim(),
            seo,
            galeriaEditorial,
            validacionHistoria,
            llamadasIA,
            forzado: Boolean(opciones.forzar),
            versionEditorial: "V2"
        };
    }
}

module.exports = ProcesadorEditorialV2;
