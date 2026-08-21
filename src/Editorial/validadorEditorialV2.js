console.log("validadorEditorialV2.js cargado");

/**
 * Validador Editorial MUBATO V2.
 *
 * Evolución del validador V1:
 * - Las palabras aisladas dejan de ser bloqueadores.
 * - Las reglas se evalúan por contexto, estructura y contrato editorial.
 * - Los hallazgos no bloqueantes se devuelven como advertencias.
 * - El resultado conserva trazabilidad de la regla que produjo cada hallazgo.
 */
class ValidadorEditorialV2 {

    constructor() {
        this.terminosMeta = [
            "el expediente", "según el expediente", "segun el expediente",
            "las observaciones", "la observación visual", "la observacion visual",
            "las fotografías como", "las fotografias como", "el contexto suministrado",
            "los datos disponibles", "el registro indica", "el archivo indica",
            "no se registra", "no se dispone de información", "no se dispone de informacion"
        ];

        this.llamadosAccion = [
            "contáctanos", "contactanos", "agenda una cita", "solicita una asesoría",
            "solicita una asesoria", "escríbenos", "escribenos", "no esperes más",
            "no esperes mas", "cotiza", "descubre", "conoce"
        ];

        this.clichesPublicitarios = [
            "espacios de ensueño", "hacemos realidad tus sueños", "el hogar de tus sueños",
            "diseño de otro nivel", "la mejor calidad", "materiales de primera",
            "acabados premium", "diseño exclusivo", "transformación total",
            "resultados increíbles", "resultados increibles", "experiencia única",
            "experiencia unica", "la mejor opción", "la mejor opcion", "creamos magia",
            "marcamos la diferencia"
        ];

        this.adjetivosComerciales = [
            "premium", "exclusivo", "exclusividad", "innovador", "innovación", "innovacion",
            "vanguardista", "sofisticado", "sofisticación", "sofisticacion", "lujo", "lujoso",
            "perfecto", "perfección", "perfeccion", "impecable", "espectacular", "impactante",
            "asombroso", "extraordinario", "único", "unico", "inigualable", "insuperable",
            "superior", "excelente", "excelencia", "magnífico", "magnifico", "increíble",
            "increible", "fascinante", "aprovecha"
        ];

        this.senalesAntes = [
            "antes", "partía", "partia", "necesidad", "necesitaba", "limitaba", "dificultad",
            "problema", "situación", "situacion", "reto", "desafío", "desafio", "condición inicial",
            "condicion inicial", "planteaba", "buscaba", "requería", "requeria", "no acompañaba",
            "no acompanaba", "había dejado de", "habia dejado de", "no respondía", "no respondia",
            "no permitía", "no permitia"
        ];

        this.senalesTransformacion = [
            "transform", "cambió", "cambio", "reorganiz", "integr", "respond", "permit",
            "convirtió", "convirt", "evolucion", "articul", "rediseñ"
        ];

        this.senalesDespues = [
            "hoy", "ahora", "desde entonces", "se vive", "se habita", "permite", "acompaña",
            "acompa", "mejora", "mejoró", "mejoro", "nueva manera de habitar",
            "nueva forma de habitar", "vida cotidiana"
        ];

        this.senalesHumanas = [
            "quienes habitan", "quien habita", "las personas", "la familia", "familia", "habitantes",
            "quien lo habita", "quienes lo habitan", "vida cotidiana", "rutina cotidiana", "día a día",
            "dia a dia", "descanso", "compartir", "reunirse", "vivir", "habitar"
        ];

        this.senalesInventario = [
            "mueble", "muebles", "cama", "cabecero", "armario", "gabinete", "repisa", "repisas",
            "televisor", "persiana", "mesa de noche", "madera", "mármol", "marmol", "piedra",
            "vidrio", "metal", "textil", "iluminación", "iluminacion", "lámpara", "lampara"
        ];
    }

    normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    contieneAlguna(texto, lista) {
        return [...new Set(lista.filter(item => texto.includes(this.normalizar(item))))];
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

    crearHallazgo(regla, mensaje, severidad = "error", evidencia = []) {
        return { regla, mensaje, severidad, evidencia };
    }

    validar(historia, proyecto = {}) {
        const textoOriginal = String(historia || "").trim();
        const texto = this.normalizar(textoOriginal);
        const palabras = this.contarPalabras(textoOriginal);
        const parrafos = this.contarParrafos(textoOriginal);

        const errores = [];
        const advertencias = [];
        const reglas = [];

        const error = (regla, mensaje, evidencia = []) => {
            const hallazgo = this.crearHallazgo(regla, mensaje, "error", evidencia);
            errores.push(hallazgo);
            reglas.push(hallazgo);
        };

        const warning = (regla, mensaje, evidencia = []) => {
            const hallazgo = this.crearHallazgo(regla, mensaje, "warning", evidencia);
            advertencias.push(hallazgo);
            reglas.push(hallazgo);
        };

        if (!textoOriginal) error("HISTORIA_VACIA", "La historia está vacía.");

        if (palabras < 250 || palabras > 500) {
            error("LONGITUD", `La historia contiene ${palabras} palabras; el contrato exige entre 250 y 500.`);
        }

        if (parrafos !== 1) {
            error("ESTRUCTURA", `La historia contiene ${parrafos} párrafos; el contrato exige exactamente un párrafo.`);
        }

        const meta = this.contieneAlguna(texto, this.terminosMeta);
        if (meta.length) {
            error(
                "LENGUAJE_META",
                "La historia habla de sus fuentes o del proceso editorial en lugar de funcionar como narración publicada.",
                meta
            );
        }

        const cta = this.contieneAlguna(texto, this.llamadosAccion);
        if (cta.length) {
            error("LLAMADO_ACCION", "La historia contiene lenguaje dirigido a captar o convertir al lector.", cta);
        }

        const cliches = this.contieneAlguna(texto, this.clichesPublicitarios);
        if (cliches.length) {
            error("CLICHE_PUBLICITARIO", "La historia utiliza una fórmula publicitaria incompatible con la voz editorial.", cliches);
        }

        // V2: los adjetivos o palabras aisladas ya NO bloquean la historia.
        // Se revisan como señales de tono comercial y solo generan advertencia.
        const comerciales = this.contieneAlguna(texto, this.adjetivosComerciales);
        if (comerciales.length) {
            warning(
                "TONO_COMERCIAL",
                "Aparecen términos potencialmente promocionales; revisar su función dentro de la frase antes de bloquear la publicación.",
                comerciales
            );
        }

        const antes = this.contieneAlguna(texto, this.senalesAntes);
        const transformacion = this.contieneAlguna(texto, this.senalesTransformacion);
        const despues = this.contieneAlguna(texto, this.senalesDespues);
        const humanas = this.contieneAlguna(texto, this.senalesHumanas);
        const inventario = this.contieneAlguna(texto, this.senalesInventario);

        if (!antes.length) {
            error("ARCO_PUNTO_PARTIDA", "No se identifica con suficiente evidencia una situación previa, necesidad espacial o condición de partida.");
        }

        if (!transformacion.length) {
            error("ARCO_TRANSFORMACION", "No se identifica una transformación o respuesta reconocible del diseño.");
        }

        if (!despues.length) {
            error("ARCO_ESTADO_POSTERIOR", "No se identifica con suficiente claridad el estado posterior o la nueva manera de habitar.");
        }

        if (!humanas.length) {
            error("EXPERIENCIA_HUMANA", "No aparece una referencia suficiente a personas, vida cotidiana o experiencia de habitar.");
        }

        const frases = textoOriginal.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
        const frasesConInventario = frases.filter(frase => {
            const f = this.normalizar(frase);
            return this.contieneAlguna(f, this.senalesInventario).length >= 2;
        }).length;

        if (inventario.length >= 6 || frasesConInventario >= 2) {
            warning(
                "DENSIDAD_INVENTARIO",
                "La historia concentra demasiadas referencias a objetos o materiales; revisar que funcionen como evidencia de una experiencia y no como inventario.",
                inventario
            );
        }

        const nombreProyecto = this.normalizar(proyecto.nombre || "");
        const ciudad = this.normalizar(proyecto.ciudad || "");
        const tieneContextoIdentificable = Boolean(nombreProyecto || ciudad || (proyecto.descripcion && String(proyecto.descripcion).trim()));
        if (tieneContextoIdentificable) {
            const mencionaNombre = nombreProyecto && texto.includes(nombreProyecto);
            const mencionaCiudad = ciudad && texto.includes(ciudad);
            if (!mencionaNombre && !mencionaCiudad) {
                warning(
                    "ESPECIFICIDAD_PROYECTO",
                    "La historia no menciona explícitamente el nombre del proyecto ni la ciudad; revisar que su contenido siga siendo inequívocamente específico.",
                    [proyecto.nombre, proyecto.ciudad].filter(Boolean)
                );
            }
        }

        if ((texto.match(/mubato/g) || []).length > 1) {
            warning("REPETICION_MARCA", "MUBATO aparece más de una vez; revisar que la marca no sustituya la narración del proyecto.");
        }

        warning(
            "REVISION_HUMANA",
            "Verificar que la historia sea específica del proyecto, fiel a la evidencia y editorialmente diferenciada antes de publicar."
        );

        return {
            aprobado: errores.length === 0,
            estado: errores.length === 0 ? "APROBADA_CON_REVISION_HUMANA" : "REVISAR",
            metricas: {
                palabras,
                parrafos,
                senalesAntes: antes,
                senalesTransformacion: transformacion,
                senalesDespues: despues,
                senalesHumanas: humanas,
                inventarioDetectado: inventario,
                lenguajeMetaDetectado: meta,
                llamadosAccion: cta,
                clichesPublicitarios: cliches,
                terminosComerciales: comerciales
            },
            errores,
            advertencias,
            reglas
        };
    }
}

module.exports = ValidadorEditorialV2;
