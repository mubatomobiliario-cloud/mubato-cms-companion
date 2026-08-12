const OpenAIClient = require("../src/direccionEditorial/openAIClient");

console.log(OpenAIClient);

async function main() {

    try {

        const cliente = new OpenAIClient();

        const respuesta = await cliente.generar(`

Di exactamente esta frase:

Hola MUBATO.

No agregues ninguna otra palabra.

`);

        console.log("");
        console.log("==============================");
        console.log("RESPUESTA");
        console.log("==============================");
        console.log("");

        console.log(respuesta);

    }

    catch (error) {

        console.error(error);

    }

}

main();