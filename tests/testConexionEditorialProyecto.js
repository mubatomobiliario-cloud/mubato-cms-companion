console.log("testConexionEditorialProyecto.js cargado");

const DirectorProyecto = require("../src/workflow/directorProyecto");

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

class ProcesadorEditorialFalso {
    constructor() {
        this.llamadas = 0;
    }

    async generar(fila, opciones) {
        this.llamadas += 1;
        assert(fila.Proyecto === "Hogar Araque", "El procesador no recibió la fila CSV correcta.");
        assert(Array.isArray(opciones.evidenciaVisual), "El procesador no recibió evidencia visual.");
        return {
            historia: "Historia editorial de prueba.",
            heroTexto: "Hero editorial de prueba.",
            descripcion: "Descripción editorial de prueba.",
            codigo: "MUB-TEST-001",
            servicios: ["Diseño", "Mobiliario"],
            slug: "hogar-araque",
            seo: {
                seoTitle: "Hogar Araque | MUBATO",
                metaDescription: "Historia de transformación del Hogar Araque."
            }
        };
    }
}

class SalidaEditorialCSVFalsa {
    constructor() {
        this.llamadas = 0;
    }

    exportar(argumentos) {
        this.llamadas += 1;
        assert(argumentos.rutaEntrada === "/tmp/entrada.csv", "Ruta de entrada incorrecta.");
        assert(argumentos.filaProyecto.Proyecto === "Hogar Araque", "La salida no recibió la fila CSV correcta.");
        assert(argumentos.editorial.codigo === "MUB-TEST-001", "La salida no recibió el contrato editorial correcto.");
        return { rutaSalida: argumentos.rutaSalida };
    }
}

async function ejecutar() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — CONEXIÓN EDITORIAL PROYECTO V2.2");
    console.log("======================================");
    console.log("");

    const procesador = new ProcesadorEditorialFalso();
    const salida = new SalidaEditorialCSVFalsa();
    const director = new DirectorProyecto({
        procesadorEditorialProyecto: procesador,
        salidaEditorialCSV: salida
    });

    director.analizar = async proyecto => proyecto;

    const proyecto = {
        nombre: "Hogar Araque",
        rutaCSV: "/tmp/entrada.csv",
        flujoEditorial: "EDITORIAL_PROYECTO_V2.2",
        filaCSV: { Proyecto: "Hogar Araque", Observaciones: "" },
        expediente: { observacionesVision: [{ fotografia: "foto.jpg", analizada: true }] }
    };

    const resultado = await director.ejecutar(proyecto);

    assert(procesador.llamadas === 1, "Editorial Proyecto V2.2 no fue ejecutado exactamente una vez.");
    assert(salida.llamadas === 1, "La salida Editorial CSV no fue ejecutada exactamente una vez.");
    assert(resultado.resultadoEditorial, "No regresó el resultado editorial.");
    assert(resultado.salidaEditorialCSV, "No regresó el resultado de salida CSV.");

    console.log("✓ PROYECTO → Editorial Proyecto V2.2 conectado.");
    console.log("✓ Editorial Proyecto V2.2 recibe la fila CSV original.");
    console.log("✓ Editorial Proyecto V2.2 recibe evidencia visual reutilizable.");
    console.log("✓ Resultado editorial se entrega a Salida Editorial CSV.");
    console.log("✓ No se utilizó OpenAI en esta prueba.");

    const directorPortfolio = new DirectorProyecto({
        procesadorEditorialProyecto: procesador,
        salidaEditorialCSV: salida
    });

    let portfolioBloqueado = false;
    try {
        await directorPortfolio.ejecutar({
            nombre: "Centro de Entretenimiento",
            flujoEditorial: "EDITORIAL_PORTFOLIO"
        });
    } catch (error) {
        portfolioBloqueado = error.message.includes("EDITORIAL_PORTFOLIO") &&
            error.message.includes("no está conectado");
    }

    assert(portfolioBloqueado, "La rama PORTFOLIO no quedó aislada del pipeline de Proyecto.");
    assert(procesador.llamadas === 1, "La rama PORTFOLIO ejecutó indebidamente Editorial Proyecto V2.2.");

    console.log("✓ PORTFOLIO queda aislado y no cae accidentalmente en Proyecto.");
    console.log("");
    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log("");
}

ejecutar().catch(error => {
    console.error("\n✗ PRUEBA FALLIDA\n");
    console.error(error.stack || error);
    process.exit(1);
});
