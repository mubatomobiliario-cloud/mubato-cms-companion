console.log("expedienteProyecto.js cargado");

class ExpedienteProyecto {

    construir(proyecto) {

        if (!proyecto) {
            throw new Error("No se recibió un proyecto para construir el expediente.");
        }

        return {
            version: "0.1",
            hechosProyecto: this.construirHechosProyecto(proyecto),
            seleccionEditorial: this.construirSeleccionEditorial(proyecto),
            observacionesVisuales: this.construirObservacionesVisuales(proyecto),
            interpretacionEditorial: {
                estado: "pendiente",
                historia: "",
                ejesNarrativos: [],
                transformacion: "",
                experienciaEspacial: ""
            }
        };
    }

    construirHechosProyecto(proyecto) {
        return {
            nombre: proyecto.nombre || "",
            codigo: proyecto.codigo || "",
            cliente: proyecto.cliente || "",
            ciudad: proyecto.ciudad || "",
            categoria: proyecto.categoria || "",
            servicios: proyecto.servicios || [],
            espacios: proyecto.espacios || [],
            estado: proyecto.estado || "",
            año: proyecto.año || proyecto.anio || ""
        };
    }

    construirSeleccionEditorial(proyecto) {
        const galeria = Array.isArray(proyecto.galeria)
            ? proyecto.galeria
            : [];

        return {
            hero: proyecto.heroImagen
                ? {
                    nombre: proyecto.heroImagen.nombre || "",
                    ruta: proyecto.heroImagen.ruta || "",
                    wixHeroSrc: proyecto.heroImagen.wixHeroSrc || ""
                }
                : null,
            galeria: galeria.map(foto => ({
                nombre: foto.nombre || "",
                ruta: foto.ruta || "",
                wixMedia: foto.wixMedia || null
            }))
        };
    }

    construirObservacionesVisuales(proyecto) {
        const fotografias = Array.isArray(proyecto.fotografias)
            ? proyecto.fotografias
            : [];

        return fotografias.map(foto => ({
            fotografia: foto.nombre || "",
            analizada: !!foto.analizada,
            espacio: foto.espacio || "",
            tipo: foto.tipo || "",
            plano: foto.plano || "",
            estilo: foto.estilo || "",
            materiales: Array.isArray(foto.materiales) ? foto.materiales : [],
            colores: Array.isArray(foto.colores) ? foto.colores : [],
            elementos: Array.isArray(foto.elementos) ? foto.elementos : [],
            iluminacion: foto.iluminacion || "",
            sensacion: foto.sensacion || "",
            confianza: typeof foto.confianza === "number" ? foto.confianza : 0
        }));
    }

}

module.exports = ExpedienteProyecto;
