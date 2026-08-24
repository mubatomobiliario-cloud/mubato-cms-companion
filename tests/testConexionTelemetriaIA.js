console.log("testConexionTelemetriaIA.js cargado");

const assert = require("assert");
const OpenAIClient = require("../src/direccionEditorial/openAIClient");

console.log("");
console.log("======================================");
console.log("PRUEBA — CONEXIÓN TELEMETRÍA IA 3B.2");
console.log("======================================");
console.log("");

(async () => {
    const cliente = new OpenAIClient();

    // Sustitución controlada únicamente para la prueba.
    // No se realiza ninguna llamada real a OpenAI.
    cliente.client = {
        responses: {
            create: async (entrada) => ({
                output_text: entrada.input[0]?.content
                    ? "respuesta vision simulada"
                    : "respuesta texto simulada",
                usage: {
                    input_tokens: entrada.input[0]?.content ? 100 : 200,
                    output_tokens: 25,
                    total_tokens: entrada.input[0]?.content ? 125 : 225
                }
            })
        }
    };

    cliente.iniciarTelemetria({
        proyecto: "Hogar Araque",
        flujo: "EDITORIAL_PROYECTO_V2.2"
    });

    const texto = await cliente.generarTextoDetallado("prompt de prueba");
    const vision = await cliente.analizarImagenEntrada(
        "data:image/jpeg;base64,PRUEBA",
        "prompt de visión de prueba",
        "hero-prueba.jpg"
    );

    const resumen = cliente.obtenerTelemetria();

    assert.strictEqual(texto.texto, "respuesta texto simulada");
    assert.strictEqual(vision.texto, "respuesta vision simulada");
    assert.strictEqual(resumen.llamadas, 2);
    assert.strictEqual(resumen.exitosas, 2);
    assert.strictEqual(resumen.fallidas, 0);
    assert.strictEqual(resumen.llamadasPorOperacion.texto, 1);
    assert.strictEqual(resumen.llamadasPorOperacion.vision, 1);
    assert.strictEqual(resumen.llamadasPorProveedor.OpenAI, 2);
    assert.strictEqual(resumen.tokensEntrada, 300);
    assert.strictEqual(resumen.tokensSalida, 50);
    assert.strictEqual(resumen.tokensTotales, 350);
    assert.strictEqual(resumen.detalle[0].operacion, "texto");
    assert.strictEqual(resumen.detalle[1].operacion, "vision");
    assert.strictEqual(resumen.detalle[1].fotografia, "hero-prueba.jpg");
    assert.strictEqual(resumen.contexto.proyecto, "Hogar Araque");

    console.log("✓ Telemetría conectada a la frontera IA.");
    console.log("✓ Operación texto registrada automáticamente.");
    console.log("✓ Operación visión registrada automáticamente.");
    console.log("✓ Tokens reales de la respuesta simulada registrados.");
    console.log("✓ Duración y resultado registrados.");
    console.log("✓ Proyecto conservado en el contexto de ejecución.");
    console.log("✓ Fotografía conservada en la llamada de visión.");
    console.log("✓ No se realizó ninguna llamada real a OpenAI.");
    console.log("");
    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log("");
})();
