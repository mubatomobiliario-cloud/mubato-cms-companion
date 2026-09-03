/**
 * ComprensorEditorialPortfolio
 *
 * Convierte el contexto editorial de un Portfolio en una comprensión
 * estructurada y trazable. No selecciona fotografías, no las ordena y no
 * genera todavía los campos finales de publicación.
 */
const ContratoPortfolio = require("./contratos/contratoPortfolio");

class ComprensorEditorialPortfolio {
    constructor({ clienteIA, constructorPrompt = null } = {}) {
        if (!clienteIA || typeof clienteIA.generarTexto !== "function") {
            throw new Error("ComprensorEditorialPortfolio requiere un cliente IA con generarTexto().");
        }

        this.clienteIA = clienteIA;
        this.constructorPrompt = constructorPrompt;
    }

    construirPrompt(contexto) {
        if (typeof contexto !== "string" || !contexto.trim()) {
            throw new Error("ComprensorEditorialPortfolio requiere un contexto editorial válido.");
        }

        const instrucciones = `
Eres el componente de comprensión editorial de MUBATO para Portfolio.

Tu tarea es comprender el conjunto de fotografías y los datos del Portfolio a partir del contexto recibido.
NO selecciones fotografías.
NO descartes fotografías.
NO cambies su orden.
NO inventes atributos que no estén sustentados por la evidencia.
NO escribas todavía Historia, Hero Texto, Descripción, SEO, Servicios ni Código.

Debes producir exclusivamente un JSON válido con esta estructura:
{
  "nucleo": "...",
  "caracter": "...",
  "materialidad": [{"texto":"...", "evidencia":["foto-id"]}],
  "funcionalidad": [{"texto":"...", "evidencia":["foto-id"]}],
  "relacionesEspaciales": [{"texto":"...", "evidencia":["foto-id"]}],
  "experiencia": "...",
  "rasgosDiferenciales": [{"texto":"...", "evidencia":["foto-id"]}],
  "enfoqueNarrativo": "..."
}

Las afirmaciones de materialidad, funcionalidad, relaciones espaciales y rasgos diferenciales DEBEN conservar como evidencia los identificadores concretos de las fotografías que las sustentan.
La comprensión debe ser del conjunto: reconoce relaciones, recurrencias, variaciones y diferentes vistas de una misma solución cuando la evidencia lo permita.

CONTEXTO EDITORIAL:
${contexto}
`;

        return this.constructorPrompt ? this.constructorPrompt(instrucciones, contexto) : instrucciones;
    }

    async comprender(contexto) {
        const prompt = this.construirPrompt(contexto);
        const respuesta = await this.clienteIA.generarTexto(prompt);
        const comprension = this.parsearJSON(respuesta);
        ContratoPortfolio.validar(comprension);
        return ContratoPortfolio.normalizar(comprension);
    }

    parsearJSON(respuesta) {
        if (typeof respuesta !== "string" || !respuesta.trim()) {
            throw new Error("La IA no devolvió una respuesta de texto válida.");
        }

        try {
            return JSON.parse(respuesta);
        } catch (error) {
            throw new Error(`La IA devolvió una comprensión Portfolio con JSON inválido: ${error.message}`);
        }
    }
}

module.exports = ComprensorEditorialPortfolio;
