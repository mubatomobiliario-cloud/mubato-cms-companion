console.log("testAislamientoPipelineEditorial.js cargado");

const fs = require("fs");
const os = require("os");
const path = require("path");
const Papa = require("papaparse");

const Parser = require("../src/core/parser");
const DirectorProyecto = require("../src/workflow/directorProyecto");
const TelemetriaIA = require("../src/core/telemetriaIA");

const PROJECTS = ["Hogar Tijo", "Hogar Rolón", "Hogar Quesada", "Hogar Araque"];
const TARGET = "Hogar Araque";

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function construirCSVTemporal() {
    const encabezados = [
        "ID", "Proyecto", "Código MUBATO", "Hero Texto", "Descripción",
        "Servicios", "Slug", "SEO Title", "Meta Description",
        "Historias de Transformación", "Hero Imágen", "Ciudad", "Categoría",
        "Galería General", "Observaciones"
    ];

    const filas = PROJECTS.map((proyecto, indice) => [
        `id-${indice + 1}`,
        proyecto,
        proyecto === TARGET ? "" : `MUB-${indice + 1}`,
        `Hero original ${proyecto}`,
        `Descripción original ${proyecto}`,
        `Servicios originales ${proyecto}`,
        `slug-${indice + 1}`,
        `SEO original ${proyecto}`,
        `Meta original ${proyecto}`,
        `historia-${proyecto}`,
        `hero-${proyecto}.jpg`,
        "Bogotá",
        "Vivienda",
        `galeria-${proyecto}.json`,
        ""
    ]);

    return Papa.unparse([encabezados, ...filas], { quotes: false });
}

function prepararCarpetaProyecto(tempDir, proyecto) {
    const carpeta = path.join(tempDir, proyecto);
    fs.mkdirSync(carpeta, { recursive: true });

    const imagen = path.join(carpeta, `${proyecto.replace(/[^a-zA-Z0-9]/g, "_")}-hero.jpg`);
    // El pipeline real necesita un archivo físico de imagen; el analizador es
    // sustituido por un stub controlado para evitar llamadas de red en este test.
    fs.writeFileSync(imagen, "fixture-image", "utf8");

    return carpeta;
}

class VisionControlada {
    async analizar(proyecto) {
        proyecto.fotografias = proyecto.fotografias || [];
        proyecto.fotografias = proyecto.fotografias.map(fotografia => ({
            ...fotografia,
            evidenciaVision: {
                identidad: fotografia.nombre || fotografia.archivo || "fixture",
                descripcion: `Evidencia controlada de ${proyecto.nombre}`
            }
        }));
        return proyecto;
    }
}

class ExpedienteControlado {
    construir(proyecto) {
        return {
            observacionesVision: proyecto.fotografias.map(fotografia => ({
                nombre: fotografia.nombre || fotografia.archivo || "fixture",
                evidencia: fotografia.evidenciaVision
            }))
        };
    }
}

class ExportadorControlado {
    persistirEvidenciaVisual(proyecto) {
        proyecto._evidenciaPersistida = proyecto.expediente.observacionesVision;
    }
}

class ProcesadorEditorialControlado {
    async generar(filaCSV, contexto) {
        assert(contexto && Array.isArray(contexto.evidenciaVisual), "Editorial recibió evidencia visual inválida.");
        assert(contexto.evidenciaVisual.length > 0, "Editorial no recibió evidencia visual.");

        const proyecto = filaCSV["Proyecto"];
        const identidad = contexto.evidenciaVisual.every(item => {
            const evidencia = item.evidencia || {};
            return String(evidencia.descripcion || "").includes(proyecto);
        });

        assert(identidad, `Contaminación de evidencia: la evidencia no pertenece exclusivamente a ${proyecto}.`);

        return {
            codigo: `MUB-ARAQUE-TEST`,
            heroTexto: `Hero editorial ${proyecto}`,
            historia: `Historia editorial ${proyecto}`,
            descripcion: `Descripción editorial ${proyecto}`,
            servicios: filaCSV["Servicios"],
            slug: filaCSV["Slug"],
            seo: {
                seoTitle: `SEO editorial ${proyecto}`,
                metaDescription: `Meta editorial ${proyecto}`
            }
        };
    }
}

class SalidaControlada {
    exportar({ rutaEntrada, rutaSalida, filaProyecto, editorial }) {
        const contenido = fs.readFileSync(rutaEntrada, "utf8");
        const datos = Papa.parse(contenido, { header: true, skipEmptyLines: true });
        const filas = datos.data;
        const index = filas.findIndex(fila => fila.Proyecto === filaProyecto.Proyecto);
        assert(index >= 0, `No se encontró ${filaProyecto.Proyecto} en el CSV.`);

        const fila = { ...filas[index] };
        fila["Código MUBATO"] = editorial.codigo;
        fila["Hero Texto"] = editorial.heroTexto;
        fila["Descripción"] = editorial.descripcion;
        fila["Servicios"] = editorial.servicios;
        fila["Slug"] = editorial.slug;
        fila["SEO Title"] = editorial.seoTitle;
        fila["Meta Description"] = editorial.metaDescription;

        filas[index] = fila;
        fs.writeFileSync(rutaSalida, Papa.unparse(filas), "utf8");
        return { rutaSalida };
    }
}

async function main() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — AISLAMIENTO PIPELINE EDITORIAL 3C.3");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: verificar aislamiento extremo-a-extremo al procesar Araque.");
    console.log("El pipeline usa dependencias controladas y no realiza llamadas a OpenAI.");
    console.log("");

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-pipeline-aislamiento-"));
    const rutaCSV = path.join(tempDir, "entrada.csv");
    const csvOriginal = construirCSVTemporal();
    fs.writeFileSync(rutaCSV, csvOriginal, "utf8");

    try {
        console.log("1. Preparando fixture multiproyecto...");
        const carpetas = new Map();
        for (const proyecto of PROJECTS) {
            carpetas.set(proyecto, prepararCarpetaProyecto(tempDir, proyecto));
        }
        console.log("✓ Tijo, Rolón, Quesada y Araque preparados.");
        console.log("✓ Solo Araque queda pendiente para Parser.");

        console.log("");
        console.log("2. Importando exclusivamente Araque mediante Parser...");
        const parser = new Parser();
        const proyecto = parser.importarProyecto(rutaCSV, carpetas.get(TARGET));
        assert(proyecto.nombre === TARGET, `Parser seleccionó ${proyecto.nombre} en vez de ${TARGET}.`);
        assert(proyecto.filaCSV["Proyecto"] === TARGET, "La fila CSV no conserva la identidad de Araque.");
        assert(proyecto.filaCSV["Código MUBATO"] === "", "Araque no quedó pendiente según el contrato del Parser.");
        console.log("✓ Parser → Araque confirmado.");

        console.log("");
        console.log("3. Ejecutando pipeline completo con dependencias controladas...");
        const telemetria = new TelemetriaIA();
        telemetria.iniciarEjecucion({ proyecto: TARGET, prueba: "3C.3" });

        const director = new DirectorProyecto({
            vision: new VisionControlada(),
            expedienteProyecto: new ExpedienteControlado(),
            exportadorEditorial: new ExportadorControlado(),
            procesadorEditorialProyecto: new ProcesadorEditorialControlado(),
            salidaEditorialCSV: new SalidaControlada()
        });

        proyecto.rutaCSV = rutaCSV;
        const resultado = await director.ejecutar(proyecto);
        console.log("✓ Pipeline completo ejecutado.");

        console.log("");
        console.log("4. Verificando identidad de extremo a extremo...");
        assert(resultado.nombre === TARGET, "El resultado final perdió la identidad del proyecto.");
        assert(resultado.filaCSV.Proyecto === TARGET, "La fila CSV final no pertenece a Araque.");
        assert(resultado.expediente.observacionesVision.length > 0, "El expediente quedó sin evidencia.");
        assert(resultado.expediente.observacionesVision.every(item => {
            return String(item.evidencia?.descripcion || "").includes(TARGET);
        }), "La evidencia visual contiene datos de otro proyecto.");
        assert(resultado.resultadoEditorial.codigo === "MUB-ARAQUE-TEST", "Editorial no produjo el código esperado para Araque.");
        console.log("✓ Identidad Araque conservada en Parser → Director → Evidencia → Editorial → Salida.");

        console.log("");
        console.log("5. Verificando aislamiento del CSV de entrada...");
        assert(fs.readFileSync(rutaCSV, "utf8") === csvOriginal, "El CSV de entrada fue modificado por el pipeline.");
        console.log("✓ CSV de entrada intacto.");

        console.log("");
        console.log("6. Verificando que no exista contaminación entre fixtures...");
        for (const proyectoAjeno of PROJECTS.filter(nombre => nombre !== TARGET)) {
            const carpeta = carpetas.get(proyectoAjeno);
            const archivos = fs.readdirSync(carpeta);
            assert(archivos.length === 1, `La carpeta de ${proyectoAjeno} fue alterada.`);
            assert(!archivos.some(nombre => nombre.includes("Araque")), `${proyectoAjeno} recibió artefactos de Araque.`);
            console.log(`✓ ${proyectoAjeno}: sin contaminación física.`);
        }

        console.log("");
        console.log("7. Resumen de telemetría...");
        const resumen = telemetria.resumen();
        console.log(`✓ Llamadas IA registradas: ${resumen.llamadas}`);
        console.log(`✓ Tokens totales: ${resumen.tokensTotales}`);
        assert(resumen.llamadas === 0, "El test controlado realizó llamadas IA inesperadas.");
        console.log("✓ Ninguna llamada real a IA.");

        console.log("");
        console.log("--------------------------------------");
        console.log("PRUEBA SUPERADA");
        console.log("--------------------------------------");
        console.log("");
        console.log("✓ Parser identifica exclusivamente Araque.");
        console.log("✓ Director conserva la identidad.");
        console.log("✓ Evidencia visual permanece aislada.");
        console.log("✓ Editorial recibe únicamente evidencia de Araque.");
        console.log("✓ Salida se genera únicamente sobre Araque.");
        console.log("✓ Tijo, Rolón y Quesada permanecen aislados.");
        console.log("✓ CSV de entrada intacto.");
        console.log("✓ No se realizaron llamadas a OpenAI.");
    } catch (error) {
        console.log("");
        console.log("--------------------------------------");
        console.log("PRUEBA FALLIDA");
        console.log("--------------------------------------");
        console.error(error.message);
        process.exitCode = 1;
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

main().catch(error => {
    console.error("");
    console.error("ERROR NO CONTROLADO");
    console.error(error);
    process.exitCode = 1;
});
