const assert = require("assert");
const path = require("path");
const DirectorComprensionPortfolio = require("../src/portfolio/directorComprensionPortfolio");

const rutaEvidencia = path.join(
    __dirname,
    "fixtures",
    "evidencia-visual-v21.fixture.json"
);

class StubComprensorEditorialPortfolio {
    constructor() {
        this.llamadas = [];
    }

    async comprender(contexto, idsFotografias) {
        this.llamadas.push({ contexto, idsFotografias });
        return {
            nucleo: "comprension de prueba",
            caracter: "caracter de prueba",
            materialidad: [],
            funcionalidad: [],
            relacionesEspaciales: [],
            experiencia: "experiencia de prueba",
            rasgosDiferenciales: [],
            enfoqueNarrativo: "narrativa de prueba"
        };
    }
}

async function main() {
    const stubComprensor = new StubComprensorEditorialPortfolio();
    const director = new DirectorComprensionPortfolio({
        comprensorEditorialPortfolio: stubComprensor
    });

    const portfolio = {
        proyecto: "Fixture Portfolio",
        ciudad: "Bogotá",
        categoria: ["Residencial"],
        espacios: ["Sala"],
        cliente: "Varios"
    };

    const resultado = await director.comprender(portfolio, rutaEvidencia);

    assert.ok(resultado);
    assert.strictEqual(resultado.nucleo, "comprension de prueba");
    assert.strictEqual(stubComprensor.llamadas.length, 1);

    const llamada = stubComprensor.llamadas[0];
    assert.strictEqual(typeof llamada.contexto, "string");
    assert.ok(llamada.contexto.includes("Fixture Portfolio"));
    assert.ok(llamada.contexto.includes("foto-001"));
    assert.ok(llamada.contexto.includes("foto-002"));

    assert.deepStrictEqual(llamada.idsFotografias, ["foto-001", "foto-002"]);

    console.log("✓ DirectorComprensionPortfolio: prueba funcional aislada superada");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
