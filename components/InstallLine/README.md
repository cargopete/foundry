# InstallLine

The install line is a copy button holding one real command.

- Provide: a `<button class="fd-install">` with `.p` (the `$` in brick), `.c` (the command) and `.h` ("copy"), an `aria-label`, and a click handler that writes the command with `navigator.clipboard` and flips `.h` to "copied".
- The command is the one a reader should run, exactly; never a placeholder.
