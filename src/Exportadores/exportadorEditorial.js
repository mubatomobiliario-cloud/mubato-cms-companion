console.log("******** EXPORTADOR EJECUTÁNDOSE ********");
console.log("exportadorEditorial.js cargado");

const fs = require("fs");
const path = require("path");

class ExportadorEditorial {

    exportar(proyecto) {

        console.log("");
        console.log("======================================");
        console.log("EXPORTANDO EXPEDIENTE EDITORIAL");
        console.log("======================================");
        console.log("");

        let texto = "";

        texto += "==================================================\n";
        texto += "EXPEDIENTE EDITORIAL MUBATO\n";
        texto += "==================================================\n\n";

        texto += `Proyecto : ${proyecto.nombre}\n`;
        texto += `Cliente  : ${proyecto.cliente}\n`;
        texto += `Ciudad   : ${proyecto.ciudad}\n`;
        texto += `Categoría: ${proyecto.categoria}\n`;
        texto += `Fotografías: ${proyecto.fotografias.length}\n\n`;

        texto += "--------------------------------------------------\n";
        texto += "HERO\n";
        texto += "--------------------------------------------------\n\n";

        texto += proyecto.hero + "\n\n";

        texto += "--------------------------------------------------\n";
        texto += "EXPEDIENTE\n";
        texto += "--------------------------------------------------\n\n";

        texto += JSON.stringify(

            proyecto.expediente,

            null,

            4

        );

        texto += "\n\n";

        texto += "--------------------------------------------------\n";
        texto += "FOTOGRAFÍAS\n";
        texto += "--------------------------------------------------\n\n";

        proyecto.fotografias.forEach((foto, i) => {

            texto += `${i + 1}. ${foto.nombre}\n`;
            texto += `   Espacio      : ${foto.espacio}\n`;
            texto += `   Plano        : ${foto.plano}\n`;
            texto += `   Estilo       : ${foto.estilo}\n`;
            texto += `   Iluminación  : ${foto.iluminacion}\n`;
            texto += `   Sensación    : ${foto.sensacion}\n`;
            texto += "\n";

        });

        const archivo = path.join(

            proyecto.rutaProyecto,

            "Expediente Editorial.txt"

        );

        fs.writeFileSync(

            archivo,

            texto,

            "utf8"

        );

        console.log("✓ Expediente exportado.");
        console.log(archivo);
        console.log("");

    }

}

module.exports = ExportadorEditorial;