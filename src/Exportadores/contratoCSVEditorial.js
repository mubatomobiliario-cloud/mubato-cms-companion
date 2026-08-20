console.log("contratoCSVEditorial.js cargado");

class ContratoCSVEditorial {

    validarDecision(decision = {}) {
        const errores = [];

        if (decision.aprobado !== true) {
            errores.push("La salida editorial no está aprobada.");
        }

        if (decision.estado !== "APROBADA_CON_REVISION_HUMANA") {
            errores.push(`Estado editorial no publicable: ${decision.estado || "(vacío)"}.`);
        }

        if (decision.modo !== "TRANSFORMACION_DOCUMENTADA") {
            errores.push(`Modo no publicable: ${decision.modo || "(vacío)"}.`);
        }

        if (decision.transformacionDocumentada !== true) {
            errores.push("La transformación no está documentada.");
        }

        const palabras = Number(decision.metricas?.palabras);
        if (!Number.isFinite(palabras) || palabras < 250 || palabras > 500) {
            errores.push(`Longitud fuera de contrato: ${Number.isFinite(palabras) ? palabras : "(no disponible)"} palabras.`);
        }

        if (Array.isArray(decision.errores) && decision.errores.length > 0) {
            errores.push(...decision.errores.map(error => `Error editorial: ${error}`));
        }

        return {
            publicable: errores.length === 0,
            errores
        };
    }

    resolverColumnaHistoria(encabezados, candidatos = ["Historia de Transformación", "Descripción"]) {
        const posiciones = {};

        encabezados.forEach((encabezado, posicion) => {
            if (!posiciones[encabezado]) posiciones[encabezado] = [];
            posiciones[encabezado].push(posicion);
        });

        for (const candidato of candidatos) {
            const coincidencias = posiciones[candidato] || [];

            if (coincidencias.length === 1) {
                return {
                    encontrada: true,
                    ambigua: false,
                    nombre: candidato,
                    posicion: coincidencias[0]
                };
            }

            if (coincidencias.length > 1) {
                return {
                    encontrada: false,
                    ambigua: true,
                    nombre: candidato,
                    posiciones: coincidencias
                };
            }
        }

        return {
            encontrada: false,
            ambigua: false,
            nombre: null,
            posicion: null
        };
    }

    prepararEscritura({ encabezados, decision, historia, candidatosColumna }) {
        const validacion = this.validarDecision(decision);

        if (!validacion.publicable) {
            return {
                permitido: false,
                estado: "BLOQUEADO_POR_CONTRATO",
                errores: validacion.errores
            };
        }

        if (!historia || !String(historia).trim()) {
            return {
                permitido: false,
                estado: "REQUIERE_HISTORIA",
                errores: ["No existe texto de historia para escribir."]
            };
        }

        const columna = this.resolverColumnaHistoria(encabezados, candidatosColumna);

        if (columna.ambigua) {
            return {
                permitido: false,
                estado: "REQUIERE_MAPEO_CSV",
                errores: [`La columna "${columna.nombre}" aparece más de una vez.`]
            };
        }

        if (!columna.encontrada) {
            return {
                permitido: false,
                estado: "REQUIERE_MAPEO_CSV",
                errores: ["No se identificó de forma inequívoca la columna destino de la Historia de Transformación."]
            };
        }

        return {
            permitido: true,
            estado: "LISTO_PARA_ESCRITURA",
            columnaHistoria: columna,
            valor: String(historia).trim(),
            errores: []
        };
    }
}

module.exports = ContratoCSVEditorial;
