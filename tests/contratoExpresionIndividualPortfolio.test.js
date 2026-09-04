const assert = require("assert");
const ContratoExpresionIndividualPortfolio = require("../src/portfolio/contratos/contratoExpresionIndividualPortfolio");

const muestra = {
    title: "Centro de entretenimiento flotante en alcoba principal",
    description: "En la alcoba principal, el televisor se integra a una composición con mueble flotante y panel decorativo en madera natural.",
    alt: "Alcoba principal contemporánea con cama, televisor, mueble flotante y panel decorativo en madera.",
    keywords: ["centro de entretenimiento", "alcoba principal", "mueble flotante", "madera"],
    nombreSEO: "centro-de-entretenimiento-flotante-en-alcoba-principal"
};

assert.deepStrictEqual(ContratoExpresionIndividualPortfolio.CAMPOS, [
    "title",
    "description",
    "alt",
    "keywords",
    "nombreSEO"
]);

ContratoExpresionIndividualPortfolio.validar(muestra);
ContratoExpresionIndividualPortfolio.validar(muestra, {
    fotografia: "CentrosEntretenimiento_005.JPG"
});

const normalizada = ContratoExpresionIndividualPortfolio.normalizar(muestra, {
    fotografia: "CentrosEntretenimiento_005.JPG"
});
assert.deepStrictEqual(normalizada, muestra);

const vacia = ContratoExpresionIndividualPortfolio.crearVacio();
assert.deepStrictEqual(vacia, {
    title: "",
    description: "",
    alt: "",
    keywords: [],
    nombreSEO: ""
});

const casosInvalidos = [
    null,
    [],
    {},
    { ...muestra, title: "" },
    { ...muestra, description: "   " },
    { ...muestra, alt: 123 },
    { ...muestra, nombreSEO: null },
    { ...muestra, keywords: [] },
    { ...muestra, keywords: "madera" },
    { ...muestra, keywords: ["madera", ""] },
    { ...muestra, keywords: ["madera", 123] }
];

for (const caso of casosInvalidos) {
    assert.throws(() => ContratoExpresionIndividualPortfolio.validar(caso));
}

assert.throws(() => ContratoExpresionIndividualPortfolio.validar(muestra, {
    fotografia: "   "
}));
assert.throws(() => ContratoExpresionIndividualPortfolio.validar(muestra, {
    fotografia: 123
}));

const entrada = {
    title: " Centro de entretenimiento flotante ",
    description: " Composición en madera natural junto a la cama. ",
    alt: " Centro de entretenimiento en alcoba principal. ",
    keywords: [" madera ", "alcoba principal", " centro de entretenimiento "],
    nombreSEO: " centro-de-entretenimiento-alcoba-principal "
};

const entradaOriginal = JSON.parse(JSON.stringify(entrada));
const resultado = ContratoExpresionIndividualPortfolio.normalizar(entrada, {
    fotografia: "CentrosEntretenimiento_005.JPG"
});

assert.deepStrictEqual(resultado, {
    title: "Centro de entretenimiento flotante",
    description: "Composición en madera natural junto a la cama.",
    alt: "Centro de entretenimiento en alcoba principal.",
    keywords: ["madera", "alcoba principal", "centro de entretenimiento"],
    nombreSEO: "centro-de-entretenimiento-alcoba-principal"
});

assert.deepStrictEqual(entrada, entradaOriginal);

console.log("✓ ContratoExpresionIndividualPortfolio: prueba estructural superada");
