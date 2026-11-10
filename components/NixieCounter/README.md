# NixieCounter

A row of nixie tubes for one large integer that changes: the tip block, a running count.

- Provide: a container with a height (the tubes fit its width), and `Foundry.NixieCounter(el, { digits, value })`; call `.set(n)` when the number changes. Needs three@0.149.0 loaded first.
- Each tube holds all ten cathodes unlit; only the current digit glows, with a faint tremble that stops under reduced motion. Leading tubes stay dark for a shorter number.
- One counter per page at most: it is the page's single most important live number.
