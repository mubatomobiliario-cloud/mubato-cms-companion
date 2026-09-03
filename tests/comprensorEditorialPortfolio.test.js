const assert = require("assert");
const ComprensorEditorialPortfolio = require("../src/portfolio/comprensorEditorialPortfolio");

const respuestaValida = JSON.stringify({
    nucleo: "Soluciones de mobiliario para integrar entretenimiento y almacenamiento.",
    caracter: "Integrado, sobrio y funcional.",
    materialidad: [
        { texto: "Presencia de madera en la composición.", evidencia: ["foto-01.jpg", "foto-02.jpg"] }
    ],
    funcionalidad: [
        { texto: "Integra soporte para pantalla y almacenamiento.", evidencia: ["foto-01.jpg", "foto-02.jpg"] }
    ],
    relacionesEspaciales: [
        { texto: "El mobiliario articula la pared de entretenimiento con áreas complementarias.", evidencia: ["foto-01.jpg"] }
    ],
    experiencia: "Una solución integrada que organiza el entretenimiento sin perder ligereza visual.",
    rasgosDiferenciales: [
        { texto: "Combina almacenamiento abierto y cerrado dentro de una composición continua.", evidencia: ["foto-02.jpg"] }
    ],
    enfoqueNarrativo: "Mostrar cómo una solución de entretenimiento puede integrar función, orden y lenguaje material."
});

async function ejecutar() {
    const prompts = [];
    const clienteIA = {
        async generarTexto(prompt) {
            prompts.push(prompt);
            return respuestaValida;
        }
    };

    const comprensor = new ComprensorEditorialPortfolio({ clienteIA });
    const contexto = "PORTFOLIO\\n\\nFOTOGRAFÍAS: foto-01.jpg, foto-02.jpg\\n\\nLa selección de fotografías no es una decisión de IA.";

    const resultado = await comprensor.comprender(contexto);

    assert.strictEqual(prompts.length, 1, "Debe realizar una sola llamada de texto.");
    assert.ok(prompts[0].includes(contexto), "El prompt debe contener el contexto recibido.");
    assert.ok(prompts[0].includes("NO selecciones fotografías."), "El prompt debe proteger la selección editorial.");
    assert.ok(prompts[0].includes("NO cambies su orden."), "El prompt debe proteger el orden editorial.");

    assert.strictEqual(resultado.nucleo, "Soluciones de mobiliario para integrar entretenimiento y almacenamiento.");
    assert.strictEqual(resultado.materialidad.length, 1);
    assert.deepStrictEqual(resultado.materialidad[0].evidencia, ["foto-01.jpg", "foto-02.jpg"]);
    assert.strictEqual(resultado.funcionalidad.length, 1);
    assert.strictEqual(resultado.relacionesEspaciales.length, 1);
    assert.strictEqual(resultado.rasgosDiferenciales.length, 1);

    const respuestaInvalida = {
        async generarTexto() {
            return JSON.stringify({ ...JSON.parse(respuestaValida), materialidad: [{ texto: "Inventado", evidencia: [] }] });
        }
    };

    const comprensorInvalido = new ComprensorEditorialPortfolio({ clienteIA: respuestaInvalida });
    await assert.rejects(
        () => comprensorInvalido.comprender(contexto),
        /requiere al menos una fotografía de evidencia/
    );

    const respuestaNoJSON = {
        async generarTexto() {
            return "no es json";
        }
    };

    const comprensorNoJSON = new ComprensorEditorialPortfolio({ clienteIA: respuestaNoJSON });
    await assert.rejects(
        () => comprensorNoJSON.comprender(contexto),
        /JSON inválido/
    );

    console.log("✓ ComprensorEditorialPortfolio: prueba aislada de comprensión y contrato superada");
}

ejecutar().catch(error => {
    console.error(error);
    process.exit(1);
});
