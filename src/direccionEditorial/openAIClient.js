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
        const imagenBase64 = fs.readFileSync(rutaImagen, { encoding: "base64" });
        return this.analizarImagenEntrada(`data:image/jpeg;base64,${imagenBase64}`, prompt, rutaImagen);
    }

    async analizarImagenURL(urlImagen, prompt) {
        return this.analizarImagenEntrada(urlImagen, prompt, urlImagen);
    }

    async analizarImagenEntrada(imagen, prompt, referencia = "imagen") {
        console.log("\n======================================\nVISIÓN\n======================================\n");
        console.log(`Analizando ${referencia}`);
        const inicio = Date.now();
        try {
            const respuesta = await this.client.responses.create({
                model: config.IA.modelo,
                input: [{ role: "user", content: [
                    { type: "input_text", text: prompt },
                    { type: "input_image", image_url: imagen }
                ] }]
            });
            const tiempo = Date.now() - inicio;
            const uso = respuesta.usage || {};
            const telemetria = {
                modelo: config.IA.modelo,
                tiempoMs: tiempo,
                inputTokens: Number(uso.input_tokens || 0),
                outputTokens: Number(uso.output_tokens || 0),
                totalTokens: Number(uso.total_tokens || 0)
            };
            console.log("✓ Imagen analizada.");
            console.log(`✓ Tiempo: ${tiempo} ms`);
            console.log(`✓ Tokens: ${telemetria.totalTokens || "no informado"}`);
            return { texto: respuesta.output_text, telemetria };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async analizarImagenJSON(rutaImagen, prompt) {
        const resultado = await this.analizarImagen(rutaImagen, prompt);
        try {
            return JSON.parse(resultado.texto);
        } catch (error) {
            console.error("La respuesta recibida fue:\n", resultado.texto);
            throw new Error("OpenAI devolvió un JSON inválido.");
        }
    }
}

module.exports = OpenAIClient;
