const assert = require("assert");
const DirectorComprensionPortfolio = require("../src/portfolio/directorComprensionPortfolio");

class LectorStub {
    cargar(ruta) {
        assert.strictEqual(ruta, "/tmp/evidencia.json");
        return { version: "TEST", proyecto: {}, observacionesVision: [] };
    }

    extraerObservaciones(evidencia) {
        assert.ok(evidencia);
        return [
            { fotografia: "foto-004" },
            { fotografia: "foto-005" }
        ];
    }
}

class ConstructorStub {
    construir(portfolio, observacionesVision) {
        assert.deepStrictEqual(portfolio, { Proyecto: "Centros de entretenimiento" });
        assert.deepStrictEqual(observacionesVision, [
            { fotografia: "foto-004" },
            { fotografia: "foto-005" }
        ]);
        return "CONTEXTO-PORTFOLIO";
    }
}

class ComprensorStub {
    async comprender(contexto, idsFotografias) {
        assert.strictEqual(contexto, "CONTEXTO-PORTFOLIO");
        assert.deepStrictEqual(idsFotografias, ["foto-004", "foto-005"]);
        return { nucleo: "comprension" };
    }
}

(async () => {
    const director = new DirectorComprensionPortfolio({
        lectorEvidenciaVisual: new LectorStub(),
        constructorContextoPortfolio: new ConstructorStub(),
        comprensorEditorialPortfolio: new ComprensorStub()
    });

    const resultado = await director.comprender(
        { Proyecto: "Centros de entretenimiento" },
        "/tmp/evidencia.json"
    );

    assert.deepStrictEqual(resultado, { nucleo: "comprension" });
    console.log("✓ DirectorComprensionPortfolio: prueba estructural superada");
})().catch(error => {
    console.error(error);
    process.exit(1);
});
