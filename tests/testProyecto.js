const Proyecto = require("./proyecto");
const Fotografia = require("./fotografia");

console.log("========== TEST DEL PROYECTO ==========");

const proyecto = new Proyecto();

proyecto.codigo = "MUB-001";
proyecto.nombre = "Hogar Tijo";

const hero = new Fotografia();
hero.nombre = "hero.jpg";

const cocina = new Fotografia();
cocina.nombre = "cocina.jpg";

const sala = new Fotografia();
sala.nombre = "sala.jpg";

proyecto.agregarFotografia(hero);
proyecto.agregarFotografia(cocina);
proyecto.agregarFotografia(sala);

proyecto.definirHero(hero);

proyecto.agregarGaleria(cocina);
proyecto.agregarGaleria(sala);

console.log(proyecto);

console.log("Hero:", proyecto.obtenerHero().nombre);

console.log("Galería:", proyecto.obtenerGaleria().length);

console.log("Fotografías:", proyecto.cantidadFotografias());