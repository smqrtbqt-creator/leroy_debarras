/**
 * Fragments HTML boutons réseaux sociaux — Leroy du Débarras
 */

export const SOCIAL_ICONS = {
  facebook: `<svg class="social-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  workwave: `<svg class="social-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
};

export function socialButton(link, esc) {
  const icon = SOCIAL_ICONS[link.id] || "";
  const aria = link.ariaLabel ? ` aria-label="${esc(link.ariaLabel)}"` : "";
  return `<a href="${esc(link.href)}" target="_blank" rel="noopener noreferrer"${aria} class="social-btn social-btn--${esc(link.id)}">${icon}<span>${esc(link.label)}</span></a>`;
}

export function socialTextLink(link, esc) {
  const aria = link.ariaLabel ? ` aria-label="${esc(link.ariaLabel)}"` : "";
  return `<a href="${esc(link.href)}" target="_blank" rel="noopener noreferrer"${aria}>${esc(link.label)}</a>`;
}

/** Colonne footer type Agence IA Web — liens texte détectables par les crawlers SEO. */
export function footerSocialCol(links, esc) {
  const items = links
    .map(
      (link) => `          <li>
            ${socialTextLink(link, esc)}
          </li>`,
    )
    .join("\n");
  return `      <div>
        <h2>Réseaux sociaux</h2>
        <ul class="footer-social">
${items}
        </ul>
      </div>`;
}
