console.log("analizadorVisualEditorialV21.js cargado");

/**
 * Enriquece una fotografía con evidencia visual estructurada.
 * V2.1 mantiene separadas observación e interpretación editorial.
 */
class AnalizadorVisualEditorialV21 {
    constructor(openAI, contexto) {
        this.openAI = openAI;
        this.contexto = contexto;
    }

    async analizar(proyecto, foto) {
        if (!foto.src) throw new Error(`No existe src para ${foto.fileName || "fotografía"}.`);
        const prompt = `Analiza exclusivamente lo observable en esta fotografía del proyecto "${proyecto.nombre}". No inventes información. Devuelve JSON válido con: espacio, tipo, plano, estilo, materiales (array), colores (array), elementos (array), iluminacion, sensacion, condicionInicial, intencionFuncional, confianza. Si algo no es visible, usa "" o []. La condicionInicial debe describir una condición espacial observable, no una interpretación de la historia. La intencionFuncional debe describir, solo si es observable, para qué parece organizarse el espacio.`;
        const resultado = await this.openAI.analizarImagenURL(foto.src, prompt);
        try {
            const datos = JSON.parse(resultado.texto);
            return {
                ...datos,
                nombre: foto.fileName || foto.nombre || "fotografia",
                analizada: true,
                descripcion: foto.description || "",
                telemetria: resultado.telemetria
            };
        } catch (error) {
            throw new Error(`Análisis visual inválido para ${foto.fileName || "fotografía"}: ${error.message}`);
        }
    }
}

module.exports = AnalizadorVisualEditorialV21;
