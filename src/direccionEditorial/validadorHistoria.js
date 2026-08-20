console.log("validadorHistoria.js cargado");

/**
 * Validador determinista de Historias Editoriales MUBATO.
 *
 * Este componente NO utiliza IA.
 * Su función es detectar incumplimientos objetivos del contrato editorial
 * antes de que una historia pueda considerarse aprobada.
 */
class ValidadorHistoria {

    constructor() {
        this.palabrasProhibidas = [
            "premium",
            "exclusivo",
            "exclusividad",
            "innovador",
            "innovación",
            "vanguardista",
            "sofisticado",
            "sofisticación",
            "lujo",
            "lujoso",
            "elite",
            "perfecto",
            "perfección",
            "impecable",
            "espectacular",
            "impactante",
            "asombroso",
            "extraordinario",
            "único",
            "inigualable",
            "insuperable",
            "superior",
            "excelente",
            "excelencia",
            "magnífico",
            "increíble",
            "fascinante"
        ];

        this.expresionesProhibidas = [
            "espacios de ensueño",
            "hacemos realidad tus sueños",
            "el hogar de tus sueños",
            "diseño de otro nivel",
            "la mejor calidad",
            "materiales de primera",
            "acabados premium",
            "diseño exclusivo",
            "transformación total",
            "resultados increíbles",
            "experiencia única",
            "la mejor opción",
            "más que un proyecto",
            "creamos magia",
            "marcamos la diferencia",
            "el diseño que siempre soñaste",
            "contáctanos",
            "agenda una cita",
            "solicita una asesoría",
            "escríbenos",
            "no esperes más",
            "descubre",
            "conoce",
            "aprovecha",
            "cotiza"
        ];

        this.senalesAntes = [
            "antes",
            "partía",
            "partía de",
            "necesidad",
            "necesitaba",
            "limitaba",
            "dificultad",
            "problema",
            "situación",
            "no acompañaba",
            "había dejado de",
            "no respondía",
            "no permitía"
        ];

        this.senalesTransformacion = [
            "transform",
            "cambió",
            "cambio",
            "reorgan",
            "integr",
            "respond",
            "permit",
            "convirtió",
            "convirt",
            "evolucion",
            "articul",
            "rediseñ"
        ];

        this.senalesDespues = [
            "hoy",
            "ahora",
            "desde entonces",
            "se vive",
            "se habita",
            "permite",
            "acompaña",
            "acompañ",
            "mejora",
            "mejoró",
            "nueva manera de habitar",
            "nueva forma de habitar",
            "vida cotidiana"
        ];

        this.senalesHumanas = [
            "quienes habitan",
            "quien habita",
            "las personas",
            "la familia",
            "familia",
            "habitantes",
            "quien lo habita",
            "quienes lo habitan",
            "vida cotidiana",
            "rutina cotidiana",
            "día a día",
            "descanso",
            "compartir",
            "reunirse",
            "vivir",
            "habitar"
        ];

        this.senalesInventario = [
            "mueble",
            "muebles",
            "cama",
            "cabecero",
            "armario",
            "gabinete",
            "repisa",
            "repisas",
            "televisor",
            "persiana",
            "mesa de noche",
            "madera",
            "mármol",
            "piedra",
            "vidrio",
            "metal",
            "textil",
            "iluminación",
            "lámpara"
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

    validar(historia) {
        const textoOriginal = String(historia || "").trim();
        const texto = this.normalizar(textoOriginal);
        const palabras = this.contarPalabras(textoOriginal);
        const parrafos = this.contarParrafos(textoOriginal);

        const errores = [];
        const advertencias = [];

        if (!textoOriginal) {
            errores.push("La historia está vacía.");
        }

        if (palabras < 250 || palabras > 500) {
            errores.push(`Longitud fuera de contrato: ${palabras} palabras. Debe estar entre 250 y 500.`);
        }

        if (parrafos < 3) {
            errores.push(`Estructura insuficiente: ${parrafos} párrafos. Se requieren párrafos naturales y separados.`);
        }

        const prohibidas = this.contieneAlguna(texto, this.palabrasProhibidas);
        const expresiones = this.contieneAlguna(texto, this.expresionesProhibidas);

        if (prohibidas.length) {
            errores.push(`Palabras o conceptos prohibidos detectados: ${prohibidas.join(", ")}.`);
        }

        if (expresiones.length) {
            errores.push(`Expresiones prohibidas detectadas: ${expresiones.join(" | ")}.`);
        }

        const antes = this.contieneAlguna(texto, this.senalesAntes);
        const transformacion = this.contieneAlguna(texto, this.senalesTransformacion);
        const despues = this.contieneAlguna(texto, this.senalesDespues);
        const humanas = this.contieneAlguna(texto, this.senalesHumanas);
        const inventario = this.contieneAlguna(texto, this.senalesInventario);

        if (!antes.length) {
            errores.push("No se identifica con suficiente evidencia el punto de partida o situación previa.");
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
                inventarioDetectado: inventario
            },
            errores,
            advertencias
        };
    }
}

module.exports = ValidadorHistoria;
