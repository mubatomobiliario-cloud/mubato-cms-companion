const assert = require("assert");
const DirectorPortfolio = require("../src/portfolio/directorPortfolio");

/**
 * Prueba de contrato duro para DirectorPortfolio.
 *
 * No depende de Vision, filesystem ni del Constructor real.
 * Las dependencias se sustituyen por dobles controlados para demostrar
 * exactamente qué orquesta el Director y qué NO hace.
 */

const evidenciaEsperada = {
    version: "V2.1",
    proyecto: { nombre: "Fixture" },
    observacionesVision: [
        { fotografia: "foto-01.jpg", analizada: true, materiales: ["madera"] },
        { fotografia: "foto-02.jpg", analizada: true, materiales: ["vidrio"] }
    ]
};

const observacionesEsperadas = [
    evidenciaEsperada.observacionesVision[0],
    evidenciaEsperada.observacionesVision[1]
];

const llamadas = {
    cargar: 0,
    extraerObservaciones: 0,
    construir: 0
};

let rutaRecibida;
let evidenciaRecibida;
let observacionesRecibidas;
let portfolioRecibido;

const lectorMock = {
    cargar(ruta) {
        llamadas.cargar += 1;
        rutaRecibida = ruta;
        return evidenciaEsperada;
    },

    extraerObservaciones(evidencia) {
        llamadas.extraerObservaciones += 1;
        evidenciaRecibida = evidencia;
        return observacionesEsperadas;
    }
};

const constructorMock = {
    construir(portfolio, observaciones) {
        llamadas.construir += 1;
        portfolioRecibido = portfolio;
        observacionesRecibidas = observaciones;
        return "CONTEXTO PORTFOLIO CONTROLADO";
    }
};

const director = new DirectorPortfolio({
    lectorEvidenciaVisual: lectorMock,
    constructorContextoPortfolio: constructorMock
});

const portfolioEsperado = {
    nombre: "Centros de entretenimiento",
    codigo: "PortafolioMUBATO_001"
};

const rutaEsperada = "/evidencia/portfolio.evidencia-visual.json";

// ------------------------------------------------------------
// 1. CONTRATO PRINCIPAL
// ------------------------------------------------------------

const resultado = director.construirContexto(
    portfolioEsperado,
    rutaEsperada
);

assert.strictEqual(resultado, "CONTEXTO PORTFOLIO CONTROLADO");
assert.strictEqual(llamadas.cargar, 1);
assert.strictEqual(llamadas.extraerObservaciones, 1);
assert.strictEqual(llamadas.construir, 1);
assert.strictEqual(rutaRecibida, rutaEsperada);
assert.strictEqual(evidenciaRecibida, evidenciaEsperada);
assert.strictEqual(portfolioRecibido, portfolioEsperado);
assert.strictEqual(observacionesRecibidas, observacionesEsperadas);

// ------------------------------------------------------------
// 2. ORDEN DE ORQUESTACIÓN
// ------------------------------------------------------------

const orden = [];

const lectorOrdenMock = {
    cargar() {
        orden.push("cargar");
        return evidenciaEsperada;
    },
    extraerObservaciones() {
        orden.push("extraer");
        return observacionesEsperadas;
    }
};

const constructorOrdenMock = {
    construir() {
        orden.push("construir");
        return "ok";
    }
};

new DirectorPortfolio({
    lectorEvidenciaVisual: lectorOrdenMock,
    constructorContextoPortfolio: constructorOrdenMock
}).construirContexto(portfolioEsperado, rutaEsperada);

assert.deepStrictEqual(orden, ["cargar", "extraer", "construir"]);

// ------------------------------------------------------------
// 3. NO HAY FALLBACK A VISION
// ------------------------------------------------------------

// Si el lector falla, el Director debe propagar el error.
// No puede intentar analizar fotografías por otra vía.
const errorEsperado = new Error("EVIDENCIA_INDISPONIBLE");

const lectorErrorMock = {
    cargar() {
        throw errorEsperado;
    },
    extraerObservaciones() {
        throw new Error("NO_DEBE_EJECUTARSE");
    }
};

let constructorLlamadoTrasError = false;

const constructorErrorMock = {
    construir() {
        constructorLlamadoTrasError = true;
        throw new Error("NO_DEBE_CONSTRUIRSE");
    }
};

assert.throws(
    () => new DirectorPortfolio({
        lectorEvidenciaVisual: lectorErrorMock,
        constructorContextoPortfolio: constructorErrorMock
    }).construirContexto(portfolioEsperado, rutaEsperada),
    error => error === errorEsperado
);

assert.strictEqual(constructorLlamadoTrasError, false);

// ------------------------------------------------------------
// 4. RUTA DE EVIDENCIA OBLIGATORIA
// ------------------------------------------------------------

for (const rutaInvalida of ["", null, undefined, 123, {}, []]) {
    assert.throws(
        () => director.construirContexto(portfolioEsperado, rutaInvalida),
        /requiere la ruta de evidencia visual persistida/
    );
}

// Una ruta inválida no debe tocar ninguna dependencia.
assert.strictEqual(llamadas.cargar, 1);
assert.strictEqual(llamadas.extraerObservaciones, 1);
assert.strictEqual(llamadas.construir, 1);

// ------------------------------------------------------------
// 5. EL DIRECTOR NO CONOCE NI INYECTA VISION
// ------------------------------------------------------------

assert.strictEqual(Object.prototype.hasOwnProperty.call(director, "vision"), false);
assert.strictEqual(Object.prototype.hasOwnProperty.call(director, "openAI"), false);
assert.strictEqual(Object.prototype.hasOwnProperty.call(director, "analizadorFotografias"), false);
assert.strictEqual(Object.prototype.hasOwnProperty.call(director, "procesadorEditorialV2"), false);
assert.strictEqual(Object.prototype.hasOwnProperty.call(director, "validadorEditorialV2"), false);

// ------------------------------------------------------------
// 6. EL DIRECTOR NO REINTERPRETA LA EVIDENCIA
// ------------------------------------------------------------

assert.strictEqual(observacionesRecibidas, observacionesEsperadas);
assert.strictEqual(observacionesRecibidas.length, 2);
assert.strictEqual(observacionesRecibidas[0], evidenciaEsperada.observacionesVision[0]);
assert.strictEqual(observacionesRecibidas[1], evidenciaEsperada.observacionesVision[1]);

// ------------------------------------------------------------
// 7. PORTFOLIO ES OBLIGATORIO PARA EL CONSTRUCTOR
// ------------------------------------------------------------

let portfolioRecibidoEnError;
const constructorValidacionMock = {
    construir(portfolio) {
        portfolioRecibidoEnError = portfolio;
        throw new Error("PORTFOLIO_INVALIDO");
    }
};

assert.throws(
    () => new DirectorPortfolio({
        lectorEvidenciaVisual: lectorMock,
        constructorContextoPortfolio: constructorValidacionMock
    }).construirContexto(null, rutaEsperada),
    /PORTFOLIO_INVALIDO/
);

assert.strictEqual(portfolioRecibidoEnError, null);

console.log("✓ DirectorPortfolio: contrato duro superado");
