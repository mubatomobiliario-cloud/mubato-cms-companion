console.log("revisorHistoria.js cargado");

/**
 * Construye instrucciones de revisión para una Historia evaluada por
 * ValidadorHistoria.
 *
 * Este componente NO llama a OpenAI por sí mismo.
 */
class RevisorHistoria {

    normalizarContexto(contexto = {}) {
        return {
            transformacionDocumentada: contexto.transformacionDocumentada === true,
            puntoDePartida: String(contexto.puntoDePartida || "").trim(),
            intencion: String(contexto.intencion || "").trim(),
            transformacion: String(contexto.transformacion || "").trim(),
            nuevaManeraDeHabitar: String(contexto.nuevaManeraDeHabitar || "").trim(),
            evidencia: Array.isArray(contexto.evidencia)
                ? contexto.evidencia.map(item => String(item || "").trim()).filter(Boolean)
                : [],
            restricciones: Array.isArray(contexto.restricciones)
                ? contexto.restricciones.map(item => String(item || "").trim()).filter(Boolean)
                : []
        };
    }

    construirBrief(historia, resultadoValidacion, contexto = {}) {
        const errores = resultadoValidacion?.errores || [];
        const advertencias = resultadoValidacion?.advertencias || [];
        const contextoNormalizado = this.normalizarContexto(contexto);

        const instrucciones = [
            "Conservar únicamente hechos sustentados por el contexto editorial disponible.",
            "Eliminar lenguaje meta/editorial sobre expedientes, fotografías, observaciones, archivos o datos suministrados.",
            "Reducir enumeraciones de muebles, materiales y elementos técnicos; conservarlos solo cuando sean evidencia necesaria de la experiencia.",
            "Mantener una narrativa centrada en personas, experiencia y manera de habitar, no en un inventario de objetos.",
            "Reforzar la relación entre situación inicial, intención, transformación y nueva manera de habitar únicamente cuando exista evidencia para hacerlo.",
            "Mantener una voz serena, humana, precisa y contenida.",
            "No introducir atributos, emociones, necesidades, actividades, problemas, causas o resultados que no estén sustentados.",
            "No utilizar lenguaje comercial, promocional ni palabras o expresiones prohibidas por el validador.",
            "No convertir la historia en una ficha técnica ni en una descripción exhaustiva del espacio.",
            "Mantener entre 250 y 500 palabras, usando solo la extensión necesaria para contar la historia.",
            "Entregar únicamente la Historia revisada, sin explicación del proceso de revisión."
        ];

        if (contextoNormalizado.transformacionDocumentada) {
            instrucciones.push(
                "La transformación está documentada: puede y debe explicitarse el punto de partida cuando esté sustentado por el contexto."
            );
        } else {
            instrucciones.push(
                "La transformación NO está documentada: no inventar un antes, una necesidad del cliente, un problema previo ni una condición histórica. La revisión puede limpiar y ordenar la narrativa, pero no puede convertir una inferencia visual en un hecho histórico."
            );
        }

        return {
            objetivo: "Revisar una Historia Editorial MUBATO sin cambiar su verdad ni inventar información.",
            historiaOriginal: String(historia || "").trim(),
            errores,
            advertencias,
            contexto: contextoNormalizado,
            instrucciones
        };
    }

    construirPrompt(historia, resultadoValidacion, contexto = {}) {
        const brief = this.construirBrief(historia, resultadoValidacion, contexto);
        const contextoEditorial = brief.contexto;

        const seccion = (titulo, contenido, fallback = "- No disponible") => [
            titulo,
            ...(contenido ? [contenido] : [fallback]),
            ""
        ];

        return [
            "DIRECTOR EDITORIAL MUBATO — REVISIÓN CONTEXTUAL DE HISTORIA",
            "",
            "OBJETIVO",
            brief.objetivo,
            "",
            ...seccion("HISTORIA ORIGINAL", brief.historiaOriginal),
            "ERRORES DEL VALIDADOR",
            ...(brief.errores.length ? brief.errores.map(e => `- ${e}`) : ["- Ninguno"]),
            "",
            "ADVERTENCIAS DEL VALIDADOR",
            ...(brief.advertencias.length ? brief.advertencias.map(a => `- ${a}`) : ["- Ninguna"]),
            "",
            "CONTEXTO DE TRANSFORMACIÓN",
            `Transformación documentada: ${contextoEditorial.transformacionDocumentada ? "SÍ" : "NO"}`,
            ...seccion("PUNTO DE PARTIDA DOCUMENTADO", contextoEditorial.puntoDePartida),
            ...seccion("INTENCIÓN DOCUMENTADA", contextoEditorial.intencion),
            ...seccion("TRANSFORMACIÓN DOCUMENTADA", contextoEditorial.transformacion),
            ...seccion("NUEVA MANERA DE HABITAR DOCUMENTADA", contextoEditorial.nuevaManeraDeHabitar),
            "EVIDENCIA DISPONIBLE",
            ...(contextoEditorial.evidencia.length
                ? contextoEditorial.evidencia.map(item => `- ${item}`)
                : ["- No se ha suministrado evidencia adicional."]),
            "",
            "RESTRICCIONES ADICIONALES",
            ...(contextoEditorial.restricciones.length
                ? contextoEditorial.restricciones.map(item => `- ${item}`)
                : ["- Ninguna."]),
            "",
            "INSTRUCCIONES DE REVISIÓN",
            ...brief.instrucciones.map(i => `- ${i}`),
            "",
            "REGLA DE VERDAD",
            contextoEditorial.transformacionDocumentada
                ? "Puedes narrar el antes, la intención, la transformación y el después solo cuando cada afirmación esté respaldada por el contexto documentado."
                : "No existe documentación suficiente para afirmar un antes histórico. No lo inventes ni lo simules. La historia debe construirse desde la condición espacial disponible, la intervención observable y la experiencia que sí pueda sostenerse.",
            "",
            "REGLA DE PUBLICACIÓN",
            contextoEditorial.transformacionDocumentada
                ? "La historia puede continuar al flujo de validación editorial si cumple el resto del contrato."
                : "La historia NO puede aprobarse como Historia de Transformación publicable hasta documentar el punto de partida.",
            "",
            "REGLA FINAL",
            "La revisión debe corregir únicamente los incumplimientos detectados y mejorar la narrativa sin agregar información inexistente."
        ].join("\n");
    }
}

module.exports = RevisorHistoria;
