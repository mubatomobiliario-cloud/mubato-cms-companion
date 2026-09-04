const fs = require("fs");

class SalidaEditorialCSVPortfolio {
    static CAMPOS_WIX_EDITABLES = Object.freeze([
        "Código MUBATO",
        "Hero Texto",
        "Historia",
        "Descripción",
        "Servicios",
        "Slug",
        "SEO Title",
        "Meta Description",
        "Galería General"
    ]);

    static CAMPO_HERO_IMAGEN = "Hero Imágen";
    static CAMPOS_IDENTIDAD_PREFERIDOS = Object.freeze(["ID", "Proyecto"]);

    exportar({ rutaEntrada, rutaSalida, filaPortfolio, editorial }) {
        this.validarEntradas({
            rutaEntrada,
            rutaSalida,
            filaPortfolio,
            editorial
        });

        const contenido = fs.readFileSync(rutaEntrada, "utf8");
        const filas = this.parsearCSV(contenido);

        if (filas.length < 2) {
            throw new Error("El CSV Portfolio debe contener encabezado y al menos una fila.");
        }

        const encabezados = filas[0];
        const indice = this.crearIndiceEncabezados(encabezados);
        this.validarContratoCSV(indice, editorial);

        const identidad = this.obtenerIdentidad(filaPortfolio, indice);
        const indiceFila = this.localizarFila(filas, indice, identidad);

        const filaOriginal = filas[indiceFila].slice();
        const camposProtegidos = this.capturarCamposNoEditables(
            filas[indiceFila],
            encabezados
        );

        const cambios = this.construirCambios(editorial);
        const filaSalida = filas[indiceFila].slice();

        for (const [campo, valor] of Object.entries(cambios)) {
            filaSalida[indice[campo]] = valor;
        }

        this.verificarCamposNoEditables(
            filaOriginal,
            filaSalida,
            encabezados,
            camposProtegidos
        );

        filas[indiceFila] = filaSalida;

        const salida = filas.map(fila => this.serializarFila(fila)).join("\n") + "\n";
        fs.writeFileSync(rutaSalida, salida, "utf8");

        return {
            rutaSalida,
            identidad,
            camposEditados: Object.keys(cambios)
        };
    }

    validarEntradas({ rutaEntrada, rutaSalida, filaPortfolio, editorial }) {
        if (typeof rutaEntrada !== "string" || !rutaEntrada.trim()) {
            throw new Error("SalidaEditorialCSVPortfolio requiere una ruta de entrada válida.");
        }
        if (typeof rutaSalida !== "string" || !rutaSalida.trim()) {
            throw new Error("SalidaEditorialCSVPortfolio requiere una ruta de salida válida.");
        }
        if (!fs.existsSync(rutaEntrada)) {
            throw new Error(`No existe el CSV Portfolio de entrada: ${rutaEntrada}`);
        }
        if (!filaPortfolio || typeof filaPortfolio !== "object" || Array.isArray(filaPortfolio)) {
            throw new Error("SalidaEditorialCSVPortfolio requiere la fila Portfolio original.");
        }
        if (!editorial || typeof editorial !== "object" || Array.isArray(editorial)) {
            throw new Error("SalidaEditorialCSVPortfolio requiere un resultado editorial válido.");
        }
    }

    validarContratoCSV(indice, editorial) {
        for (const campo of SalidaEditorialCSVPortfolio.CAMPOS_WIX_EDITABLES) {
            if (indice[campo] === undefined) {
                throw new Error(`El CSV Portfolio no contiene la columna editable requerida: ${campo}.`);
            }
        }

        if (indice[SalidaEditorialCSVPortfolio.CAMPO_HERO_IMAGEN] === undefined) {
            throw new Error('El CSV Portfolio debe contener exactamente una columna "Hero Imágen".');
        }

        if (typeof editorial.historia !== "string" || !editorial.historia.trim()) {
            throw new Error("El resultado editorial Portfolio requiere Historia.");
        }

        if (!Array.isArray(editorial.galeriaEditorial)) {
            throw new Error("El resultado editorial Portfolio requiere galeriaEditorial[].");
        }
    }

    obtenerIdentidad(filaPortfolio, indice) {
        for (const campo of SalidaEditorialCSVPortfolio.CAMPOS_IDENTIDAD_PREFERIDOS) {
            if (indice[campo] !== undefined) {
                const valor = filaPortfolio[campo];
                if (typeof valor === "string" && valor.trim()) {
                    return { campo, valor };
                }
            }
        }

        throw new Error("No fue posible determinar una identidad estable para la fila Portfolio.");
    }

    localizarFila(filas, indice, identidad) {
        for (let i = 1; i < filas.length; i += 1) {
            if (filas[i][indice[identidad.campo]] === identidad.valor) {
                return i;
            }
        }
        throw new Error(
            `No se encontró la fila Portfolio con ${identidad.campo} = ${identidad.valor}.`
        );
    }

    capturarCamposNoEditables(fila, encabezados) {
        const editables = new Set(SalidaEditorialCSVPortfolio.CAMPOS_WIX_EDITABLES);
        const protegidos = new Map();

        encabezados.forEach((campo, posicion) => {
            if (!editables.has(campo)) {
                protegidos.set(posicion, fila[posicion]);
            }
        });

        return protegidos;
    }

    verificarCamposNoEditables(filaOriginal, filaSalida, encabezados, protegidos) {
        for (const [posicion, valorOriginal] of protegidos.entries()) {
            if (filaSalida[posicion] !== valorOriginal) {
                throw new Error(
                    `El campo protegido "${encabezados[posicion]}" fue modificado durante la exportación.`
                );
            }
        }

        if (filaSalida.length !== filaOriginal.length) {
            throw new Error("La exportación Portfolio alteró la estructura de la fila.");
        }
    }

    construirCambios(editorial) {
        return {
            "Código MUBATO": editorial.codigo,
            "Hero Texto": editorial.heroTexto,
            "Historia": editorial.historia,
            "Descripción": editorial.descripcion,
            "Servicios": editorial.servicios,
            "Slug": editorial.slug,
            "SEO Title": editorial.seoTitle,
            "Meta Description": editorial.metaDescription,
            "Galería General": this.serializarGaleriaWix(editorial.galeriaEditorial)
        };
    }

    serializarGaleriaWix(galeriaEditorial) {
        if (!Array.isArray(galeriaEditorial)) {
            throw new Error("galeriaEditorial debe ser un arreglo.");
        }

        const campos = [
            "description",
            "fileName",
            "slug",
            "alt",
            "src",
            "title",
            "type",
            "settings"
        ];

        const proyectada = galeriaEditorial.map((item, posicion) => {
            if (!item || typeof item !== "object" || Array.isArray(item)) {
                throw new Error(`La galería editorial contiene un elemento inválido en posición ${posicion}.`);
            }

            const salida = {};
            for (const campo of campos) {
                if (!Object.prototype.hasOwnProperty.call(item, campo)) {
                    throw new Error(
                        `La fotografía de la posición ${posicion} no contiene el campo Wix requerido: ${campo}.`
                    );
                }
                salida[campo] = item[campo];
            }
            return salida;
        });

        return JSON.stringify(proyectada);
    }

    crearIndiceEncabezados(encabezados) {
        const indice = {};
        encabezados.forEach((campo, posicion) => {
            if (indice[campo] !== undefined) {
                throw new Error(`El CSV Portfolio contiene la columna duplicada: ${campo}.`);
            }
            indice[campo] = posicion;
        });
        return indice;
    }

    parsearCSV(contenido) {
        const filas = [];
        let fila = [];
        let campo = "";
        let entreComillas = false;

        for (let i = 0; i < contenido.length; i += 1) {
            const caracter = contenido[i];

            if (entreComillas) {
                if (caracter === '"') {
                    if (contenido[i + 1] === '"') {
                        campo += '"';
                        i += 1;
                    } else {
                        entreComillas = false;
                    }
                } else {
                    campo += caracter;
                }
                continue;
            }

            if (caracter === '"') {
                entreComillas = true;
            } else if (caracter === ',') {
                fila.push(campo);
                campo = "";
            } else if (caracter === "\n") {
                fila.push(campo);
                campo = "";
                if (fila.length > 1 || fila[0] !== "") {
                    filas.push(fila);
                }
                fila = [];
            } else if (caracter === "\r") {
                // Ignorar CR de CRLF; el LF cierra la fila.
            } else {
                campo += caracter;
            }
        }

        if (campo !== "" || fila.length > 0) {
            fila.push(campo);
            filas.push(fila);
        }

        return filas;
    }

    serializarFila(fila) {
        return fila.map(valor => this.escaparCSV(valor)).join(",");
    }

    escaparCSV(valor) {
        const texto = valor === undefined || valor === null ? "" : String(valor);
        if (/[",\n\r]/.test(texto)) {
            return `"${texto.replace(/"/g, '""')}"`;
        }
        return texto;
    }
}

module.exports = SalidaEditorialCSVPortfolio;
