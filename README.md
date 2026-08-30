# Leroy Débarras — site vitrine

Site statique indépendant, prêt à être déployé sur son propre domaine.
Ne dépend pas d’agence-ia-web.com.

## Configuration (une seule source)

Fichier : `js/site-config.js`

| Variable | Usage |
| --- | --- |
| `SITE_URL` | Domaine définitif, **sans slash final**. Canonicals, Open Graph, JSON-LD, sitemap, robots. |
| `SITE_NAME` / `BUSINESS_NAME` | Nom affiché |
| `PHONE` / `PHONE_DISPLAY` | Affiche les boutons « Appeler » uniquement s’ils sont renseignés |
| `EMAIL` | Lien mailto + repli du formulaire si pas d’endpoint |
| `ADDRESS` / `POSTAL_CODE` / `CITY` | NAP — laisser `null` tant que l’adresse n’est pas fournie |
| `FORM_ENDPOINT` | URL POST JSON du formulaire (backend / CRM / e-mail) |
| Champs légaux | `LEGAL_NAME`, `LEGAL_FORM`, `SIRET`, `PUBLICATION_DIRECTOR`, `HOSTING`, etc. |

Après changement de `SITE_URL` :

```bash
node tools/apply-site-url.mjs
```

(équivalent : `node tools/build-pages.mjs` puis `node tools/minify.mjs`)

## Formulaire

Non relié à un service externe par défaut. États : envoi, succès, erreur, validation.
Anti-spam : honeypot `website` + horodatage `startedAt`.
Photos : champ prévu ; envoi des fichiers seulement lorsque l’infrastructure le permettra.

## En-têtes

`_headers` (Netlify / Cloudflare Pages) : nosniff, Referrer-Policy, frame deny.
Adapter un vhost nginx à partir de `deploy/nginx.conf.example`.
