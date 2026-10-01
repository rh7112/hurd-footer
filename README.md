# hurd-footer

A shared footer for the Hurd Craft Co. family of sites, as a single
dependency-free Web Component (`<hurd-footer>`) — one implementation
instead of one per framework, since these sites span Next.js, SvelteKit,
and Nuxt.

## Usage

Load `hurd-footer.js` as a module (via the jsDelivr CDN below, or copy the
file locally), then use the element anywhere in your page/layout:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/rh7112/hurd-footer@main/hurd-footer.js"></script>

<hurd-footer
  tagline="Ryan Hurd — Software Engineer"
  link-href="https://hurd.cc"
></hurd-footer>
```

The footer also renders a `© <current year>` ahead of the tagline automatically
-- not an attribute, just computed at render time.

The right-hand link renders as the Hurd Craft Co. logo mark (orange "Hurd" +
blue "Craft"/"Co." stacked), not plain text -- fixed brand colors, not themed
per site.

If `link-href`'s hostname matches the page's own hostname (e.g. hurd.cc's own
usage linking to hurd.cc), the credit link is omitted entirely rather than
rendered as a dead self-link -- automatic, based on where the page actually
is, not specific to any one domain.

### Attributes (all optional)

| Attribute | Default | Description |
|---|---|---|
| `tagline` | `Hurd Archives` | Text on the left (after the auto `©` + year) |
| `link-href` | `https://hurd.cc` | URL on the right |
| `link-label` | `Made by Hurd Craft Co.` if `link-href` points at hurd.cc, otherwise `link-href` with the scheme stripped | Not shown visually -- the link's accessible name (`aria-label`/`title`) for screen readers and tooltips, since the logo mark carries no text node |

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

The tagline/copyright text reads `--color-border` and `--color-text-muted`
from the host page if defined (custom properties pierce shadow DOM), and
falls back to its own defaults otherwise — so it looks right immediately,
and matches a site's own palette once that site defines those tokens.

The logo mark does *not* theme per site — it always renders in fixed Hurd
Craft Co. brand colors (orange/blue, with a dark-mode-aware variant via
`prefers-color-scheme`), since it's meant to be a consistent company mark
rather than blend into each site's own palette. `--color-accent` is no
longer read by this component; if your site only defined that token for
the footer's benefit, it's now unused and safe to remove.

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
