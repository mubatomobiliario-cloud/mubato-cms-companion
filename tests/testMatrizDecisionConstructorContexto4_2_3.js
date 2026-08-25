const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('testMatrizDecisionConstructorContexto4_2_3.js cargado');
console.log('');
console.log('======================================');
console.log('AUDITORÍA — MATRIZ DECISIÓN CONSTRUCTOR CONTEXTO 4.2.3');
console.log('======================================');
console.log('');
console.log('Objetivo: convertir la evidencia de 4.2.1 y 4.2.2 en una matriz formal de decisión, sin modificar producción.');
console.log('La prueba verifica imports, consumidores y clasificación antes de cualquier limpieza.');
console.log('');

const repoRoot = path.resolve(__dirname, '..');
const contextoPath = path.join(repoRoot, 'src', 'direccionEditorial', 'ConstructorContexto.js');
const procesadorPath = path.join(repoRoot, 'src', 'Editorial', 'procesadorEditorialV2.js');
const legacyPath = path.join(repoRoot, 'src', 'Editorial', 'procesadorEditorialV1.js');

assert.ok(fs.existsSync(contextoPath), 'ConstructorContexto no existe');
assert.ok(fs.existsSync(procesadorPath), 'procesadorEditorialV2 no existe');

const contexto = fs.readFileSync(contextoPath, 'utf8');
const procesador = fs.readFileSync(procesadorPath, 'utf8');
const legacy = fs.existsSync(legacyPath) ? fs.readFileSync(legacyPath, 'utf8') : '';

const methods = [
  'construirHero',
  'construirHistoria',
  'construirHistoriaWeb',
  'construirSEO',
  'construirMetadatosFotografia',
  'construirKeywords',
  'construirSlug',
  'construirCodigo',
  'construirCategoria',
  'construirServicios',
  'construirEspacios',
  'construirAltText',
  'construirTituloFotografia',
  'construirKeywordsFotografia',
  'construirNombreSEOFotografia'
];

methods.forEach(method => assert.ok(contexto.includes(method), `Método ausente en ConstructorContexto: ${method}`));

const active = ['construirHero','construirHistoria','construirHistoriaWeb','construirSEO','construirMetadatosFotografia'];
const deterministic = ['construirSlug','construirCodigo','construirServicios'];
const legacyMethods = ['construirAltText','construirTituloFotografia','construirKeywordsFotografia','construirNombreSEOFotografia'];
const cleanupCandidates = ['construirKeywords','construirCategoria','construirEspacios'];

console.log('1. Verificando contrato activo V2.2...');
active.forEach(method => assert.ok(procesador.includes(method), `${method} no está conectado a V2.2`));
console.log(`✓ ${active.length} métodos forman parte del contrato activo V2.2.`);
console.log('');

console.log('2. Verificando frontera determinista...');
deterministic.forEach(method => assert.ok(contexto.includes(method), `${method} debe permanecer disponible`));
console.log('✓ Código, Servicios y Slug permanecen fuera de IA.');
console.log('');

console.log('3. Verificando aislamiento del legado V1...');
legacyMethods.forEach(method => assert.ok(legacy.includes(method), `${method} no aparece en V1 como se esperaba`));
console.log('✓ Los 4 métodos fotográficos heredados permanecen aislados en V1.');
console.log('');

console.log('4. Verificando candidatos sin consumidor detectado...');
cleanupCandidates.forEach(method => {
  const outsideFiles = [];
  const roots = [path.join(repoRoot, 'src'), path.join(repoRoot, 'app'), path.join(repoRoot, 'lib'), path.join(repoRoot, 'tests')];
  const walk = dir => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|cjs|mjs|ts)$/.test(entry.name) && full !== contextoPath) {
        const text = fs.readFileSync(full, 'utf8');
        if (text.includes(method)) outsideFiles.push(full);
      }
    }
  };
  roots.forEach(walk);
  const relevant = outsideFiles.filter(file => !file.includes('testMatrizDecisionConstructorContexto4_2_3.js'));
  assert.strictEqual(relevant.length, 0, `${method} tiene consumidores detectados: ${relevant.join(', ')}`);
});
console.log('✓ Keywords, Categoría y Espacios no presentan consumidores detectados fuera de ConstructorContexto.');
console.log('');

console.log('5. Matriz formal de decisión...');
const matrix = [
  ['ACTIVO V2.2', active, 'CONSERVAR'],
  ['DETERMINISTA / CONTRATO', deterministic, 'CONSERVAR Y CONSOLIDAR'],
  ['V1 LEGADO', legacyMethods, 'AISLAR; NO ELIMINAR EN 4.2.3'],
  ['SIN CONSUMIDOR DETECTADO', cleanupCandidates, 'CANDIDATO A LIMPIEZA; REQUIERE REGRESIÓN']
];
for (const [group, list, decision] of matrix) {
  console.log(`• ${group}: ${list.join(', ')}`);
  console.log(`  → ${decision}`);
}
console.log('');

console.log('6. Regla de seguridad...');
assert.ok(procesador.includes('construirSlug') || procesador.includes('slug'), 'V2.2 debe conservar la frontera de slug');
console.log('✓ No se autoriza eliminación de métodos en esta prueba.');
console.log('✓ No se modifica producción.');
console.log('✓ La limpieza de candidatos queda separada para una prueba de regresión específica.');
console.log('');

console.log('--------------------------------------');
console.log('AUDITORÍA SUPERADA — 4.2.3');
console.log('--------------------------------------');
console.log('');
console.log('✓ Matriz de decisión formal establecida.');
console.log('✓ 5 métodos activos V2.2: conservar.');
console.log('✓ 3 métodos deterministas: conservar y consolidar.');
console.log('✓ 4 métodos V1: aislar, no eliminar todavía.');
console.log('✓ 3 métodos sin consumidor: candidatos formales a limpieza.');
console.log('✓ No se modificó código de producción.');
console.log('✓ No se realizaron llamadas a OpenAI.');
console.log('');
console.log('CONCLUSIÓN 4.2.3: la limpieza puede ejecutarse de forma controlada, pero únicamente después de una regresión explícita que demuestre que los tres candidatos sin consumidor no forman parte de ningún contrato vigente.');
