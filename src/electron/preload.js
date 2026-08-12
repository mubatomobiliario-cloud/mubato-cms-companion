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

}
});
