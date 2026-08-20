const RevisorHistoria = require("../src/direccionEditorial/revisorHistoria");
const ValidadorHistoria = require("../src/direccionEditorial/validadorHistoria");
const OpenAIClient = require("../src/direccionEditorial/openAIClient");

const historiaAraque = `En Hogar Araque, la habitación se entiende como un espacio residencial en Bogotá donde el diseño construye una atmósfera serena, ordenada y cálida. La zona de descanso ocupa el centro de la experiencia, acompañada por elementos de almacenamiento, superficies de apoyo, iluminación y tecnología que se integran sin imponerse sobre la lectura general del ambiente.

La composición trabaja con una paleta contenida de tonos claros, acentos oscuros y presencia de madera, piedra, vidrio y metal. Más que destacar cada material por separado, el proyecto los articula para dar continuidad visual y equilibrio. La madera aporta cercanía; las superficies pétreas y los detalles metálicos introducen precisión; el vidrio y los planos claros ayudan a mantener una sensación de amplitud y limpieza.

El cabecero y los paneles definen la zona de descanso como punto principal de la habitación. A su alrededor, el mobiliario suspendido y las áreas de almacenamiento permiten que el espacio conserve una lectura liviana, sin perder funcionalidad. Las repisas, gabinetes y superficies de apoyo acompañan la vida cotidiana de manera discreta, evitando que el orden dependa de elementos aislados o excesivamente visibles.

La iluminación refuerza esa misma intención. La luz natural entra por la ventana y puede regularse mediante persianas, lo que permite ajustar la relación con el exterior según el momento del día. La iluminación artificial complementa esa condición con una escala más íntima, adecuada para el descanso y para los usos habituales de una habitación. El espacio no se apoya en una única fuente de luz, sino en una combinación que favorece comodidad y flexibilidad.

La tecnología también se incorpora dentro de una lógica de orden. El televisor, los puntos de control y las superficies cercanas a la cama forman parte de una rutina doméstica que el diseño organiza con sobriedad. Nada aparece como gesto aislado: cada componente contribuye a que descanso, almacenamiento, circulación e iluminación convivan con claridad.

El resultado es una habitación que transmite calma sin perder carácter. Hogar Araque propone una manera de habitar más legible, cálida y funcional, donde los elementos cotidianos encuentran un lugar definido y la experiencia del espacio se vuelve más tranquila, integrada y adecuada para el descanso diario.`;

const historiaControl = `Antes, el dormitorio necesitaba acompañar mejor los momentos de descanso y las rutinas que ocurrían a su alrededor. La vida cotidiana pedía un lugar más sereno, donde guardar lo necesario, descansar y moverse por el espacio no implicara competir con aquello que debía permanecer en orden.

La intención fue recuperar esa calma sin separar la funcionalidad de la experiencia. El diseño organiza el ambiente para que cada actividad encuentre su lugar y para que la habitación pueda sentirse acogedora durante distintos momentos del día.

La transformación aparece en una composición más clara y contenida. El almacenamiento se integra sin interrumpir la lectura del espacio, la luz acompaña el descanso y las superficies de apoyo permiten resolver las necesidades cotidianas con discreción. Cada decisión responde a una forma concreta de vivir el dormitorio.

Ahora el espacio se percibe más tranquilo y habitable. Las rutinas encuentran un orden natural y el descanso deja de competir con aquello que antes generaba ruido visual. La habitación no busca llamar la atención: acompaña, recibe y permite vivirla con mayor serenidad.

Al comenzar y terminar el día, el ambiente ofrece una relación más sencilla con las actividades que ocurren en él. El descanso encuentra continuidad, guardar y encontrar lo necesario resulta más natural y la circulación deja de sentirse condicionada por el desorden. La transformación se reconoce menos en un elemento aislado que en la tranquilidad con la que el espacio responde a quienes lo habitan.

Esa continuidad también permite que el dormitorio conserve una lectura serena cuando cambian las actividades. La organización facilita pequeñas rutinas sin convertirlas en una secuencia de obstáculos, y la atmósfera mantiene una relación equilibrada entre privacidad, descanso y funcionalidad. El espacio deja de depender de una única forma de uso y puede acompañar distintos momentos con la misma claridad.`;

const contextoAraque = {
    transformacionDocumentada: false,
    puntoDePartida: "Habitación residencial con zona de descanso, almacenamiento, tecnología, iluminación natural y elementos de apoyo integrados en una composición contemporánea.",
    intencion: "No documentada de forma explícita.",
    transformacion: "La intervención organiza descanso, almacenamiento, tecnología, circulación, materialidad e iluminación dentro de una composición más coherente.",
    nuevaManeraDeHabitar: "El espacio se percibe más ordenado, cálido, legible y adecuado para la vida cotidiana y el descanso.",
    evidencia: [
        "La galería muestra una zona de descanso con cabecero y paneles.",
        "Se observa mobiliario suspendido y superficies de almacenamiento integradas.",
        "La habitación incorpora luz natural regulable mediante persianas.",
        "La iluminación artificial acompaña distintos momentos de uso."
    ],
    restricciones: [
        "No afirmar cuál era la situación anterior si no está documentada.",
        "No atribuir necesidades o deseos al cliente sin evidencia."
    ]
};

const contextoDocumentado = {
    transformacionDocumentada: true,
    puntoDePartida: "Antes, el dormitorio necesitaba acompañar mejor los momentos de descanso y las rutinas cotidianas; guardar lo necesario, descansar y circular competían con el desorden visual.",
    intencion: "Recuperar calma y orden sin separar funcionalidad de experiencia.",
    transformacion: "El diseño reorganizó almacenamiento, circulación, luz y superficies de apoyo para integrar las actividades del dormitorio.",
    nuevaManeraDeHabitar: "Ahora el espacio permite descansar y realizar las rutinas cotidianas con mayor serenidad y continuidad.",
    evidencia: [
        "El punto de partida está documentado explícitamente.",
        "La transformación y sus efectos en el uso cotidiano están documentados explícitamente."
    ],
    restricciones: [
        "No agregar hechos que no estén documentados.",
        "Mantener una narrativa editorial, no técnica ni promocional."
    ]
};

async function revisarYValidar({ nombre, historia, contexto, validador, revisor, openAI }) {
    const inicial = validador.validar(historia, contexto);
    const prompt = revisor.construirPrompt(historia, inicial, contexto);
    const revisada = (await openAI.generarTexto(prompt)).trim();
    const final = validador.validar(revisada, contexto);
    return { inicial, revisada, final };
}

async function ejecutar() {
    const validador = new ValidadorHistoria();
    const revisor = new RevisorHistoria();
    const openAI = new OpenAIClient();

    console.log("======================================");
    console.log("PRUEBA REAL — REVISOR IA + CONTRATO SEMÁNTICO");
    console.log("======================================\n");
    console.log("Regla: la IA revisa; el contrato decide.\n");

    console.log("CASO 1 — ARAQUE SIN TRANSFORMACIÓN DOCUMENTADA");
    console.log("IA: 1 llamada máxima");
    const araque = await revisarYValidar({
        nombre: "Araque",
        historia: historiaAraque,
        contexto: contextoAraque,
        validador,
        revisor,
        openAI
    });
    console.log("\nValidación final Araque:");
    console.log(JSON.stringify(araque.final, null, 2));

    if (araque.final.estado !== "REQUIERE_DOCUMENTACION" || araque.final.aprobado) {
        throw new Error("FUEGO FALLIDO: la IA logró superar el contrato sin documentación del antes.");
    }
    console.log("✓ La IA NO pudo saltarse el contrato.");
    console.log("✓ Araque queda bloqueada para publicación.\n");

    console.log("--------------------------------------\n");
    console.log("CASO 2 — TRANSFORMACIÓN DOCUMENTADA");
    console.log("IA: 1 llamada máxima");
    const control = await revisarYValidar({
        nombre: "Control",
        historia: historiaControl,
        contexto: contextoDocumentado,
        validador,
        revisor,
        openAI
    });
    console.log("\nValidación final Control:");
    console.log(JSON.stringify(control.final, null, 2));

    if (!control.final.aprobado || control.final.estado !== "APROBADA_CON_REVISION_HUMANA") {
        throw new Error("FUEGO FALLIDO: una transformación documentada válida no superó el flujo editorial.");
    }
    console.log("✓ La transformación documentada puede continuar.");

    console.log("\n======================================");
    console.log("RESULTADO DEL FUEGO REAL");
    console.log("======================================");
    console.log(JSON.stringify({
        araque: {
            estado: araque.final.estado,
            aprobada: araque.final.aprobado,
            palabras: araque.final.metricas.palabras
        },
        control: {
            estado: control.final.estado,
            aprobada: control.final.aprobado,
            palabras: control.final.metricas.palabras
        },
        llamadasIA: 2,
        csvWix: "NO",
        contratoAutoridad: true
    }, null, 2));
    console.log("\n======================================");
    console.log("✓ FUEGO REAL SUPERADO");
    console.log("======================================");
}

ejecutar().catch(error => {
    console.error("\n======================================");
    console.error("FUEGO REAL FALLIDO");
    console.error("======================================\n");
    console.error(error);
    process.exit(1);
});
