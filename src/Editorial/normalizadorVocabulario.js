console.log("normalizadorVocabulario.js cargado");

class NormalizadorVocabulario {

    constructor() {

        this.materiales = {

            "Madera": "Madera Natural",
            "Madera Natural": "Madera Natural",

            "Tela": "Textil",
            "Textil": "Textil",

            "Cuero": "Cuero",

            "Metal": "Metal",

            "Metal Negro": "Metal",

            "Vidrio": "Vidrio",

            "Espejo": "Vidrio"

        };

        this.elementos = {

            "Puff": "Puf",
            "Pouf": "Puf",
            "Puf": "Puf",

            "Zapatos": "Zapato",
            "Zapato": "Zapato",

            "Cajones": "Cajón",
            "Cajón": "Cajón",

            "Repisas": "Repisa",
            "Repisa": "Repisa",

            "Lámparas": "Lámpara",
            "Lámpara": "Lámpara"

        };

        this.colores = {

            "Roble": "Roble",

            "Marrón": "Marrón",

            "Cafe": "Marrón",
            "Café": "Marrón",

            "Blanco": "Blanco",

            "Negro": "Negro",

            "Gris": "Gris",

            "Beige": "Beige",

            "Verde": "Verde"

        };

    }

    normalizarMaterial(material) {

        return this.materiales[material] || material;

    }

    normalizarElemento(elemento) {

        return this.elementos[elemento] || elemento;

    }

    normalizarColor(color) {

        return this.colores[color] || color;

    }

    normalizarLista(lista, tipo) {

        if (!Array.isArray(lista)) {

            return [];

        }

        let resultado = lista.map(item => {

            switch (tipo) {

                case "material":

                    return this.normalizarMaterial(item);

                case "elemento":

                    return this.normalizarElemento(item);

                case "color":

                    return this.normalizarColor(item);

                default:

                    return item;

            }

        });

        return [...new Set(resultado)].sort();

    }

}

module.exports = NormalizadorVocabulario;