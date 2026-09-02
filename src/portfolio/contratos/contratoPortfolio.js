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
 *
 * Las afirmaciones editoriales trazables conservan únicamente los
 * identificadores de las fotografías que sostienen la afirmación. No se
 * duplica aquí la evidencia Vision ni se decide selección u orden.
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

            for (const valor of comprension[campo]) {
                if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
                    throw new Error(`Cada afirmación de "${campo}" debe ser un objeto trazable.`);
                }

                if (typeof valor.texto !== "string" || !valor.texto.trim()) {
                    throw new Error(`Cada afirmación de "${campo}" requiere un texto válido.`);
                }

                if (!Array.isArray(valor.evidencia) || valor.evidencia.length === 0) {
                    throw new Error(`Cada afirmación de "${campo}" requiere al menos una fotografía de evidencia.`);
                }

                for (const fotografia of valor.evidencia) {
                    if (typeof fotografia !== "string" || !fotografia.trim()) {
                        throw new Error(`La evidencia de "${campo}" debe contener identificadores de fotografía válidos.`);
                    }
                }
            }
        }

        return true;
    }

    static normalizar(comprension) {
        this.validar(comprension);

        const normalizarAfirmaciones = afirmaciones => afirmaciones.map(afirmacion => ({
            texto: afirmacion.texto.trim(),
            evidencia: afirmacion.evidencia.map(String).map(x => x.trim()).filter(Boolean)
        }));

        return {
            nucleo: comprension.nucleo.trim(),
            caracter: comprension.caracter.trim(),
            materialidad: normalizarAfirmaciones(comprension.materialidad),
            funcionalidad: normalizarAfirmaciones(comprension.funcionalidad),
            relacionesEspaciales: normalizarAfirmaciones(comprension.relacionesEspaciales),
            experiencia: comprension.experiencia.trim(),
            rasgosDiferenciales: normalizarAfirmaciones(comprension.rasgosDiferenciales),
            enfoqueNarrativo: comprension.enfoqueNarrativo.trim()
        };
    }
}
module.exports = ContratoPortfolio;
