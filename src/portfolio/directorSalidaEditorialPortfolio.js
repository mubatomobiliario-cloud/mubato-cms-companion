const EnsambladorEditorialPortfolio = require("./ensambladorEditorialPortfolio");
const SalidaEditorialCSV = require("../Exportadores/salidaEditorialCSV");

class DirectorSalidaEditorialPortfolio {
    constructor({
        ensamblador = new EnsambladorEditorialPortfolio(),
        salidaEditorialCSV = new SalidaEditorialCSV()
    } = {}) {
        this.ensamblador = ensamblador;
        this.salidaEditorialCSV = salidaEditorialCSV;
    }

    exportar({
        rutaEntrada,
        rutaSalida,
        filaPortfolio,
        expresionColectiva,
        expresionesIndividuales,
        servicios,
        codigo,
        slug
    }) {
        this.validarEntrada({
            rutaEntrada,
            rutaSalida,
            filaPortfolio,
            expresionColectiva,
            expresionesIndividuales,
            servicios,
            codigo,
            slug
        });

        const editorial = this.ensamblador.ensamblar({
            filaPortfolio,
            expresionColectiva,
            expresionesIndividuales,
            servicios,
            codigo,
            slug
        });

        const salida = this.salidaEditorialCSV.exportar({
            rutaEntrada,
            rutaSalida,
            filaProyecto: filaPortfolio,
            editorial
        });

        return {
            editorial,
            salida
        };
    }

    validarEntrada({
        rutaEntrada,
        rutaSalida,
        filaPortfolio,
        expresionColectiva,
        expresionesIndividuales,
        servicios,
        codigo,
        slug
    }) {
        if (!rutaEntrada || typeof rutaEntrada !== "string") {
            throw new Error("DirectorSalidaEditorialPortfolio requiere rutaEntrada.");
        }

        if (!rutaSalida || typeof rutaSalida !== "string") {
            throw new Error("DirectorSalidaEditorialPortfolio requiere rutaSalida.");
        }

        if (!filaPortfolio || typeof filaPortfolio !== "object" || Array.isArray(filaPortfolio)) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere la fila Portfolio original.");
        }

        if (!expresionColectiva || typeof expresionColectiva !== "object" || Array.isArray(expresionColectiva)) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere una expresión colectiva válida.");
        }

        if (!Array.isArray(expresionesIndividuales)) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere expresionesIndividuales[].");
        }

        if (!Array.isArray(servicios)) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere servicios[].");
        }

        if (typeof codigo !== "string" || !codigo.trim()) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere un código válido.");
        }

        if (typeof slug !== "string" || !slug.trim()) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere un slug válido.");
        }
    }
}

module.exports = DirectorSalidaEditorialPortfolio;
