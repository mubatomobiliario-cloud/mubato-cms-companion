/**
 * ContratoExpresionIndividualPortfolio
 *
 * Contrato interno de la expresión editorial individual de una fotografía
 * de Portfolio.
 *
 * Esta estructura NO es el formato Wix. Representa exclusivamente el
 * contenido editorial generado para una fotografía cuya inclusión y orden
 * ya fueron definidos fuera de este contrato.
 *
 * La evidencia Vision es fuente de verdad para la fotografía; este contrato
 * no la modifica, no decide selección y no decide orden.
 */
class ContratoExpresionIndividualPortfolio {
    static CAMPOS = Object.freeze([
        "title",
        "description",
        "alt",
        "keywords",
        "nombreSEO"
    ]);

    static crearVacio() {
        return {
            title: "",
            description: "",
            alt: "",
            keywords: [],
            nombreSEO: ""
        };
    }

    static validar(expresion, opciones = {}) {
        if (!expresion || typeof expresion !== "object" || Array.isArray(expresion)) {
            throw new Error("La expresión individual Portfolio debe ser un objeto.");
        }

        const requeridosTexto = [
            "title",
            "description",
            "alt",
            "nombreSEO"
        ];

        for (const campo of requeridosTexto) {
            if (typeof expresion[campo] !== "string" || !expresion[campo].trim()) {
                throw new Error(`La expresión individual Portfolio requiere el campo de texto "${campo}".`);
            }
        }

        if (!Array.isArray(expresion.keywords) || expresion.keywords.length === 0) {
            throw new Error("La expresión individual Portfolio requiere keywords como arreglo no vacío.");
        }

        for (const keyword of expresion.keywords) {
            if (typeof keyword !== "string" || !keyword.trim()) {
                throw new Error("Cada keyword de la expresión individual Portfolio debe ser un texto válido.");
            }
        }

        if (opciones.fotografia !== undefined) {
            if (typeof opciones.fotografia !== "string" || !opciones.fotografia.trim()) {
                throw new Error("La expresión individual Portfolio requiere un identificador de fotografía válido.");
            }
        }

        return true;
    }

    static normalizar(expresion, opciones = {}) {
        this.validar(expresion, opciones);

        return {
            title: expresion.title.trim(),
            description: expresion.description.trim(),
            alt: expresion.alt.trim(),
            keywords: expresion.keywords.map(String).map(x => x.trim()).filter(Boolean),
            nombreSEO: expresion.nombreSEO.trim()
        };
    }
}

module.exports = ContratoExpresionIndividualPortfolio;
