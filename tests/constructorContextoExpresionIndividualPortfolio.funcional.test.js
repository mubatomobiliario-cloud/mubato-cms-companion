const assert = require("assert");
const ConstructorContextoExpresionIndividualPortfolio = require("../src/portfolio/constructorContextoExpresionIndividualPortfolio");

const portfolio = {
    nombre: "Centros de Entretenimiento",
    categoria: ["Residencial"],
    ciudad: "Bogotá",
    espacios: ["Sala", "Cocina", "Alcoba Principal", "Alcoba Infantil", "Estudio"],
    cliente: "Varios"
};

const comprension = {
    nucleo: "Colección residencial de centros de entretenimiento que integra televisión, almacenamiento y superficies de apoyo en salas y alcobas, con soluciones contemporáneas basadas en madera, vidrio, tonos neutros y composiciones ordenadas.",
    caracter: "Contemporáneo y moderno, con una presencia cálida y serena.",
    materialidad: [
        {
            texto: "La madera y la madera natural aparecen como recurso dominante.",
            evidencia: [
                "CentrosEntretenimiento_004.JPG",
                "CentrosEntretenimiento_003.JPG",
                "CentrosEntretenimiento_007.JPG",
                "CentrosEntretenimiento_006.JPG",
                "CentrosEntretenimiento_001.JPG",
                "CentrosEntretenimiento_002.JPG"
            ]
        },
        {
            texto: "El vidrio acompaña las composiciones de la colección.",
            evidencia: [
                "CentrosEntretenimiento_004.JPG",
                "CentrosEntretenimiento_005.JPG",
                "CentrosEntretenimiento_003.JPG",
                "CentrosEntretenimiento_007.JPG",
                "CentrosEntretenimiento_006.JPG",
                "CentrosEntretenimiento_001.JPG",
                "CentrosEntretenimiento_002.JPG"
            ]
        }
    ],
    funcionalidad: [
        {
            texto: "La colección integra entretenimiento, almacenamiento y exhibición.",
            evidencia: [
                "CentrosEntretenimiento_004.JPG",
                "CentrosEntretenimiento_003.JPG",
                "CentrosEntretenimiento_006.JPG",
                "CentrosEntretenimiento_002.JPG"
            ]
        }
    ],
    relacionesEspaciales: [
        {
            texto: "Las composiciones se relacionan con salas, alcobas, ventanas y frentes murales.",
            evidencia: [
                "CentrosEntretenimiento_004.JPG",
                "CentrosEntretenimiento_005.JPG",
                "CentrosEntretenimiento_007.JPG",
                "CentrosEntretenimiento_001.JPG",
                "CentrosEntretenimiento_002.JPG"
            ]
        }
    ],
    experiencia: "El conjunto transmite orden, luminosidad, calidez y calma.",
    rasgosDiferenciales: [
        {
            texto: "La tipología se adapta a distintos contextos residenciales.",
            evidencia: [
                "CentrosEntretenimiento_004.JPG",
                "CentrosEntretenimiento_005.JPG",
                "CentrosEntretenimiento_001.JPG",
                "CentrosEntretenimiento_002.JPG"
            ]
        }
    ],
    enfoqueNarrativo: "Presentar la colección como soluciones residenciales que organizan tecnología y almacenamiento con lenguaje contemporáneo."
};

const observacion002 = {
    fotografia: "CentrosEntretenimiento_002.JPG",
    analizada: true,
    espacio: "Alcoba auxiliar",
    tipo: "",
    plano: "General",
    estilo: "Contemporary",
    materiales: ["wood", "glass"],
    colores: ["white", "gray", "black", "brown", "beige", "green"],
    elementos: ["TV", "desk", "chair", "arcade machine", "armchair", "shelves"],
    iluminacion: "Natural",
    sensacion: "Playful",
    observaciones: "TV furniture with desk, chair, shelves and arcade machine in an auxiliary bedroom.",
    confianza: 90
};

const constructor = new ConstructorContextoExpresionIndividualPortfolio();
const contexto = constructor.construir(comprension, observacion002, portfolio);

assert.strictEqual(typeof contexto, "string");
assert.ok(contexto.length > 0);

// Identidad del Portfolio.
assert.ok(contexto.includes("Centros de Entretenimiento"));
assert.ok(contexto.includes("Bogotá"));
assert.ok(contexto.includes("Residencial"));

// Comprensión central: debe entrar como contexto editorial.
assert.ok(contexto.includes("COMPRENSIÓN EDITORIAL CENTRAL"));
assert.ok(contexto.includes(comprension.nucleo));
assert.ok(contexto.includes(comprension.caracter));
assert.ok(contexto.includes(comprension.experiencia));
assert.ok(contexto.includes(comprension.enfoqueNarrativo));

// Evidencia individual: debe entrar completa y específicamente.
assert.ok(contexto.includes("EVIDENCIA DE LA FOTOGRAFÍA"));
assert.ok(contexto.includes("CentrosEntretenimiento_002.JPG"));
assert.ok(contexto.includes("Alcoba auxiliar"));
assert.ok(contexto.includes("desk"));
assert.ok(contexto.includes("arcade machine"));
assert.ok(contexto.includes("Playful"));
assert.ok(contexto.includes("TV furniture with desk, chair, shelves and arcade machine in an auxiliary bedroom."));

// La arquitectura debe declarar sus límites.
assert.ok(contexto.includes("no ejecuta Vision"));
assert.ok(contexto.includes("No decidir inclusión, selección ni orden"));
assert.ok(contexto.includes("No inventar personas, necesidades, usos, materiales, espacios o circunstancias no observados."));

// Control crítico: una evidencia de otra fotografía no debe contaminar la evidencia individual.
assert.ok(!contexto.includes("CentrosEntretenimiento_005.JPG"));

console.log("✓ ConstructorContextoExpresionIndividualPortfolio: prueba funcional aislada superada");
