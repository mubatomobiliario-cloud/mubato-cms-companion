const path = require("path");

const OpenAIClient = require("../src/direccionEditorial/openAIClient");

async function main() {

    const cliente = new OpenAIClient();

    const rutaImagen = path.join(
        __dirname,
        "../Proyectos/Andrés Giraldo/IMG_1826.jpeg"
    );

    const prompt = `
Analiza esta fotografía de un proyecto de interiorismo.

Devuelve únicamente un JSON con esta estructura:

{
    "espacio":"",
    "tipo":"",
    "plano":"",
    "estilo":"",
    "materiales":[],
    "colores":[],
    "elementos":[],
    "iluminacion":"",
    "sensacion":""
}

No escribas explicaciones.

Responde únicamente el JSON.
`;

    const respuesta = await cliente.analizarImagen(
        rutaImagen,
        prompt
    );

    console.log(respuesta);

}

main().catch(console.error);