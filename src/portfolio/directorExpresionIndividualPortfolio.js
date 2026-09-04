/**
 * DirectorExpresionIndividualPortfolio
 *
 * Orquesta la expresión editorial de una fotografía individual de PORTFOLIO.
 *
 * PRINCIPIOS
 * - No ejecuta Vision.
 * - No ejecuta comprensión central.
 * - No decide inclusión ni orden de fotografías.
 * - Consume una única observación visual ya persistida.
 * - Construye el contexto mediante ConstructorContextoExpresionIndividualPortfolio.
 * - Genera exclusivamente la expresión individual de la fotografía.
 * - Valida y normaliza la salida mediante ContratoExpresionIndividualPortfolio.
 */
const ConstructorContextoExpresionIndividualPortfolio = require("./constructorContextoExpresionIndividualPortfolio");
const ContratoExpresionIndividualPortfolio = require("./contratos/contratoExpresionIndividualPortfolio");
const OpenAIClient = require("../direccionEditorial/openAIClient");

class DirectorExpresionIndividualPortfolio {
    constructor({
        constructorContexto = new ConstructorContextoExpresionIndividualPortfolio(),
        openAI = new OpenAIClient()
    } = {}) {
        this.constructorContexto = constructorContexto;
        this.openAI = openAI;
    }

    async expresar(comprension, observacionFotografia, portfolio) {
        if (!observacionFotografia || typeof observacionFotografia !== "object") {
            throw new Error("DirectorExpresionIndividualPortfolio requiere una observación fotográfica válida.");
        }

        const fotografia = observacionFotografia.fotografia;
        if (typeof fotografia !== "string" || !fotografia.trim()) {
            throw new Error("DirectorExpresionIndividualPortfolio requiere un identificador de fotografía válido.");
        }

        const contexto = this.constructorContexto.construir(
            comprension,
            observacionFotografia,
            portfolio
        );

        const prompt = this.construirPrompt(contexto);
        const respuesta = await this.openAI.generarTextoDetallado(prompt);
        const expresion = this.parsearRespuesta(respuesta);

        return ContratoExpresionIndividualPortfolio.normalizar(expresion, {
            fotografia
        });
    }

    construirPrompt(contexto) {
        return [
            "Eres el módulo de expresión editorial individual de MUBATO.",
            "",
            "Tu tarea es expresar UNA fotografía específica de un Portfolio.",
            "",
            "No ejecutes análisis visual adicional.",
            "No inventes información.",
            "No decidas si la fotografía pertenece a la colección.",
            "No cambies su orden.",
            "No escribas la Historia, el Hero Texto ni el SEO colectivo del Portfolio.",
            "",
            "Produce exclusivamente un objeto JSON válido con estos campos:",
            "{",
            '  "title": "",',
            '  "description": "",',
            '  "alt": "",',
            '  "keywords": [],',
            '  "nombreSEO": ""',
            "}",
            "",
            "La expresión debe diferenciar esta fotografía dentro de la colección,",
            "manteniendo coherencia con la comprensión central y fidelidad absoluta a su evidencia.",
            "",
            "CONTEXTO EDITORIAL:",
            contexto
        ].join("\n");
    }

    parsearRespuesta(respuesta) {
        if (respuesta && typeof respuesta === "object") {
            if (typeof respuesta.output_text === "string") {
                return this.parsearJSON(respuesta.output_text);
            }
            return respuesta;
        }

        if (typeof respuesta !== "string") {
            throw new Error("La respuesta de expresión individual Portfolio no tiene un formato válido.");
        }

        return this.parsearJSON(respuesta);
    }

    parsearJSON(texto) {
        try {
            return JSON.parse(texto);
        } catch (error) {
            throw new Error(`La expresión individual Portfolio devolvió JSON inválido: ${error.message}`);
        }
    }
}

module.exports = DirectorExpresionIndividualPortfolio;
