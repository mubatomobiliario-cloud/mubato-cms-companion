/**
 * ContratoPortfolio
 *
 * Contrato interno de la comprensión editorial central de Portfolio.
 *
 * Esta estructura NO es el formato Wix y NO contiene decisiones de selección
 * de fotografías. Su función es representar qué comprendió Editorial IA
 * a partir de la evidencia visual ya persistida y de los datos del Portfolio.
 *
 * La comprensión es insumo para la expresión editorial posterior:
 * Historia, Hero Texto, SEO y contenidos individuales de Galería.
 */
class ContratoPortfolio {
    static CAMPOS = Object.freeze([
        "nucleo",
        "caracter",
        "materialidad",
        "funcionalidad",
        "relacionesEspaciales",
        "experiencia",
        "rasgosDiferenciales",
        "enfoqueNarrativo"
    ]);

    static crearVacio() {
        return {
            nucleo: "",
            caracter: "",
            materialidad: [],
            funcionalidad: [],
            relacionesEspaciales: [],
            experiencia: "",
            rasgosDiferenciales: [],
            enfoqueNarrativo: ""
        };
    }

    static validar(comprension) {
        if (!comprension || typeof comprension !== "object" || Array.isArray(comprension)) {
            throw new Error("La comprensión Portfolio debe ser un objeto.");
        }

        const requeridosTexto = [
            "nucleo",
            "caracter",
            "experiencia",
            "enfoqueNarrativo"
        ];

        for (const campo of requeridosTexto) {
            if (typeof comprension[campo] !== "string" || !comprension[campo].trim()) {
                throw new Error(`La comprensión Portfolio requiere el campo de texto "${campo}".`);
            }
        }

        const requeridosArreglo = [
            "materialidad",
            "funcionalidad",
            "relacionesEspaciales",
            "rasgosDiferenciales"
        ];

        for (const campo of requeridosArreglo) {
            if (!Array.isArray(comprension[campo])) {
                throw new Error(`La comprensión Portfolio requiere "${campo}" como arreglo.`);
            }
        }

        return true;
    }

    static normalizar(comprension) {
        this.validar(comprension);

        return {
            nucleo: comprension.nucleo.trim(),
            caracter: comprension.caracter.trim(),
            materialidad: comprension.materialidad.map(String).map(x => x.trim()).filter(Boolean),
            funcionalidad: comprension.funcionalidad.map(String).map(x => x.trim()).filter(Boolean),
            relacionesEspaciales: comprension.relacionesEspaciales.map(String).map(x => x.trim()).filter(Boolean),
            experiencia: comprension.experiencia.trim(),
            rasgosDiferenciales: comprension.rasgosDiferenciales.map(String).map(x => x.trim()).filter(Boolean),
            enfoqueNarrativo: comprension.enfoqueNarrativo.trim()
        };
    }
}

module.exports = ContratoPortfolio;
