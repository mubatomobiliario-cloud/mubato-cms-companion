console.log("openAIClient.js cargado");

require("dotenv").config();

const fs = require("fs");
const OpenAI = require("openai");
const config = require("../core/configNode");
const TelemetriaIA = require("../core/telemetriaIA");

class OpenAIClient {
    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.telemetria = new TelemetriaIA();
    }

    iniciarTelemetria(contexto = {}) {
        this.telemetria.iniciarEjecucion(contexto);
    }

    obtenerTelemetria() {
        return this.telemetria.resumen();
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

        const medicion = this.telemetria.iniciarLlamada({
            proveedor: "OpenAI",
            operacion: "texto",
            modelo: config.IA.modelo
        });

        try {
            const respuesta = await this.client.responses.create({ model: config.IA.modelo, input: prompt });
            const uso = respuesta.usage || {};
            const registro = this.telemetria.registrarLlamada(medicion, {
                model: config.IA.modelo,
                usage: uso
            });

            console.log("✓ OpenAI respondió correctamente.");
            console.log(`✓ Tiempo: ${registro.duracionMs} ms`);
            console.log(`✓ Tokens: ${registro.tokensTotales || "no informado"}`);
            return {
                texto: respuesta.output_text,
                telemetria: {
                    modelo: registro.modelo,
                    tiempoMs: registro.duracionMs,
                    inputTokens: registro.tokensEntrada,
                    outputTokens: registro.tokensSalida,
                    totalTokens: registro.tokensTotales
                }
            };
        } catch (error) {
            this.telemetria.registrarError(medicion, error);
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

        const medicion = this.telemetria.iniciarLlamada({
            proveedor: "OpenAI",
            operacion: "vision",
            modelo: config.IA.modelo,
            fotografia: referencia
        });

        try {
            const respuesta = await this.client.responses.create({
                model: config.IA.modelo,
                input: [{ role: "user", content: [
                    { type: "input_text", text: prompt },
                    { type: "input_image", image_url: imagen }
                ] }]
            });
            const uso = respuesta.usage || {};
            const registro = this.telemetria.registrarLlamada(medicion, {
                model: config.IA.modelo,
                usage: uso
            });

            console.log("✓ Imagen analizada.");
            console.log(`✓ Tiempo: ${registro.duracionMs} ms`);
            console.log(`✓ Tokens: ${registro.tokensTotales || "no informado"}`);
            return {
                texto: respuesta.output_text,
                telemetria: {
                    modelo: registro.modelo,
                    tiempoMs: registro.duracionMs,
                    inputTokens: registro.tokensEntrada,
                    outputTokens: registro.tokensSalida,
                    totalTokens: registro.tokensTotales
                }
            };
        } catch (error) {
            this.telemetria.registrarError(medicion, error);
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
