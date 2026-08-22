console.log("validadorHistoriaWebV2.js cargado");

class ValidadorHistoriaWebV2 {
    normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    contarPalabras(texto) {
        const limpio = String(texto || "").trim();
        return limpio ? limpio.split(/\s+/).length : 0;
    }

    contarParrafos(texto) {
        return String(texto || "")
            .split(/\n\s*\n/)
            .map(p => p.trim())
            .filter(Boolean)
            .length;
    }

    primeraFrase(texto) {
        const coincidencia = String(texto || "").trim().match(/^.*?[.!?](?:\s|$)/);
        return this.normalizar(coincidencia ? coincidencia[0] : texto);
    }

    validar(historia, proyecto = {}) {
        const original = String(historia || "").trim();
        const texto = this.normalizar(original);
        const palabras = this.contarPalabras(original);
        const parrafos = this.contarParrafos(original);
        const errores = [];
        const anclas = [proyecto.nombre, proyecto.ciudad, ...(Array.isArray(proyecto.espacios) ? proyecto.espacios : [])]
            .filter(Boolean)
            .map(x => this.normalizar(x))
            .filter(x => x.length >= 4);

        const primera = this.primeraFrase(original);
        const anclasEncontradas = [...new Set(anclas.filter(a => texto.includes(a)))];
        const anclasIniciales = anclas.filter(a => primera.includes(a));

        // La Historia Web es una síntesis de una Historia Maestra ya validada.
        // Por eso no exigimos palabras literales como "partía" o "permitía".
        // Validamos estructura narrativa y anclaje real al proyecto.
        const transformacion = /\b(?:transform\w*|reorganiz\w*|integr\w*|rediseñ\w*|redisen\w*|convirt\w*|evolucion\w*|articul\w*|renov\w*|interven\w*|diseñ\w*|configur\w*|incorpor\w*)\b/.test(texto);
        const experiencia = /\b(?:habitar|vivir|descanso|compartir|reunirse|personas|familia|habitantes|vida cotidiana|calma|comodidad|confort|funcionalidad|experiencia|bienestar|uso cotidiano|disfrut\w*)\b/.test(texto);
        const posterior = /\b(?:ahora|hoy|queda|quedo|queda configurad\w*|se convierte|se convirtio|resulta|permite|ofrece|aporta|favorece|facilita|hace posible|genera|logra|consigue|propicia|responde|nuevo|nueva|renovad\w*|integrado|integrada|resuelto|resuelta|funcional|calido|calida|calma|equilibrio|fluidez|comodidad|confort)\b/.test(texto);
        const meta = /\b(?:expediente|contexto suministrado|datos disponibles|informacion proporcionada|observaciones|fotografias como fuente|segun|de acuerdo con)\b/.test(texto);
        const cta = /\b(?:conoce|descubre|contactanos|contactanos|escribenos|escribenos|cotiza|agenda una cita)\b/.test(texto);

        // El punto de partida no necesita una palabra gatillo concreta:
        // debe estar presente en la apertura y no ser simplemente el resultado.
        const aperturaEsTransformacion = /\b(?:transform\w*|reorganiz\w*|integr\w*|rediseñ\w*|redisen\w*|convirt\w*|evolucion\w*|renov\w*|interven\w*)\b/.test(primera);
        const puntoPartida = anclasIniciales.length > 0 && !aperturaEsTransformacion;

        if (palabras < 150 || palabras > 220) errores.push(`La Historia Web tiene ${palabras} palabras; exige entre 150 y 220.`);
        if (parrafos !== 1) errores.push(`La Historia Web contiene ${parrafos} párrafos; exige exactamente uno.`);
        if (!puntoPartida) errores.push("Falta el punto de partida en la Historia Web.");
        if (!transformacion) errores.push("Falta una transformación reconocible en la Historia Web.");
        if (!posterior) errores.push("Falta el estado posterior o nueva experiencia en la Historia Web.");
        if (!experiencia) errores.push("Falta una referencia suficiente a la experiencia de habitar.");
        if (meta) errores.push("La Historia Web contiene lenguaje meta/editorial.");
        if (cta) errores.push("La Historia Web contiene un llamado a la acción.");
        if (anclasEncontradas.length < 2) errores.push("La Historia Web contiene pocas anclas comprobables del proyecto.");

        return {
            aprobado: errores.length === 0,
            metricas: { palabras, parrafos, anclasContextuales: anclasEncontradas.length },
            errores,
            anclasEncontradas
        };
    }
}

module.exports = ValidadorHistoriaWebV2;
