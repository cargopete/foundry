# NeedleGauge

A moving-coil meter for one live quantity with a known range: memory against its ceiling, calls a minute against a budget.

- Provide: a container and `Foundry.NeedleGauge(el, { min, max, value, label, unit, warnAt?, digits?, ticks? })`; call `.set(v)` on every new reading. `warnAt` paints the arc from there to `max` in `bad`.
- The needle moves only when `.set` gives it a new value, settling like a damped coil; under reduced motion it jumps. Never animate it on a timer.
- SVG, no WebGL: use it where a 3D instrument would be too heavy, including inside tables and cards.
