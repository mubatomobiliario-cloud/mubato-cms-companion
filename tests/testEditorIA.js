const path = require("path");

const Parser = require("../src/core/parser");
const EditorIA = require("../src/core/editorIA");

const parser = new Parser();

const editor = new EditorIA();

const carpeta = path.join(
    __dirname,
    "..",
    "Proyectos",
    "Andrés Giraldo"
);

const proyecto = parser.importarCarpeta(carpeta);

editor.analizar(proyecto);