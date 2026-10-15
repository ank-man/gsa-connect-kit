# GSA Connect Kit

**Free digital business cards for UGA graduate & professional students, with a template for every major.**
Popl/Wave-style tap-and-scan cards, self-hosted on GitHub Pages. Powered by **ScholarTap**.

👉 **Browse the templates:** https://ank-man.github.io/gsa-connect-kit/

Every template is a standalone repo you can clone (or click **Use this template**) and set up in about 3 minutes:

```bash
gh repo create my-card --template ank-man/gsa-connect-entomology --public --clone
cd my-card && npm run setup        # form opens → upload photo & CV → Publish
```

## What every card does

| | |
|---|---|
| 📇 **Save contact** | One-tap vCard download for iPhone / Android / Outlook |
| 📄 **CV & research** | CV PDF, research interests, publications, projects, education, awards |
| 🔳 **QR + NFC** | On-page QR, print-ready `qr.svg`/`qr.png`, and NFC tag instructions |
| 👛 **Wallets** | Apple Wallet `.pkpass`, Google Wallet and Samsung Wallet passes, built in CI from secrets |
| 🧩 **Setup form** | `npm run setup`: template picker, photo crop/upload, CV upload, live phone preview, one-click publish |
| 🎨 **Switch anytime** | Every repo ships all 51 templates; change `"template"` in `card.json` or click one in the form |
| 📶 **NFC writer** | `/nfc.html` writes your card link to an NFC tag from Chrome on Android (verify, batch, lock) |
| 📱 **PWA** | Add to Home Screen, native share sheet, light/dark aware |

## Templates (51)

7 layouts × field-specific themes (palette, type pairing, background motif, sample persona):

| Group | Templates |
|---|---|
| General | Classic · Scholar · Minimal · Midnight · Officer |
| Computing & Data | Computer Science · Data Science · Artificial Intelligence |
| Engineering | Electrical & Computer · Mechanical · Civil & Environmental |
| Physical Sciences | Chemistry · Physics & Astronomy · Mathematics · Statistics · Geology |
| Life Sciences | Genetics · Biochemistry & Molecular Bio · Neuroscience · Ecology · Marine Sciences · Forestry & Natural Resources |
| Plant & Agricultural Sciences | Plant Biology · Plant Pathology · Horticulture · Crop & Soil Sciences · **Entomology** · Food Science |
| Health Professions | Veterinary Medicine · Pharmacy · Medicine · Public Health · Kinesiology |
| Law, Business & Policy | Law · Business (MBA) · Finance & Accounting · Economics · Public Policy & Int'l Affairs |
| Social Sciences & Education | Psychology · Social Work · Education · Anthropology & Archaeology |
| Humanities | English & Literature · Creative Writing · History · Philosophy & Religion · Linguistics & Languages |
| Arts & Media | Journalism & Mass Comm · Fine Arts · Music · Architecture & Environmental Design |

Layouts: **classic** (bold header card) · **scholar** (academic homepage) · **minimal** (link-in-bio) ·
**midnight** (dark, flippable 3D card) · **officer** (ID badge, office hours, events) · **terminal** (shell session) · **portfolio** (work-first editorial).

## How this kit is organised

```
shared/            engine every card shares: js/card.js renderer, setup.html form, scripts/ (build, vCard,
                   Apple/Google/Samsung wallet, dev server), GitHub Actions workflow, sample card.json
layouts/<name>/    index.html + css/style.css for each of the 7 layouts (all colours/fonts are CSS variables)
tools/themes.mjs   the catalog: one entry per template (layout, fonts, palette, motif, sample persona)
tools/motifs.mjs   26 SVG background motifs (DNA, insects, circuit, staff lines, columns…)
tools/assemble.mjs builds ../gsa-connect-<id>/ repos from shared + layout + theme
tools/gallery.mjs  builds index.html (the template catalog)
docs/              README template, wallet setup, NFC & print guides, screenshots
```

### Add or change a template

1. Add an entry to `tools/themes.mjs` (copy an existing one).
2. `npm run assemble -- <id>` → `../gsa-connect-<id>/`
3. `npm install && npx playwright install chromium && npm run screenshots -- <id> && npm run gallery`

Changes to `shared/` or `layouts/` reach every repo when you re-run `npm run assemble`. Existing `.git` folders are kept.

### Wallets for the whole GSA

Put the Apple / Google / Samsung secrets on the **GitHub organisation** that hosts members' card repos.
Every card in the org then gets wallet passes, and members never touch a certificate. See `docs/WALLET-SETUP.md`.

### Brand

"Powered by ScholarTap" comes from `poweredBy` in each `card.json`. Change the default in `shared/card.json`.
UGA colours and the text "UGA GSA" are used as text only. Official UGA marks need approval from UGA Brand & Licensing.

MIT licensed.
