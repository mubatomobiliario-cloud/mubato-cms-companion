console.log("openAIClient.js cargado");

require("dotenv").config();

const fs = require("fs");
const OpenAI = require("openai");
const config = require("../core/configNode");

class OpenAIClient {
    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async generarTexto(prompt) {
        const resultado = await this.generarTextoDetallado(prompt);
        return resultado.texto;
    }

    async generarTextoDetallado(prompt) {
        console.log("\n======================================");
        console.log("DIRECTOR EDITORIAL MUBATO");
        console.log("======================================\n");
        console.log("Conectando con OpenAI...\n");
        const inicio = Date.now();
        try {
            const respuesta = await this.client.responses.create({ model: config.IA.modelo, input: prompt });
            const tiempo = Date.now() - inicio;
            const uso = respuesta.usage || {};
            const telemetria = {
                modelo: config.IA.modelo,
                tiempoMs: tiempo,
                inputTokens: Number(uso.input_tokens || 0),
                outputTokens: Number(uso.output_tokens || 0),
                totalTokens: Number(uso.total_tokens || 0)
            };
            console.log("✓ OpenAI respondió correctamente.");
            console.log(`✓ Tiempo: ${tiempo} ms`);
            console.log(`✓ Tokens: ${telemetria.totalTokens || "no informado"}`);
            return { texto: respuesta.output_text, telemetria };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async analizarImagen(rutaImagen, prompt) {
        console.log("\n======================================\nVISIÓN\n======================================\n");
        console.log(`Analizando ${rutaImagen}`);
        const inicio = Date.now();
        try {
            const imagenBase64 = fs.readFileSync(rutaImagen, { encoding: "base64" });
            const respuesta = await this.client.responses.create({
                model: config.IA.modelo,
                input: [{ role: "user", content: [
                    { type: "input_text", text: prompt },
                    { type: "input_image", image_url: `data:image/jpeg;base64,${imagenBase64}` }
                ] }]
            });
            const tiempo = Date.now() - inicio;
            console.log("✓ Imagen analizada.");
            console.log(`✓ Tiempo: ${tiempo} ms`);
            return respuesta.output_text;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async analizarImagenJSON(rutaImagen, prompt) {
        const respuesta = await this.analizarImagen(rutaImagen, prompt);
        try {
            return JSON.parse(respuesta);
        } catch (error) {
            console.error("La respuesta recibida fue:\n", respuesta);
            throw new Error("OpenAI devolvió un JSON inválido.");
        }
    }
}

module.exports = OpenAIClient;
