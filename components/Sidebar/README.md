# Sidebar

The sidebar is the dashboard frame's left column: wordmark, sections titled in brick mono, and links.

- Provide: `<aside class="fd-side">` with a `.fd-side-brand` (lowercase product name in `<b>`, a mono tagline in `<span>`), `.fd-side-sec` groups each led by a `.fd-side-t` title, and `a.fd-side-link`; mark the current page with `aria-current="true"`.
- Width 15rem, fixed; below 920px it hides and a bottom nav lists the same links. Keep a test that compares the two lists.
