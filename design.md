# Design — Yabadabadoo Campers

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

Source of this system: direction **A — Editorial atmosférico**, chosen by the
client from a 3-way comparison (`Rumbos Yaba`). Same real photo
(`camper-side.jpeg`), same content, editorial-travel-magazine treatment.

**Revision 2** (signature-detail pass): client picked structure **Opción C —
Papel de viaje** from a second 3-way comparison (sello de viaje / ruta
trazada / papel de viaje), then **Paleta 2 — Terracota mediterráneo** from a
3-way palette comparison on that structure. This revision keeps the
editorial bones (Fraunces + Public Sans, N6 masthead, Ft1 footer, ink-fill
CTA voice) and replaces the accent palette + adds two recurring signature
details: a subtle paper-grain texture site-wide, and a framed/deckle-edge
photo treatment (a physical printed photo tucked onto the page, rotated
slightly) used for hero photography instead of full-bleed.

## Genre
editorial

## Scope
Public marketing site only: home, camper, rutas, reservar, faq, legal pages.
The `/dashboard` admin panel is explicitly out of scope — it stays functional,
not brand-led — see `src/components/dashboard/*`.

## Macrostructure family

- **Marketing pages** (home, camper, rutas): **Photographic** — full-bleed
  real photography dominates each fold, text is small annotation anchored
  bottom-left over a dark gradient veil, not a headline-first layout. Camper
  and rutas may vary the archetype within this family (e.g. Split Studio
  diptych for camper's spec sheet, Long Document travel-journal voice for
  rutas) but keep the photographic-lead + editorial-serif fingerprint.
- **Content pages** (faq): **Conversational FAQ** — bold question, brief
  honest answer, accordion optional.
- **Legal pages** (aviso-legal, condiciones, cookies, privacidad):
  **Long Document** — continuous prose, inline section heads, no marketing
  structure. These already read this way; only retheme typography/colour.
- **Reservar (booking flow)**: functional, typography-only. No enrichment —
  the stepper, calendar and forms carry the page. Reskin with system tokens
  only (colour, type, radius, focus ring); do not add decorative elements
  that could interfere with the working booking logic.

## Theme — Terracota mediterráneo (revision 2)

- `--color-paper`    oklch(96% 0.02 85)   /* warm cream, terracotta-shifted */
- `--color-paper-2`  oklch(91% 0.025 75)  /* sand, section alternation */
- `--color-ink`      oklch(24% 0.02 50)   /* warm near-black */
- `--color-ink-2`    oklch(46% 0.02 50)   /* muted warm grey, secondary text */
- `--color-rule`     oklch(85% 0.02 70)   /* hairline */
- `--color-accent`   oklch(58% 0.15 35)   /* terracotta / brick */
- `--color-focus`    oklch(58% 0.15 35)   /* accent, already ≥3:1 on paper */

Accent use ≤ 5% of any viewport — links, focus rings, small CTA fills, active
nav state. It never becomes a background wash.

## Signature details (revision 2)

- **Paper grain** — a faint SVG feTurbulence noise texture, `opacity: 0.05`,
  `mix-blend-mode: multiply`, fixed full-viewport, behind all content. Utility
  class `.paper-grain`, applied once in the root layout body.
- **Framed / deckle-edge photo** — the real photo sits inside a slightly
  rotated (2°) off-white card with padding and a soft shadow, bottom edge
  clipped into an irregular deckle via `clip-path`, with a small handwritten-
  style caption line beneath (e.g. "Iniesta, verano 2026"). Utility pattern
  `.photo-frame` (card) + `.photo-deckle` (clip-path) in `globals.css`. Used
  for the ONE hero photo per page — not applied to gallery grids or repeated
  thumbnails, to keep it a signature rather than decoration. **Never place a
  `next/image` (`fill`) inside `.photo-deckle`** — the `clip-path` on the
  parent causes Chrome to load the image but never paint it on first render
  (confirmed reproducible; `priority` does not fix it, only a forced reflow
  does, which isn't available to real visitors). Use a plain
  `role="img"` + `background-image` div instead, as done in
  `HomeClient.tsx`, `CamperClient.tsx`, `RutasClient.tsx`.

## Typography

- Display: **Fraunces**, weight 600, style normal (never italic headers)
- Body: **Public Sans**, weight 400 / 600
- Display tracking: -0.01em
- Type scale anchor: `--text-display` = clamp(2.25rem, 3.4vw + 1rem, 3.75rem)

Pairing carried over unchanged from the approved `Rumbos Yaba` mockup — do not
substitute Inter back in.

## Spacing

4-point named scale in `tokens.css`. Pages use named tokens
(`var(--space-md)`), never raw values.

## Motion

- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- Reveal pattern: fade + 12px rise on scroll, once, never re-triggering
- Reduced-motion fallback: opacity-only, ≤150ms
- framer-motion already in the project (motion-on) — reuse it, don't add a
  second motion library

## Microinteractions stance

- Silent success over celebratory toasts (booking confirmation stays a plain
  confirmation state, no confetti/toast)
- Hover-tooltip delay 800ms · focus-tooltip delay 0ms
- `:focus-visible` ring always instant, never animated in

## CTA voice

- Primary CTA: solid ink fill (`--color-ink`), `--radius-sm` (not a full
  pill — pill buttons read as generic SaaS, not editorial), label is a verb
  ("Reservar", not "Empezar ahora")
- Secondary CTA: typographic link — text + arrow, 1px underline, no border
  box

This replaces the current `.btn-primary` (Apple-blue pill) and
`.btn-secondary` (outlined pill) — both get retired in favour of the above.

## Navigation & footer

- Nav: **N6 Newspaper masthead** — full-width header, centred wordmark top
  row, thin link row beneath, double hairline rule below. Replaces the
  current left-wordmark + inline-links bar.
- Footer: **Ft1 Mast-headed** — wordmark + tagline anchor one horizontal
  band, 2–3 links beside, contact/address below.

Both are shared identically across every public page — this is one small
brand site, not a multi-product app; consistency here is the point.

## Per-page allowances

- Marketing pages (home, camper, rutas) MAY use Tier-A/B enrichment (CSS
  photo treatment, hand-built accents). No invented stock photography — only
  the four real photos in `public/images/`.
- Reservar MUST NOT use enrichment — function carries the page.
- Legal + FAQ: typography only.
- Dashboard: out of scope, untouched.

## What pages MUST share

- The wordmark / logotype treatment
- The terracotta accent and its ≤5% placement rule
- Fraunces + Public Sans
- The CTA voice (ink-fill `--radius-sm` primary, typographic-link secondary)
- N6 masthead nav + Ft1 footer
- Section heading rhythm: eyebrow (small caps, accent colour) above a
  Fraunces heading, stacked vertically — never tag-left/heading-right
- The paper-grain texture (site-wide) and the framed/deckle-edge treatment
  on each page's one hero photo

## What pages MAY differ on

- Macrostructure within the page-type family (see above)
- Enrichment tier, on marketing pages only
- Section order and count

## Exports

### tokens.css
```css
:root {
  --color-paper:      oklch(96% 0.02 85);
  --color-paper-2:    oklch(91% 0.025 75);
  --color-ink:         oklch(24% 0.02 50);
  --color-ink-2:       oklch(46% 0.02 50);
  --color-rule:        oklch(85% 0.02 70);
  --color-accent:      oklch(58% 0.15 35);
  --color-accent-ink:  oklch(97% 0.01 90);
  --color-focus:       oklch(58% 0.15 35);

  --font-display: "Fraunces", serif;
  --font-body:    "Public Sans", sans-serif;

  --space-3xs: 0.25rem;  --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-sm:  1rem;     --space-md:  1.5rem;  --space-lg: 2rem;
  --space-xl:  3rem;     --space-2xl: 4.5rem;  --space-3xl: 7rem;

  --text-xs: 0.75rem;   --text-sm: 0.875rem; --text-md: 1.125rem;
  --text-lg: 1.375rem;  --text-xl: 1.75rem;  --text-2xl: 2.25rem;
  --text-display: clamp(2.25rem, 3.4vw + 1rem, 3.75rem);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-short: 220ms;
  --radius-sm: 8px; --radius-md: 14px; --radius-pill: 999px;
}
```

## Provenance

Extracted from the `Rumbos Yaba` design-direction comparison shown to the
client (option A). Real photo (`camper-side.jpeg`), real brand copy
(Iniesta/Cuenca, pet-friendly, Fiat Ducato camperizado). No fabricated
metrics or testimonials to be introduced anywhere in the rebuild.

Revision 2 extracted from two follow-up local-preview comparisons: structure
(sello de viaje / ruta trazada / **papel de viaje** ← chosen) then palette
(sepia mapa antiguo / **terracota mediterráneo** ← chosen / azul vaquero),
built with `/design` + `frontend-design` + `hallmark` guidance combined.
