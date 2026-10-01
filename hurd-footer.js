// <hurd-footer> -- a shared site footer for the Hurd Craft Co. family of
// sites (Next.js, SvelteKit, Nuxt -- see the README), built as a native
// Web Component specifically so there's exactly one implementation to
// maintain instead of one per framework. No build step, no
// dependencies: this file is consumed directly, either via a CDN URL
// (jsDelivr serving straight from this repo) or copied locally.
//
// Usage: load this file as a module, then use the element anywhere:
//   <script type="module" src=".../hurd-footer.js"></script>
//   <hurd-footer tagline="Ryan Hurd — Software Engineer" link-href="https://hurd.cc"></hurd-footer>
//
// Attributes (all optional):
//   tagline    -- text on the left. Defaults to "Hurd Archives".
//   link-href  -- URL on the right. When it points at hurd.cc (the
//                 default), renders as "Made by " + the Hurd Craft Co.
//                 logo mark; any other host renders as plain text
//                 instead, since the logo shouldn't be attributed to
//                 somewhere else. Defaults to https://hurd.cc.
//   link-label -- not shown visually in the hurd.cc/logo case -- used as
//                 the link's accessible name (aria-label/title) for
//                 screen readers and tooltips instead, since the
//                 rendered content there ("Made by " + an SVG) doesn't
//                 read cleanly as one phrase on its own. Shown directly
//                 as the visible text in the plain-text (non-hurd.cc)
//                 case. Defaults to "Made by Hurd Craft Co." when
//                 link-href points at hurd.cc, otherwise link-href with
//                 the scheme stripped.
//
// Self-link suppression: if link-href's hostname matches the current
// page's hostname (e.g. hurd.cc's own usage linking to hurd.cc), the
// link would just reload the page you're already on -- so it renders as
// plain, non-interactive text instead of a link. Not hurd.cc-specific:
// it's a general "don't link to yourself" rule based on where the page
// actually is, so it keeps working correctly if that ever changes.
//
// Theming: the shadow-DOM styles read --color-border/--color-text-muted
// custom properties from the host page if defined (custom properties
// pierce shadow DOM boundaries), falling back to this component's own
// defaults otherwise -- so it looks reasonable dropped into any site
// untouched, and matches a site's own palette once that site defines
// those tokens. The logo mark itself uses fixed Hurd Craft Co. brand
// colors (not --color-accent) since it's a consistent company mark
// rather than something that should blend into each site's own theme --
// --color-accent is no longer read by this component at all.
//
// SSR note: like any Web Component, this only renders once its JS runs
// in the browser -- server-rendered HTML will show an empty
// <hurd-footer> tag until it upgrades client-side. For a personal-scale
// site this is a non-issue in practice (near-instant), but it's not
// server-rendered content.

// The Hurd Craft Co. wordmark: "Hurd" (Fraunces) beside "Craft"/"Co."
// stacked (Manrope), orange + blue. Lives inline (not as an external
// image) so it respects currentColor-independent brand colors without
// a network request, matching this file's "no build step, no
// dependencies" design -- Fraunces/Manrope are requested via
// font-family with Georgia/system-ui fallbacks, not loaded by this
// component itself, so sites that haven't loaded those Google Fonts
// still get a readable (if not pixel-identical) mark rather than a
// missing asset.
const logoSvg = `
  <svg class="logo" viewBox="0 0 118 26" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    <text x="0" y="20" class="logo-hurd">Hurd</text>
    <text x="64" y="11" class="logo-stack">CRAFT</text>
    <text x="64" y="21" class="logo-stack">CO.</text>
  </svg>
`

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch])
}

function isHurdCcHref(linkHref) {
  try {
    return new URL(linkHref, 'https://hurd.cc').hostname === 'hurd.cc'
  } catch {
    return false
  }
}

function defaultLinkLabel(linkHref) {
  return isHurdCcHref(linkHref) ? 'Made by Hurd Craft Co.' : linkHref.replace(/^https?:\/\//, '')
}

function isSelfLink(linkHref) {
  try {
    return new URL(linkHref, window.location.href).hostname === window.location.hostname
  } catch {
    return false
  }
}

class HurdFooter extends HTMLElement {
  connectedCallback() {
    const tagline = this.getAttribute('tagline') || 'Hurd Archives'
    const linkHref = this.getAttribute('link-href') || 'https://hurd.cc'
    const linkLabel = this.getAttribute('link-label') || defaultLinkLabel(linkHref)
    const year = new Date().getFullYear()
    // "Made by " + the logo mark only when link-href actually points at
    // hurd.cc -- the logo represents Hurd Craft Co. specifically, so a
    // link crediting somewhere else (a rare case today, but supported)
    // falls back to plain text instead of misattributing the mark.
    const creditInner = isHurdCcHref(linkHref)
      ? `Made by ${logoSvg}`
      : escapeHtml(linkLabel)
    // Self-link: omit the credit entirely rather than showing it as
    // plain text -- on hurd.cc's own usage, the default label ("Made by
    // Hurd Craft Co.") would just repeat what the tagline ("Hurd Craft
    // Co. LLC") already says, so there's nothing useful left to show.
    const credit = isSelfLink(linkHref)
      ? ''
      : `<a class="credit" href="${escapeHtml(linkHref)}" target="_blank" rel="noopener" aria-label="${escapeHtml(linkLabel)}" title="${escapeHtml(linkLabel)}">${creditInner}</a>`

    const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          max-width: 720px;
          margin: 2rem auto 0;
          padding: 1.25rem 1.5rem 2rem;
          border-top: 1px solid var(--color-border, #e4dcd0);
          font-family: system-ui, sans-serif;
          font-size: 0.82rem;
          line-height: 1.4;
          color: var(--color-text-muted, #7a7168);
        }
        .tagline {
          display: flex;
          align-items: baseline;
          gap: 0.4em;
        }
        .year {
          font-variant-numeric: tabular-nums;
          opacity: 0.75;
        }
        .credit {
          display: inline-flex;
          align-items: center;
          gap: 0.4em;
          color: var(--color-text-muted, #7a7168);
          text-decoration: none;
          opacity: 0.9;
          transition: opacity 0.15s ease;
        }
        a.credit:hover,
        a.credit:focus-visible {
          opacity: 1;
        }
        .logo {
          height: 22px;
          width: auto;
          overflow: visible;
        }
        .logo-hurd {
          font-family: Fraunces, Georgia, 'Times New Roman', serif;
          font-weight: 700;
          font-size: 20px;
          fill: #e8600c;
        }
        .logo-stack {
          font-family: Manrope, system-ui, sans-serif;
          font-weight: 700;
          font-size: 7px;
          letter-spacing: 0.06em;
          fill: #2563eb;
        }
        @media (prefers-color-scheme: dark) {
          .logo-hurd { fill: #fb923c; }
          .logo-stack { fill: #60a5fa; }
        }
      </style>
      <footer>
        <span class="tagline"><span class="year">&copy; ${year}</span><span>${escapeHtml(tagline)}</span></span>
        ${credit}
      </footer>
    `
  }
}

customElements.define('hurd-footer', HurdFooter)
