console.log("validadorHistoriaV2.js cargado");

class ValidadorHistoriaV2 {

    constructor() {

        this.reglas = [
            { id: "estructura.parrafos", severidad: "error" },
            { id: "narrativa.punto_partida", severidad: "error" },
            { id: "narrativa.transformacion", severidad: "error" },
            { id: "narrativa.estado_posterior", severidad: "error" },
            { id: "narrativa.experiencia_humana", severidad: "error" },
            { id: "contexto.especificidad", severidad: "error" }
        ];

    }

    extraerContexto(proyecto) {

        const valores = [];

        const agregar = valor => {

            if (valor === undefined || valor === null) {
                return;
            }

            if (Array.isArray(valor)) {

                valor.forEach(item => agregar(item));
                return;

            }

            const texto = String(valor).trim();

            if (texto.length >= 4) {
                valores.push(texto);
            }

        };

        agregar(proyecto.nombre);
        agregar(proyecto.proyecto);
        agregar(proyecto.ciudad);
        agregar(proyecto.categoria);
        agregar(proyecto.espacios);
        agregar(proyecto.servicios);

        if (proyecto.expediente) {

            agregar(proyecto.expediente.observacionesVision);

        }

        return [...new Set(valores)];

    }

    validar(textoHistoria, proyecto) {

        const errores = [];
        const advertencias = [];
        const metricas = {};

        const texto = String(textoHistoria || "")
            .trim()
            .replace(/\s+/g, " ");

        const registrar = (regla, aprobado, mensaje, detalle = {}) => {

            const registro = {
                regla,
                aprobado,
                mensaje,
                ...detalle
            };

            if (!aprobado) {
                errores.push(registro);
            }

            return registro;

        };

        // --------------------------------------------------
        // ESTRUCTURA
        // --------------------------------------------------

        const parrafos = texto
            .split(/\n\s*\n/)
            .map(p => p.trim())
            .filter(Boolean);

        metricas.parrafos = parrafos.length;
        metricas.caracteres = texto.length;
        metricas.palabras = texto
            ? texto.split(/\s+/).length
            : 0;

        registrar(
            "estructura.parrafos",
            parrafos.length === 1,
            parrafos.length === 1
                ? "La historia contiene exactamente un párrafo."
                : "La historia debe contener exactamente un párrafo.",
            {
                parrafos: parrafos.length
            }
        );

        // --------------------------------------------------
        // PATRONES NARRATIVOS
        // --------------------------------------------------

        const antes = [

            /\bantes\b/,
            /\bpartia\b/,
            /\bpartía\b/,
            /\bpartia de\b/,
            /\bpartía de\b/,
            /\bse encontraba\b/,
            /\bse encontraba en\b/,
            /\bestaba\b/,
            /\bera\b/,
            /\btenia\b/,
            /\btenía\b/,
            /\bcontaba con\b/,
            /\bpresentaba\b/,
            /\balbergaba\b/,
            /\bdisponia de\b/,
            /\bdisponía de\b/,
            /\bcarecia de\b/,
            /\bcarecía de\b/,
            /\bno contaba con\b/,
            /\bno disponia de\b/,
            /\bno disponía de\b/,
            /\bno permitia\b/,
            /\bno permitía\b/,
            /\blimitaba\b/,
            /\bdificultad\b/,
            /\bproblema\b/,
            /\breto\b/,
            /\bdesafio\b/,
            /\bdesafío\b/,
            /\bcondicion inicial\b/,
            /\bcondición inicial\b/,
            /\bsituacion inicial\b/,
            /\bsituación inicial\b/,
            /\bbuscaba\b/,
            /\bqueria\b/,
            /\bquería\b/,
            /\brequeria\b/,
            /\brequería\b/,
            /\bnecesitaba\b/,
            /\bnecesidad(?:es)?\b/,
            /\bplanteaba\b/

        ];

        const transformacion = [

            /\btransform\w*\b/,
            /\breorganiz\w*\b/,
            /\bintegr\w*\b/,
            /\brediseñ\w*\b/,
            /\bredisen\w*\b/,
            /\bconvirt\w*\b/,
            /\bevolucion\w*\b/,
            /\barticul\w*\b/,
            /\brespond\w*\b/,
            /\bconfigur\w*\b/,
            /\bincorpor\w*\b/,
            /\bresolv\w*\b/,
            /\badapt\w*\b/,
            /\bcrea\w*\b/,
            /\bdiseñ\w*\b/,
            /\bdiseñó\b/,
            /\bdiseno\b/,
            /\bdiseño\b/

        ];

        /*
         * ESTADO POSTERIOR
         *
         * Antes el validador dependía casi exclusivamente de:
         *
         * hoy / ahora / se vive / se habita / permite /
         * acompaña / mejora / nueva forma de habitar /
         * vida cotidiana
         *
         * Eso es demasiado restrictivo.
         *
         * Una historia puede expresar claramente el resultado
         * mediante formulaciones como:
         *
         * "la alcoba queda configurada..."
         * "el espacio adquiere..."
         * "la composición integra..."
         * "el dormitorio se percibe..."
         * "la intervención genera..."
         * "la solución permite..."
         *
         * Todas son señales legítimas de estado posterior.
         */

        const despues = [

            // Estado explícito
            /\bhoy\b/,
            /\bahora\b/,
            /\bactualmente\b/,
            /\bdesde entonces\b/,
            /\bfinalmente\b/,
            /\bal final\b/,
            /\bdespues\b/,
            /\bdespués\b/,

            // Estado resultante
            /\bse vive\b/,
            /\bse habita\b/,
            /\bse disfruta\b/,
            /\bse percibe\b/,
            /\bse siente\b/,
            /\bse experimenta\b/,
            /\bse configura\b/,
            /\bqueda configurad\w*\b/,
            /\bqueda resuelt\w*\b/,
            /\bqueda integrad\w*\b/,
            /\bqueda organizad\w*\b/,
            /\bqueda articulad\w*\b/,
            /\bqueda transformad\w*\b/,
            /\bqueda convertid\w*\b/,

            // Resultado espacial
            /\badquiere\b/,
            /\bincorpora\b/,
            /\bintegra\b/,
            /\barticula\b/,
            /\borganiza\b/,
            /\bresuelve\b/,
            /\bpermite\b/,
            /\bfavorece\b/,
            /\bfacilita\b/,
            /\bacompaña\b/,
            /\bcontribuye\b/,
            /\bgenera\b/,
            /\bproduce\b/,
            /\bdefine\b/,
            /\bredefine\b/,
            /\bpotencia\b/,
            /\bmejora\b/,

            // Resultado perceptual
            /\bse percibe\b/,
            /\bse siente\b/,
            /\bse reconoce\b/,
            /\bse aprecia\b/,
            /\bse entiende\b/,

            // Resultado de uso / experiencia
            /\bnueva (?:forma|manera) de habitar\b/,
            /\bnueva experiencia\b/,
            /\bexperiencia cotidiana\b/,
            /\bvida cotidiana\b/,
            /\brutina cotidiana\b/,
            /\buso cotidiano\b/,
            /\buso diario\b/,
            /\bdescanso\b/,
            /\bmayor claridad\b/,
            /\bmayor orden\b/,
            /\bmayor funcionalidad\b/,
            /\bmayor amplitud\b/,
            /\bmayor comodidad\b/,
            /\bmayor armonia\b/,
            /\bmayor armonía\b/,
            /\bsensacion de\b/,
            /\bsensación de\b/,
            /\batmosfera\b/,
            /\batmósfera\b/

        ];

        const humana = [

            /\bquienes (?:lo )?habitan\b/,
            /\bquien habita\b/,
            /\blas personas\b/,
            /\bla familia\b/,
            /\bhabitantes\b/,
            /\bvida cotidiana\b/,
            /\brutina cotidiana\b/,
            /\bdia a dia\b/,
            /\bdía a día\b/,
            /\bdescanso\b/,
            /\bcompartir\b/,
            /\breunirse\b/,
            /\bvivir\b/,
            /\bhabitar\b/,
            /\bhabita\b/,
            /\bhabitan\b/,
            /\buso cotidiano\b/,
            /\buso diario\b/

        ];

        const cuentaPatrones = patrones =>
            patrones.filter(patron => patron.test(texto)).length;

        const nAntes = cuentaPatrones(antes);
        const nTransformacion = cuentaPatrones(transformacion);
        const nDespues = cuentaPatrones(despues);
        const nHumana = cuentaPatrones(humana);

        // --------------------------------------------------
        // ANCLAS DEL PROYECTO
        // --------------------------------------------------

        const contexto = this.extraerContexto(proyecto);

        const anclasEncontradas = contexto.filter(
            anchor =>
                anchor.length >= 4 &&
                texto.toLowerCase().includes(anchor.toLowerCase())
        );

        const anclasUnicas = [...new Set(anclasEncontradas)];

        // --------------------------------------------------
        // PUNTO DE PARTIDA
        // --------------------------------------------------

        /*
         * El punto de partida no debe depender exclusivamente
         * de palabras como "antes".
         *
         * Se acepta:
         *
         * 1. señal explícita
         *
         * o
         *
         * 2. transformación + experiencia humana +
         *    dos anclas comprobables.
         */

        const respaldoEstructural =
            nTransformacion > 0 &&
            nHumana > 0 &&
            anclasUnicas.length >= 2;

        const puntoPartidaValido =
            nAntes > 0 ||
            respaldoEstructural;

        registrar(
            "narrativa.punto_partida",
            puntoPartidaValido,
            puntoPartidaValido
                ? (
                    nAntes > 0
                        ? "Existe señal explícita del punto de partida."
                        : "El punto de partida queda sustentado por la estructura narrativa, la experiencia humana y las anclas comprobables del proyecto."
                )
                : "Falta una condición inicial o una estructura narrativa suficiente para inferir el punto de partida.",
            {
                senales: nAntes,
                respaldoEstructural,
                anclasContextuales: anclasUnicas.length
            }
        );

        // --------------------------------------------------
        // TRANSFORMACIÓN
        // --------------------------------------------------

        registrar(
            "narrativa.transformacion",
            nTransformacion > 0,
            nTransformacion > 0
                ? "Existe señal de transformación o respuesta de diseño."
                : "Falta una transformación o respuesta de diseño reconocible.",
            {
                senales: nTransformacion
            }
        );

        // --------------------------------------------------
        // ESTADO POSTERIOR
        // --------------------------------------------------

        /*
         * La validación sigue siendo obligatoria.
         *
         * Lo que cambia es la definición de señal válida:
         * ahora reconoce resultados espaciales, perceptuales
         * y funcionales, no solamente marcadores temporales.
         */

        registrar(
            "narrativa.estado_posterior",
            nDespues > 0,
            nDespues > 0
                ? "Existe señal de estado posterior o nueva experiencia."
                : "Falta una señal clara del estado posterior.",
            {
                senales: nDespues
            }
        );

        // --------------------------------------------------
        // EXPERIENCIA HUMANA
        // --------------------------------------------------

        registrar(
            "narrativa.experiencia_humana",
            nHumana > 0,
            nHumana > 0
                ? "Existe referencia a personas o experiencia de habitar."
                : "Falta una referencia suficiente a personas, vida cotidiana o habitar.",
            {
                senales: nHumana
            }
        );

        // --------------------------------------------------
        // ESPECIFICIDAD
        // --------------------------------------------------

        registrar(
            "contexto.especificidad",
            anclasUnicas.length >= 2,
            anclasUnicas.length >= 2
                ? "La historia contiene anclas comprobables del proyecto."
                : "La historia contiene pocas anclas comprobables del proyecto y puede resultar intercambiable.",
            {
                anclasEncontradas: anclasUnicas.slice(0, 12),
                total: anclasUnicas.length
            }
        );

        // --------------------------------------------------
        // INVENTARIO
        // --------------------------------------------------

        const inventario = [

            {
                id: "punto_partida",
                senales: nAntes
            },

            {
                id: "transformacion",
                senales: nTransformacion
            },

            {
                id: "estado_posterior",
                senales: nDespues
            },

            {
                id: "experiencia_humana",
                senales: nHumana
            },

            {
                id: "anclas_contextuales",
                senales: anclasUnicas.length
            }

        ];

        metricas.senales = {
            antes: nAntes,
            transformacion: nTransformacion,
            despues: nDespues,
            humana: nHumana
        };

        metricas.anclasContextuales = anclasUnicas.length;

        return {
            aprobado: errores.length === 0,
            errores,
            advertencias,
            metricas,
            inventario
        };

    }

}

module.exports = ValidadorHistoriaV2;