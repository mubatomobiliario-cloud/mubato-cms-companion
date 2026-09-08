const path = require("path");

const OpenAIClient = require("../direccionEditorial/openAIClient");
const LectorEvidenciaVisual = require("../core/lectorEvidenciaVisual");
const DirectorPortfolio = require("./directorPortfolio");
const DirectorComprensionPortfolio = require("./directorComprensionPortfolio");
const ComprensorEditorialPortfolio = require("./comprensorEditorialPortfolio");
const DirectorExpresionIndividualPortfolio = require("./directorExpresionIndividualPortfolio");
const DirectorSalidaEditorialPortfolio = require("./directorSalidaEditorialPortfolio");
const SalidaEditorialCSVPortfolio = require("../Exportadores/salidaEditorialCSVPortfolio");
const { obtenerServicios } = require("../configuracion/catalogoMubato");

class DirectorEditorialPortfolio {
    constructor({
        openAI = new OpenAIClient(),
        lectorEvidenciaVisual = new LectorEvidenciaVisual(),
        directorPortfolio = null,
        directorComprension = null,
        directorExpresionIndividual = null,
        directorSalida = new DirectorSalidaEditorialPortfolio(),
        salidaEditorialCSV = new SalidaEditorialCSVPortfolio()
    } = {}) {
        this.openAI = openAI;
        this.lectorEvidenciaVisual = lectorEvidenciaVisual;
        this.directorPortfolio = directorPortfolio || new DirectorPortfolio({
            lectorEvidenciaVisual
        });
        this.directorComprension = directorComprension || new DirectorComprensionPortfolio({
            lectorEvidenciaVisual,
            comprensorEditorialPortfolio: new ComprensorEditorialPortfolio({
                clienteIA: openAI
            })
        });
        this.directorExpresionIndividual = directorExpresionIndividual ||
            new DirectorExpresionIndividualPortfolio({ openAI });
        this.directorSalida = directorSalida;
        this.salidaEditorialCSV = salidaEditorialCSV;
    }

    async ejecutar(proyecto, rutaEvidenciaVisual) {
        this.validarProyecto(proyecto);

        if (!rutaEvidenciaVisual || typeof rutaEvidenciaVisual !== "string") {
            throw new Error("DirectorEditorialPortfolio requiere evidencia visual persistida.");
        }

        this.openAI.iniciarTelemetria({
            proyecto: proyecto.nombre,
            tipoEditorial: "PORTFOLIO"
        });

        console.log("");
        console.log("======================================");
        console.log("EDITORIAL PORTFOLIO");
        console.log("======================================");
        console.log("");
        console.log("✓ Vision no se ejecutará en Editorial Portfolio.");

        const contexto = this.directorPortfolio.construirContexto(
            proyecto,
            rutaEvidenciaVisual
        );

        proyecto.contextoEditorialPortfolio = contexto;

        console.log("1. Construyendo comprensión editorial Portfolio...");
        const comprension = await this.directorComprension.comprender(
            proyecto,
            rutaEvidenciaVisual
        );
        proyecto.comprensionEditorialPortfolio = comprension;
        console.log("✓ Comprensión editorial Portfolio completada.");

        const expresionColectiva = await this.generarExpresionColectiva(
            contexto,
            comprension,
            proyecto
        );
        proyecto.expresionColectivaPortfolio = expresionColectiva;
        console.log("✓ Expresión colectiva Portfolio completada.");

        const evidencia = this.lectorEvidenciaVisual.cargar(rutaEvidenciaVisual);
        const observacionesVision = this.lectorEvidenciaVisual.extraerObservaciones(evidencia);
        const idsGaleria = proyecto.obtenerGaleria().map(foto => foto.nombre);
        const observacionesPorFoto = new Map(
            observacionesVision.map(observacion => [observacion.fotografia, observacion])
        );

        if (idsGaleria.length !== observacionesVision.length) {
            throw new Error(
                `La galería curada (${idsGaleria.length}) y la evidencia visual (${observacionesVision.length}) no tienen la misma cardinalidad.`
            );
        }

        const expresionesIndividuales = [];

        console.log("2. Generando expresión individual de la galería...");
        for (const fotografia of idsGaleria) {
            const observacion = observacionesPorFoto.get(fotografia);
            if (!observacion) {
                throw new Error(`No existe evidencia visual para la fotografía ${fotografia}.`);
            }

            const expresion = await this.directorExpresionIndividual.expresar(
                comprension,
                observacion,
                proyecto
            );

            expresionesIndividuales.push({
                fotografia,
                ...expresion
            });

            console.log(`✓ Expresión individual: ${fotografia}`);
        }

        const servicios = obtenerServicios();
        const slug = this.slugDeterminista(proyecto.nombre);

        console.log("3. Ensamblando resultado editorial Portfolio...");
        const ensamblado = this.directorSalida.ensamblar({
            filaPortfolio: proyecto.filaCSV,
            expresionColectiva,
            expresionesIndividuales,
            servicios,
            codigo: proyecto.codigo,
            slug
        });

        const telemetria = this.openAI.obtenerTelemetria();
        const resultadoEditorial = {
            ...ensamblado,
            seo: {
                seoTitle: ensamblado.seoTitle,
                metaDescription: ensamblado.metaDescription
            },
            llamadasIA: telemetria.llamadas,
            telemetria
        };

        console.log("✓ Ensamblaje Portfolio completado.");

        console.log("4. Generando salida editorial CSV Portfolio...");
        const rutaSalida = this.construirRutaSalidaEditorial(proyecto);
        const salida = this.salidaEditorialCSV.exportar({
            rutaEntrada: proyecto.rutaCSV,
            rutaSalida,
            filaPortfolio: proyecto.filaCSV,
            editorial: resultadoEditorial
        });

        proyecto.resultadoEditorial = resultadoEditorial;
        proyecto.salidaEditorialCSV = salida;

        console.log("✓ Salida Editorial CSV Portfolio generada.");
        console.log(`✓ Archivo: ${salida.rutaSalida}`);
        console.log(`✓ Llamadas IA: ${telemetria.llamadas}`);
        console.log(`✓ Tokens totales: ${telemetria.tokensTotales}`);

        return proyecto;
    }

    async generarExpresionColectiva(contexto, comprension, proyecto) {
        const prompt = [
            "Eres el módulo de expresión editorial colectiva de MUBATO para Portfolio.",
            "",
            "Debes expresar editorialmente la comprensión central de una pieza o colección de mobiliario.",
            "",
            "PORTFOLIO NO NARRA EL PROYECTO. NARRA EL MUEBLE.",
            "La selección y el orden de fotografías ya están definidos y no pueden cambiarse.",
            "No inventes personas, necesidades, motivaciones, circunstancias, medidas, materiales no sustentados ni usos no evidenciados.",
            "La Historia es el núcleo semántico y narrativo del Portfolio.",
            "La expresión visible debe ser breve y elegante; la precisión semántica debe ser rica y natural.",
            "",
            "Produce exclusivamente JSON válido con esta estructura:",
            "{",
            '  "historia": "...",',
            '  "heroTexto": "...",',
            '  "descripcion": "...",',
            '  "seoTitle": "...",',
            '  "metaDescription": "..."',
            "}",
            "",
            "REGLAS:",
            "- Hero Texto: entre 22 y 27 palabras.",
            "- Historia: desarrolla el núcleo semántico del mueble o colección a partir de la comprensión.",
            "- Descripción: más breve que la Historia y centrada en la pieza o colección.",
            "- SEO Title y Meta Description: naturales, específicos y semánticamente relevantes para el tipo de mobiliario.",
            "- No escribas Código ni Servicios.",
            "",
            "DATOS DEL PORTFOLIO:",
            JSON.stringify({
                nombre: proyecto.nombre,
                ciudad: proyecto.ciudad,
                categoria: proyecto.categoria,
                espacios: proyecto.espacios,
                cliente: proyecto.cliente
            }, null, 2),
            "",
            "COMPRENSIÓN EDITORIAL:",
            JSON.stringify(comprension, null, 2),
            "",
            "CONTEXTO EDITORIAL ORIGINAL:",
            contexto
        ].join("\n");

        const respuesta = await this.openAI.generarTextoDetallado(prompt);
        const texto = respuesta && typeof respuesta === "object"
            ? respuesta.texto
            : respuesta;

        let expresion;
        try {
            expresion = JSON.parse(texto);
        } catch (error) {
            throw new Error(`La expresión colectiva Portfolio devolvió JSON inválido: ${error.message}`);
        }

        this.validarExpresionColectiva(expresion);
        return expresion;
    }

    validarExpresionColectiva(expresion) {
        if (!expresion || typeof expresion !== "object" || Array.isArray(expresion)) {
            throw new Error("La expresión colectiva Portfolio debe ser un objeto.");
        }

        for (const campo of ["historia", "heroTexto", "descripcion", "seoTitle", "metaDescription"]) {
            if (typeof expresion[campo] !== "string" || !expresion[campo].trim()) {
                throw new Error(`La expresión colectiva Portfolio requiere ${campo}.`);
            }
        }

        const palabrasHero = this.contarPalabras(expresion.heroTexto);
        if (palabrasHero < 22 || palabrasHero > 27) {
            throw new Error(
                `Hero Texto Portfolio fuera de contrato: ${palabrasHero} palabras. Se requieren entre 22 y 27.`
            );
        }
    }

    contarPalabras(texto) {
        return String(texto || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;
    }

    slugDeterminista(nombre) {
        return String(nombre || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    construirRutaSalidaEditorial(proyecto) {
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:]/g, "")
            .replace("T", "")
            .slice(0, 14);

        const nombreProyecto = String(proyecto.nombre)
            .trim()
            .replace(/[\\/:*?"<>|]/g, "-");

        return path.join(
            path.dirname(proyecto.rutaCSV),
            `${nombreProyecto}_Editorial_${timestamp}.csv`
        );
    }

    validarProyecto(proyecto) {
        if (!proyecto || typeof proyecto !== "object" || Array.isArray(proyecto)) {
            throw new Error("DirectorEditorialPortfolio requiere un proyecto válido.");
        }
        if (proyecto.flujoEditorial !== "EDITORIAL_PORTFOLIO") {
            throw new Error("DirectorEditorialPortfolio solo puede ejecutar EDITORIAL_PORTFOLIO.");
        }
        if (!proyecto.filaCSV || typeof proyecto.filaCSV !== "object") {
            throw new Error("DirectorEditorialPortfolio requiere la fila Portfolio original.");
        }
        if (!proyecto.rutaCSV) {
            throw new Error("DirectorEditorialPortfolio requiere rutaCSV.");
        }
    }
}

module.exports = DirectorEditorialPortfolio;
