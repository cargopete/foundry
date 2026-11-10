---
name: foundry
description: Foundry, the house style of cargopete.com, nuthatch-indexer.com and nuthatch-indexer.com/analytics - brick and rust on warm dark, with steampunk 3D scenery from scenes/ - plus the earlier cargopete house frontend style it grew from, extracted from nuthatch-indexer.com, yetanothertaskrunner.com and redstart-lang.com. A single mandated palette - warm near-black ground, slate-blue and terracotta accents, warm off-white ink - with monospace instrument labels, hairline borders, macro whitespace, a real terminal transcript as the hero artefact, bento grids, and an honest comparison table that admits where the product loses. Also carries the dashboard dialect from lodestar-dashboard.com: one brick accent, a red kept for bad news, type in rem at a 112.5% root, a sidebar-and-topbar frame, and panels that say when a read failed. Use when building or revamping a landing page, docs site, dashboard or developer-tool site in this style, when asked for "the nuthatch style", "the house style", "my style", "cargopete style", or when refactoring an existing site to match them.
---

# cargopete style

> **Foundry is current.** The three sites ship Foundry: `tokens.css` and `foundry.css` at the repo
> root, the 3D scenery in `scenes/` (`npm run build` there gives `dist/scenes.min.js`, which sites
> vendor as `public/foundry/scenes.js`), and the rules in `reference/foundry.md`. Where this file
> and Foundry disagree, Foundry wins. The sections below are the style it grew from.

## 0. The doctrine

Five sentences. Everything below is enforcement.

> **The palette is fixed and is not yours to redesign. The ground is warm dark,
> never grey and never black. Both accents get spent, not just the blue one.
> Monospace is the instrument label, not the code font. The screenshot is a true
> transcript. Say plainly what it does not do.**

The mental image is a well-kept piece of field equipment photographed at dusk. It is
dark because that is where it lives, not because dark mode is fashionable. Every
label on it is stamped rather than styled. The readout shows real numbers from a real
run, because a fake readout is the one lie the whole page cannot survive.

### The palette is mandated

This is the load-bearing rule and the one that separates this skill from a taste
protocol. Other design skills hand you a method for deriving colour. This one hands
you the colour.

> **Every site in this style ships the palette in `reference/tokens.css`, unchanged.
> Do not derive a new accent. Do not tune the ground to the product. Do not swap the
> slate blue for the client's brand hue.**

The palette is the nuthatch palette, in full, in `reference/tokens.css`. It came from
a bird - slate-blue back, terracotta underside, on unlit wood - and that provenance is
worth knowing, but it is history now rather than a method. The point of a house style
is that every house in it is recognisably the same house.

What varies between sites is subject, structure, illustration and texture. Not colour.

The one exception is a dashboard. An application someone works in for an hour has numbers
that fall and checks that fail, and there the pair gets in the way. It has its own mandated
palette, `data-palette="brick"`, and its own rules in section 13. It is a second palette, not
a licence for a third.

### Lineage, so you know what to keep

This style is a deliberate inversion of the `minimalist-ui` protocol from
`Leonxlnx/taste-skill`. Keep from upstream: macro whitespace, hairline 1px borders,
flat bento grids, typographic contrast, banned hype vocabulary, no emoji, no
Inter/Roboto, no heavy shadows, no pill-shaped large containers.

Discard from upstream: the white canvas, the pastel accent chart, the picsum
placeholders, the rough ink illustrations, the drifting gradient blob. Those are
replaced by sections 1, 3 and 7 below.

If a rule appears in both, this file wins.

### The four exemplars

- **nuthatch-indexer.com** - canonical, and the source of the mandated palette. Flat,
  no gradients, no shadows, geometric sans, optional light theme. When in doubt, do
  what this site does.
- **yetanothertaskrunner.com** - the atmospheric texture: ambient glow, grain, an
  illustrated horizon, an editorial serif with an italic accent cut. Its amber palette
  **predates the mandate and is not to be reproduced.** Take its structure, render it
  in the mandated colours.
- **redstart-lang.com** - the before/after diptych, the "would you rather maintain
  this" framing, and the tightest copy of the four. Its cool near-black ground and
  ember accent likewise **predate the mandate.** Take the structure, leave the colour.
- **engine.camp** - the scope panel: "What it does, and what it doesn't." in two
  mono-labelled columns, followed by "A community service. Be a good citizen." The
  clearest statement of the fifth doctrine rule anywhere in the family. Palette,
  again, predates the mandate.

Three of the four exemplars are wrong about colour. That is exactly why the palette is
mandated now.

---

## 1. The palette

Ship `reference/tokens.css` verbatim. What follows is what each token is for, so you
place them correctly rather than approximately.

**Surfaces.** Four tiers and no more. Every neutral is brown-shifted: the canvas
reads as soil or unlit wood, not as slate. `#111111`, `#0a0a0a`, `#000000` and
anything with a blue cast are banned, and the difference is visible the moment a warm
accent sits on top.

| Token | Value | Job |
|---|---|---|
| `--bg` | `#171614` | the page canvas |
| `--bg-elev` | `#201f1c` | cards, panels, anything lifted |
| `--bg-code` | `#1b1a17` | terminal and code block bodies |
| `--bg-inset` | `#262420` | inline code, kbd, chips - pressed in, not lifted |

**Borders.** Two weights, and they do all the structural work.
`--border: rgba(255,255,255,0.09)` at rest, `--border-hi: rgba(255,255,255,0.16)`
when a thing is interactive or focused. Elevation is expressed by surface tier plus a
hairline. It is never expressed by a shadow. The single permitted shadow in the whole
style is under a hero terminal in the atmospheric texture (section 9), and it is a
deep soft one, not a card lift.

**Ink.** Three tiers. `--text: #ece9e3`, `--text-muted: #9c978c`,
`--text-faint: #6e6a61`. Body text is never pure white; `#ffffff` on a warm dark
ground glares and reads as a different design.

**Accents.** Two, because the bird had two, and **both of them have a job.** This is
the rule most often got wrong, including by me: it is easy to build a page that spends
`--accent` on everything, uses `--rust` three times as a garnish, and comes out reading
as warm-grey plus blue. That page has half a palette.

> **If a shell printed it, it is slate. If a person wrote it, it is terracotta.**

| | `--accent` `#8bb8dc` | `--rust` `#cd8560` |
|---|---|---|
| voice | the machine | the person |
| carries | shell prompts, the nav CTA, links, focus rings, technical chips, counts inside a terminal, the "us" column | section kickers, the hero eyebrow, stat units and suffixes, list markers, the live marker on a timeline, hover states, tags for work that is yours and ongoing |
| feel | cool, quiet, structural | warm, editorial, the thing a reader notices first |

`--accent-ink: #cfe3f2` is for accent-coloured text sitting on an accent wash, where
the accent itself would be too dim.

**The floor.** Grep your finished stylesheet. If `var(--rust)` appears fewer than a
dozen times, you have not built a page in this style; you have built a blue page on a
warm ground. The nuthatch site uses it twenty-one times across its stylesheets and its
author still thinks that is thin. Section kickers alone, which appear above every
section on the page, should account for a good share of it.

Never a third hue. Never a saturated red in the resting palette. Status is washed:
`--ok: #86b592`, `--warn: #cdb06a`, and status colours are not a way to smuggle in a
third accent - a green dot marking "the current one" is a marker, not a status, and
belongs to `--rust`.

**Washes.** The accents at 12% alpha, for tag backgrounds and the tinted table
column. `--pale-blue-bg`, `--pale-rust-bg`, `--pale-green-bg`.

**Light theme.** Optional, and a faithful inversion rather than a second design. Also
mandated where it exists: same file, `[data-theme='light']`. Set it from an inline
script reading `localStorage` before first paint so the choice survives a reload
without a flash.

---

## 2. Contrast, measured

Real ratios for the mandated dark palette, computed rather than assumed. Run
`python3 tools/contrast.py` to reproduce; it exits non-zero on a failure and drops
straight into CI.

| Ink | on `--bg` | on `--bg-elev` | on `--bg-inset` | Verdict |
|---|---|---|---|---|
| `--text` `#ece9e3` | 14.92 | 13.60 | 12.78 | AAA everywhere |
| `--text-muted` `#9c978c` | 6.22 | 5.67 | 5.33 | AA everywhere |
| `--text-faint` `#6e6a61` | 3.36 | 3.06 | 2.87 | **fails AA** |
| `--accent` `#8bb8dc` | 8.60 | 7.84 | 7.37 | AAA everywhere |
| `--rust` `#cd8560` | 6.13 | 5.59 | 5.25 | AA everywhere |
| `--ok` `#86b592` | 7.78 | 7.09 | 6.67 | AAA everywhere |

`--text-faint` is decorative only. It is for section kickers, terminal window titles,
timestamps and the copy hint on an install line - things a reader can lose without
losing meaning. It never carries body copy, never carries a link, and never carries
the only instance of a piece of information. This is the first rule a careless
retrofit breaks.

Two values in the light theme are deliberately not the ones the sites currently ship,
because the validator caught them:

- `--text-muted: #706d69`, not upstream's `#787774`, which measures 4.32 on a
  `#fbfbfa` canvas and misses AA. The shipped value measures 4.97.
- `--rust: #9d5433`, not nuthatch's `#a85a38`, which measures 4.44 on `--bg-inset` and
  misses AA in exactly the place the rust tag lives. The shipped value measures 4.95.

Both are small darkenings and neither is visible beside the original. Take them, and
push them back into the nuthatch site next time it is touched.

---

## 3. Type

Three tiers, three jobs, no overlap.

**Display.** Headings and hero. Space Grotesk at 600 is the canonical choice, tracked
at `-0.03em` with `line-height: 1.1`. Sizes are fluid: `clamp(2.4rem, 6vw, 3.9rem)`
for h1, `clamp(1.6rem, 3.4vw, 2.3rem)` for h2.

An editorial serif with an italic accent cut (Fraunces at 400, italic at 500) is the
one permitted substitution, and it comes with the atmospheric texture rather than on
its own. In that setting one clause of the heading is set in italic and coloured
`--accent`, and that clause carries the claim: *"Run your tasks. **Trust your
cache.**"* One clause per heading. Never italicise the whole line.

**Sans.** Body and UI. Space Grotesk, 17px, `line-height: 1.6`,
`letter-spacing: -0.01em`. Ledes cap at 56ch, running prose at 44rem. A lede at 30ch
under a hero is correct and deliberate.

**Mono.** This is the tier that identifies the style, and it does far more than code.

Monospace carries every stamped label on the page: section kickers, tags, badges,
eyebrows, the terminal, install commands, table units, stat suffixes, footer licence
lines, window chrome titles. The treatment is fixed:

```css
font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;
font-size: 0.66rem to 0.78rem;   /* 11px to 13px */
letter-spacing: 0.08em to 0.14em;
text-transform: uppercase;
color: var(--rust);              /* kickers and eyebrows: the human voice */
```

A section that opens without a mono kicker above its heading is not in this style.
That kicker is the equivalent of the engraved plate above a dial, and **it is
terracotta.** Kickers are the single largest employer of `--rust` on a page and the
cheapest way to make a build stop reading as monochrome. `--rust` measures 6.13:1 on
`--bg` and clears AA at that size.

Labels that are genuinely disposable - a terminal window title, a copy hint, a
timestamp, an em-dash placeholder in a table - stay `--text-faint`.

The nuthatch site still sets its section labels in `--text-faint`; it predates this
rule and should be brought up to it. Do not copy it on this one point.

Self-host both faces, subset to the glyphs actually used, `font-display: swap`. See
section 7.

---

## 4. Page grammar

The landing page has a fixed skeleton. All four exemplars use it; deviate only with
a reason.

1. **Sticky nav**, 72px, hairline bottom border, backdrop blur, brand mark left, links
   right in muted ink, one accent-filled CTA at the far right.
2. **Hero.** Mono eyebrow pill, then the claim in display face on two lines, then a
   lede at ~30ch, then a CTA row of exactly two: a copyable install line and one ghost
   link. Beside it, the terminal (section 5).
3. **Proof.** Three to four hard numbers, or the pipeline diagram. Whatever is
   measurable goes here, immediately, before any feature list.
4. **Features**, as a six-column bento with one feature cell spanning four.
5. **Mechanism.** How the thing actually works, as a diagram, a numbered walk, or a
   before/after diptych. This is the section that earns the reader's trust and it is
   not optional.
6. **The honest comparison**, or the scope panel, or both. See section 5.
7. **Close.** Centred, one heading at ≤16ch, the install commands again, three links.
8. **Footer.** Hairline top border, brand, licence in mono, nothing else.

Section rhythm: `padding-block: clamp(4rem, 9vw, 7rem)`, tightening to ~76px under
540px. Content caps at `68rem`, gutters 24px. Headings that carry a claim cap at ~16ch
so they wrap where you intend.

Section head, every time:

```html
<p class="kicker">How it works</p>
<h2>One process, from RPC to a query you can trust.</h2>
<p class="section-lede">…56ch of plain explanation…</p>
```

---

## 5. The artefacts

Seven components carry the style. Full markup and CSS in `reference/components.md`.

**The terminal.** The hero artefact and the most identifying element in the whole
style. A `--bg-code` panel, 12px radius, hairline border, a title bar with three 11px
dots and a mono window title in `--text-faint`, then a body in mono at ~13.5px with
`line-height: 1.85`.

The transcript is real. Real commands, real elapsed times, real addresses, real
output. `0.04s   restored from cache` and `sealed segment 3f9c8a… → 2,497 rows` are
both true statements about their products, which is why they land. A prettified or
invented transcript is the one failure this style cannot absorb - it turns the whole
page into marketing, which is precisely what it is trying not to be.

The full transcript lives in the DOM as static markup so it works with JavaScript
off. Typewriter animation, if any, is progressive enhancement over reserved line
heights, so there is no layout shift either way.

**The install line.** A `<button>`, not a `<div>`, so it is focusable. Mono, `$` in
`--accent`, command in `--text`, the word `copy` at the right in `--text-faint` behind
a hairline divider. Border goes to `--accent` on hover, and the hint flips to accent
for a beat on success. Ships an `aria-label`.

**The bento.** `repeat(6, 1fr)`, 16px gap, `--bg-elev` cells with hairline borders and
28px padding. One feature cell spans 4 and is taller with a big display-face number in
`--accent` or a small diagram at its foot; the rest span 2 or 3. Collapses to two
columns at 920px and one at 540px. Hover lifts by 3px and brightens the border.
Nothing else moves.

**The honest comparison.** A table whose "us" column is tinted `--pale-blue-bg` and
headed in `--accent`, and whose rows include at least one the product loses. nuthatch
titles the section "The honest comparison." and means it. A comparison table where one
column wins every row is read, correctly, as a lie, and it costs more credibility than
the features gain.

**The stat band.** A full-width band on `--bg-elev` between hairline rules, three
columns, each a display-face number at `clamp(2.6rem, 5vw, 3.8rem)` with the unit or
suffix in `--accent`, and a ~30ch muted label beneath.

**The scope panel.** Two mono-labelled columns under one heading: what the product
does, and what it deliberately does not. "In scope" in `--ok`, "out of scope" in
`--rust` - a boundary, not a failure, which is what the second accent is for. The two
columns must be roughly the same length; a three-item "out of scope" beside a
twelve-item "in scope" is the table-that-wins-every-row problem in a different hat.
Follow it with a short paragraph on how to use the thing well and where to self-host.

**The before/after diptych.** Two code panels side by side under a single heading that
poses the question - redstart's *"Would you rather write and maintain this"*. The
"before" panel is muted, longer, and real code from the ecosystem being replaced; the
"after" is shorter and syntax-highlighted with the accent doing the work. Line counts
go in mono above each panel, because the whole argument is the ratio. Stacks at 920px
with the before on top. Highlighting is build-time (Shiki), never a client-side
library.

---

## 6. Motion budget

One entrance, one pulse, and nothing else. Motion is spent, not sprinkled.

- **Entrance.** `opacity 0 → 1` with `translateY(10px→0)`, 600–700ms,
  `cubic-bezier(0.16, 1, 0.3, 1)`. Hero elements stagger at 50/120/190ms. Below the
  fold, drive it with `IntersectionObserver`, never a scroll listener.
- **Pulse.** Exactly one live indicator on the page - the serving dot in the
  terminal, typically - at 2.4s, opacity 1 → 0.45 → 1.
- **Hover.** Border colour and a 3px lift on cards; `scale(0.98)` on `:active` for
  buttons. 120–220ms. Nothing hovers into a new colour.
- **Ambient.** Only with the atmospheric texture, only as a fixed non-interactive
  layer, and it does not animate.

Animate `transform` and `opacity` only. Every animation and transition sits inside a
`@media (prefers-reduced-motion: reduce)` block that switches it off, and the page
must be complete and legible with all of it disabled - which is also how it renders
for a crawler.

---

## 7. Assets and the performance contract

This is a moral position as much as a technical one, and it is why the nuthatch site
reads as credible: the site practises the thing the product is selling.

- **Zero third-party requests.** No font CDN, no analytics, no tag manager, no
  picsum, no CDN-hosted anything. Fonts are self-hosted woff2, subset with `fonttools`
  to the glyphs actually used - roughly 40KB for both faces together.
- **Inline the CSS.** Astro: `inlineStylesheets: 'always'`. Static HTML: one `<style>`
  block in the head. One request for the document, one per font.
- **Budget.** The landing page transfers under 100KB. nuthatch measures ~46KB.
- **No photography and no stock illustration.** Every graphic is SVG that depicts a
  real thing in the product: the namesake creature as a logomark, the actual data
  pipeline, the actual horizon it lives on. An icon is a 24px SVG at 1.7 stroke, drawn
  to standard, never a library import.
- **No emoji.** The one standing exception is a single 🇧🇬 in the nuthatch footer,
  which is a signature rather than a decoration.
- Ships `llms.txt`, `robots.txt`, `sitemap.xml`, a real favicon, and honest `og:`
  metadata on the apex domain.

yatr loads Google Fonts; redstart and camp ship Next.js bundles. All three predate the
rule. Do not copy them; when any of those landings is next touched, bring it into line.

---

## 8. Copy

The writing is half the style. Full rules in `reference/voice.md`. The short form:

- Sentence case headings, always, ending in a full stop when they are a sentence.
- Plain declaratives, often three words. *"Be your own indexer." "Three front doors."
  "The eject path is the whole bet." "Two minutes. One binary. No one to ask."*
- Specific numbers instead of adjectives. `0.43s` beats "blazing fast", and it is also
  checkable, which is the point.
- No hype vocabulary: elevate, seamless, unleash, next-gen, game-changer, delve,
  revolutionary, effortless, powerful, robust. No exclamation marks.
- No placeholder names. Ever. Real addresses, real repos, real commands.
- State the limitation in the product's own voice, in the comparison table and in the
  prose. It reads as confidence because it is.

---

## 9. Texture: flat or atmospheric

The palette does not vary. The texture may, once, per site. Pick before you start.

**Flat** - the nuthatch setting, the default, and the one to reach for unless you have
a reason. No gradients anywhere. No shadows at all. Flat surfaces separated by
hairlines and whitespace. Geometric sans for display. Optional light theme. Quieter,
more document-like, ages better, and reads as an instrument.

**Atmospheric** - the yatr setting, rendered in the mandated palette. A fixed ambient
layer of two large radial glows built from `--accent` and `--rust` at 0.10–0.16 alpha,
plus an SVG turbulence grain at 0.035 with `mix-blend-mode: overlay`. Cells get a 180°
gradient between two surface tiers. The hero terminal gets one deep shadow. Editorial
serif with an italic accent cut for display. An illustrated horizon motif anchoring the
hero. Dark only - the ambient layer has no honest light inversion, so do not build one.

Both settings are in `reference/tokens.css`. The atmospheric block there is texture
only; it inherits every colour from the mandated palette and defines no hues of its
own. If you find yourself adding a hue to it, stop.

If the product is infrastructure someone operates, use flat. If it is a tool someone
enjoys, atmospheric is available. When unsure, flat.

---

## 10. Revamping an existing site

The common case is not a greenfield page but an existing site to be brought over.
Follow `reference/retrofit.md` - it is a procedure with an order, and the order
matters, because retrofitting the components before the tokens produces a site that is
half in each style and worse than either.

Short form: tokens first, then type, then borders and elevation, then the section
grammar, then the artefacts, then the copy, then measure.

---

## 11. Banned

- Any colour not in `reference/tokens.css`. A brand hue, a client hue, a third accent,
  a saturated red.
- Pure black, pure white, and any cool-grey or blue-shifted neutral.
- Inter, Roboto, Open Sans. Lucide, Feather, Heroicons.
- Box shadows for card elevation. Glassmorphism beyond the nav blur.
- Gradients in the flat texture. Any gradient on text, in either texture.
- `border-radius: 9999px` on anything larger than a tag or a dot.
- Emoji, hype vocabulary, exclamation marks, placeholder names, invented transcripts.
- **Em dashes.** Not in the copy, not in the comments, not in commit messages. Use a
  full stop, a colon, a plain hyphen, or recast the sentence.
- Stock photography, picsum, icon-library imports, third-party font CDNs.
- Scroll listeners for reveal animation, and any animation that survives
  `prefers-reduced-motion: reduce`.
- A comparison table the product wins outright.

---

## 12. Before you call it done

For a dashboard, use the list at the end of `reference/dashboard.md` instead of the
landing-specific lines below (the rust floor, the terminal, the comparison table).


- [ ] Every colour in the built CSS appears in `reference/tokens.css`.
- [ ] `grep -c 'var(--rust)'` on the stylesheet returns twelve or more.
- [ ] `grep -c '—'` across the source returns zero.
- [ ] `python3 tools/contrast.py` passes.
- [ ] `--text-faint` carries nothing load-bearing.
- [ ] Every section opens with a mono kicker.
- [ ] The terminal transcript is true, and readable with JavaScript disabled.
- [ ] The comparison table contains a row the product loses.
- [ ] Zero third-party requests in the network panel. Landing under 100KB.
- [ ] `prefers-reduced-motion: reduce` leaves a complete, still, legible page.
- [ ] Keyboard: skip link, visible `:focus-visible` ring in accent, install line
      focusable and operable by Enter.
- [ ] 540px, 920px and 1440px all hold. No horizontal scroll at 320px.
- [ ] No word from the banned list survives in the copy.

---

## 13. The dashboard dialect

From lodestar-dashboard.com. For an application someone operates, not the page that explains
it. Read `reference/dashboard.md` in full before building one; the short form:

- `data-palette="brick"` on `<html>`. One accent, brick `#d0704f`, for every label, link and
  focus ring. `--bad` `#e36b6b` is the only red and marks only bad news. **Brick labels
  things. Red reports things.**
- Text on a wash is the `-ink` tone. The hue on its own wash fails AA.
- `html { font-size: 112.5% }`, and every size after that in rem, chart ticks included.
- A fixed sidebar, a blurred topbar, a bottom nav on mobile, and a test that keeps the two
  navigations listing the same pages.
- Hairline stat grids, a readout panel in place of the terminal, badges as the only pills.
- A read that failed says so, and nothing it feeds renders as zero.
- Dark only.
