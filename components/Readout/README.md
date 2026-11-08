# Readout

A readout is the dashboard's terminal: a mono panel of live rows from a real source, newest first.

- Provide: `.fd-readout` with a `.fd-readout-head` (what it reads, and the block or time it is current to in `<b>`), rows of `.fd-readout-row` (`.w` when, `.v` what, a value), and a `.fd-readout-foot` saying what a row is.
- A failed read adds `.is-failed` and a `.fd-readout-failed` line in red; never an empty list that looks like quiet.
