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
//   link-href  -- URL on the right. Defaults to https://hurd.cc.
//   link-label -- text for the link. Defaults to "Made by Hurd Craft Co."
//                 when link-href points at hurd.cc (that's attribution,
//                 not a self-explanatory URL) -- otherwise defaults to
//                 link-href with the scheme stripped (e.g. a GitHub link
//                 already says where it goes, "Made by Hurd Craft Co."
//                 would just be redundant next to a tagline that already
//                 says who the site belongs to).
//
// Self-link suppression: if link-href's hostname matches the current
// page's hostname (e.g. hurd.cc's own usage linking to hurd.cc), the
// link would just reload the page you're already on -- so it renders as
// plain, non-interactive text instead of a link. Not hurd.cc-specific:
// it's a general "don't link to yourself" rule based on where the page
// actually is, so it keeps working correctly if that ever changes.
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

function defaultLinkLabel(linkHref) {
  let hostname
  try {
    hostname = new URL(linkHref, 'https://hurd.cc').hostname
  } catch {
    hostname = ''
  }
  return hostname === 'hurd.cc' ? 'Made by Hurd Craft Co.' : linkHref.replace(/^https?:\/\//, '')
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
    // Self-link: omit the credit entirely rather than showing it as
    // plain text -- on hurd.cc's own usage, the default label ("Made by
    // Hurd Craft Co.") would just repeat what the tagline ("Hurd Craft
    // Co. LLC") already says, so there's nothing useful left to show.
    const credit = isSelfLink(linkHref)
      ? ''
      : `<a class="credit" href="${escapeHtml(linkHref)}" target="_blank" rel="noopener">${escapeHtml(linkLabel)}</a>`

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
          color: var(--color-text-muted, #7a7168);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s ease;
        }
        a.credit:hover,
        a.credit:focus-visible {
          color: var(--color-accent, #8a5a3b);
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
