#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DOCS = [
    "docs/00_Estado/ESTADO_PROYECTO.md",
    "docs/00_Estado/MATRIZ_COMPONENTES.md",
    "docs/00_Estado/LEDGER_CONTINUIDAD.md"
];
const FORBIDDEN = "docs/04_Guías/Estado_Proyecto.md";
const START = "<!-- CONTINUIDAD_AUTO_START -->";
const END = "<!-- CONTINUIDAD_AUTO_END -->";

function run(command, args) {
    return execFileSync(command, args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function read(relative) {
    const file = path.join(ROOT, relative);
    if (!fs.existsSync(file)) throw new Error(`Falta documento canónico: ${relative}`);
    return fs.readFileSync(file, "utf8");
}

function replaceAutoBlock(text, block) {
    const start = text.indexOf(START);
    const end = text.indexOf(END);
    const rendered = `${START}\n${block}\n${END}`;
    if (start === -1 || end === -1 || end < start) return `${rendered}\n\n${text}`;
    return `${text.slice(0, start)}${rendered}${text.slice(end + END.length)}`;
}

function insertAfterHeading(text, heading, block) {
    const marker = `${START}\n${block}\n${END}`;
    const start = text.indexOf(START);
    const end = text.indexOf(END);
    if (start !== -1 && end !== -1 && end >= start) {
        return replaceAutoBlock(text, block);
    }
    const position = text.indexOf(heading);
    if (position === -1) throw new Error(`No se encontró el ancla documental: ${heading}`);
    const afterHeading = text.indexOf("\n", position) + 1;
    return `${text.slice(0, afterHeading)}\n${marker}\n${text.slice(afterHeading)}`;
}

function main() {
    console.log("======================================");
    console.log("MUBATO — CONTINUIDAD DOCUMENTAL");
    console.log("======================================\n");

    const state = read(DOCS[0]);
    const matrix = read(DOCS[1]);
    const ledger = read(DOCS[2]);

    if (fs.existsSync(path.join(ROOT, FORBIDDEN))) {
        throw new Error(`Existe una ruta de continuidad prohibida: ${FORBIDDEN}`);
    }

    const parser = read("src/core/parser.js");
    const output = read("src/Exportadores/salidaEditorialCSV.js");

    const requiredParserRules = [
        'determinarTipoEditorial',
        '"PROYECTO"',
        '"PORTFOLIO"',
        'fila["Observaciones"]'
    ];
    for (const token of requiredParserRules) {
        if (!parser.includes(token)) throw new Error(`La bifurcación del Parser no contiene: ${token}`);
    }

    const protectedTerms = [
        '"Historias de Transformación"',
        '"Hero Imágen"'
    ];
    for (const token of protectedTerms) {
        if (!output.includes(token)) throw new Error(`El contrato de salida no protege explícitamente: ${token}`);
    }

    const branch = run("git", ["branch", "--show-current"]) || "DETACHED";
    const commit = run("git", ["rev-parse", "--short", "HEAD"]);
    const files = run("git", ["ls-files"]).split("\n").filter(Boolean).length;
    const generated = new Date().toISOString().replace("T", " ").replace(".000Z", " UTC");
    const recent = run("git", ["log", "-5", "--date=short", "--pretty=format:%h — %ad — %s"]);

    const block = [
        `- Generado automáticamente: \`${generated}\``,
        `- Commit observado: \`${commit}\``,
        `- Rama: \`${branch}\``,
        `- Archivos versionados: \`${files}\``,
        `- Verificaciones: **OK** — canon documental, bifurcación Parser, contrato de salida y campos Wix protegidos.`,
        "- Últimos commits:",
        recent.split("\n").map(line => `  - ${line}`).join("\n")
    ].join("\n");

    const nextState = insertAfterHeading(state, "# MUBATO CMS Companion — Estado del Proyecto", block);
    const nextMatrix = insertAfterHeading(matrix, "# MUBATO CMS Companion — Matriz Viva de Componentes", block);
    const nextLedger = insertAfterHeading(ledger, "# MUBATO CMS Companion — Ledger de Continuidad", block);

    fs.writeFileSync(path.join(ROOT, DOCS[0]), nextState, "utf8");
    fs.writeFileSync(path.join(ROOT, DOCS[1]), nextMatrix, "utf8");
    fs.writeFileSync(path.join(ROOT, DOCS[2]), nextLedger, "utf8");

    console.log("✓ Tres documentos canónicos sincronizados.");
    console.log("✓ Bifurcación Parser verificada.");
    console.log("✓ Contrato de salida verificado.");
    console.log("✓ Campos Wix protegidos verificados.");
    console.log(`✓ Commit observado: ${commit}`);
    console.log(`✓ Rama: ${branch}`);
    console.log("\nCONTINUIDAD OK");
}

try {
    main();
} catch (error) {
    console.error(`\n✗ CONTINUIDAD FALLIDA\n\n${error.message}`);
    process.exit(1);
}
