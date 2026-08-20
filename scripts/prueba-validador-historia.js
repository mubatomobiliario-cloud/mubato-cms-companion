const ValidadorHistoria = require("../src/direccionEditorial/validadorHistoria");

const historiaAraque = `En Hogar Araque, el expediente no registra una necesidad declarada por el cliente, por lo que la lectura del proyecto parte de lo que el espacio revela: una intervención residencial en Bogotá donde el diseño se concentra en construir una atmósfera de calma, orden y calidez. La presencia de cama, cabecero, mesas de noche, armario, repisas, gabinete y mueble suspendido permite reconocer un ambiente íntimo, asociado al descanso y a la vida cotidiana dentro del hogar.

La lógica de diseño se apoya en una composición contemporánea, serena y contenida. Los tonos blanco, beige, gris, marrón y negro establecen una base visual equilibrada, sin contrastes excesivos. La madera natural aporta cercanía y temperatura; el mármol, la piedra, el vidrio y el metal introducen precisión y estructura. Estos materiales no aparecen como protagonistas aislados, sino como recursos para ordenar el espacio y darle una lectura más integrada.

El mobiliario parece responder a una intención de continuidad visual y funcionalidad. El mueble suspendido libera la percepción del piso y ayuda a que el ambiente se sienta más liviano. Las repisas y gabinetes ofrecen superficies de apoyo y almacenamiento sin recargar la composición. El cabecero y los paneles enmarcan la zona de descanso, creando un punto de referencia claro dentro del espacio. Cada elemento ocupa un lugar definido, lo que contribuye a una experiencia más tranquila y legible.

La iluminación mixta refuerza esa sensación. La entrada de luz por la ventana, acompañada por persianas, permite graduar la relación con el exterior. La lámpara y los puntos de luz complementarios aportan una escala más íntima, adecuada para distintos momentos del día. Así, el espacio no depende de una sola fuente lumínica, sino que ofrece posibilidades de uso más flexibles y confortables.

La transformación se percibe en la manera como los elementos construyen una atmósfera coherente. No se trata únicamente de incorporar mobiliario o acabados, sino de establecer una relación más armónica entre descanso, almacenamiento, tecnología y circulación. La cama, el televisor, el control remoto, los interruptores y las superficies de apoyo hacen parte de una vida diaria que el diseño organiza con discreción.

El resultado es un espacio residencial que transmite calma sin perder carácter. La experiencia de habitarlo mejora porque cada decisión favorece el orden, la comodidad visual y la sensación de refugio. Hogar Araque muestra cómo una intervención medida puede transformar un ambiente cotidiano en un lugar más claro, cálido y funcional para vivirlo.`;

const historiaValida = `Cada día, el dormitorio necesitaba acompañar mejor los momentos de descanso y las rutinas que ocurrían a su alrededor. La vida cotidiana pedía un lugar más sereno, donde guardar lo necesario, descansar y moverse por el espacio no implicara competir con aquello que debía permanecer en orden.

La intención fue recuperar esa calma sin separar la funcionalidad de la experiencia. El diseño organiza el ambiente para que cada actividad encuentre su lugar y para que la habitación pueda sentirse acogedora durante distintos momentos del día.

La transformación aparece en una composición más clara y contenida. El almacenamiento se integra sin interrumpir la lectura del espacio, la luz acompaña el descanso y las superficies de apoyo permiten resolver las necesidades cotidianas con discreción. Cada decisión responde a una forma concreta de vivir el dormitorio.

Ahora el espacio se percibe más tranquilo y habitable. Las rutinas encuentran un orden natural y el descanso deja de competir con aquello que antes generaba ruido visual. La habitación no busca llamar la atención: acompaña, recibe y permite vivirla con mayor serenidad.

Al comenzar y terminar el día, el ambiente ofrece una relación más sencilla con las actividades que ocurren en él. El descanso encuentra continuidad, guardar y encontrar lo necesario resulta más natural y la circulación deja de sentirse condicionada por el desorden. La transformación se reconoce menos en un elemento aislado que en la tranquilidad con la que el espacio responde a quienes lo habitan.

Esa continuidad también permite que el dormitorio conserve una lectura serena cuando cambian las actividades. La organización facilita pequeñas rutinas sin convertirlas en una secuencia de obstáculos, y la atmósfera mantiene una relación equilibrada entre privacidad, descanso y funcionalidad. El espacio deja de depender de una única forma de uso y puede acompañar distintos momentos con la misma claridad.`;

function ejecutar() {
    const validador = new ValidadorHistoria();

    console.log("======================================");
    console.log("PRUEBA CONTROLADA — VALIDADOR DE HISTORIAS");
    console.log("======================================\n");

    console.log("CASO 1 — HOGAR ARAQUE — TRANSFORMACIÓN NO DOCUMENTADA\n");
    const resultadoAraque = validador.validar(historiaAraque, {
        transformacionDocumentada: false
    });
    console.log(JSON.stringify(resultadoAraque, null, 2));

    console.log("\n--------------------------------------\n");
    console.log("CASO 2 — HISTORIA DE CONTROL — TRANSFORMACIÓN DOCUMENTADA\n");
    const resultadoValido = validador.validar(historiaValida, {
        transformacionDocumentada: true
    });
    console.log(JSON.stringify(resultadoValido, null, 2));

    console.log("\n--------------------------------------\n");
    console.log("CASO 3 — REGRESIÓN — 'NECESIDADES' NO ES 'ANTES'\n");
    const resultadoRegresion = validador.contieneSenalAntes(
        validador.normalizar("El diseño responde a las necesidades cotidianas del espacio y acompaña el descanso.")
    );
    console.log(JSON.stringify({
        senalesAntesDetectadas: resultadoRegresion,
        esperado: []
    }, null, 2));

    if (resultadoRegresion.length !== 0) {
        throw new Error("REGRESIÓN FALLIDA: 'necesidades' fue detectado como señal de situación previa.");
    }

    console.log("✓ Regresión superada.");

    console.log("\n======================================");
    console.log("RESULTADO DE LA PRUEBA");
    console.log("======================================");
    console.log(`Araque: ${resultadoAraque.estado}`);
    console.log(`Modo Araque: ${resultadoAraque.metricas.modo}`);
    console.log(`Control: ${resultadoValido.estado}`);
    console.log(`Modo Control: ${resultadoValido.metricas.modo}`);
    console.log("Regresión: SUPERADA");
    console.log("IA utilizada: NO");
    console.log("======================================\n");
}

ejecutar();
