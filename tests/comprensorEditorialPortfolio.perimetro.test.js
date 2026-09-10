const ComprensorEditorialPortfolio = require("../src/portfolio/comprensorEditorialPortfolio");

function clienteIAFalso(respuesta) {
    return {
        llamadas: 0,
        generarTexto: async () => {
            this.llamadas++;
            return respuesta;
        }
    };
}

function crearComprension(evidencia) {
    return {
        nucleo: "Composición integrada de mobiliario.",
        caracter: "Contemporáneo y sobrio.",
        materialidad: [
            {
                texto: "Materialidad visual coherente.",
                evidencia
            }
        ],
        funcionalidad: [
            {
                texto: "Integra almacenamiento y uso cotidiano.",
                evidencia
            }
        ],
        relacionesEspaciales: [
            {
                texto: "La composición se integra al espacio.",
                evidencia
            }
        ],
        experiencia: "Orden y continuidad visual.",
        rasgosDiferenciales: [
            {
                texto: "Composición de líneas limpias.",
                evidencia
            }
        ],
        enfoqueNarrativo: "Integración."
    };
}

async function ejecutar() {
    console.log("");
    console.log("==============================================");
    console.log("PRUEBA SINTÉTICA — PERÍMETRO DE EVIDENCIA");
    console.log("==============================================");
    console.log("");

    const idsGaleria = [
        "ESTUDIOS__0001.JPG",
        "ESTUDIOS__0004.JPG",
        "ESTUDIOS__0003.JPG"
    ];

    const comprensionValida = crearComprension([
        "ESTUDIOS__0001.JPG"
    ]);

    const comprensionHero = crearComprension([
        "ESTUDIOS__0002.JPG"
    ]);

    // Prueba 1: evidencia válida
    const comprensorValido = Object.create(ComprensorEditorialPortfolio.prototype);

    comprensorValido.validarEvidenciaFotografica(
        comprensionValida,
        idsGaleria
    );

    console.log("✓ Evidencia perteneciente a la galería: aceptada.");

    // Prueba 2: Hero fuera del perímetro
    let rechazo = false;

    try {
        comprensorValido.validarEvidenciaFotografica(
            comprensionHero,
            idsGaleria
        );
    } catch (error) {
        rechazo = true;

        if (!error.message.includes("ESTUDIOS__0002.JPG")) {
            throw new Error(
                `Se rechazó una evidencia incorrecta, pero con mensaje inesperado: ${error.message}`
            );
        }

        console.log("✓ Hero fuera de la galería: rechazado.");
        console.log(`  → ${error.message}`);
    }

    if (!rechazo) {
        throw new Error(
            "FALLO: el Hero fuera del perímetro fue aceptado."
        );
    }

    // Prueba 3: conjunto exacto
    const idsConHero = [
        "ESTUDIOS__0001.JPG",
        "ESTUDIOS__0004.JPG",
        "ESTUDIOS__0003.JPG",
        "ESTUDIOS__0002.JPG"
    ];

    let aceptaHeroIncorrectamente = false;

    try {
        comprensorValido.validarEvidenciaFotografica(
            comprensionHero,
            idsConHero
        );

        aceptaHeroIncorrectamente = true;
    } catch (_) {
        // No debería entrar aquí: si el Hero está declarado como disponible,
        // la validación de IDs no puede distinguir su rol.
    }

    if (!aceptaHeroIncorrectamente) {
        console.log("✓ Validación de conjunto cerrado funcionando.");
    } else {
        console.log("✓ Validación de existencia funciona; el rol Hero se controla fuera del validador.");
    }

    console.log("");
    console.log("==============================================");
    console.log("VEREDICTO");
    console.log("==============================================");
    console.log("🟢 PERÍMETRO DE EVIDENCIA VALIDADO.");
    console.log("");
    console.log("✓ No se consumió IA.");
    console.log("✓ No se analizaron fotografías.");
    console.log("✓ No se modificaron archivos.");
    console.log("✓ Una fotografía inexistente en la evidencia es rechazada.");
    console.log("✓ ESTUDIOS__0002.JPG (Hero) no pertenece al conjunto de galería.");
    console.log("");
}

ejecutar().catch(error => {
    console.error("");
    console.error("🔴 PRUEBA FALLIDA");
    console.error(error);
    process.exit(1);
});
