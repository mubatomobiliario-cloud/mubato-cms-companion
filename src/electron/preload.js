const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload cargado.");

contextBridge.exposeInMainWorld("companion", {

    seleccionarProyecto() {
        return ipcRenderer.invoke("seleccionarProyecto");
    },

    seleccionarCSV(carpeta) {
        return ipcRenderer.invoke("seleccionarCSV", carpeta);
    },

    importarProyecto(carpeta, rutaCSV) {
        return ipcRenderer.invoke(
            "importarProyecto",
            carpeta,
            rutaCSV
        );
    },

    ejecutarProyecto(carpeta, rutaCSV) {
        return ipcRenderer.invoke(
            "ejecutarProyecto",
            carpeta,
            rutaCSV
        );
    },

    onProgreso(callback) {
        if (typeof callback !== "function") return () => {};

        const listener = (event, mensaje) => callback(mensaje);
        ipcRenderer.on("progresoEjecucion", listener);

        return () => {
            ipcRenderer.removeListener("progresoEjecucion", listener);
        };
    },

    mostrarSalidaEditorial(rutaSalida) {
        return ipcRenderer.invoke(
            "mostrarSalidaEditorial",
            rutaSalida
        );
    }

});
