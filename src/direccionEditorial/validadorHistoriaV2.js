console.log("validadorHistoriaV2.js cargado");

/**
 * Validador Editorial de Historias MUBATO V2.
 *
 * Evolución de V1:
 * - No decide por una lista plana de palabras prohibidas.
 * - Evalúa reglas editoriales sobre estructura, función del lenguaje,
 *   contexto narrativo, densidad de inventario y señales de publicación.
 * - Devuelve evidencia por regla para facilitar diagnóstico y evolución.
 *
 * El validador sigue siendo determinista y no utiliza IA.
 */
class ValidadorHistoriaV2 {
    constructor() {
        this.reglas = [
            { id: "estructura.longitud", severidad: "error" },
            { id: "estructura.parrafo", severidad: "error" },
            { id: "voz.meta", severidad: "error" },
            { id: "voz.llamado_accion", severidad: "error" },
            { id: "voz.publicidad", severidad: "error" },
            { id: "narrativa.punto_partida", severidad: "error" },
            { id: "narrativa.transformacion", severidad: "error" },
            { id: "narrativa.estado_posterior", severidad: "error" },
            { id: "narrativa.experiencia_humana", severidad: "error" },
            { id: "contexto.especificidad", severidad: "error" },
            { id: "contexto.inventario", severidad: "warning" },
            { id: "marca.repeticion", severidad: "warning" }
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

    contiene(texto, expresion) {
        return expresion.test(texto);
    }

    coincidencias(texto, expresiones) {
        return expresiones
            .filter(({ id, regex }) => this.contiene(texto, regex))
            .map(({ id }) => id);
    }

    frases(texto) {
        return String(texto || "")
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(Boolean);
    }

    extraerContexto(proyecto = {}) {
        const valores = [
            proyecto.nombre,
            proyecto.ciudad,
            ...(Array.isArray(proyecto.espacios) ? proyecto.espacios : []),
            ...(Array.isArray(proyecto.servicios) ? proyecto.servicios : []),
            proyecto.descripcion
        ];

        return valores
            .filter(Boolean)
            .flatMap(valor => String(valor).split(/[,;|]/))
            .map(valor => this.normalizar(valor))
            .map(valor => valor.replace(/\s+/g, " ").trim())
            .filter(valor => valor.length >= 4 && !["sin informacion", "pendiente"].includes(valor));
    }

    evaluar(historia, proyecto = {}) {
        const original = String(historia || "").trim();
        const texto = this.normalizar(original);
        const errores = [];
        const advertencias = [];
        const evidencia = {};

        const registrar = (id, ok, mensaje, datos = {}) => {
            evidencia[id] = { ok, mensaje, ...datos };
            if (!ok) {
                const regla = this.reglas.find(r => r.id === id);
                const destino = regla?.severidad === "warning" ? advertencias : errores;
                destino.push({ regla: id, mensaje, evidencia: datos });
            }
        };

        const palabras = this.contarPalabras(original);
        const parrafos = this.contarParrafos(original);
        registrar(
            "estructura.longitud",
            palabras >= 250 && palabras <= 500,
            palabras >= 250 && palabras <= 500
                ? "Longitud dentro del contrato."
                : `La historia tiene ${palabras} palabras; el contrato exige entre 250 y 500.`,
            { palabras }
        );
        registrar(
            "estructura.parrafo",
            parrafos === 1,
            parrafos === 1
                ? "La historia contiene exactamente un párrafo."
                : `La historia contiene ${parrafos} párrafos; el contrato exige exactamente uno.`,
            { parrafos }
        );

        const metaPatterns = [
            { id: "fuente_expediente", regex: /\b(?:el|segun el|de acuerdo con el) expediente\b/ },
            { id: "fuente_contexto", regex: /\b(?:contexto suministrado|contexto del proyecto|datos disponibles|informacion proporcionada)\b/ },
            { id: "fuente_registro", regex: /\b(?:el registro|el archivo) (?:indica|señala|registra)\b/ },
            { id: "fuente_fotografia", regex: /\b(?:la|las) fotograf(?:ia|ias) (?:muestra|muestran|evidencia|evidencian)\b/ },
            { id: "fuente_observacion", regex: /\b(?:las observaciones|la observacion visual)\b/ },
            { id: "fuente_informacion", regex: /\bno se (?:dispone|registra) de (?:informacion|datos)\b/ }
        ];
        const meta = this.coincidencias(texto, metaPatterns);
        registrar(
            "voz.meta",
            meta.length === 0,
            meta.length === 0
                ? "No se detecta lenguaje meta sobre la fuente de información."
                : "La historia habla del proceso de documentación o de sus fuentes en lugar de narrar el proyecto.",
            { coincidencias: meta }
        );

        const ctaPatterns = [
            { id: "imperativo_aprovecha", regex: /\baprovecha\s+(?:esta|la|tu|una)\b/ },
            { id: "imperativo_conoce", regex: /\bconoce\s+(?:mas|más|nuestro|nuestra|este|esta|el|la)\b/ },
            { id: "imperativo_descubre", regex: /\bdescubre\s+(?:mas|más|nuestro|nuestra|este|esta|el|la)\b/ },
            { id: "contacto", regex: /\b(?:contáctanos|contactanos|escribenos|escríbenos|agenda\s+(?:una|tu)\s+cita|solicita\s+(?:una|tu)\s+asesoria|solicita\s+(?:una|tu)\s+asesoría|cotiza)\b/ },
            { id: "destinatario_directo", regex: /\b(?:tu|tus|te|contigo)\b\s+(?:espacio|hogar|proyecto|diseño|diseno)\b/ }
        ];
        const cta = this.coincidencias(texto, ctaPatterns);
        registrar(
            "voz.llamado_accion",
            cta.length === 0,
            cta.length === 0
                ? "No se detecta llamado comercial a la acción."
                : "Se detecta lenguaje orientado a convertir al lector en destinatario comercial.",
            { coincidencias: cta }
        );

        const publicidad = [
            { id: "promesa_absoluta", regex: /\b(?:la mejor|el mejor|sin igual|inigualable|insuperable)\b/ },
            { id: "hiperbole_comercial", regex: /\b(?:increible|increíble|espectacular|extraordinario|extraordinaria|perfecto|perfecta|impecable|lujo|lujoso|lujosa|exclusivo|exclusiva|premium|fascinante)\b/ },
            { id: "slogan", regex: /\b(?:hacemos realidad tus sueños|espacios de ensueño|creamos magia|marcamos la diferencia)\b/ }
        ];
        const publicitarias = this.coincidencias(texto, publicidad);
        registrar(
            "voz.publicidad",
            publicitarias.length === 0,
            publicitarias.length === 0
                ? "No se detectan construcciones publicitarias evidentes."
                : "Se detectan afirmaciones o fórmulas de publicidad que desvían la voz editorial.",
            { coincidencias: publicitarias }
        );

        // El punto de partida puede expresarse de muchas formas legítimas.
        // No debe depender únicamente de palabras como “antes”, “necesitaba” o “reto”.
        // Se reconocen construcciones descriptivas de estado inicial, condición,
        // carencia, intención funcional y situación espacial comprobable.
        const antes = [
            /\bantes\b/,
            /\bpartia\b/,
            /\bpartia de\b/,
            /\bse encontraba\b/,
            /\bse encontraba en\b/,
            /\bestaba\b/,
            /\bera\b/,
            /\btenia\b/,
            /\bcontaba con\b/,
            /\bpresentaba\b/,
            /\balbergaba\b/,
            /\bdisponia de\b/,
            /\bcarecia de\b/,
            /\bno contaba con\b/,
            /\bno disponia de\b/,
            /\bno permitia\b/,
            /\blimitaba\b/,
            /\bdificultad\b/,
            /\bproblema\b/,
            /\breto\b/,
            /\bdesafio\b/,
            /\bcondicion inicial\b/,
            /\bsituacion inicial\b/,
            /\bbuscaba\b/,
            /\bqueria\b/,
            /\brequeria\b/,
            /\bnecesitaba\b/,
            /\bnecesidad(?:es)?\b/,
            /\bplanteaba\b/
        ];
        const transformacion = [
            /\btransform\w*\b/, /\breorganiz\w*\b/, /\bintegr\w*\b/, /\brediseñ\w*\b/, /\bredisen\w*\b/, /\bconvirt\w*\b/, /\bevolucion\w*\b/, /\barticul\w*\b/, /\brespond\w*\b/
        ];
        const despues = [
            /\bhoy\b/, /\bahora\b/, /\bdesde entonces\b/, /\bse vive\b/, /\bse habita\b/, /\bpermite\b/, /\bacompañ\w*\b/, /\bmejor\w*\b/, /\bnueva (?:forma|manera) de habitar\b/, /\bvida cotidiana\b/
        ];
        const humana = [
            /\bquienes (?:lo )?habitan\b/, /\bquien habita\b/, /\blas personas\b/, /\bla familia\b/, /\bhabitantes\b/, /\bvida cotidiana\b/, /\brutina cotidiana\b/, /\bdia a dia\b/, /\bdescanso\b/, /\bcompartir\b/, /\breunirse\b/, /\bvivir\b/, /\bhabitar\b/
        ];

        const cuentaPatrones = patrones => patrones.filter(p => p.test(texto)).length;
        const nAntes = cuentaPatrones(antes);
        const nTransformacion = cuentaPatrones(transformacion);
        const nDespues = cuentaPatrones(despues);
        const nHumana = cuentaPatrones(humana);

        registrar("narrativa.punto_partida", nAntes > 0, nAntes > 0 ? "Existe señal del punto de partida." : "Falta una condición inicial o intención funcional reconocible.", { senales: nAntes });
        registrar("narrativa.transformacion", nTransformacion > 0, nTransformacion > 0 ? "Existe señal de transformación o respuesta de diseño." : "Falta una transformación o respuesta de diseño reconocible.", { senales: nTransformacion });
        registrar("narrativa.estado_posterior", nDespues > 0, nDespues > 0 ? "Existe señal de estado posterior o nueva experiencia." : "Falta una señal clara del estado posterior.", { senales: nDespues });
        registrar("narrativa.experiencia_humana", nHumana > 0, nHumana > 0 ? "Existe referencia a personas o experiencia de habitar." : "Falta una referencia suficiente a personas, vida cotidiana o habitar.", { senales: nHumana });

        const contexto = this.extraerContexto(proyecto);
        const anclasEncontradas = contexto.filter(anchor => anchor.length >= 4 && texto.includes(anchor));
        const anclasUnicas = [...new Set(anclasEncontradas)];
        registrar(
            "contexto.especificidad",
            anclasUnicas.length >= 2,
            anclasUnicas.length >= 2
                ? "La historia contiene anclas comprobables del proyecto."
                : "La historia contiene pocas anclas comprobables del proyecto y puede resultar intercambiable.",
            { anclasEncontradas: anclasUnicas.slice(0, 12), total: anclasUnicas.length }
        );

        const inventario = [
            /\bmueble(?:s)?\b/, /\bcama\b/, /\bcabecero\b/, /\barmario\b/, /\bgabinete\b/, /\brepisa(?:s)?\b/, /\bmesa de noche\b/, /\bmadera\b/, /\bmarmol\b/, /\bpiedra\b/, /\bvidrio\b/, /\bmetal\b/, /\btextil\b/, /\biluminacion\b/, /\blampara\b/
        ];
        const inventarioEncontrado = inventario.filter(p => p.test(texto)).length;
        const frasesConInventario = this.frases(original).filter(frase => {
            const f = this.normalizar(frase);
            return inventario.filter(p => p.test(f)).length >= 2;
        }).length;
        registrar(
            "contexto.inventario",
            inventarioEncontrado < 6 && frasesConInventario < 2,
            inventarioEncontrado < 6 && frasesConInventario < 2
                ? "La densidad de objetos/materiales no domina la narración."
                : "La narración presenta alta densidad de objetos/materiales; revisar que funcionen como evidencia y no como inventario.",
            { terminos: inventarioEncontrado, frasesConInventario }
        );

        const mubato = (texto.match(/\bmubato\b/g) || []).length;
        registrar(
            "marca.repeticion",
            mubato <= 1,
            mubato <= 1
                ? "La marca no se repite innecesariamente."
                : "MUBATO aparece más de una vez; revisar protagonismo de la marca.",
            { menciones: mubato }
        );

        return {
            aprobado: errores.length === 0,
            estado: errores.length === 0 ? "APROBADA_CON_REVISION_HUMANA" : "REVISAR",
            reglas: this.reglas,
            metricas: {
                palabras,
                parrafos,
                anclasContextuales: anclasUnicas.length,
                llamadasAccion: cta.length,
                lenguajeMeta: meta.length,
                publicidad: publicitarias.length,
                densidadInventario: inventarioEncontrado
            },
            errores,
            advertencias,
            evidencia
        };
    }

    validar(historia, proyecto = {}) {
        return this.evaluar(historia, proyecto);
    }
}

module.exports = ValidadorHistoriaV2;
