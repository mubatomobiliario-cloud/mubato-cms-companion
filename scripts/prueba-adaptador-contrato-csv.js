const fs = require("fs");
const os = require("os");
const path = require("path");
const Papa = require("papaparse");
const AdaptadorCSVEditorial = require("../src/Exportadores/adaptadorCSVEditorial");

const adaptador = new AdaptadorCSVEditorial();

const decisionDocumentada = {
    aprobado: true,
    estado: "APROBADA_CON_REVISION_HUMANA",
    modo: "TRANSFORMACION_DOCUMENTADA",
    transformacionDocumentada: true,
    metricas: { palabras: 264 },
    errores: []
};

const decisionBloqueada = {
    aprobado: false,
    estado: "REQUIERE_DOCUMENTACION",
    modo: "TRANSFORMACION_NO_DOCUMENTADA",
    transformacionDocumentada: false,
    metricas: { palabras: 301 },
    errores: ["La transformación no está documentada."]
};

const historia = "Historia documentada de prueba para verificar la escritura controlada en el CSV editorial de MUBATO.";

function crearCSV(encabezados = [
    "ID",
    "Proyecto",
    "Slug",
    "Código MUBATO",
    "Historia de Transformación",
    "SEO Title",
    "Meta Description",
    "Campo Wix Intacto"
]) {
    const fila = [
        "abc123",
        "Hogar Control",
        "hogar-control",
        "",
        "",
        "Título Wix original",
        "Meta Wix original",
        "NO TOCAR"
    ];

    const directorio = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-csv-"));
    const entrada = path.join(directorio, "entrada.csv");
    const salida = path.join(directorio, "salida.csv");
    fs.writeFileSync(entrada, Papa.unparse([encabezados, fila]), "utf8");

    return {
        directorio,
        entrada,
        salida,
        filaProyecto: {
            ID: "abc123",
            Proyecto: "Hogar Control",
            Slug: "hogar-control",
            "Código MUBATO": ""
        }
    };
}

function leerCSV(ruta) {
    return Papa.parse(fs.readFileSync(ruta, "utf8"), {
        header: true,
        skipEmptyLines: true
    }).data[0];
}

console.log("");
console.log("======================================");
console.log("PRUEBA REAL — ADAPTADOR + CONTRATO CSV");
console.log("======================================");

// CASO 1: una salida no documentada no debe escribir el CSV.
{
    const caso = crearCSV();
    let bloqueado = false;

    try {
        adaptador.exportar({
            rutaEntrada: caso.entrada,
            rutaSalida: caso.salida,
            filaProyecto: caso.filaProyecto,
            decision: decisionBloqueada,
            historia
        });
    } catch (error) {
        bloqueado = error.codigo === "BLOQUEADO_POR_CONTRATO";
        console.log(`CASO 1 — BLOQUEO: ${error.codigo}`);
    }

    if (!bloqueado) throw new Error("CONTRATO FALLIDO: una historia bloqueada llegó al adaptador.");
    if (fs.existsSync(caso.salida)) throw new Error("CONTRATO FALLIDO: se generó CSV pese al bloqueo.");
    console.log("✓ Ningún CSV fue escrito.");
}

// CASO 2: una historia documentada puede entrar y solo toca campos permitidos.
{
    const caso = crearCSV();

    const resultado = adaptador.exportar({
        rutaEntrada: caso.entrada,
        rutaSalida: caso.salida,
        filaProyecto: caso.filaProyecto,
        decision: decisionDocumentada,
        historia,
        camposEditoriales: {
            codigo: "MUBATO-001"
        }
    });

    const fila = leerCSV(caso.salida);

    if (!fs.existsSync(caso.salida)) throw new Error("CONTRATO FALLIDO: no se generó CSV aprobado.");
    if (fila["Historia de Transformación"] !== historia) {
        throw new Error("CONTRATO FALLIDO: la historia no llegó a la columna contractual.");
    }
    if (fila["Código MUBATO"] !== "MUBATO-001") {
        throw new Error("CONTRATO FALLIDO: no se aplicó el campo editorial permitido.");
    }
    if (fila["SEO Title"] !== "Título Wix original") {
        throw new Error("CONTRATO FALLIDO: se modificó un campo Wix no solicitado.");
    }
    if (fila["Meta Description"] !== "Meta Wix original") {
        throw new Error("CONTRATO FALLIDO: se modificó un campo Wix no solicitado.");
    }
    if (fila["Campo Wix Intacto"] !== "NO TOCAR") {
        throw new Error("CONTRATO FALLIDO: se modificó un campo fuera del contrato.");
    }

    console.log(`CASO 2 — ESCRITURA: ${resultado.contratoHistoria.estado}`);
    console.log("✓ Historia escrita y campos no autorizados preservados.");
}

// CASO 3: una columna duplicada debe detener la escritura.
{
    const encabezados = [
        "ID",
        "Proyecto",
        "Slug",
        "Código MUBATO",
        "Historia de Transformación",
        "Historia de Transformación"
    ];
    const caso = crearCSV(encabezados);
    let bloqueado = false;

    try {
        adaptador.exportar({
            rutaEntrada: caso.entrada,
            rutaSalida: caso.salida,
            filaProyecto: caso.filaProyecto,
            decision: decisionDocumentada,
            historia
        });
    } catch (error) {
        bloqueado = error.codigo === "REQUIERE_MAPEO_CSV";
        console.log(`CASO 3 — MAPEO: ${error.codigo}`);
    }

    if (!bloqueado) throw new Error("CONTRATO FALLIDO: columna duplicada no bloqueó la escritura.");
    if (fs.existsSync(caso.salida)) throw new Error("CONTRATO FALLIDO: se generó CSV con columna ambigua.");
    console.log("✓ Escritura detenida por mapeo ambiguo.");
}

console.log("");
console.log("======================================");
console.log("RESULTADO");
console.log("======================================");
console.log("Caso 1: BLOQUEO SUPERADO");
console.log("Caso 2: ESCRITURA CONTROLADA SUPERADA");
console.log("Caso 3: MAPEO AMBIGUO SUPERADO");
console.log("IA utilizada: NO");
console.log("Contrato editorial conectado al adaptador: SÍ");
console.log("✓ FUEGO REAL — ADAPTADOR + CONTRATO SUPERADO");
