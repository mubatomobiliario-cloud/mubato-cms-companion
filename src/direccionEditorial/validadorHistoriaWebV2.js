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

    validarContrato(contrato, proyecto = {}) {
        const errores = [];
        const requeridos = ["puntoPartida", "logicaDiseno", "transformacion", "estadoPosterior", "experiencia", "texto"];

        if (!contrato || typeof contrato !== "object" || Array.isArray(contrato)) {
            return { aprobado: false, errores: ["La Historia Web no devolvió el contrato JSON esperado."], metricas: {} };
        }

        for (const campo of requeridos) {
            if (!String(contrato[campo] || "").trim()) errores.push(`Falta el campo obligatorio: ${campo}.`);
        }
        if (errores.length) return { aprobado: false, errores, metricas: {} };

        const texto = String(contrato.texto).trim();
        const normalizado = this.normalizar(texto);
        const palabras = this.contarPalabras(texto);
        const parrafos = this.contarParrafos(texto);

        if (palabras < 150 || palabras > 220) errores.push(`La Historia Web tiene ${palabras} palabras; exige entre 150 y 220.`);
        if (parrafos !== 1) errores.push(`La Historia Web contiene ${parrafos} párrafos; exige exactamente uno.`);

        if (/\b(?:expediente|contexto suministrado|datos disponibles|informacion proporcionada|observaciones|fotografias como fuente|segun el expediente|de acuerdo con el expediente)\b/.test(normalizado)) {
            errores.push("La Historia Web contiene lenguaje meta/editorial.");
        }
        if (/\b(?:conoce|descubre|contactanos|escribenos|cotiza|agenda una cita|solicita una asesoria)\b/.test(normalizado)) {
            errores.push("La Historia Web contiene un llamado a la acción.");
        }

        const anclas = [proyecto.nombre, proyecto.ciudad, ...(Array.isArray(proyecto.espacios) ? proyecto.espacios : [])]
            .filter(Boolean)
            .map(x => this.normalizar(x))
            .filter(x => x.length >= 4);
        const anclasEncontradas = [...new Set(anclas.filter(a => normalizado.includes(a)))];
        if (anclasEncontradas.length < 2) errores.push("La Historia Web contiene pocas anclas comprobables del proyecto.");

        const primeraFrase = this.normalizar(texto.match(/^.*?[.!?](?:\s|$)/)?.[0] || texto);
        const punto = this.normalizar(contrato.puntoPartida);
        const fragmentoPunto = punto.split(/\s+/).slice(0, 8).join(" ");
        if (!fragmentoPunto || !primeraFrase.includes(fragmentoPunto)) {
            errores.push("La primera frase no conserva explícitamente el punto de partida del contrato.");
        }

        return {
            aprobado: errores.length === 0,
            errores,
            metricas: { palabras, parrafos, anclasContextuales: anclasEncontradas.length },
            anclasEncontradas,
            contrato
        };
    }

    validar(historiaWeb, proyecto = {}) {
        return this.validarContrato(historiaWeb, proyecto);
    }
}

module.exports = ValidadorHistoriaWebV2;
