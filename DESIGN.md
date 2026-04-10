# Design System: Paper

jobsearch.quest uses the "Paper" design language. Warm, editorial, trustworthy. Think a well-designed book or magazine layout, not a SaaS dashboard.

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#111111` | Primary text, buttons, brand |
| `--bg` | `#FAFAF8` | App background (warm white) |
| `--surface` | `#FFFFFF` | Cards, bubbles, elevated surfaces |
| `--surface-warm` | `#FAFAF8` | Warm sections, alternating backgrounds |
| `--surface-card` | `#FFFFFF` | Card backgrounds |
| `--surface-hover` | `#F3F4F6` | Hover states |
| `--text` | `#111827` | Primary text |
| `--text-secondary` | `#6B7280` | Secondary text, descriptions |
| `--text-tertiary` | `#9CA3AF` | Labels, hints, timestamps |
| `--muted` | `#6B7280` | Muted text (alias for text-secondary) |
| `--border` | `#E5E7EB` | Default borders |
| `--border-light` | `#F3F4F6` | Subtle borders, dividers |
| `--border-focus` | `#3B82F6` | Focus rings |
| `--accent` | `#3B82F6` | Accent blue (links, focus, highlights) |
| `--accent-dim` | `#3B82F611` | User bubble background |
| `--accent-mid` | `#3B82F633` | User bubble border |
| `--danger` | `#ef4444` | Error states |
| `--warning` | `#f59e0b` | Warning states |

## Typography

| Role | Font | Weight | Size | Usage |
|------|------|--------|------|-------|
| Display | Montserrat | 700 | 24-32px | Landing page headings (`.display` class) |
| Section label | PT Mono | 400 | 12px | Section labels, uppercase, 0.12em tracking |
| Body (landing) | Roboto | 400/500 | 14-16px | Landing page body text, buttons |
| Body (app) | IBM Plex Sans | 300-600 | 14px | App interface text |
| Code/Mono (app) | IBM Plex Mono | 400/600 | 12-13px | Labels, timestamps, code |

## Spacing

| Token | Value |
|-------|-------|
| Container max-width | 960px |
| Container padding | 24px |
| Section padding | 80px vertical |
| Section label margin-bottom | 12px |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--paper-shadow` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Cards, chat bubbles |
| `--paper-shadow-lg` | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | Elevated elements |
| `--paper-texture` | SVG noise at 2% opacity | Subtle texture overlay |

## Components

### Chat Bubble (shared between app and landing)
- Border radius: 0.75rem
- Padding: 0.75rem 1rem
- Font size: 0.875rem, line-height 1.6
- AI bubbles: white surface, border, paper shadow
- User bubbles: accent-dim background, accent-mid border

### Buttons
- Border radius: 4px
- Padding: 10px 24px
- Font size: 14px, weight 500
- Primary: black bg, white text
- Ghost/outline: transparent bg, border
- Focus: 2px solid primary, 2px offset

### Nav
- Sticky, white with blur backdrop
- Border-bottom: 1px solid border
- 14px link text, secondary color, hover to primary

## Anti-patterns (do NOT use)
- Purple/indigo gradients
- Colored circle icons
- 3-column symmetrical feature grids with icons
- Centered everything
- Default font stacks (Inter, system-ui)
- Decorative blobs or wavy SVG dividers
- Uniform bubbly border-radius on everything
- Colored left-borders on cards

## Design Philosophy
- Paper/editorial aesthetic, not SaaS
- Warm neutrals, minimal color (accent blue only for interactive elements)
- Paper shadows for depth, not drop shadows
- Subtle texture, not flat
- Content-first layout, decoration earns its place
- Asymmetric layouts preferred over symmetrical grids
