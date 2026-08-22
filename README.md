# hurd-footer

A shared footer for the hurd.cc family of sites, as a single dependency-free
Web Component (`<hurd-footer>`) — one implementation instead of one per
framework, since these sites span Next.js, SvelteKit, and Nuxt.

## Usage

Load `hurd-footer.js` as a module (via the jsDelivr CDN below, or copy the
file locally), then use the element anywhere in your page/layout:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/rh7112/hurd-footer@main/hurd-footer.js"></script>

<hurd-footer
  tagline="Ryan Hurd — Software Engineer"
  link-href="https://ryan.hurd.cc"
></hurd-footer>
```

### Attributes (all optional)

| Attribute | Default | Description |
|---|---|---|
| `tagline` | `Hurd Archives` | Text on the left |
| `link-href` | `https://ryan.hurd.cc` | URL on the right |
| `link-label` | `Made by Ryan Hurd` if `link-href` points at ryan.hurd.cc, otherwise `link-href` with the scheme stripped | Text for the link |

### Per-framework notes

- **Next.js / React**: `<hurd-footer>` works as plain JSX (it's a native
  element, not a React component) — put the `<script type="module">` tag
  in your root layout and the element wherever the footer belongs.
- **SvelteKit**: same — put both in `+layout.svelte`.
- **Nuxt/Vue**: Vue treats unrecognized hyphenated tags as native custom
  elements automatically. If you see a dev-time warning, add to
  `nuxt.config.ts`:
  ```ts
  vue: { compilerOptions: { isCustomElement: (tag) => tag === 'hurd-footer' } }
  ```

### Theming

The component reads `--color-border`, `--color-text-muted`, and
`--color-accent` from the host page if defined (custom properties pierce
shadow DOM), and falls back to its own defaults otherwise — so it looks
right immediately, and matches a site's own palette once that site
defines those tokens.

### SSR note

Like any Web Component, this only renders once its JS runs in the
browser — a server-rendered page will show an empty `<hurd-footer>` tag
until it upgrades client-side. Fine at personal-site scale; just not
server-rendered content.

## Updating

Edit `hurd-footer.js`, commit, push to `main` — that's it. Every
consuming site loads this file straight from jsDelivr's CDN at page-load
time rather than bundling it in at their own build time, so nothing
downstream ever needs a rebuild: the change is live for every site the
moment jsDelivr's edge cache picks it up. A GitHub Action
(`.github/workflows/purge-jsdelivr.yml`) purges that cache automatically
on every push to `main`, so in practice the change is live within
moments, not jsDelivr's ~12h default TTL.
