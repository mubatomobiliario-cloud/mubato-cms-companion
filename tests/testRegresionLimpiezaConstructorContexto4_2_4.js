const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('testRegresionLimpiezaConstructorContexto4_2_4.js cargado');
console.log('');
console.log('======================================');
console.log('REGRESIÓN — LIMPIEZA CONSTRUCTOR CONTEXTO 4.2.4');
console.log('======================================');
console.log('');
console.log('Objetivo: demostrar que la eliminación controlada de Keywords, Categoría y Espacios no rompe el contrato V2.2 ni la frontera determinista/legado.');
console.log('La prueba es estática y de instancia: no ejecuta OpenAI ni modifica producción.');
console.log('');

const repoRoot = path.resolve(__dirname, '..');
const contextoPath = path.join(repoRoot, 'src', 'direccionEditorial', 'ConstructorContexto.js');
const procesadorPath = path.join(repoRoot, 'src', 'Editorial', 'procesadorEditorialV2.js');
const legacyPath = path.join(repoRoot, 'src', 'Editorial', 'procesadorEditorialV1.js');

assert.ok(fs.existsSync(contextoPath), 'ConstructorContexto no existe');
assert.ok(fs.existsSync(procesadorPath), 'procesadorEditorialV2 no existe');

const contextoSource = fs.readFileSync(contextoPath, 'utf8');
const procesadorSource = fs.readFileSync(procesadorPath, 'utf8');
const legacySource = fs.existsSync(legacyPath) ? fs.readFileSync(legacyPath, 'utf8') : '';

const removed = ['construirKeywords', 'construirCategoria', 'construirEspacios'];
const active = ['construirHero', 'construirHistoria', 'construirHistoriaWeb', 'construirSEO', 'construirMetadatosFotografia'];
const deterministic = ['construirSlug', 'construirCodigo', 'construirServicios'];
const legacy = ['construirAltText', 'construirTituloFotografia', 'construirKeywordsFotografia', 'construirNombreSEOFotografia'];

console.log('1. Verificando eliminación exacta de candidatos...');
removed.forEach(method => assert.ok(!contextoSource.includes(method), `${method} todavía aparece en ConstructorContexto`));
console.log('✓ Keywords, Categoría y Espacios fueron eliminados de ConstructorContexto.');
console.log('');

console.log('2. Verificando contrato activo V2.2...');
active.forEach(method => {
  assert.ok(contextoSource.includes(method), `${method} fue eliminado accidentalmente`);
  assert.ok(procesadorSource.includes(method), `${method} ya no está conectado a V2.2`);
});
console.log('✓ Los 5 métodos activos V2.2 permanecen disponibles y conectados.');
console.log('');

console.log('3. Verificando frontera determinista...');
deterministic.forEach(method => assert.ok(contextoSource.includes(method), `${method} fue eliminado accidentalmente`));
console.log('✓ Código, Servicios y Slug permanecen disponibles y fuera de la limpieza.');
console.log('');

console.log('4. Verificando aislamiento del legado V1...');
legacy.forEach(method => {
  assert.ok(legacySource.includes(method), `${method} ya no existe en V1 legado`);
  assert.ok(contextoSource.includes(method), `${method} fue eliminado de ConstructorContexto aunque V1 todavía lo requiere`);
});
console.log('✓ Los 4 métodos fotográficos V1 permanecen aislados y conservados.');
console.log('');

console.log('5. Verificando instancia de ConstructorContexto...');
const ConstructorContexto = require('../src/direccionEditorial/ConstructorContexto');
const instancia = new ConstructorContexto();
removed.forEach(method => assert.strictEqual(typeof instancia[method], 'undefined', `${method} todavía existe en la instancia`));
active.concat(deterministic, legacy).forEach(method => assert.strictEqual(typeof instancia[method], 'function', `${method} no está disponible en la instancia`));
console.log('✓ La superficie pública de ConstructorContexto coincide con la matriz de decisión.');
console.log('');

console.log('6. Verificando que no haya referencias productivas V2 a los métodos eliminados...');
const productionRoots = [path.join(repoRoot, 'src'), path.join(repoRoot, 'app'), path.join(repoRoot, 'lib')];
const walk = (dir, files = []) => {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|cjs|mjs|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
};
const productionFiles = productionRoots.flatMap(root => walk(root));
removed.forEach(method => {
  const consumers = productionFiles
    .filter(file => file !== contextoPath && file !== legacyPath)
    .filter(file => fs.readFileSync(file, 'utf8').includes(method));
  assert.strictEqual(consumers.length, 0, `${method} conserva referencias productivas: ${consumers.join(', ')}`);
});
console.log('✓ Ningún método eliminado conserva consumidor productivo detectado.');
console.log('');

console.log('7. Regla de seguridad final...');
active.forEach(method => assert.ok(procesadorSource.includes(method), `Contrato V2.2 incompleto: ${method}`));
console.log('✓ La limpieza no altera el contrato activo V2.2.');
console.log('✓ No se realizan llamadas a OpenAI.');
console.log('');

console.log('--------------------------------------');
console.log('PRUEBA SUPERADA — 4.2.4');
console.log('--------------------------------------');
console.log('');
console.log('✓ 3 métodos candidatos eliminados de forma controlada.');
console.log('✓ 5 métodos activos V2.2 preservados.');
console.log('✓ 3 métodos deterministas preservados.');
console.log('✓ 4 métodos V1 heredados preservados.');
console.log('✓ Sin consumidores productivos detectados para los métodos eliminados.');
console.log('✓ Superficie de ConstructorContexto consistente con la matriz 4.2.3.');
console.log('✓ No se realizaron llamadas reales a OpenAI.');
console.log('');
console.log('CONCLUSIÓN 4.2.4: la limpieza controlada de ConstructorContexto no rompe el contrato editorial V2.2 y deja fuera de la arquitectura vigente los tres métodos sin consumidor V2 identificado.');
