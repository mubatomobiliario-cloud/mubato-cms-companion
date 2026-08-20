console.log("validadorHistoria.js cargado");

/**
 * Validador determinista de Historias Editoriales MUBATO.
 *
 * Contrato de transformación:
 * - TRANSFORMACION_DOCUMENTADA: existe evidencia suficiente del punto de partida,
 *   la intervención y el estado posterior.
 * - TRANSFORMACION_NO_DOCUMENTADA: puede describirse la condición espacial y la
 *   intervención observable, pero no puede afirmarse un "antes" histórico.
 * - REQUIERE_DOCUMENTACION: una pieza destinada a publicarse como Historia de
 *   Transformación no puede quedar aprobada si el antes no está documentado.
 *
 * Este componente NO utiliza IA.
 */
class ValidadorHistoria {

    constructor() {
        this.palabrasProhibidas = [
            "premium", "exclusivo", "exclusividad", "innovador", "innovación",
            "vanguardista", "sofisticado", "sofisticación", "lujo", "lujoso",
            "elite", "perfecto", "perfección", "impecable", "espectacular",
            "impactante", "asombroso", "extraordinario", "único", "inigualable",
            "insuperable", "superior", "excelente", "excelencia", "magnífico",
            "increíble", "fascinante"
        ];

        this.expresionesProhibidas = [
            "espacios de ensueño", "hacemos realidad tus sueños", "el hogar de tus sueños",
            "diseño de otro nivel", "la mejor calidad", "materiales de primera",
            "acabados premium", "diseño exclusivo", "transformación total",
            "resultados increíbles", "experiencia única", "la mejor opción",
            "más que un proyecto", "creamos magia", "marcamos la diferencia",
            "el diseño que siempre soñaste", "contáctanos", "agenda una cita",
            "solicita una asesoría", "escríbenos", "no esperes más", "descubre",
            "conoce", "aprovecha", "cotiza"
        ];

        this.lenguajeMeta = [
            "el expediente", "según el expediente", "el expediente no registra",
            "el expediente plantea", "las observaciones", "la observación visual",
            "la fotografía", "las fotografías", "el contexto suministrado",
            "el contexto del proyecto", "los datos disponibles", "el registro indica",
            "el archivo indica", "no se registra", "no se dispone de información"
        ];

        this.senalesAntes = [
            "antes", "partía", "partía de", "necesidad", "necesitaba", "limitaba",
            "dificultad", "problema", "situación", "no acompañaba", "había dejado de",
            "no respondía", "no permitía"
        ];

        this.senalesTransformacion = [
            "transform", "cambió", "cambio", "reorgan", "integr", "respond", "permit",
            "convirtió", "convirt", "evolucion", "articul", "rediseñ"
        ];

        this.senalesDespues = [
            "hoy", "ahora", "desde entonces", "se vive", "se habita", "permite",
            "acompaña", "acompañ", "mejora", "mejoró", "nueva manera de habitar",
            "nueva forma de habitar", "vida cotidiana"
        ];

        this.senalesHumanas = [
            "quienes habitan", "quien habita", "las personas", "la familia", "familia",
            "habitantes", "quien lo habita", "quienes lo habitan", "vida cotidiana",
            "rutina cotidiana", "día a día", "descanso", "compartir", "reunirse",
            "vivir", "habitar"
        ];

        this.senalesCondicionInicial = [
            "espacio", "ambiente", "composición", "composicion", "atmósfera", "atmosfera",
            "base cromática", "base cromatica", "lectura del espacio", "condición", "condicion",
            "estado", "distribución", "distribucion", "relación", "relacion", "se percibe",
            "se concentra", "parte de", "se organiza", "se apoya"
        ];

        this.senalesInventario = [
            "mueble", "muebles", "cama", "cabecero", "armario", "gabinete", "repisa",
            "repisas", "televisor", "persiana", "mesa de noche", "madera", "mármol",
            "piedra", "vidrio", "metal", "textil", "iluminación", "lámpara"
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
        return lista.filter(item => texto.includes(this.normalizar(item)));
    }

    contienePalabraExacta(texto, lista) {
        return lista.filter(item => {
            const palabra = this.normalizar(item).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            return new RegExp(`(^|\\s)${palabra}(?=\\s|[,.!?;:()¿¡]|$)`, "i").test(texto);
        });
    }

    contieneSenalAntes(texto) {
        return this.senalesAntes.filter(item => {
            const senal = this.normalizar(item).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            return new RegExp(`(^|\\s)${senal}(?=\\s|[,.!?;:()¿¡]|$)`, "i").test(texto);
        });
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

    validar(historia, contexto = {}) {
        const textoOriginal = String(historia || "").trim();
        const texto = this.normalizar(textoOriginal);
        const palabras = this.contarPalabras(textoOriginal);
        const parrafos = this.contarParrafos(textoOriginal);

        const errores = [];
        const advertencias = [];

        if (!textoOriginal) errores.push("La historia está vacía.");

        if (palabras < 250 || palabras > 500) {
            errores.push(`Longitud fuera de contrato: ${palabras} palabras. Debe estar entre 250 y 500.`);
        }

        if (parrafos < 3) {
            errores.push(`Estructura insuficiente: ${parrafos} párrafos. Se requieren párrafos naturales y separados.`);
        }

        const prohibidas = this.contienePalabraExacta(texto, this.palabrasProhibidas);
        const expresiones = this.contienePalabraExacta(texto, this.expresionesProhibidas);
        const meta = this.contienePalabraExacta(texto, this.lenguajeMeta);

        if (prohibidas.length) {
            errores.push(`Palabras o conceptos prohibidos detectados: ${prohibidas.join(", ")}.`);
        }

        if (expresiones.length) {
            errores.push(`Expresiones prohibidas detectadas: ${expresiones.join(" | ")}.`);
        }

        if (meta.length) {
            errores.push(`Lenguaje meta/editorial detectado: ${meta.join(" | ")}. La historia debe leerse como una narración publicada, no como un informe del expediente.`);
        }

        const antes = this.contieneSenalAntes(texto);
        const transformacion = this.contieneAlguna(texto, this.senalesTransformacion);
        const despues = this.contieneAlguna(texto, this.senalesDespues);
        const humanas = this.contieneAlguna(texto, this.senalesHumanas);
        const condicionInicial = this.contieneAlguna(texto, this.senalesCondicionInicial);
        const inventario = this.contieneAlguna(texto, this.senalesInventario);

        const transformacionDocumentada = contexto.transformacionDocumentada === true;
        const puntoDePartidaDocumentado = String(contexto.puntoDePartida || "").trim().length > 0;
        const modo = transformacionDocumentada ? "TRANSFORMACION_DOCUMENTADA" : "TRANSFORMACION_NO_DOCUMENTADA";

        if (transformacionDocumentada && !puntoDePartidaDocumentado) {
            errores.push("El contexto declara una transformación documentada, pero no aporta un punto de partida documentado.");
        }

        if (transformacionDocumentada && !antes.length) {
            errores.push("La transformación está documentada, pero no se identifica con suficiente evidencia el punto de partida o situación previa.");
        }

        if (!transformacion.length) {
            errores.push("No se identifica una transformación o respuesta del diseño.");
        }

        if (!despues.length) {
            errores.push("No se identifica con suficiente claridad una nueva manera de habitar o un estado posterior.");
        }

        if (!humanas.length) {
            errores.push("No aparece una referencia suficiente a personas, vida cotidiana o experiencia de habitar.");
        }

        if (!transformacionDocumentada && !condicionInicial.length) {
            errores.push("No se identifica una condición espacial suficiente para comprender la intervención disponible.");
        }

        const frases = textoOriginal.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
        const frasesConInventario = frases.filter(frase => {
            const f = this.normalizar(frase);
            return this.contieneAlguna(f, this.senalesInventario).length >= 2;
        }).length;

        if (inventario.length >= 6 || frasesConInventario >= 2) {
            advertencias.push("Alta densidad de objetos/materiales: revisar que funcionen como evidencia de una experiencia y no como inventario.");
        }

        if (texto.includes("mubato") && texto.split("mubato").length - 1 > 1) {
            advertencias.push("MUBATO aparece más de una vez; revisar que el texto no hable innecesariamente de la marca.");
        }

        advertencias.push("Revisión humana pendiente: verificar que la historia sea específica del proyecto y no pueda pertenecer a cualquier estudio de interiorismo.");

        // Regla editorial crítica: una Historia de Transformación no puede aprobarse
        // como transformación publicable cuando el antes no está documentado.
        if (!transformacionDocumentada && errores.length === 0) {
            return {
                aprobado: false,
                estado: "REQUIERE_DOCUMENTACION",
                metricas: {
                    palabras,
                    parrafos,
                    modo,
                    transformacionDocumentada,
                    senalesAntes: antes,
                    senalesTransformacion: transformacion,
                    senalesDespues: despues,
                    senalesHumanas: humanas,
                    condicionInicialDetectada: condicionInicial,
                    inventarioDetectado: inventario,
                    lenguajeMetaDetectado: meta
                },
                errores: ["La historia no puede aprobarse como Historia de Transformación porque el punto de partida no está documentado. No debe inventarse ni inferirse como hecho histórico."],
                advertencias
            };
        }

        return {
            aprobado: errores.length === 0,
            estado: errores.length === 0 ? "APROBADA_CON_REVISION_HUMANA" : "REVISAR",
            metricas: {
                palabras,
                parrafos,
                modo,
                transformacionDocumentada,
                senalesAntes: antes,
                senalesTransformacion: transformacion,
                senalesDespues: despues,
                senalesHumanas: humanas,
                condicionInicialDetectada: condicionInicial,
                inventarioDetectado: inventario,
                lenguajeMetaDetectado: meta
            },
            errores,
            advertencias
        };
    }
}

module.exports = ValidadorHistoria;
