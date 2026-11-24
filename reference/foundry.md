# Foundry

Foundry is the one house style for Lodestar, nuthatch-indexer.com, nuthatch analytics and cargopete.com: a warm, dark instrument panel in brick and rust, with working steampunk machines (valve radios, nixie tubes, CRT terminals, moving-coil meters) that display real figures.

> **Brick labels things. Red reports things. Every machine on the page shows a real number.**

## Where it applies

| Product | Wordmark tagline | Frame | Signature instrument |
|---|---|---|---|
| Lodestar (lodestar-dashboard.com) | `graph network` | Dashboard: `Sidebar`, topbar, bottom nav on phones | `NeedleGauge` per indexer health figure |
| nuthatch-indexer.com | `be your own indexer` | Landing: top nav, hero, sections | `CRTTerminal` showing a real `nuthatch dev` run |
| nuthatch analytics (/analytics/) | `analytics` | Dashboard | `NixieCounter` on the tip block, `ValveRadio` on RPC calls a minute |
| cargopete.com | `cargopete` | Landing, editorial | `ValveRadio` tuned to the latest post |

Every wordmark is the lowercase product name in `display` at weight 600, tracked `-0.06em`, with its tagline in `kicker` beneath it in `accent`.

## Content fundamentals

- Write plain declaratives in sentence case, often short: "Be your own indexer." "One process, from RPC to this page." "Slice it any way you like."
- Use the exact number instead of an adjective: "39,186 liquidations", "515 MB resident", "a second per query", never "blazing fast" or "massive".
- Headings that are sentences end in a full stop. Labels and kickers do not.
- Say what a thing does not do, in its own voice and on the same page: "Liquid staking tokens are counted, not priced." A comparison the product wins on every row is read as a lie.
- A terminal or readout shows real output from a real run. Never invent a transcript.
- No exclamation marks except a thank-you, no emoji, no em dashes, no hype words (seamless, unleash, next-gen, revolutionary, effortless, powerful, robust).
- Name things by what people see: "requests answered", not "http_requests_total"; "Unavailable", not "null".
- No comparative or superlative without a number beside it: not "best", "fastest", "most secure", "sexiest", "sweet spot". Lead with the figure the page can prove. No adjective triplets ("fast, single-binary, polyglot").
- Every landing page carries one row the product loses or one out-of-scope list of roughly the same length as the in-scope list. Check every cell of the comparison against the rival's real behaviour (`make -j` exists).
- Say a thing once per page. A hero panel that lists what the next section lists, contact links in three places, the same closing line twice: keep the best one.
- One noun per thing across the site: the CV is "CV" in the nav, the button and the heading.
- A missing value reads "Unavailable", never `—`, `0` or `+0.0%`. A delta whose earlier window never arrived is not shown at all.

## Colour

- Paint every page on `bg`. Lift panels, cards and stat cells to `bg-elev`; set terminals, readouts and instrument wells in `bg-code`; press chips, inline code and chart tracks into `bg-inset`. Separate them with `border` hairlines, `border-hi` when interactive. Never a cool grey, never `#000`.
- Set body copy and figures in `text`; secondary copy, captions and axis ticks in `text-muted`. `text-faint` is decoration only (a window title, a timestamp); it fails AA in dark and never carries a fact.
- `accent` (brick) is the one accent. Spend it on kickers, stat labels and units, links, the current nav item, focus rings, the primary action, a chart's lead series and an instrument's lit glass. Do not introduce a second accent.
- Put text on an accent wash in `accent-ink` on `pale-accent-bg`. Put text on a solid brick fill in `on-accent`.
- `bad` reports bad news and nothing else: a failed read, a failing check, a blocked chain, a negative figure. Its washes take `bad-ink` on `pale-bad-bg`.
- `ok` and `warn` are washed status colours and always sit beside a word ("live", "snapshot"). They never colour a category, a table column or a chart series: a second series is `text-muted`, plain figures are `text`.
- `metal-copper`, `metal-brass`, `metal-iron`, `metal-verdigris`, `material-bakelite` and `glow-valve` are 3D materials only. They never colour UI text, borders or fills.
- Dark is the primary theme. Light is a faithful inversion with its own measured brick (`accent` `#a8481f`, 5.14:1 or better on every light surface); the 3D instruments are drawn for dark and sit in a `bg-code` well in both themes.

## Type

- Set the root at `html { font-size: 112.5% }` and size everything after that in rem, chart ticks included, so the page follows the reader's own browser text size.
- `display` (Space Grotesk) for `hero`, `h1`, `title` and `figure`, weight 500, tracked tight. `sans` (the same face) for `lede`, `body`, `nav` and `small`.
- `mono` (JetBrains Mono) is the instrument label, not only the code font: every `kicker`, stat label, unit, badge, table header, install line and terminal. Kickers are uppercase, tracked `0.12em`, in `accent`.
- Figures use `font-variant-numeric: tabular-nums` so columns line up.
- The scale is fixed. At the 112.5% root:

  | Step | Size | Use |
  |---|---|---|
  | `hero` | `clamp(2.4rem, 6vw, 3.6rem)` | the one landing claim |
  | `figure` | `clamp(2rem, 4.5vw, 3rem)` | stat-band numbers |
  | `h1` | 1.875rem, `-0.04em` | page titles, one per page, one component |
  | `title` | 1.25rem | section and panel headings |
  | `lede` | 1rem (18px) | the paragraph under a heading |
  | `body` | 0.889rem (16px) | all running text, captions included |
  | `small` | 0.75rem (13.5px) | one-line meta only: a timestamp, a table cell, a hint |
  | `kicker` | 0.625rem (11.25px) | mono labels, uppercase, tracked |

  Nothing else. Running text is never under 16px; a caption of two lines or more is `body`. A page that renders more than ten distinct sizes has drifted: count with `getComputedStyle` before calling it done.
- Weights are 400 and 500, and 600 for the wordmark only. No 700, and `font-semibold` is not a utility to reach for on everything.
- Mono caps are for kickers and labels, never for form labels, table headers people read, or anything in Cyrillic, where the tracking wrecks the word.
- Self-host both faces as woff2 with `font-display: swap`; load nothing from a font CDN. The files here are subset to the glyphs nuthatch-indexer.com uses: subset again per site from the full families before relying on unusual glyphs.

## Layout

- Dashboards use the frame: `Sidebar` (15rem, fixed), a 4.5rem topbar at 80% `bg` with a backdrop blur and a hairline under it (page name in brick mono on the left, a live chip on the right), and below 920px a bottom nav of three destinations and a More sheet. The sidebar and the bottom nav list the same routes, checked by a test.
- Landing pages use the grammar: a sticky top nav, a hero with one claim and one instrument, a proof band (`StatGrid`), then sections that each open with `SectionHead`, then an honest scope panel, then a close with the `InstallLine`.
- Content caps at 72rem with a 24px gutter, 16px under 540px. Nothing scrolls the page sideways; wide tables and code scroll inside their own container.
- Elevation is a surface tier plus a hairline. The one shadow, `shadow-float`, sits under a readout or terminal floating over a 3D scene.
- Radii: `radius-sm` for buttons and chips, `radius-md` for panels, `radius-pill` for badges and dots only.
- Grids fill. Cell spans sum to whole rows at every breakpoint; eight cells in three columns leaves an orphan, so use nine, four columns, or a spanning last cell. A stat grid's column count divides its cell count.
- Grid and flex children that hold code or tables get `min-width: 0`, or one long line widens the whole page. Check `document.documentElement.scrollWidth` at 390px.
- Section rhythm is one rule, not two: either hairline dividers or section padding carries the separation, never 6rem each side of an `<hr>`.
- Mobile nav: below 920px the links wrap to a second row or move into a menu. They are never simply hidden, and the nav CTA keeps `margin-left: auto`. A dashboard's pinned sidebar card must not push routes out of sight.
- A hero has at most two calls to action: the install line and one ghost link. A leftover `TODO` badge is not a third.
- An install command wraps on phones (`white-space: pre-wrap; overflow-wrap: anywhere`) rather than clipping the half that matters.
- Scenery has a budget. A 3D scene that a ground wash covers to near-invisibility is not shipped; if the page cannot afford to show it, drop it. The landing still transfers under 100KB before the scene, and the scene loads after first paint.
- One segmented control, one badge, one page header per site, drawn once as a component. Three styles of the same toggle is drift.

## The instruments

**Superseded 2026-11-08.** Instruments that display figures read as comical, so the shipped sites use
scenery instead: a full-bleed 3D scene behind the hero and an ambient layer of dim parts in the
margins, both from `scenes/` (`createMachineRoom`, `createWorkbench`, `createSea`, `createRelay`, `createAmbient`). `createRelay` is the one for anything that routes requests: an exchange tower, masts in rings, and requests and answers running along the cables.
The components below remain in `components/` for reference and are not used by any site.

The steampunk layer is machinery that works, not costume.

- **Ornament test:** draw a machine only if it displays a real figure from the product. A dial that shows nothing, a cog that turns forever, a gauge that wobbles on a timer: delete it.
- Pick by figure: one large changing integer → `NixieCounter`; a rate or level on a known scale → `ValveRadio` (hero) or `NeedleGauge` (anywhere); a stream of lines → `CRTTerminal`.
- At most one hero instrument per page and three WebGL instruments in all. `NeedleGauge` is SVG and may repeat.
- Every instrument sits in an `.fd-instrument` well with a plate naming what it reads ("Tip block", "RPC calls / min").
- Light them like a bench lamp: one warm key from the upper right, a low fill, a faint rim. Brass is polished, never gold, and under a tenth of a machine; iron and bakelite are most of it; verdigris is one small patch at most.
- Machines move only when their figure moves: a needle settles, a nixie digit changes, a line arrives. Under `prefers-reduced-motion: reduce` they render still, and they pause when scrolled out of view.
- When the data behind an instrument cannot be read, the plate says "Unavailable" in `bad` and the machine goes dark. It never shows a stale number as if it were live.

## Motion

- One entrance per page: opacity and a 10px rise over 700ms on `cubic-bezier(0.16, 1, 0.3, 1)`, driven by an IntersectionObserver.
- One pulse per page: the live dot, 2.4s.
- Hover changes a border to `border-hi` or a link to `accent`; buttons scale to 0.98 on press. Nothing lifts, and a filled button keeps its fill: no hovering into `accent-ink` or a new colour. No arrow-shift on links.
- Nothing pings, twinkles or glows forever. A nav pill that pulses is louder than the hero.
- All of it switches off under reduced motion, and every page is complete and legible without it.

## Iconography

- No icon libraries (Lucide, Feather, Heroicons) and no emoji, the gear emoji least of all.
- Draw the few icons a page needs as 24px SVG at a 1.7 stroke in `currentColor`, each depicting a real thing in the product. Two features never share one generic glyph.
- Link glyphs: `→` for internal, `↗` for external, nothing on `mailto:` or in-page anchors. No `›`, no `↓` on a button.
- A "how it works" section is a drawn diagram of the real pipeline, with the prose as captions under it. Three columns of prose is the slop version.
- The 3D instruments are the illustration. No stock photography, no generated imagery.

## Accessibility

- Text pairs measured in both themes: `text` 12.8:1 or better, `text-muted` AA on all four surfaces, `accent` 5.26:1 dark and 5.14:1 or better light, `accent-ink` on its wash 9.4:1 dark and 7.55:1 light.
- Focus is a 2px `accent` outline offset 3px on everything interactive. The skip link is `accent` with `bg` text.
- A failed read says so in `bad`, once, at the top of the panel, and every figure it feeds reads "Unavailable". Never a confident zero, an empty table, or a green "Stable" for data that never arrived.
