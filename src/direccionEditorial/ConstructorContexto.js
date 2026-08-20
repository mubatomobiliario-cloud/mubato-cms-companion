console.log("ConstructorContexto.js cargado");

const contextoMarca = require("./contextoMarca");
const promptTemplates = require("./promptTemplates");

class ConstructorContexto {

    construirHero(proyecto) {
        return this.construirProyecto(proyecto, promptTemplates.HERO, "HERO");
    }

    construirHistoria(proyecto) {
        return this.construirProyecto(proyecto, promptTemplates.HISTORIA, "HISTORIA");
    }

    construirSEO(proyecto, historia = "") {
        return this.construirProyecto(proyecto, promptTemplates.SEO, "SEO", `\n====================================================\nHISTORIA EDITORIAL\n====================================================\n\n${historia || "Sin historia editorial disponible."}\n`);
    }

    construirKeywords(proyecto, historia = "") {
        return this.construirProyecto(proyecto, promptTemplates.KEYWORDS, "KEYWORDS", `\n====================================================\nHISTORIA EDITORIAL\n====================================================\n\n${historia || "Sin historia editorial disponible."}\n`);
    }

    construirSlug(proyecto) {
        return this.construirProyecto(proyecto, promptTemplates.SLUG, "SLUG");
    }

    construirCodigo(proyecto) {
        return this.construirProyecto(proyecto, promptTemplates.CODIGO, "CODIGO");
    }

    construirCategoria(proyecto) {
        return this.construirProyecto(proyecto, promptTemplates.CATEGORIAS, "CATEGORIA");
    }

    construirServicios(proyecto) {
        return this.construirProyecto(proyecto, promptTemplates.SERVICIOS, "SERVICIOS");
    }

    construirEspacios(proyecto) {
        return this.construirProyecto(proyecto, promptTemplates.ESPACIOS, "ESPACIOS");
    }

    construirAltText(proyecto, fotografia) {
        const expediente = proyecto.expediente || {};
        return this.encabezado("ALT_TEXT") + this.seccionMarca() + promptTemplates.ALT_TEXT + this.seccionProyecto(proyecto) + this.seccionExpediente(expediente) + this.seccionFotografia(fotografia);
    }

    construirProyecto(proyecto, plantilla, nombreContrato, adicional = "") {
        const expediente = proyecto.expediente || {};
        return this.encabezado(nombreContrato) + this.seccionMarca() + plantilla + this.seccionProyecto(proyecto) + this.seccionExpediente(expediente) + adicional;
    }

    encabezado(nombre) {
        return `\n====================================================\nCONTRATO EDITORIAL: ${nombre}\n====================================================\n`;
    }

    seccionMarca() {
        return `\n====================================================\nCONTEXTO DE MARCA MUBATO\n====================================================\n\n${JSON.stringify(contextoMarca, null, 2)}\n`;
    }

    seccionProyecto(proyecto) {
        return `\n====================================================\nDATOS DEL PROYECTO\n====================================================\n\nProyecto\n${this.valor(proyecto.nombre)}\n\nCódigo\n${this.valor(proyecto.codigo || "Pendiente")}\n\nCliente\n${this.valor(proyecto.cliente)}\n\nCiudad\n${this.valor(proyecto.ciudad)}\n\nEstado\n${this.valor(proyecto.estado)}\n\nCategoría\n${this.valor(proyecto.categoria)}\n`;
    }

    seccionExpediente(expediente) {
        const observaciones = Array.isArray(expediente.observacionesVision) ? expediente.observacionesVision : [];
        const agregados = this.agregarObservaciones(observaciones);
        const espacios = expediente.proyecto?.espacios || agregados.espacios;

        return `\n====================================================\nEXPEDIENTE DEL PROYECTO\n====================================================\n\nVersión\n${this.valor(expediente.version)}\n\nEspacios\n${this.lista(espacios)}\n\nMateriales observados\n${this.lista(agregados.materiales)}\n\nColores observados\n${this.lista(agregados.colores)}\n\nElementos observados\n${this.lista(agregados.elementos)}\n\nEstilos observados\n${this.lista(agregados.estilos)}\n\nIluminación observada\n${this.lista(agregados.iluminacion)}\n\nSensaciones observadas\n${this.lista(agregados.sensaciones)}\n\nFotografías analizadas\n${observaciones.filter(f => f.analizada).length} de ${observaciones.length}\n`;
    }

    agregarObservaciones(observaciones) {
        const unicos = valores => [...new Set(valores.filter(Boolean))];
        return {
            espacios: unicos(observaciones.map(o => o.espacio)),
            materiales: unicos(observaciones.flatMap(o => Array.isArray(o.materiales) ? o.materiales : [])),
            colores: unicos(observaciones.flatMap(o => Array.isArray(o.colores) ? o.colores : [])),
            elementos: unicos(observaciones.flatMap(o => Array.isArray(o.elementos) ? o.elementos : [])),
            estilos: unicos(observaciones.map(o => o.estilo)),
            iluminacion: unicos(observaciones.map(o => o.iluminacion)),
            sensaciones: unicos(observaciones.map(o => o.sensacion))
        };
    }

    seccionFotografia(fotografia) {
        if (!fotografia) return `\n====================================================\nFOTOGRAFÍA\n====================================================\n\nSin fotografía disponible.\n`;

        return `\n====================================================\nFOTOGRAFÍA\n====================================================\n\nNombre\n${this.valor(fotografia.nombre)}\n\nEspacio\n${this.valor(fotografia.espacio)}\n\nTipo\n${this.valor(fotografia.tipo)}\n\nPlano\n${this.valor(fotografia.plano)}\n\nEstilo\n${this.valor(fotografia.estilo)}\n\nMateriales\n${this.lista(fotografia.materiales)}\n\nColores\n${this.lista(fotografia.colores)}\n\nElementos\n${this.lista(fotografia.elementos)}\n\nIluminación\n${this.valor(fotografia.iluminacion)}\n\nSensación\n${this.valor(fotografia.sensacion)}\n\nConfianza Vision\n${this.valor(fotografia.confianza)}\n`;
    }

    lista(valores) {
        if (!Array.isArray(valores) || valores.length === 0) return "Sin información";
        return valores.filter(Boolean).map(item => `• ${item}`).join("\n");
    }

    valor(valor) {
        if (valor === undefined || valor === null || valor === "") return "Sin información";
        return String(valor);
    }
}

module.exports = ConstructorContexto;
