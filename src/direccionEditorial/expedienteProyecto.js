console.log("expedienteProyecto.js cargado");

/**
 * Expediente Editorial MUBATO V0.1
 *
 * Puente entre hechos del proyecto, observaciones de Vision
 * y futura interpretación de Dirección Editorial.
 *
 * MUBATO decide Hero y Galería.
 * Vision observa; no selecciona ni ordena.
 * Dirección Editorial interpreta; no inventa hechos visuales.
 */
class ExpedienteProyecto {

    construir(proyecto) {

        const fotografias = proyecto.fotografias || proyecto.listaFotografias || [];

        return {
            version: "0.1",

            proyecto: {
                nombre: proyecto.nombre || "",
                codigo: proyecto.codigo || "",
                slug: proyecto.slug || "",
                cliente: proyecto.cliente || "",
                ciudad: proyecto.ciudad || "",
                estado: proyecto.estado || "",
                categoria: proyecto.categoria || "",
                servicios: Array.isArray(proyecto.servicios) ? [...proyecto.servicios] : proyecto.servicios || [],
                espacios: Array.isArray(proyecto.espacios) ? [...proyecto.espacios] : proyecto.espacios || []
            },

            seleccionEditorial: {
                hero: proyecto.heroImagen ? this.referenciaFotografia(proyecto.heroImagen) : null,
                galeria: (proyecto.galeria || []).map(foto => this.referenciaFotografia(foto))
            },

            observacionesVision: fotografias.map(foto => this.observacionVision(foto)),

            interpretacionEditorial: {
                transformacion: null,
                experiencia: null,
                narrativa: null,
                temas: [],
                notas: []
            }
        };
    }

    referenciaFotografia(foto) {
        return {
            nombre: foto.nombre || "",
            ruta: foto.ruta || "",
            esHero: !!foto.esHero,
            enGaleria: !!foto.enGaleria,
            wixHeroSrc: foto.wixHeroSrc || null,
            wixMedia: foto.wixMedia || null
        };
    }

    observacionVision(foto) {
        return {
            fotografia: foto.nombre || "",
            analizada: !!foto.analizada,
            espacio: foto.espacio || null,
            tipo: foto.tipo || null,
            plano: foto.plano || null,
            estilo: foto.estilo || null,
            materiales: Array.isArray(foto.materiales) ? [...foto.materiales] : [],
            colores: Array.isArray(foto.colores) ? [...foto.colores] : [],
            elementos: Array.isArray(foto.elementos) ? [...foto.elementos] : [],
            iluminacion: foto.iluminacion || null,
            sensacion: foto.sensacion || null,
            confianza: typeof foto.confianza === "number" ? foto.confianza : null
        };
    }
}

module.exports = ExpedienteProyecto;
