console.log("revisorHistoria.js cargado");

/**
 * Construye instrucciones de revisión para una Historia que ya pasó por el
 * Director Editorial y fue evaluada por el ValidadorHistoria.
 *
 * Este componente NO llama a OpenAI por sí mismo.
 * Su responsabilidad es convertir los hallazgos del validador en un brief
 * preciso para una única revisión editorial.
 */
class RevisorHistoria {

    construirBrief(historia, resultadoValidacion) {
        const errores = resultadoValidacion?.errores || [];
        const advertencias = resultadoValidacion?.advertencias || [];

        return {
            objetivo: "Revisar una Historia Editorial MUBATO sin cambiar su verdad ni inventar información.",
            historiaOriginal: String(historia || "").trim(),
            errores,
            advertencias,
            instrucciones: [
                "Conservar únicamente hechos sustentados por el contexto editorial disponible.",
                "Eliminar lenguaje meta/editorial sobre expedientes, fotografías, observaciones, archivos o datos suministrados.",
                "Reducir enumeraciones de muebles, materiales y elementos técnicos; conservarlos solo cuando sean evidencia necesaria de la experiencia.",
                "Reforzar la relación entre situación inicial, transformación y nueva manera de habitar cuando el contexto lo permita.",
                "Mantener una voz serena, humana, precisa y contenida.",
                "No introducir atributos, emociones, necesidades, actividades o resultados que no estén sustentados.",
                "No utilizar lenguaje comercial, promocional ni palabras prohibidas.",
                "Mantener entre 300 y 500 palabras.",
                "Entregar únicamente la Historia revisada, sin explicación del proceso de revisión."
            ]
        };
    }

    construirPrompt(historia, resultadoValidacion) {
        const brief = this.construirBrief(historia, resultadoValidacion);

        return [
            "DIRECTOR EDITORIAL MUBATO — REVISIÓN DE HISTORIA",
            "",
            "OBJETIVO",
            brief.objetivo,
            "",
            "HISTORIA ORIGINAL",
            brief.historiaOriginal,
            "",
            "ERRORES DEL VALIDADOR",
            ...(brief.errores.length ? brief.errores.map(e => `- ${e}`) : ["- Ninguno"]),
            "",
            "ADVERTENCIAS DEL VALIDADOR",
            ...(brief.advertencias.length ? brief.advertencias.map(a => `- ${a}`) : ["- Ninguna"]),
            "",
            "INSTRUCCIONES DE REVISIÓN",
            ...brief.instrucciones.map(i => `- ${i}`),
            "",
            "REGLA FINAL",
            "La revisión debe corregir únicamente los incumplimientos detectados. No debe convertir la Historia en una ficha técnica ni agregar información que no exista en el contexto editorial."
        ].join("\n");
    }
}

module.exports = RevisorHistoria;
