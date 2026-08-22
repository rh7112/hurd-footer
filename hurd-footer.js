// <hurd-footer> -- a shared site footer for the hurd.cc family of sites
// (Next.js, SvelteKit, Nuxt -- see the README), built as a native Web
// Component specifically so there's exactly one implementation to
// maintain instead of one per framework. No build step, no
// dependencies: this file is consumed directly, either via a CDN URL
// (jsDelivr serving straight from this repo) or copied locally.
//
// Usage: load this file as a module, then use the element anywhere:
//   <script type="module" src=".../hurd-footer.js"></script>
//   <hurd-footer tagline="Ryan Hurd — Software Engineer" link-href="https://ryan.hurd.cc"></hurd-footer>
//
// Attributes (all optional):
//   tagline    -- text on the left. Defaults to "Hurd Archives".
//   link-href  -- URL on the right. Defaults to https://ryan.hurd.cc.
//   link-label -- text for the link. Defaults to "Made by Ryan Hurd".
//
// Theming: the shadow-DOM styles read --color-border/--color-text-muted/
// --color-accent custom properties from the host page if defined
// (custom properties pierce shadow DOM boundaries), falling back to this
// component's own defaults otherwise -- so it looks reasonable dropped
// into any site untouched, and matches a site's own palette once that
// site defines those tokens.
//
// SSR note: like any Web Component, this only renders once its JS runs
// in the browser -- server-rendered HTML will show an empty
// <hurd-footer> tag until it upgrades client-side. For a personal-scale
// site this is a non-issue in practice (near-instant), but it's not
// server-rendered content.

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch])
}

class HurdFooter extends HTMLElement {
  connectedCallback() {
    const tagline = this.getAttribute('tagline') || 'Hurd Archives'
    const linkHref = this.getAttribute('link-href') || 'https://ryan.hurd.cc'
    const linkLabel = this.getAttribute('link-label') || 'Made by Ryan Hurd'

    const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          max-width: 720px;
          margin: 2rem auto 0;
          padding: 1.25rem 1.5rem 2rem;
          border-top: 1px solid var(--color-border, #e4dcd0);
          font-family: system-ui, sans-serif;
          font-size: 0.82rem;
          color: var(--color-text-muted, #7a7168);
        }
        a {
          color: var(--color-text-muted, #7a7168);
          text-decoration: none;
        }
        a:hover {
          color: var(--color-accent, #8a5a3b);
        }
      </style>
      <footer>
        <span>${escapeHtml(tagline)}</span>
        <a href="${escapeHtml(linkHref)}" target="_blank" rel="noopener">${escapeHtml(linkLabel)}</a>
      </footer>
    `
  }
}

customElements.define('hurd-footer', HurdFooter)
