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

        const puntoPartida = /\b(?:partia|partia de|antes|condicion|reto|desafio|necesidad|limitaba|requeria|buscaba|no permitia|no respondia)\b/.test(texto);
        const transformacion = /\b(?:transform\w*|reorganiz\w*|integr\w*|rediseñ\w*|redisen\w*|convirt\w*|evolucion\w*|articul\w*|respond\w*)\b/.test(texto);
        const posterior = /\b(?:hoy|ahora|permite|se vive|se habita|acompañ\w*|mejor\w*|nueva forma|nueva manera|vida cotidiana)\b/.test(texto);
        const experiencia = /\b(?:habitar|vivir|descanso|compartir|reunirse|personas|familia|habitantes|vida cotidiana)\b/.test(texto);
        const meta = /\b(?:expediente|contexto suministrado|datos disponibles|informacion proporcionada|observaciones|fotografias como fuente|segun|de acuerdo con)\b/.test(texto);
        const cta = /\b(?:conoce|descubre|contáctanos|contactanos|escribenos|escríbenos|cotiza|agenda una cita)\b/.test(texto);
        const anclasEncontradas = [...new Set(anclas.filter(a => texto.includes(a)))];

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
