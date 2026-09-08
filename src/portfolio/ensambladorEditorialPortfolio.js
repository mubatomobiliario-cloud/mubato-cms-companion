class EnsambladorEditorialPortfolio {
    ensamblar({
        filaPortfolio,
        expresionColectiva,
        expresionesIndividuales,
        servicios,
        codigo,
        slug
    } = {}) {
        this.validarEntrada({
            filaPortfolio,
            expresionColectiva,
            expresionesIndividuales,
            servicios,
            codigo,
            slug
        });

        return {
            codigo,
            heroTexto: expresionColectiva.heroTexto,
            historia: expresionColectiva.historia,
            descripcion: expresionColectiva.descripcion,
            servicios,
            slug,
            seoTitle: expresionColectiva.seoTitle,
            metaDescription: expresionColectiva.metaDescription,
            galeriaEditorial: this.ensamblarGaleria(
                filaPortfolio,
                expresionesIndividuales
            )
        };
    }

    validarEntrada({
        filaPortfolio,
        expresionColectiva,
        expresionesIndividuales,
        codigo,
        slug
    }) {
        if (!filaPortfolio || typeof filaPortfolio !== "object" || Array.isArray(filaPortfolio)) {
            throw new Error("EnsambladorEditorialPortfolio requiere una fila Portfolio válida.");
        }

        if (!expresionColectiva || typeof expresionColectiva !== "object" || Array.isArray(expresionColectiva)) {
            throw new Error("EnsambladorEditorialPortfolio requiere una expresión colectiva válida.");
        }

        for (const campo of ["historia", "heroTexto", "descripcion", "seoTitle", "metaDescription"]) {
            if (typeof expresionColectiva[campo] !== "string" || !expresionColectiva[campo].trim()) {
                throw new Error(`EnsambladorEditorialPortfolio requiere ${campo} en la expresión colectiva.`);
            }
        }

        if (!Array.isArray(expresionesIndividuales)) {
            throw new Error("EnsambladorEditorialPortfolio requiere un array de expresiones individuales.");
        }

        if (typeof codigo !== "string" || !codigo.trim()) {
            throw new Error("EnsambladorEditorialPortfolio requiere un código válido.");
        }

        if (typeof slug !== "string" || !slug.trim()) {
            throw new Error("EnsambladorEditorialPortfolio requiere un slug válido.");
        }
    }

    ensamblarGaleria(filaPortfolio, expresionesIndividuales) {
        const galeriaOriginal = this.extraerGaleriaOriginal(filaPortfolio);
        const expresionesPorFotografia = new Map();

        for (const expresion of expresionesIndividuales) {
            if (!expresion || typeof expresion !== "object" || Array.isArray(expresion)) {
                throw new Error("EnsambladorEditorialPortfolio encontró una expresión individual inválida.");
            }

            const fotografia = expresion.fotografia;
            if (typeof fotografia !== "string" || !fotografia.trim()) {
                throw new Error("Cada expresión individual debe tener un identificador de fotografía válido.");
            }

            if (expresionesPorFotografia.has(fotografia)) {
                throw new Error(`Existe más de una expresión individual para la fotografía ${fotografia}.`);
            }

            expresionesPorFotografia.set(fotografia, expresion);
        }

        if (galeriaOriginal.length !== expresionesIndividuales.length) {
            throw new Error("La cantidad de expresiones individuales no coincide con la galería original.");
        }

        return galeriaOriginal.map(item => {
            const fotografia = this.obtenerFotografia(item);
            const expresion = expresionesPorFotografia.get(fotografia);

            if (!expresion) {
                throw new Error(`No existe expresión individual para la fotografía ${fotografia}.`);
            }

            return {
                ...item,
                title: expresion.title,
                description: expresion.description,
                alt: expresion.alt,
                keywords: expresion.keywords,
                nombreSEO: expresion.nombreSEO,
                fotografia
            };
        });
    }

    extraerGaleriaOriginal(filaPortfolio) {
        const galeria = filaPortfolio["Galería General"];

        if (typeof galeria !== "string" || !galeria.trim()) {
            throw new Error("EnsambladorEditorialPortfolio requiere la Galería General original.");
        }

        let datos;
        try {
            datos = JSON.parse(galeria);
        } catch (error) {
            throw new Error(`La Galería General original contiene JSON inválido: ${error.message}`);
        }

        if (!Array.isArray(datos)) {
            throw new Error("La Galería General original debe contener un array.");
        }

        return datos;
    }

    obtenerFotografia(item) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            throw new Error("La Galería General contiene un elemento inválido.");
        }

        const fotografia = item.fotografia || item.fileName || item.filename;
        if (typeof fotografia !== "string" || !fotografia.trim()) {
            throw new Error("Cada elemento de la Galería General debe tener identificador de fotografía.");
        }

        return fotografia;
    }
}

module.exports = EnsambladorEditorialPortfolio;
