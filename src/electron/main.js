const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const Parser = require("../core/parser");

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
ipcMain.handle("importarProyecto", async (event, carpeta) => {

    const Parser = require("../core/parser");

    const parser = new Parser();

    const proyecto = parser.importarCarpeta(carpeta);

    return {

        nombre: proyecto.nombre,

        codigo: proyecto.codigo,

        cliente: proyecto.cliente,

        ciudad: proyecto.ciudad,

        estado: proyecto.estado,

        fotografias: proyecto.cantidadFotografias(),

        listaFotografias: proyecto.obtenerFotografias().map(foto => ({

            nombre: foto.nombre,

            ruta: foto.ruta,

            extension: foto.extension,

            tamano: foto.tamano

        }))

    };

});