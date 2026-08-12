const path = require("path");

const OpenAIClient = require("../src/direccionEditorial/openAIClient");
const PromptVision = require("../src/vision/promptVision");

async function main() {

    console.clear();

    console.log("");
    console.log("======================================");
    console.log("PRUEBA ANALIZADOR DE FOTOGRAFÍA");
    console.log("======================================");
    console.log("");

    const openAI = new OpenAIClient();
    const promptVision = new PromptVision();

    //--------------------------------------------------
    // Fotografía de prueba
    //--------------------------------------------------

    const rutaImagen = path.join(

        __dirname,

        "..",

        "Proyectos",

        "Andrés Giraldo",

        "IMG_1826.jpeg"

    );

    console.log("Fotografía:");
    console.log(rutaImagen);
    console.log("");

    //--------------------------------------------------
    // Prompt
    //--------------------------------------------------

    const prompt = promptVision.construir();

    console.log("Enviando imagen a OpenAI...");
    console.log("");

    //--------------------------------------------------
    // Vision
    //--------------------------------------------------

    const resultado = await openAI.analizarImagenJSON(

        rutaImagen,

        prompt

    );

    //--------------------------------------------------
    // Resultado
    //--------------------------------------------------

    console.log("");
    console.log("======================================");
    console.log("JSON RECIBIDO");
    console.log("======================================");
    console.log("");

    console.log(JSON.stringify(

        resultado,

        null,

        4

    ));

    console.log("");

    console.log("======================================");
    console.log("FIN");
    console.log("======================================");
    console.log("");

}

main().catch(error => {

    console.error("");

    console.error("======================================");
    console.error("ERROR");
    console.error("======================================");
    console.error("");

    console.error(error);

});