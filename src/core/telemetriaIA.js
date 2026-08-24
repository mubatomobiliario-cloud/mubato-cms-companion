console.log("telemetriaIA.js cargado");

/**
 * TelemetriaIA
 *
 * Registra métricas de uso de cualquier proveedor de IA sin acoplar
 * la telemetría a OpenAI ni a otro proveedor concreto.
 *
 * No realiza llamadas de red y no calcula costos por proveedor.
 */
class TelemetriaIA {
    constructor() {
        this.resetear();
    }

    resetear() {
        this.llamadas = [];
        this.inicio = null;
    }

    iniciarEjecucion(contexto = {}) {
        this.resetear();
        this.inicio = Date.now();
        this.contexto = { ...contexto };
    }

    iniciarLlamada({ proveedor = "desconocido", operacion = "desconocida", modelo = "desconocido", proyecto = "", fotografia = "" } = {}) {
        return {
            inicio: Date.now(),
            proveedor,
            operacion,
            modelo,
            proyecto,
            fotografia
        };
    }

    registrarLlamada(medicion, resultado = {}) {
        const fin = Date.now();
        const uso = resultado.usage || {};

        const entrada = {
            numero: this.llamadas.length + 1,
            proveedor: medicion.proveedor,
            operacion: medicion.operacion,
            modelo: resultado.model || medicion.modelo,
            proyecto: medicion.proyecto || "",
            fotografia: medicion.fotografia || "",
            duracionMs: fin - medicion.inicio,
            exito: resultado.exito !== false,
            error: resultado.error ? String(resultado.error) : null,
            tokensEntrada: Number(uso.input_tokens || uso.prompt_tokens || 0),
            tokensSalida: Number(uso.output_tokens || uso.completion_tokens || 0),
            tokensTotales: Number(uso.total_tokens || 0),
            timestamp: new Date(medicion.inicio).toISOString()
        };

        if (!entrada.tokensTotales) {
            entrada.tokensTotales = entrada.tokensEntrada + entrada.tokensSalida;
        }

        this.llamadas.push(entrada);
        return entrada;
    }

    registrarError(medicion, error) {
        return this.registrarLlamada(medicion, {
            exito: false,
            error: error && error.message ? error.message : error
        });
    }

    resumen() {
        const resumen = {
            contexto: { ...(this.contexto || {}) },
            llamadas: this.llamadas.length,
            exitosas: this.llamadas.filter(l => l.exito).length,
            fallidas: this.llamadas.filter(l => !l.exito).length,
            tokensEntrada: this.llamadas.reduce((t, l) => t + l.tokensEntrada, 0),
            tokensSalida: this.llamadas.reduce((t, l) => t + l.tokensSalida, 0),
            tokensTotales: this.llamadas.reduce((t, l) => t + l.tokensTotales, 0),
            duracionMs: this.llamadas.reduce((t, l) => t + l.duracionMs, 0),
            llamadasPorOperacion: {},
            llamadasPorProveedor: {},
            detalle: [...this.llamadas]
        };

        for (const llamada of this.llamadas) {
            resumen.llamadasPorOperacion[llamada.operacion] =
                (resumen.llamadasPorOperacion[llamada.operacion] || 0) + 1;
            resumen.llamadasPorProveedor[llamada.proveedor] =
                (resumen.llamadasPorProveedor[llamada.proveedor] || 0) + 1;
        }

        return resumen;
    }
}

module.exports = TelemetriaIA;
