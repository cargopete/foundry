# Foundry

The house style of [cargopete.com](https://cargopete.com),
[nuthatch-indexer.com](https://nuthatch-indexer.com) and
[nuthatch-indexer.com/analytics](https://nuthatch-indexer.com/analytics/): brick and rust on a
warm dark ground, monospace instrument labels, hairline borders, and steampunk 3D scenery behind
the hero rather than decoration on top of it.

It is also a Claude Code skill (`SKILL.md`), so a session can build or retrofit a site in it.

> **Brick labels things. Red reports things.**

## Install the skill

```bash
git clone https://github.com/cargopete/foundry.git
cd foundry
./install.sh
```

Then start a Claude Code session and ask for the house style, or ask to revamp an existing site
into it.

## Build the scenery

```bash
cd scenes
npm install
npm run build        # dist/scenes.min.js, three bundled
```

A site vendors `dist/scenes.min.js` as `public/foundry/scenes.js` and calls `createMachineRoom`,
`createWorkbench`, `createSea` or `createAmbient(canvas, { kit })`. `npm run dev` serves
`index.html` with every scene for a look.

## Contents

| Path | What it is |
|---|---|
| `tokens.css`, `tokens.json` | Foundry's tokens, dark first, with a measured light theme. `build-tokens.mjs` writes the CSS from the JSON |
| `foundry.css` | Base styles and component classes |
| `scenes/` | The 3D scenery: machine room, workbench, sea, observatory, and the ambient layer |
| `fonts/` | Space Grotesk and JetBrains Mono, woff2, subset for nuthatch-indexer.com |
| `components/` | Previews of Button, Badge, SectionHead, StatGrid, Readout, InstallLine, Sidebar, and the retired instruments |
| `foundry.js`, `vendor/` | The retired instrument bundle (NeedleGauge, NixieCounter, ValveRadio, CRTTerminal) |
| `reference/foundry.md` | Foundry's rules: content, colour, type, layout, motion, accessibility |
| `SKILL.md` | The skill, and the earlier cargopete style Foundry grew from |
| `reference/` | Tokens, components, the dashboard dialect, retrofit procedure and voice of the earlier style |
| `tools/contrast.py` | Palette validator. Exits non-zero, drops into CI |
| `example/` | Reference renders of the earlier style, no build step |

## Licence

MIT. The fonts are under the SIL Open Font License and three.js is MIT.
