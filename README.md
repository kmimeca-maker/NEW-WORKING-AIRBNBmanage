# Changeover & property care — marketing site

A single-page static site: `index.html`, `styles.css`, `script.js`. No framework,
no build step. Deploy it by dragging the folder.

## 1. Fill in the placeholders (do this first)

The business details were left as visible tokens so nothing invented ships by
accident. Search and replace each of these across **`index.html`**:

| Token | Replace with | Example |
|---|---|---|
| `[BUSINESS NAME]` | Your trading name | Clyde Changeovers |
| `[COVERAGE AREA]` | Where you work | Clydebank, West Dunbartonshire, and north-west Glasgow |
| `[PHONE]` | Phone number as displayed | 0141 000 0000 |
| `[PHONE-TEL]` | Phone number for `tel:` links — international format, no spaces | +441410000000 |
| `[EMAIL]` | Contact email | hello@example.co.uk |

`[BUSINESS NAME]` also appears in the header comments of `styles.css` and
`script.js` — cosmetic only, but tidy to replace.

A quick check when you're done: search the files for `[` — the only brackets
left should be in code, not copy.

## 2. Change prices

**Every price on the site lives in one place**: the block in `index.html`
between the comments

```
<!-- PRICING — ALL PRICES ON THE SITE LIVE IN THIS ONE SECTION. -->
    ...
<!-- ============ END OF PRICING FIGURES ============ -->
```

That covers the changeover table, add-ons, surcharges, the two service levels,
and the worked example. No figure appears anywhere else — the hero and the
quote form deliberately mention no numbers.

If you change the changeover or linen prices, remember to update the **worked
example** table in the same block so the arithmetic still adds up
(£79 + 6×£60 + 6×£10 + ≈£22 → £442 recovered).

## 3. Connect the quote form

The form ships pointing at a placeholder. Until you replace it, submissions go
nowhere (visitors see a clear error with your phone number as the fallback).

### Formspree (default wiring)

1. Sign up at [formspree.io](https://formspree.io) (free tier is fine) and create a form.
2. Copy your endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
3. Paste it in **two places**:
   - `index.html` — the `action="..."` attribute on `<form id="quote-form">`
   - `script.js` — the `FORM_ENDPOINT` constant at the top

### Netlify Forms (if you deploy to Netlify)

1. In `index.html`, add `data-netlify="true"` and `name="quote"` to the `<form>` tag.
2. In `script.js`, set `FORM_ENDPOINT = "/"`.
3. Redeploy. Submissions appear under **Forms** in the Netlify dashboard.

The form includes a honeypot field (`company`) for spam; both services also
filter on their side. There is no CAPTCHA by design.

## 4. Deploy

The whole site is the three files plus this README — any static host works.

- **Netlify**: [app.netlify.com/drop](https://app.netlify.com/drop) — drag the
  folder onto the page. Done. (Best choice if you want Netlify Forms.)
- **Vercel**: `npx vercel` in this folder, or import the repo at
  [vercel.com/new](https://vercel.com/new).
- **GitHub Pages**: push to GitHub, then Settings → Pages → deploy from the
  main branch, root folder.

After deploying, add your live URL to the commented-out `og:url` meta tag in
`index.html` so shared links carry the right address.

## 5. Other things you might edit

- **Timeline times** (`11:00 → 15:00` hero): in `index.html`, the
  `<figure class="timeline">` block. Times are plain text.
- **Colours**: the six palette values at the top of `styles.css` under
  `:root`. The warm `--signal` colour is reserved for timestamps and flagged
  issues — keep it out of buttons and headings so it keeps its meaning.
- **Fonts**: loaded from Google Fonts via one `<link>` in `index.html`
  (Bricolage Grotesque / Source Sans 3 / IBM Plex Mono). Fallbacks are set, so
  the site still works offline or if the fonts fail to load.

## 6. A note on the copy

The wording is deliberate: the site describes a **changeover and property care
service working at the owner's direction** — it never claims to manage the
property, communicate with guests, or control access. If you edit copy, keep
that boundary. Avoid: "management", "we handle everything", "fully hands-off",
"we take care of your listing", "co-host".
