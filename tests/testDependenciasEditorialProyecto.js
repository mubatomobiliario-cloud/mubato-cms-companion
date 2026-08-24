console.log("testDependenciasEditorialProyecto.js cargado");

const fs = require("fs");
const os = require("os");
const path = require("path");

const Parser = require("../src/core/parser");
const DirectorProyecto = require("../src/workflow/directorProyecto");
const SalidaEditorialCSV = require("../src/Exportadores/salidaEditorialCSV");

class VisionStub {
    async analizar(proyecto) {
        return {
            ...proyecto,
            fotografias: proyecto.fotografias || [
                {
                    nombre: "foto-prueba.jpg",
                    espacio: "sala",
                    plano: "general",
                    estilo: "contemporáneo",
                    iluminacion: "natural",
                    sensacion: "serena"
                }
            ]
        };
    }
}

class ExpedienteStub {
    construir() {
        return {
            proyecto: { nombre: "Proyecto Dependencias" },
            observacionesVision: [
                {
                    fotografia: "foto-prueba.jpg",
                    observacion: "Evidencia visual de prueba"
                }
            ]
        };
    }
}

class ExportadorStub {
    persistirEvidenciaVisual() {
        return "/tmp/evidencia-prueba.json";
    }
}

class ProcesadorEditorialStub {
    async generar(filaCSV, contexto) {
        if (!filaCSV) throw new Error("No recibió filaCSV.");
        if (!contexto || !contexto.evidenciaVisual) {
            throw new Error("No recibió evidencia visual.");
        }

        return {
            codigo: "MUBATO-PRUEBA",
            heroTexto: "Texto Hero de prueba",
            historia: "Historia editorial de prueba",
            descripcion: "Descripción de prueba",
            servicios: "Diseño y mobiliario",
            slug: "proyecto-dependencias",
            seo: {
                seoTitle: "Proyecto de prueba | MUBATO",
                metaDescription: "Descripción SEO de prueba."
            }
        };
    }
}

class SalidaEditorialStub {
    exportar(argumentos) {
        const requeridos = [
            "rutaEntrada",
            "rutaSalida",
            "filaProyecto",
            "editorial"
        ];

        for (const campo of requeridos) {
            if (argumentos[campo] === undefined) {
                throw new Error(`SalidaEditorialCSV no recibió: ${campo}.`);
            }
        }

        if (argumentos.editorial.heroTexto !== "Texto Hero de prueba") {
            throw new Error("Hero Texto no llegó correctamente a la salida.");
        }

        if (argumentos.editorial.historia !== "Historia editorial de prueba") {
            throw new Error("Historia no llegó correctamente a la salida.");
        }

        return {
            rutaSalida: argumentos.rutaSalida,
            proyecto: argumentos.filaProyecto.Proyecto,
            camposActualizados: Object.keys(argumentos.editorial)
        };
    }
}

function crearCSVTemporal() {
    const directorio = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-dependencias-"));
    const rutaCSV = path.join(directorio, "entrada.csv");

    const encabezados = [
        "Proyecto",
        "Descripción",
        "Hero Imágen",
        "Hero Texto",
        "ID",
        "Código MUBATO",
        "Ciudad",
        "Categoría",
        "Servicios",
        "SEO Title",
        "Meta Description",
        "Slug",
        "Cliente",
        "Observaciones"
    ];

    const valores = [
        "Proyecto Dependencias",
        "Descripción original",
        "hero-original.jpg",
        "Hero original",
        "id-prueba",
        "",
        "Bogotá",
        "Sala",
        "",
        "",
        "",
        "",
        "Cliente prueba",
        ""
    ];

    fs.writeFileSync(
        rutaCSV,
        encabezados.join(",") + "\n" + valores.map(valor => JSON.stringify(valor)).join(",") + "\n",
        "utf8"
    );

    return { directorio, rutaCSV };
}

function assert(condicion, mensaje) {
    if (!condicion) throw new Error(mensaje);
}

async function ejecutar() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — DEPENDENCIAS EDITORIAL PROYECTO V2.2");
    console.log("======================================");
    console.log("");

    const { directorio, rutaCSV } = crearCSVTemporal();

    try {
        console.log("1. Verificando Parser...");
        const parser = new Parser();
        const proyecto = parser.importarProyecto(rutaCSV, directorio);

        assert(proyecto.tipoEditorial === "PROYECTO", "El Parser no determinó PROYECTO.");
        assert(proyecto.flujoEditorial === "EDITORIAL_PROYECTO_V2.2", "El Parser no seleccionó Editorial Proyecto V2.2.");
        assert(proyecto.filaCSV, "El Parser no conservó filaCSV.");
        assert(proyecto.filaCSV["Hero Imágen"] === "hero-original.jpg", "Se perdió Hero Imágen original.");
        assert(proyecto.filaCSV["Hero Texto"] === "Hero original", "Se perdió Hero Texto original.");
        console.log("✓ Parser entrega identidad, flujo y fila CSV original.");
        console.log("");

        console.log("2. Verificando dependencias del DirectorProyecto...");
        const director = new DirectorProyecto({
            vision: new VisionStub(),
            expedienteProyecto: new ExpedienteStub(),
            exportadorEditorial: new ExportadorStub(),
            procesadorEditorialProyecto: new ProcesadorEditorialStub(),
            salidaEditorialCSV: new SalidaEditorialStub()
        });

        assert(director.vision, "Falta dependencia Vision.");
        assert(director.expedienteProyecto, "Falta dependencia ExpedienteProyecto.");
        assert(director.exportadorEditorial, "Falta dependencia ExportadorEditorial.");
        assert(director.procesadorEditorialProyecto, "Falta dependencia Editorial Proyecto V2.2.");
        assert(director.salidaEditorialCSV, "Falta dependencia SalidaEditorialCSV.");
        console.log("✓ Todas las dependencias del DirectorProyecto están disponibles.");
        console.log("");

        console.log("3. Verificando compatibilidad Parser → Director...");
        const resultado = await director.ejecutar(proyecto);

        assert(resultado.resultadoEditorial, "No existe resultadoEditorial.");
        assert(resultado.salidaEditorialCSV, "No existe salidaEditorialCSV.");
        assert(resultado.filaCSV === proyecto.filaCSV, "La fila CSV no se conservó durante el pipeline.");
        console.log("✓ Datos y evidencia atraviesan correctamente el pipeline.");
        console.log("");

        console.log("4. Verificando dependencia Salida Editorial CSV...");
        assert(resultado.salidaEditorialCSV.rutaSalida.endsWith(".salida-editorial-proyecto-v2.csv"), "La ruta de salida no corresponde a Editorial Proyecto V2.2.");
        console.log("✓ Resultado editorial llega correctamente a la salida CSV.");
        console.log("");

        console.log("--------------------------------------");
        console.log("PRUEBA SUPERADA");
        console.log("--------------------------------------");
        console.log("");
        console.log("✓ Parser → Director → Editorial Proyecto V2.2 → Salida CSV");
        console.log("✓ Dependencias estructurales verificadas.");
        console.log("✓ Fila CSV original verificada.");
        console.log("✓ Hero Imágen y Hero Texto originales no fueron sustituidos.");
        console.log("✓ Evidencia visual disponible para Editorial.");
        console.log("✓ No se utilizó OpenAI.");
        console.log("");
    } finally {
        fs.rmSync(directorio, { recursive: true, force: true });
    }
}

ejecutar().catch(error => {
    console.error("");
    console.error("✗ PRUEBA FALLIDA");
    console.error("");
    console.error(error.message);
    process.exitCode = 1;
});
