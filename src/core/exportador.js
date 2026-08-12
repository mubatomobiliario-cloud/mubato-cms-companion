console.log("exportador.js cargado");

function convertirProyecto(proyecto) {

    return {

        Título: proyecto.proyecto,

        Slug: proyecto.slug,

        Código: proyecto.codigo

    };

}


function generarCSV(registros){

    if(registros.length === 0){

        return "";

    }

    const encabezados = Object.keys(registros[0]);

    let csv = encabezados.join(",") + "\n";

    registros.forEach(registro=>{

        const fila = encabezados.map(campo=>{

            let valor = registro[campo] ?? "";

            valor = valor.toString().replace(/"/g,'""');

            return `"${valor}"`;

        });

        csv += fila.join(",") + "\n";

    });

    return csv;

}


function descargarCSV(registros){

    const csv = generarCSV(registros);

    const blob = new Blob([csv],{

        type:"text/csv;charset=utf-8;"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Historias_MUBATO_Procesado.csv";

    a.click();

    URL.revokeObjectURL(url);

}