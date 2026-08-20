const RevisorHistoria = require("../src/direccionEditorial/revisorHistoria");
const ValidadorHistoria = require("../src/direccionEditorial/validadorHistoria");

const historiaAraque = `En Hogar Araque, el expediente no registra una necesidad declarada por el cliente, por lo que la lectura del proyecto parte de lo que el espacio revela: una intervención residencial en Bogotá donde el diseño se concentra en construir una atmósfera de calma, orden y calidez. La presencia de cama, cabecero, mesas de noche, armario, repisas, gabinete y mueble suspendido permite reconocer un ambiente íntimo, asociado al descanso y a la vida cotidiana dentro del hogar.

La lógica de diseño se apoya en una composición contemporánea, serena y contenida. Los tonos blanco, beige, gris, marrón y negro establecen una base visual equilibrada, sin contrastes excesivos. La madera natural aporta cercanía y temperatura; el mármol, la piedra, el vidrio y el metal introducen precisión y estructura. Estos materiales no aparecen como protagonistas aislados, sino como recursos para ordenar el espacio y darle una lectura más integrada.

El mobiliario parece responder a una intención de continuidad visual y funcionalidad. El mueble suspendido libera la percepción del piso y ayuda a que el ambiente se sienta más liviano. Las repisas y gabinetes ofrecen superficies de apoyo y almacenamiento sin recargar la composición. El cabecero y los paneles enmarcan la zona de descanso, creando un punto de referencia claro dentro del espacio. Cada elemento ocupa un lugar definido, lo que contribuye a una experiencia más tranquila y legible.

La iluminación mixta refuerza esa sensación. La entrada de luz por la ventana, acompañada por persianas, permite graduar la relación con el exterior. La lámpara y los puntos de luz complementarios aportan una escala más íntima, adecuada para distintos momentos del día. Así, el espacio no depende de una sola fuente lumínica, sino que ofrece posibilidades de uso más flexibles y confortables.

La transformación se percibe en la manera como los elementos construyen una atmósfera coherente. No se trata únicamente de incorporar mobiliario o acabados, sino de establecer una relación más armónica entre descanso, almacenamiento, tecnología y circulación. La cama, el televisor, el control remoto, los interruptores y las superficies de apoyo hacen parte de una vida diaria que el diseño organiza con discreción.

El resultado es un espacio residencial que transmite calma sin perder carácter. La experiencia de habitarlo mejora porque cada decisión favorece el orden, la comodidad visual y la sensación de refugio. Hogar Araque muestra cómo una intervención medida puede transformar un ambiente cotidiano en un lugar más claro, cálido y funcional para vivirlo.`;

function ejecutar() {
    const validador = new ValidadorHistoria();
    const revisor = new RevisorHistoria();
    const validacion = validador.validar(historiaAraque);
    const brief = revisor.construirBrief(historiaAraque, validacion);
    const prompt = revisor.construirPrompt(historiaAraque, validacion);

    console.log("======================================");
    console.log("PRUEBA CONTROLADA — REVISOR DE HISTORIA");
    console.log("======================================\n");
    console.log(`Estado inicial: ${validacion.estado}`);
    console.log(`Errores transferidos: ${brief.errores.length}`);
    console.log(`Advertencias transferidas: ${brief.advertencias.length}`);
    console.log("\n--------------------------------------");
    console.log("BRIEF ESTRUCTURADO");
    console.log("--------------------------------------\n");
    console.log(JSON.stringify(brief, null, 2));
    console.log("\n--------------------------------------");
    console.log("PROMPT DE REVISIÓN");
    console.log("--------------------------------------\n");
    console.log(prompt);
    console.log("\n======================================");
    console.log("IA utilizada: NO");
    console.log("No se modifica CSV ni Wix.");
    console.log("======================================\n");
}

ejecutar();
