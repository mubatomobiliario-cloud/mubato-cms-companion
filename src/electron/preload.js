const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload cargado.");

contextBridge.exposeInMainWorld("companion", {

    seleccionarProyecto() {
        return ipcRenderer.invoke("seleccionarProyecto");
    },

    importarProyecto(carpeta) {
        return ipcRenderer.invoke(
            "importarProyecto",
            carpeta
        );
    },

    ejecutarProyecto(carpeta) {
        return ipcRenderer.invoke(
            "ejecutarProyecto",
            carpeta
        );
    },

    mostrarSalidaEditorial(rutaSalida) {
        return ipcRenderer.invoke(
            "mostrarSalidaEditorial",
            rutaSalida
        );
    }

});
