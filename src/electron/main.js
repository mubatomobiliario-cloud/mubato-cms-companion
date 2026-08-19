const { app, BrowserWindow, ipcMain, dialog } = require("electron");
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

ipcMain.handle("importarProyecto", async (event, carpeta) => {

    const Parser = require("../core/parser");

    const parser = new Parser();

    const proyecto = parser.importarCarpeta(carpeta);

    const resultado = serializarProyecto(proyecto);

    console.log("IMPORTACIÓN COMPLETADA");
    console.log("Proyecto:", resultado.nombre);
    console.log("Hero:", resultado.heroImagen ? resultado.heroImagen.nombre : "NINGUNO");
    console.log("Galería:", resultado.galeria.map(foto => foto.nombre));

    return resultado;

});

ipcMain.handle("analizarProyecto", async (event, carpeta) => {

    const parser = new Parser();

    const proyecto = parser.importarCarpeta(carpeta);

    const director = new DirectorProyecto();

    const resultado = await director.analizar(proyecto);

    return {

        nombre: resultado.nombre,

        codigo: resultado.codigo,

        cliente: resultado.cliente,

        ciudad: resultado.ciudad,

        estado: resultado.estado,

        expediente: resultado.expediente,

        listaFotografias: resultado.obtenerFotografias().map(foto => ({

            nombre: foto.nombre,

            ruta: foto.ruta,

            extension: foto.extension,

            tamano: foto.tamano,

            analizada: foto.analizada,

            espacio: foto.espacio,

            tipo: foto.tipo,

            plano: foto.plano,

            estilo: foto.estilo,

            materiales: foto.materiales,

            colores: foto.colores,

            elementos: foto.elementos,

            iluminacion: foto.iluminacion,

            sensacion: foto.sensacion,

            confianza: foto.confianza

        }))

    };

});