# Design Brief

## Direction

Golden Light — a premium Thai real-estate social commerce platform on warm white/light-yellow surfaces with champagne gold accents used sparingly for CTAs, badges, ratings, and highlights.

## Tone

Refined luxury meets flat modern material — minimalist, trustworthy, and editorial, with generous white space and a bento grid that feels curated rather than busy.

## Differentiation

The gold-on-light-yellow "Golden Light" system with a luxury serif display face (Fraunces) over a clean sans body creates a distinctive, premium Thai-branded voice that no generic real-estate template matches.

## Color Palette

| Token      | OKLCH          | Role                                   |
| ---------- | -------------- | -------------------------------------- |
| background | 0.985 0.02 90  | warm off-white / light yellow canvas   |
| foreground | 0.22 0.02 55   | deep warm charcoal text                |
| card       | 1.0 0.004 90   | pure white surfaces                    |
| primary    | 0.72 0.14 80   | champagne gold — CTAs, active states   |
| accent     | 0.78 0.12 85   | lighter gold — highlights, icons       |
| muted      | 0.94 0.03 90   | light yellow secondary surfaces        |
| border     | 0.9 0.025 85   | soft warm hairlines                    |

## Typography

- Display: Fraunces — brand logo, hero, section headings (luxury serif)
- Body: General Sans — UI labels, paragraphs, cards (clean modern sans)
- Scale: hero `text-4xl md:text-6xl font-semibold tracking-tight`, h2 `text-2xl md:text-4xl font-semibold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Flat surfaces with soft warm shadows (`shadow-subtle` for resting cards, `shadow-elevated` for floating header/bottom nav, `shadow-gold` for primary CTAs) create hierarchy without heavy gradients.

## Structural Zones

| Zone       | Background        | Border   | Notes                                  |
| ---------- | ----------------- | -------- | -------------------------------------- |
| Header     | glass (blur)      | border-b | floating, gold logo, side menu, bell   |
| Content    | background        | —        | bento grid, alternating muted sections |
| Bottom nav | glass (blur)      | border-t | floating, 5 tabs, active gold          |
| Footer     | muted/40          | border-t | OurHome + NIC GROUP 95 (THAILAND)      |

## Spacing & Rhythm

Mobile-first; generous section gaps (`py-12 md:py-20`), bento grid with `gap-4`, card padding `p-5 md:p-6`, tight micro-spacing `gap-2` within cards.

## Component Patterns

- Buttons: pill/rounded-full, gold primary with dark text, soft `shadow-gold`, hover lift
- Cards: rounded `rounded-2xl md:rounded-3xl`, white `bg-card`, `shadow-subtle`/`shadow-elevated`
- Badges: pill, gold or light-yellow fill, dark text, small uppercase Thai labels
- Ratings: gold star icons, dark numeric value

## Motion

- Entrance: `fade-in-up` 0.5s on cards/hero, staggered on load
- Hover: cards lift + `shadow-elevated`, buttons brighten, 0.3s `transition-smooth`
- Decorative: subtle `float` on hero accents, `shimmer` on gold badges/CTAs

## Constraints

- Gold used sparingly — only CTAs, icons, badges, ratings, borders, highlights
- Thai UI copy throughout; keep labels short for clarity
- AA+ contrast: dark text on light-yellow surfaces, dark text on gold CTAs
- Token-only styling — no raw hex or inline color literals in components

## Signature Detail

The champagne-gold gradient CTA with `text-gradient-gold` on the Fraunces brand lockup delivers a distinctly premium, trustworthy Thai luxury identity.
