const assert = require("assert");
const ContratoPortfolio = require("../src/portfolio/contratos/contratoPortfolio");

const muestra = {
    nucleo: "Sistema de entretenimiento integrado que articula almacenamiento, pantalla y presencia arquitectónica.",
    caracter: "Sobrio, contemporáneo y preciso.",
    materialidad: ["madera", "laca"],
    funcionalidad: ["entretenimiento", "almacenamiento"],
    relacionesEspaciales: ["muro principal", "zona social"],
    experiencia: "Organiza la tecnología dentro de una composición limpia y equilibrada.",
    rasgosDiferenciales: ["integración", "continuidad visual"],
    enfoqueNarrativo: "Contar cómo el mueble integra función y arquitectura sin competir con el espacio."
};

ContratoPortfolio.validar(muestra);

const normalizada = ContratoPortfolio.normalizar(muestra);

assert.strictEqual(normalizada.nucleo, muestra.nucleo);
assert.deepStrictEqual(normalizada.materialidad, muestra.materialidad);
assert.deepStrictEqual(normalizada.funcionalidad, muestra.funcionalidad);
assert.deepStrictEqual(normalizada.relacionesEspaciales, muestra.relacionesEspaciales);
assert.deepStrictEqual(normalizada.rasgosDiferenciales, muestra.rasgosDiferenciales);

const vacia = ContratoPortfolio.crearVacio();
assert.deepStrictEqual(vacia, {
    nucleo: "",
    caracter: "",
    materialidad: [],
    funcionalidad: [],
    relacionesEspaciales: [],
    experiencia: "",
    rasgosDiferenciales: [],
    enfoqueNarrativo: ""
});

const casosInvalidos = [
    null,
    [],
    {},
    { ...muestra, nucleo: "" },
    { ...muestra, caracter: 123 },
    { ...muestra, experiencia: "   " },
    { ...muestra, enfoqueNarrativo: null },
    { ...muestra, materialidad: "madera" },
    { ...muestra, funcionalidad: null },
    { ...muestra, relacionesEspaciales: {} },
    { ...muestra, rasgosDiferenciales: "integración" }
];

for (const caso of casosInvalidos) {
    assert.throws(() => ContratoPortfolio.validar(caso));
}

const entrada = {
    ...muestra,
    materialidad: [" madera ", "", "laca "],
    funcionalidad: [" entretenimiento ", "almacenamiento"],
    relacionesEspaciales: [" muro principal ", "zona social"],
    rasgosDiferenciales: [" integración ", "continuidad visual "]
};

const resultado = ContratoPortfolio.normalizar(entrada);
assert.deepStrictEqual(resultado.materialidad, ["madera", "laca"]);
assert.deepStrictEqual(resultado.funcionalidad, ["entretenimiento", "almacenamiento"]);
assert.deepStrictEqual(resultado.relacionesEspaciales, ["muro principal", "zona social"]);
assert.deepStrictEqual(resultado.rasgosDiferenciales, ["integración", "continuidad visual"]);

assert.deepStrictEqual(entrada, {
    ...muestra,
    materialidad: [" madera ", "", "laca "],
    funcionalidad: [" entretenimiento ", "almacenamiento"],
    relacionesEspaciales: [" muro principal ", "zona social"],
    rasgosDiferenciales: [" integración ", "continuidad visual "]
});

console.log("✓ ContratoPortfolio: prueba estructural aislada superada");
