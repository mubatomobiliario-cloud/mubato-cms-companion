const EnsambladorEditorialPortfolio = require("./ensambladorEditorialPortfolio");

class DirectorSalidaEditorialPortfolio {
    constructor({
        ensambladorEditorialPortfolio = new EnsambladorEditorialPortfolio()
    } = {}) {
        this.ensambladorEditorialPortfolio = ensambladorEditorialPortfolio;
    }

    ensamblar({
        filaPortfolio,
        expresionColectiva,
        expresionesIndividuales,
        servicios,
        codigo,
        slug
    }) {
        if (!filaPortfolio || typeof filaPortfolio !== "object" || Array.isArray(filaPortfolio)) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere la fila Portfolio original.");
        }
        if (!expresionColectiva || typeof expresionColectiva !== "object" || Array.isArray(expresionColectiva)) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere una expresión colectiva válida.");
        }
        if (!Array.isArray(expresionesIndividuales)) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere expresiones individuales válidas.");
        }
        if (servicios === undefined || servicios === null) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere servicios determinísticos.");
        }
        if (typeof codigo !== "string" || !codigo.trim()) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere un código Portfolio válido.");
        }
        if (typeof slug !== "string" || !slug.trim()) {
            throw new Error("DirectorSalidaEditorialPortfolio requiere un slug válido.");
        }
        if (!this.ensambladorEditorialPortfolio ||
            typeof this.ensambladorEditorialPortfolio.ensamblar !== "function") {
            throw new Error("DirectorSalidaEditorialPortfolio requiere un EnsambladorEditorialPortfolio válido.");
        }

        return this.ensambladorEditorialPortfolio.ensamblar({
            filaPortfolio,
            expresionColectiva,
            expresionesIndividuales,
            servicios,
            codigo,
            slug
        });
    }
}

module.exports = DirectorSalidaEditorialPortfolio;
