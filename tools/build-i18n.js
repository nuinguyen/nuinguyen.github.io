// Builds the translation files used by lang.js.
// Run after build-product-pages.js:  node tools/build-i18n.js
//
// - tools/strings-index.json and tools/strings-products.json hold English -> Vietnamese pairs
//   (the Vietnamese written alongside the English source).
// - tools/strings-source.json is the full list of English strings that need a translation.
// - i18n/vi.json is generated from those pairs; the other i18n/<code>.json files are edited by hand
//   (keys are the English text). This script lists any English string a language is missing.
const fs = require('fs');
const path = require('path');

const TOOLS = __dirname;
const I18N = path.join(__dirname, '..', 'i18n');
const LANGS = ['vi', 'es', 'pt-BR', 'fr', 'de', 'ru', 'id', 'hi', 'ja', 'ko', 'zh-CN'];

const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const pairs = { ...read(path.join(TOOLS, 'strings-index.json')), ...read(path.join(TOOLS, 'strings-products.json')) };
const source = Object.keys(pairs).sort();

fs.mkdirSync(I18N, { recursive: true });
fs.writeFileSync(path.join(TOOLS, 'strings-source.json'), JSON.stringify(source, null, 2));
const vi = {};
for (const en of source) vi[en] = pairs[en];
fs.writeFileSync(path.join(I18N, 'vi.json'), JSON.stringify(vi, null, 2));
console.log(`${source.length} English strings`);

let problems = 0;
for (const code of LANGS) {
  const file = path.join(I18N, `${code}.json`);
  if (!fs.existsSync(file)) { console.log(`${code.padEnd(6)} missing file`); problems++; continue; }
  const dict = read(file);
  const missing = source.filter(en => !dict[en]);
  const unused = Object.keys(dict).filter(en => !(en in pairs));
  console.log(`${code.padEnd(6)} ${source.length - missing.length}/${source.length}` + (unused.length ? `, ${unused.length} unused` : ''));
  missing.slice(0, 5).forEach(en => console.log(`        missing: ${en}`));
  problems += missing.length;
}
process.exitCode = problems ? 1 : 0;
