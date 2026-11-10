// tokens.json -> tokens.css: dark on :root (the primary theme), light under [data-theme='light'].
import { readFileSync, writeFileSync } from 'node:fs';
const t = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)));
const [first, ...rest] = t.color.themes.map((x) => x.id);
const val = (tok, th) => (typeof tok.value === 'string' ? tok.value : tok.value[th] ?? tok.value[first]);
let css = `/* Foundry, generated from tokens.json */\n`;
for (const f of t.type.fonts) css += `@font-face { font-family: '${f.family}'; src: url('fonts/${f.file.split('/').pop()}') format('woff2'); font-weight: ${f.weight}; font-display: swap; }\n`;
css += `:root, [data-theme='${first}'] {\n` + t.color.tokens.map((c) => `  --${c.name}: ${val(c, first)};`).join('\n') + `\n  color-scheme: dark;\n}\n`;
for (const th of rest) {
  const lines = t.color.tokens.filter((c) => typeof c.value !== 'string' && c.value[th]).map((c) => `  --${c.name}: ${c.value[th]};`);
  css += `:root[data-theme='${th}'] {\n${lines.join('\n')}\n  color-scheme: ${th};\n}\n`;
}
const fams = Object.entries(t.type.families).map(([k, v]) => `  --font-${k}: ${v};`);
const other = ['spacing', 'radius', 'shadow'].flatMap((k) => (t[k]?.tokens || []).map((x) => `  --${x.name}: ${typeof x.value === 'string' ? x.value : x.value[first]};`));
css += `:root {\n${[...fams, ...other].join('\n')}\n}\n`;
writeFileSync(new URL('./tokens.css', import.meta.url), css);
console.log('tokens.css', css.length, 'bytes');
