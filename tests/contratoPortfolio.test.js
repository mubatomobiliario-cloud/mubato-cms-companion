const assert = require("assert");
const ContratoPortfolio = require("../src/portfolio/contratos/contratoPortfolio");

const muestra = {
    nucleo: "Sistema de entretenimiento integrado que articula almacenamiento, pantalla y presencia arquitectónica.",
    caracter: "Sobrio, contemporáneo y preciso.",
    materialidad: [
        { texto: "madera", evidencia: ["foto-01.jpg", "foto-02.jpg"] }
    ],
    funcionalidad: [
        { texto: "entretenimiento", evidencia: ["foto-01.jpg", "foto-02.jpg"] },
        { texto: "almacenamiento", evidencia: ["foto-02.jpg"] }
    ],
    relacionesEspaciales: [
        { texto: "muro principal", evidencia: ["foto-01.jpg"] }
    ],
    experiencia: "Organiza la tecnología dentro de una composición limpia y equilibrada.",
    rasgosDiferenciales: [
        { texto: "integración", evidencia: ["foto-01.jpg", "foto-02.jpg"] }
    ],
    enfoqueNarrativo: "Contar cómo el mueble integra función y arquitectura sin competir con el espacio."
};

assert.deepStrictEqual(ContratoPortfolio.CAMPOS, [
    "nucleo",
    "caracter",
    "materialidad",
    "funcionalidad",
    "relacionesEspaciales",
    "experiencia",
    "rasgosDiferenciales",
    "enfoqueNarrativo"
]);

ContratoPortfolio.validar(muestra);

const normalizada = ContratoPortfolio.normalizar(muestra);
assert.deepStrictEqual(normalizada, muestra);

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
    { ...muestra, rasgosDiferenciales: "integración" },
    { ...muestra, materialidad: [{ texto: "madera", evidencia: [] }] },
    { ...muestra, funcionalidad: [{ texto: "", evidencia: ["foto-01.jpg"] }] },
    { ...muestra, relacionesEspaciales: [{ texto: "muro", evidencia: [""] }] },
    { ...muestra, rasgosDiferenciales: [{ texto: "integración", evidencia: "foto-01.jpg" }] },
    { ...muestra, materialidad: [{ texto: "madera", evidencia: [123] }] }
];

for (const caso of casosInvalidos) {
    assert.throws(() => ContratoPortfolio.validar(caso));
}

const entrada = {
    ...muestra,
    materialidad: [
        { texto: " madera ", evidencia: [" foto-01.jpg ", "foto-02.jpg "] }
    ],
    funcionalidad: [
        { texto: " entretenimiento ", evidencia: ["foto-01.jpg"] },
        { texto: "almacenamiento", evidencia: [" foto-02.jpg "] }
    ],
    relacionesEspaciales: [
        { texto: " muro principal ", evidencia: ["foto-01.jpg"] }
    ],
    rasgosDiferenciales: [
        { texto: " integración ", evidencia: ["foto-01.jpg", " foto-02.jpg "] }
    ]
};

const entradaOriginal = JSON.parse(JSON.stringify(entrada));
const resultado = ContratoPortfolio.normalizar(entrada);

assert.deepStrictEqual(resultado.materialidad, [
    { texto: "madera", evidencia: ["foto-01.jpg", "foto-02.jpg"] }
]);
assert.deepStrictEqual(resultado.funcionalidad, [
    { texto: "entretenimiento", evidencia: ["foto-01.jpg"] },
    { texto: "almacenamiento", evidencia: ["foto-02.jpg"] }
]);
assert.deepStrictEqual(resultado.relacionesEspaciales, [
    { texto: "muro principal", evidencia: ["foto-01.jpg"] }
]);
assert.deepStrictEqual(resultado.rasgosDiferenciales, [
    { texto: "integración", evidencia: ["foto-01.jpg", "foto-02.jpg"] }
]);

assert.deepStrictEqual(entrada, entradaOriginal);

console.log("✓ ContratoPortfolio: trazabilidad de evidencia superada");
