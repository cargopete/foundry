# StatGrid

A stat grid shows three to eight headline figures, drawn by 1px hairlines rather than boxes.

- Provide: `.fd-stats` holding `.fd-stat` cells, each a `.fd-stat-l` label (brick mono), a `.fd-stat-n` figure with its unit in `<span class="u">`, and a `.fd-stat-s` qualifier saying what the figure counts.
- Figures use tabular numerals and real values with their source. A figure that failed to load reads "Unavailable" with `.is-unavailable` (red), never 0.
