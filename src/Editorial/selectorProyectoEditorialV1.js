console.log("selectorProyectoEditorialV1.js cargado");

class SelectorProyectoEditorialV1 {

    seleccionar(filas, opciones = {}) {
        if (!Array.isArray(filas) || filas.length === 0) {
            throw new Error("No existen filas de proyectos para seleccionar.");
        }

        if (opciones.nombre) {
            const fila = filas.find(f => String(f["Proyecto"] || "").trim() === String(opciones.nombre).trim());
            if (!fila) throw new Error(`No se encontró el proyecto solicitado: ${opciones.nombre}`);
            return { fila, modo: "explicito" };
        }

        const filaPendiente = filas.find(fila => this.estaPendiente(fila));
        if (!filaPendiente) {
            throw new Error("No se encontró ningún proyecto con contenido editorial pendiente.");
        }

        return { fila: filaPendiente, modo: "pendiente" };
    }

    estaPendiente(fila) {
        if (!String(fila["Historias de Transformación"] || "").trim()) return true;
        if (!String(fila["Hero Texto"] || "").trim()) return true;
        if (!String(fila["SEO Title"] || "").trim()) return true;
        if (!String(fila["Meta Description"] || "").trim()) return true;

        try {
            const galeria = JSON.parse(fila["Galería General"] || "[]");
            if (!Array.isArray(galeria) || galeria.length === 0) return true;
            return galeria.some(foto =>
                !foto.title ||
                !foto.alt ||
                !foto.keywords ||
                !Array.isArray(foto.keywords) ||
                foto.keywords.length === 0 ||
                !foto.nombreSEO
            );
        } catch (error) {
            return true;
        }
    }
}

module.exports = SelectorProyectoEditorialV1;
