# CRTTerminal

A phosphor CRT in a bakelite case showing the latest lines of a real feed: decoded rows, log lines, events.

- Provide: a container with a height and `Foundry.CRTTerminal(el, { title?, lines })`; `.push(line)` appends one, `.setLines(arr)` replaces them. Twelve lines show; each is clipped at 40 characters. Needs three@0.149.0.
- The text is real output, newest last. The cursor blinks; under reduced motion it holds.
