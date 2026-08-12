console.log("openAIClient.js cargado");

require("dotenv").config();

const fs = require("fs");
const OpenAI = require("openai");
const config = require("../core/configNode");

class OpenAIClient {

    constructor() {

        this.client = new OpenAI({

            apiKey: process.env.OPENAI_API_KEY

        });

    }

    //==================================================
    // TEXTO
    //==================================================

    async generarTexto(prompt) {

        console.log("");
        console.log("======================================");
        console.log("DIRECTOR EDITORIAL MUBATO");
        console.log("======================================");
        console.log("");

        console.log("Conectando con OpenAI...");
        console.log("");

        const inicio = Date.now();

        try {

            const respuesta = await this.client.responses.create({

                model: config.IA.modelo,

                input: prompt

            });

            const tiempo = Date.now() - inicio;

            console.log("✓ OpenAI respondió correctamente.");
            console.log(`✓ Tiempo: ${tiempo} ms`);

            return respuesta.output_text;

        }

        catch(error){

            console.error(error);

            throw error;

        }

    }

    //==================================================
    // VISIÓN
    //==================================================

    async analizarImagen(rutaImagen, prompt) {

        console.log("");
        console.log("======================================");
        console.log("VISIÓN");
        console.log("======================================");
        console.log("");

        console.log(`Analizando ${rutaImagen}`);

        const inicio = Date.now();

        try {

            const imagenBase64 = fs.readFileSync(rutaImagen, {

                encoding: "base64"

            });

            const respuesta = await this.client.responses.create({

                model: config.IA.modelo,

                input: [

                    {

                        role: "user",

                        content: [

                            {

                                type: "input_text",

                                text: prompt

                            },

                            {

                                type: "input_image",

                                image_url: `data:image/jpeg;base64,${imagenBase64}`

                            }

                        ]

                    }

                ]

            });

            const tiempo = Date.now() - inicio;

            console.log("✓ Imagen analizada.");
            console.log(`✓ Tiempo: ${tiempo} ms`);
            console.log("");

            return respuesta.output_text;

        }

        catch(error){

            console.error(error);

            throw error;

        }

    }



    //==================================================
    // VISIÓN (JSON)
    //==================================================

    async analizarImagenJSON(rutaImagen, prompt) {

        const respuesta = await this.analizarImagen(

            rutaImagen,

            prompt

        );

        try {

            return JSON.parse(respuesta);

        }

        catch (error) {

            console.error("");
            console.error("======================================");
            console.error("ERROR JSON");
            console.error("======================================");
            console.error("");

            console.error("La respuesta recibida fue:");
            console.error("");
            console.error(respuesta);
            console.error("");

            throw new Error(

                "OpenAI devolvió un JSON inválido."

            );

        }

    }
}
module.exports = OpenAIClient;