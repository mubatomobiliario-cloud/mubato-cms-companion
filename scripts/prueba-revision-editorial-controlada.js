const RevisorHistoria = require("../src/direccionEditorial/revisorHistoria");
const ValidadorHistoria = require("../src/direccionEditorial/validadorHistoria");
const OpenAIClient = require("../src/direccionEditorial/openAIClient");

const contextoEditorial = {
    // En Araque NO existe documentación histórica suficiente del "antes".
    transformacionDocumentada: false,
    puntoDePartida: "Habitación residencial con zona de descanso, almacenamiento, tecnología, iluminación natural y elementos de apoyo integrados en una composición contemporánea.",
    intencion: "No documentada de forma explícita.",
    transformacion: "La intervención organiza descanso, almacenamiento, tecnología, circulación, materialidad e iluminación dentro de una composición más coherente.",
    nuevaManeraDeHabitar: "El espacio se percibe más ordenado, cálido, legible y adecuado para la vida cotidiana y el descanso.",
    evidencia: [
        "La galería muestra una zona de descanso con cabecero y paneles.",
        "Se observa mobiliario suspendido y superficies de almacenamiento integradas.",
        "La habitación incorpora luz natural regulable mediante persianas.",
        "La iluminación artificial acompaña distintos momentos de uso.",
        "La composición combina madera, piedra, vidrio y metal sin que el relato deba convertirlos en inventario."
    ],
    restricciones: [
        "No afirmar cuál era la situación anterior si no está documentada.",
        "No atribuir necesidades o deseos al cliente sin evidencia.",
        "No presentar la galería ni el expediente como parte de la narración publicada."
    ]
};

const historiaOriginal = `En Hogar Araque, el expediente no registra una necesidad declarada por el cliente, por lo que la lectura del proyecto parte de lo que el espacio revela: una intervención residencial en Bogotá donde el diseño se concentra en construir una atmósfera de calma, orden y calidez. La presencia de cama, cabecero, mesas de noche, armario, repisas, gabinete y mueble suspendido permite reconocer un ambiente íntimo, asociado al descanso y a la vida cotidiana dentro del hogar.

La lógica de diseño se apoya en una composición contemporánea, serena y contenida. Los tonos blanco, beige, gris, marrón y negro establecen una base visual equilibrada, sin contrastes excesivos. La madera natural aporta cercanía y temperatura; el mármol, la piedra, el vidrio y el metal introducen precisión y estructura. Estos materiales no aparecen como protagonistas aislados, sino como recursos para ordenar el espacio y darle una lectura más integrada.

El mobiliario parece responder a una intención de continuidad visual y funcionalidad. El mueble suspendido libera la percepción del piso y ayuda a que el ambiente se sienta más liviano. Las repisas y gabinetes ofrecen superficies de apoyo y almacenamiento sin recargar la composición. El cabecero y los paneles enmarcan la zona de descanso, creando un punto de referencia claro dentro del espacio. Cada elemento ocupa un lugar definido, lo que contribuye a una experiencia más tranquila y legible.

La iluminación mixta refuerza esa sensación. La entrada de luz por la ventana, acompañada por persianas, permite graduar la relación con el exterior. La lámpara y los puntos de luz complementarios aportan una escala más íntima, adecuada para distintos momentos del día. Así, el espacio no depende de una sola fuente lumínica, sino que ofrece posibilidades de uso más flexibles y confortables.

La transformación se percibe en la manera como los elementos construyen una atmósfera coherente. No se trata únicamente de incorporar mobiliario o acabados, sino de establecer una relación más armónica entre descanso, almacenamiento, tecnología y circulación. La cama, el televisor, el control remoto, los interruptores y las superficies de apoyo hacen parte de una vida diaria que el diseño organiza con discreción.

El resultado es un espacio residencial que transmite calma sin perder carácter. La experiencia de habitarlo mejora porque cada decisión favorece el orden, la comodidad visual y la sensación de refugio. Hogar Araque muestra cómo una intervención medida puede transformar un ambiente cotidiano en un lugar más claro, cálido y funcional para vivirlo.`;

async function ejecutar() {
    const validador = new ValidadorHistoria();
    const revisor = new RevisorHistoria();
    const openAI = new OpenAIClient();

    const validacionInicial = validador.validar(historiaOriginal, contextoEditorial);
    if (validacionInicial.aprobado) {
        throw new Error("La historia original ya fue aprobada; no corresponde ejecutar revisión.");
    }

    const prompt = revisor.construirPrompt(
        historiaOriginal,
        validacionInicial,
        contextoEditorial
    );

    console.log("======================================");
    console.log("REVISIÓN EDITORIAL CONTEXTUAL — HOGAR ARAQUE");
    console.log("======================================\n");
    console.log(`Validación inicial: ${validacionInicial.estado}`);
    console.log(`Modo editorial: ${validacionInicial.metricas.modo}`);
    console.log(`Transformación documentada: ${contextoEditorial.transformacionDocumentada ? "SÍ" : "NO"}`);
    console.log("IA: 1 llamada máxima");
    console.log("CSV/Wix: NO");
    console.log("\nGENERANDO REVISIÓN...\n");

    const historiaRevisada = (await openAI.generarTexto(prompt)).trim();
    const validacionFinal = validador.validar(historiaRevisada, contextoEditorial);

    console.log("======================================");
    console.log("HISTORIA REVISADA");
    console.log("======================================\n");
    console.log(historiaRevisada);

    console.log("\n======================================");
    console.log("VALIDACIÓN FINAL");
    console.log("======================================\n");
    console.log(JSON.stringify(validacionFinal, null, 2));

    console.log("\n======================================");
    console.log("RESULTADO");
    console.log("======================================\n");
    console.log(JSON.stringify({
        estadoInicial: validacionInicial.estado,
        estadoFinal: validacionFinal.estado,
        modo: validacionFinal.metricas.modo,
        aprobada: validacionFinal.aprobado,
        palabrasOriginal: validacionInicial.metricas.palabras,
        palabrasRevisada: validacionFinal.metricas.palabras,
        inventarioOriginal: validacionInicial.metricas.inventarioDetectado.length,
        inventarioRevisada: validacionFinal.metricas.inventarioDetectado.length,
        lenguajeMetaOriginal: validacionInicial.metricas.lenguajeMetaDetectado.length,
        lenguajeMetaRevisada: validacionFinal.metricas.lenguajeMetaDetectado.length,
        llamadasIA: 1,
        originalModificado: false
    }, null, 2));

    console.log("\nCSV/Wix: NO SE ACTUALIZAN");
}

ejecutar().catch(error => {
    console.error("\n======================================");
    console.error("ERROR EN LA REVISIÓN EDITORIAL");
    console.error("======================================\n");
    console.error(error);
    process.exit(1);
});
