const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const Parser = require("../core/parser");
const DirectorProyecto = require("../workflow/directorProyecto");

let ventanaPrincipal = null;

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

ipcMain.handle("importarProyecto", async (event, carpeta) => {

    const parser = new Parser();
    const proyecto = parser.importarCarpeta(carpeta);
    const resultado = serializarProyecto(proyecto);

    console.log("IMPORTACIÓN COMPLETADA");
    console.log("Proyecto:", resultado.nombre);
    console.log("Hero:", resultado.heroImagen ? resultado.heroImagen.nombre : "NINGUNO");
    console.log("Galería:", resultado.galeria.map(foto => foto.nombre));

    return resultado;

});

ipcMain.handle("ejecutarProyecto", async (event, carpeta) => {

    if (!carpeta) {
        throw new Error("No se recibió una carpeta de proyecto.");
    }

    const parser = new Parser();
    const proyecto = parser.importarCarpeta(carpeta);
    const director = new DirectorProyecto();

    const resultado = await director.ejecutar(proyecto);

    console.log("EJECUCIÓN COMPLETA — ELECTRON");
    console.log("Proyecto:", resultado.nombre);
    console.log("Salida Editorial:", resultado.salidaEditorialCSV?.rutaSalida || "NO GENERADA");

    return serializarResultadoEditorial(resultado);

});

ipcMain.handle("mostrarSalidaEditorial", async (event, rutaSalida) => {

    if (!rutaSalida) {
        throw new Error("No existe una ruta de salida editorial para mostrar.");
    }

    shell.showItemInFolder(rutaSalida);

    return true;

});
