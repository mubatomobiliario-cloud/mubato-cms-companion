# MUBATO CMS Companion — Contrato de Expediente Editorial V0.1

## Propósito

El Expediente Editorial es el puente entre el proyecto reconstruido desde Wix, las observaciones visuales de Vision y la interpretación de Dirección Editorial.

No es un formulario que MUBATO deba diligenciar manualmente. Su objetivo es consolidar automáticamente la evidencia disponible para que Dirección Editorial pueda trabajar sin inventar información.

## Principios congelados

1. **MUBATO selecciona Hero y Galería.**
2. **Vision observa; no selecciona ni ordena.**
3. **Dirección Editorial interpreta; no convierte inferencias en hechos.**
4. La ausencia de evidencia se conserva como `null`, arreglo vacío o `analizada: false`; no se rellena con datos inventados.
5. Los campos visuales son observaciones por fotografía, no atributos que MUBATO deba diligenciar por proyecto.
6. El Expediente no conoce el formato físico de Wix.

## Tres capas de conocimiento

### Capa A — Hechos del proyecto

Fuente: CSV/Wix + modelo `Proyecto`.

Incluye nombre, código, slug, cliente, ciudad, estado, categoría, servicios y espacios declarados.

### Capa B — Selección editorial

Fuente: decisión humana de MUBATO reconstruida por `ProyectoManager`.

Incluye Hero seleccionado, Galería seleccionada y ordenada, identidad local de las fotografías y referencias Wix cuando existan.

Vision no modifica esta capa.

### Capa C — Observaciones de Vision

Fuente: `AnalizadorFotografias`.

Por fotografía puede contener espacio, tipo, plano, estilo, materiales, colores, elementos, iluminación, sensación, confianza y estado de análisis.

Estos campos son **opcionales y automáticos**. No son requisitos de cargue manual.

## Capa D — Interpretación Editorial

La interpretación se reserva para Dirección Editorial. El Expediente V0.1 prepara el espacio para transformación, experiencia, narrativa, temas y notas editoriales.

Estos campos permanecen vacíos hasta que Dirección Editorial tenga evidencia suficiente para construirlos.

## Estructura conceptual

```text
Expediente
├── version
├── proyecto
├── seleccionEditorial
│   ├── hero
│   └── galeria[]
├── observacionesVision[]
│   └── una entrada por fotografía
└── interpretacionEditorial
```

## Regla de utilidad

Vision debe producir observaciones **genéricas pero útiles**, sin afirmar intenciones del cliente, historia del proyecto o decisiones de diseño que no sean observables.

Ejemplo válido:

> Materiales visibles: madera, piedra y vidrio.

Ejemplo no válido como observación visual:

> El cliente buscaba una cocina más funcional.

La segunda afirmación pertenece a la interpretación o a evidencia documental del proyecto, no a Vision.

## Integración

El flujo objetivo es:

```text
Proyecto
  ↓
Vision
  ↓
Expediente Editorial
  ↓
ConstructorContexto
  ↓
Dirección Editorial
```

El Expediente no debe llamar directamente a OpenAI. Vision y Dirección Editorial mantienen responsabilidades separadas.

## Estado V0.1

La estructura está definida y `expedienteProyecto.js` fue reconstruido para consolidar automáticamente las capas disponibles y reservar la interpretación editorial.

La siguiente validación debe comprobar el Expediente sobre un proyecto realmente analizado por Vision antes de conectar generación editorial real.
