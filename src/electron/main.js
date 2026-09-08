const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { format } = require("util");
const Parser = require("../core/parser");
const DirectorProyecto = require("../workflow/directorProyecto");
const DirectorPortfolio = require("../portfolio/directorPortfolio");

let ventanaPrincipal = null;

function emitirProgreso(...args) {
    if (
        ventanaPrincipal &&
        !ventanaPrincipal.isDestroyed() &&
        ventanaPrincipal.webContents
    ) {
        ventanaPrincipal.webContents.send("progresoEjecucion", format(...args));
    }
}

async function ejecutarConConsolaVisible(fn) {
    const logOriginal = console.log;
    const errorOriginal = console.error;
    const warnOriginal = console.warn;

    console.log = (...args) => {
        logOriginal(...args);
        emitirProgreso(...args);
    };

    console.error = (...args) => {
        errorOriginal(...args);
        emitirProgreso("ERROR:", ...args);
    };

    console.warn = (...args) => {
        warnOriginal(...args);
        emitirProgreso("ADVERTENCIA:", ...args);
    };

    try {
        return await fn();
    } finally {
        console.log = logOriginal;
        console.error = errorOriginal;
        console.warn = warnOriginal;
    }
}

function crearVentanaPrincipal() {

    ventanaPrincipal = new BrowserWindow({
        width: 1400,
        height: 900,
        show: false,
        title: "MUBATO CMS Companion",
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    ventanaPrincipal.loadFile(
        path.join(__dirname, "../renderer/index.html")
    );

    ventanaPrincipal.webContents.on("did-finish-load", () => {
        console.log("Renderer cargado correctamente.");
    });

    ventanaPrincipal.once("ready-to-show", () => {
        ventanaPrincipal.show();
        ventanaPrincipal.focus();
    });

    ventanaPrincipal.webContents.openDevTools();
}

app.whenReady().then(() => {

    crearVentanaPrincipal();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            crearVentanaPrincipal();
        }
    });

});

ipcMain.handle("seleccionarProyecto", async () => {

    const resultado = await dialog.showOpenDialog({
        properties: ["openDirectory"]
    });

    if (resultado.canceled) {
        return null;
    }

    return resultado.filePaths[0];
});

ipcMain.handle("seleccionarCSV", async (event, carpeta) => {

    if (!carpeta) {
        throw new Error("No se recibió la carpeta del proyecto.");
    }

    const resultado = await dialog.showOpenDialog({
        defaultPath: carpeta,
        properties: ["openFile"],
        filters: [
            { name: "Archivos CSV", extensions: ["csv"] }
        ]
    });

    if (resultado.canceled) {
        return null;
    }

    const rutaCSV = path.resolve(resultado.filePaths[0]);
    const rutaCarpeta = path.resolve(carpeta);

    if (path.dirname(rutaCSV) !== rutaCarpeta) {
        throw new Error(
            "El CSV seleccionado debe estar dentro de la carpeta del proyecto."
        );
    }

    return rutaCSV;
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

function serializarProyecto(proyecto) {

    const hero = proyecto.obtenerHero();
    const galeria = proyecto.obtenerGaleria();

    return {
        nombre: proyecto.nombre,
        codigo: proyecto.codigo,
        cliente: proyecto.cliente,
        ciudad: proyecto.ciudad,
        estado: proyecto.estado,
        categoria: proyecto.categoria,
        servicios: proyecto.servicios,
        espacios: proyecto.espacios,
        csvFuente: proyecto.rutaCSV || null,

        heroImagen: hero ? {
            nombre: hero.nombre,
            enGaleria: hero.enGaleria,
            esHero: hero.esHero,
            wixHeroSrc: hero.wixHeroSrc || null,
            wixMedia: hero.wixMedia || null
        } : null,

        galeria: galeria.map(foto => ({
            nombre: foto.nombre,
            enGaleria: foto.enGaleria,
            esHero: foto.esHero,
            wixMedia: foto.wixMedia || null
        })),

        fotografias: proyecto.cantidadFotografias(),

        listaFotografias: proyecto.obtenerFotografias().map(foto => ({
            nombre: foto.nombre,
            ruta: foto.ruta,
            extension: foto.extension,
            tamano: foto.tamano,
            enGaleria: foto.enGaleria,
            esHero: foto.esHero
        }))
    };
}

function serializarResultadoEditorial(proyecto) {

    const editorial = proyecto.resultadoEditorial;

    return {
        ...serializarProyecto(proyecto),
        expediente: proyecto.expediente || null,
        salidaEditorialCSV: proyecto.salidaEditorialCSV ? {
            rutaSalida: proyecto.salidaEditorialCSV.rutaSalida || null
        } : null,
        editorial: editorial ? {
            versionEditorial: editorial.versionEditorial || null,
            codigo: editorial.codigo || null,
            heroTexto: editorial.heroTexto || "",
            historia: editorial.historia || "",
            descripcion: editorial.descripcion || "",
            servicios: editorial.servicios || [],
            slug: editorial.slug || "",
            seo: editorial.seo || {
                seoTitle: "",
                metaDescription: ""
            },
            galeriaEditorial: Array.isArray(editorial.galeriaEditorial)
                ? editorial.galeriaEditorial.map(foto => ({
                    fileName: foto.fileName,
                    title: foto.title,
                    description: foto.description,
                    alt: foto.alt,
                    keywords: foto.keywords,
                    nombreSEO: foto.nombreSEO,
                    esHero: Boolean(foto.esHero),
                    enGaleria: Boolean(foto.enGaleria)
                }))
                : [],
            llamadasIA: editorial.llamadasIA || 0,
            telemetria: editorial.telemetria || null
        } : null
    };
}

function resolverEvidenciaVisualPortfolio(proyecto) {
    const evidenciaExplicita = process.env.MUBATO_PORTFOLIO_EVIDENCIA_VISUAL;

    if (evidenciaExplicita) {
        const rutaExplicita = path.resolve(evidenciaExplicita);
        if (!fs.existsSync(rutaExplicita)) {
            throw new Error(
                `La evidencia visual Portfolio indicada no existe: ${rutaExplicita}`
            );
        }

        console.warn("MODO LAB: usando evidencia visual explícita:", rutaExplicita);
        return rutaExplicita;
    }

    const rutaProduccion = path.resolve(
        proyecto.rutaProyecto,
        `${proyecto.nombre}.evidencia-visual.json`
    );

    if (!fs.existsSync(rutaProduccion)) {
        throw new Error(
            `No existe evidencia visual Portfolio persistida en la ruta esperada: ${rutaProduccion}`
        );
    }

    return rutaProduccion;
}

function prepararPortfolioAntesIA(proyecto) {
    const rutaEvidenciaVisual = resolverEvidenciaVisualPortfolio(proyecto);
    const directorPortfolio = new DirectorPortfolio();
    const contexto = directorPortfolio.construirContexto(
        proyecto,
        rutaEvidenciaVisual
    );

    proyecto.contextoEditorialPortfolio = contexto;

    const coincidenciaObservaciones = contexto.match(/Fotografías recibidas:\s*(\d+)/);
    const cantidadObservaciones = coincidenciaObservaciones
        ? Number(coincidenciaObservaciones[1])
        : 0;

    console.log("PORTFOLIO — PRE-IA COMPLETADO");
    console.log("Evidencia visual:", rutaEvidenciaVisual);
    console.log("Fotografías cargadas:", proyecto.cantidadFotografias());
    console.log(
        "Galería curada:",
        proyecto.obtenerGaleria().map(foto => foto.nombre)
    );
    console.log(
        "Hero independiente:",
        proyecto.obtenerHero()?.nombre || "NINGUNO"
    );
    console.log("Observaciones Vision transportadas al contexto:", cantidadObservaciones);
    console.log("IA ejecutada: 0");

    return contexto;
}

ipcMain.handle("importarProyecto", async (event, carpeta, rutaCSV) => {

    const parser = new Parser();
    const proyecto = parser.importarCarpeta(carpeta, rutaCSV);
    const resultado = serializarProyecto(proyecto);

    console.log("IMPORTACIÓN COMPLETADA");
    console.log("Proyecto:", resultado.nombre);
    console.log("CSV fuente:", resultado.csvFuente);
    console.log("Hero:", resultado.heroImagen ? resultado.heroImagen.nombre : "NINGUNO");
    console.log("Galería:", resultado.galeria.map(foto => foto.nombre));

    return resultado;
});

ipcMain.handle("ejecutarProyecto", async (event, carpeta, rutaCSV) => {

    if (!carpeta) {
        throw new Error("No se recibió una carpeta de proyecto.");
    }

    if (!rutaCSV) {
        throw new Error("No se recibió el CSV fuente del proyecto.");
    }

    return ejecutarConConsolaVisible(async () => {
        emitirProgreso("");
        emitirProgreso("======================================");
        emitirProgreso("MUBATO COMPANION — EJECUCIÓN");
        emitirProgreso("======================================");
        emitirProgreso(`CSV fuente: ${rutaCSV}`);

        const parser = new Parser();
        const proyecto = parser.importarCarpeta(carpeta, rutaCSV);

        if (proyecto.flujoEditorial === "EDITORIAL_PORTFOLIO") {
            prepararPortfolioAntesIA(proyecto);

            emitirProgreso("======================================");
            emitirProgreso("✓ PORTFOLIO PRE-IA COMPLETADO");
            emitirProgreso("✓ NO SE REALIZÓ NINGUNA LLAMADA A IA");
            emitirProgreso("======================================");

            throw new Error(
                "PORTFOLIO PRE-IA: frontera de IA alcanzada. La ejecución se detuvo deliberadamente antes de cualquier llamada a IA."
            );
        }

        const director = new DirectorProyecto();
        const resultado = await director.ejecutar(proyecto);

        console.log("EJECUCIÓN COMPLETA — ELECTRON");
        console.log("Proyecto:", resultado.nombre);
        console.log("Salida Editorial:", resultado.salidaEditorialCSV?.rutaSalida || "NO GENERADA");

        emitirProgreso("======================================");
        emitirProgreso("✓ COMPANION COMPLETADO");
        emitirProgreso("======================================");

        return serializarResultadoEditorial(resultado);
    });
});

ipcMain.handle("mostrarSalidaEditorial", async (event, rutaSalida) => {

    if (!rutaSalida) {
        throw new Error("No existe una ruta de salida editorial para mostrar.");
    }

    shell.showItemInFolder(rutaSalida);

    return true;
});
