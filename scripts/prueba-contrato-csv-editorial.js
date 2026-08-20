const ContratoCSVEditorial = require("../src/Exportadores/contratoCSVEditorial");

function decision({ aprobado, estado, modo, documentada, palabras, errores = [] }) {
    return {
        aprobado,
        estado,
        modo,
        transformacionDocumentada: documentada,
        metricas: { palabras },
        errores
    };
}

function ejecutar() {
    const contrato = new ContratoCSVEditorial();
    const historia = "Una historia editorial de transformación suficientemente extensa para representar el contenido que será publicado en el CMS de MUBATO.";

    console.log("======================================");
    console.log("PRUEBA CONTROLADA — CONTRATO CSV EDITORIAL");
    console.log("======================================\n");

    const araque = contrato.prepararEscritura({
        encabezados: ["ID", "Proyecto", "Descripción", "Código MUBATO"],
        decision: decision({
            aprobado: false,
            estado: "REQUIERE_DOCUMENTACION",
            modo: "TRANSFORMACION_NO_DOCUMENTADA",
            documentada: false,
            palabras: 301
        }),
        historia,
        candidatosColumna: ["Historia de Transformación", "Descripción"]
    });

    console.log("CASO 1 — ARAQUE NO DOCUMENTADA");
    console.log(JSON.stringify(araque, null, 2));

    if (araque.permitido) {
        throw new Error("CONTRATO FALLIDO: Araque no puede entrar al CSV.");
    }
    if (araque.estado !== "BLOQUEADO_POR_CONTRATO") {
        throw new Error("CONTRATO FALLIDO: Araque no quedó bloqueada por contrato.");
    }
    console.log("✓ Bloqueo de publicación superado.\n");

    const control = contrato.prepararEscritura({
        encabezados: ["ID", "Proyecto", "Historia de Transformación", "Código MUBATO"],
        decision: decision({
            aprobado: true,
            estado: "APROBADA_CON_REVISION_HUMANA",
            modo: "TRANSFORMACION_DOCUMENTADA",
            documentada: true,
            palabras: 264
        }),
        historia,
        candidatosColumna: ["Historia de Transformación", "Descripción"]
    });

    console.log("CASO 2 — CONTROL DOCUMENTADA");
    console.log(JSON.stringify(control, null, 2));

    if (!control.permitido) {
        throw new Error("CONTRATO FALLIDO: la transformación documentada debe poder continuar.");
    }
    if (control.columnaHistoria.nombre !== "Historia de Transformación") {
        throw new Error("CONTRATO FALLIDO: no se resolvió la columna canónica de Historia.");
    }
    console.log("✓ Preparación de escritura superada.\n");

    const duplicada = contrato.prepararEscritura({
        encabezados: ["ID", "Proyecto", "Historia de Transformación", "Historia de Transformación"],
        decision: decision({
            aprobado: true,
            estado: "APROBADA_CON_REVISION_HUMANA",
            modo: "TRANSFORMACION_DOCUMENTADA",
            documentada: true,
            palabras: 250
        }),
        historia,
        candidatosColumna: ["Historia de Transformación"]
    });

    console.log("CASO 3 — COLUMNA DUPLICADA");
    console.log(JSON.stringify(duplicada, null, 2));

    if (duplicada.permitido || duplicada.estado !== "REQUIERE_MAPEO_CSV") {
        throw new Error("CONTRATO FALLIDO: una columna duplicada no puede resolverse silenciosamente.");
    }
    console.log("✓ Bloqueo por mapeo ambiguo superado.\n");

    console.log("======================================");
    console.log("RESULTADO");
    console.log("======================================\n");
    console.log("Araque: BLOQUEADA");
    console.log("Control: LISTA PARA ESCRITURA");
    console.log("Duplicada: REQUIERE_MAPEO_CSV");
    console.log("IA utilizada: NO");
    console.log("\n✓ CONTRATO CSV EDITORIAL SUPERADO");
}

ejecutar();
