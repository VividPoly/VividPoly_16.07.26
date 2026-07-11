# Knack Packaging Design Tokens

Source of truth for all visual design decisions. Derived from [knackpackaging.com](https://knackpackaging.com) (RedBiz / SpecThemes template). Use these tokens only when adding or changing UI.

## Brand color

| Token | Value | Usage |
|-------|-------|-------|
| `--knack-brand` | `#d21e2b` | Primary accent, icons, hovers, badges, progress, links on hover |
| `--knack-brand-rgb` | `210, 30, 43` | Gradients and overlays |
| `--knack-brand-hover` | `#111111` | Primary button hover, dark CTA hover to red |
| `--knack-brand-10` | `rgba(210, 30, 43, 0.1)` | Icon wash gradients |
| `--knack-brand-60` | `rgba(210, 30, 43, 0.6)` | Icon circle gradients |
| `--knack-brand-90` | `rgba(210, 30, 43, 0.9)` | Image overlay gradients |

## Neutrals

| Token | Value | Usage |
|-------|-------|-------|
| `--knack-heading` | `#111111` | All headings, primary text |
| `--knack-text` | `#222222` | Nav links, labels |
| `--knack-body` | `#999999` | Body copy (14px paragraphs) |
| `--knack-muted` | `#aaaaaa` | Section subcopy, card descriptions |
| `--knack-nav-muted` | `#70798b` | Nav chevrons, megamenu |
| `--knack-white` | `#ffffff` | Cards, nav bar, button text on red |
| `--knack-black` | `#111111` | Footer, dark buttons, dark sections |
| `--knack-charcoal` | `#222222` | Footer tags, dark list icons |
| `--knack-topbar` | `#2a2a2a` | Utility / top bar background |

## Surfaces

| Token | Value | Usage |
|-------|-------|-------|
| `--knack-surface-page` | `#ffffff` | Page background |
| `--knack-surface-section` | `#f9f9f9` | Grey section bands |
| `--knack-surface-alt` | `#f7f7f7` | Notice sections, accordion panels |
| `--knack-surface-elevated` | `#ffffff` | Cards |
| `--knack-surface-dark` | `#222222` | Dark section blocks |

## Borders

| Token | Value |
|-------|-------|
| `--knack-border` | `#ececec` |
| `--knack-border-light` | `#eeeeee` |
| `--knack-border-subtle` | `#f7f7f7` |
| `--knack-border-footer` | `rgba(255, 255, 255, 0.1)` |

## Typography

| Token | Value |
|-------|-------|
| `--knack-font` | `Geist`, via `--font-geist-sans` |
| Body size | `14px`, weight `400`, line-height `1.7`, color `--knack-body` |
| Section eyebrow | `15px`, weight `500`, color `--knack-brand`, line-height `200%` |
| Section h2 | `42px`, weight `500`, color `--knack-heading`, line-height `130%` |
| Section h3 | `35px`, weight `600`, color `--knack-heading` |
| Section h4 | `30px`, weight `600` |
| Card title | `18px`, weight `500`, color `--knack-heading` |
| Card body | `15px`, weight `400`, color `--knack-muted` |
| Nav link | `13px`, weight `600`, uppercase, color `--knack-text` |
| Top bar | `13px`, weight `500`, color `--knack-white` |
| Footer heading | `24px`, weight `400`, color `--knack-white` |
| Footer body | `14px`, weight `400`, color `--knack-body`, line-height `1.7` |
| Hero h2 | `50px` desktop / `25px` mobile, weight `600`, color `#fff` |

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--knack-section-y` | `90px` | Grey / major sections |
| `--knack-section-y-sm` | `40px` | Compact sections |
| `--knack-section-y-notice` | `60px` | Notice bands |
| `--knack-card-margin` | `15px` | Vertical card margin |
| `--knack-card-pad` | `20px` | Card inner padding |
| `--knack-grid-gap` | `15px` | Card grid gap |

## Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `--knack-radius-card` | `5px` | All cards, forms, tags |
| `--knack-radius-media` | `5px` | Images in cards |
| `--knack-radius-pill` | `4px` | Buttons and CTAs |
| `--knack-radius-nav-cta` | `4px` | Nav bar button |
| `--knack-radius-modal` | `10px` | Modals, paginator |
| `--knack-radius-circle` | `50%` | Icons, avatars |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--knack-shadow-card` | `0 10px 30px rgba(50, 50, 50, 0.16)` | Blog, team, case, catalogue cards |
| `--knack-shadow-card-sm` | `0 10px 20px rgba(50, 50, 50, 0.12)` | Service / product boxes |
| `--knack-shadow-card-hover` | `0 10px 30px rgba(50, 50, 50, 0.3)` | Card hover |
| `--knack-shadow-nav` | `0 0 65px rgba(0, 0, 0, 0.09)` | Fixed navbar |
| `--knack-shadow-dropdown` | `0 6px 50px rgba(0, 0, 0, 0.04)` | Megamenu |

## Buttons

### Primary
- Background: `--knack-brand`
- Color: `#fff`
- Font: `11px` base / `14px` md, weight `500`
- Padding: `10px 15px` base / `13px 25px` md
- Border-radius: `4px`
- Hover: background `#111`

### Dark (hero CTA)
- Background: `#111`
- Color: `#fff`
- Border-radius: `4px`
- Hover: background `--knack-brand`

### Outlined
- Border: `2px solid --knack-brand`
- Color: `--knack-brand`
- Background: transparent
- Border-radius: `4px`
- Hover: fill red, white text

### Rectangular (pricing)
- Border: `2px solid --knack-brand`
- Border-radius: `4px`
- Padding: `8px 20px`

## Cards (service-box pattern)

```css
background: #fff;
border: 1px solid #eee;
border-radius: 5px;
box-shadow: 0 10px 30px rgba(50, 50, 50, 0.16);
margin: 15px 0;
/* title: 18px #111; body: 15px #999; icon: #d21e2b */
```

## Section heading accent

- Line: `100px` x `3px`, background `--knack-brand`, border-radius `25%`
- Margin: `15px` top, `5px` bottom

## Navigation

| Property | Value |
|----------|-------|
| Top bar height | `45px` |
| Nav height | `95px` |
| Nav background | `#fff` |
| Nav border | `1px solid #eee` |
| Nav shadow | `--knack-shadow-nav` |
| Link hover | `--knack-brand` |
| Logo height | `48px` |

## Footer

| Property | Value |
|----------|-------|
| Background | `#111` |
| Padding | `60px 0 20px` |
| Heading rule | `70px` x `2px` red, `12px` below title |
| Social circle | `35px`, bg `#333`, hover `--knack-brand` |

## Hero / slider

- Full-bleed photo backgrounds (not solid red gradient)
- Overlay: `rgba(0,0,0,0.5)` to `0.7`
- Slide title: white, `50px` / `25px` mobile
- Slide lead: `15px`, `rgba(255,255,255,0.7)`, line-height `1.9`
- CTA: dark pill button (`.dark-button.button-md`)

## Breakpoints (Bootstrap 4)

| Name | Min width | Container |
|------|-----------|-----------|
| sm | 576px | 540px |
| md | 768px | 720px |
| lg | 992px | 960px |
| xl | 1200px | 1140px |

## Motion

- Default transition: `0.3s ease`
- Buttons: `0.4s ease`
- Nav drawer: `0.8s ease`

## Enquiry form (modal + contact page)

| Element | Spec |
|---------|------|
| Modal width | `560px` max |
| Modal radius | `10px` |
| Modal padding | `32px` |
| Title | `22px`, weight `600`, `#111` |
| Close button | `40px`, `1px` red border, `5px` radius, hover fill red |
| Labels | `14px`, weight `600`, `#111`, above field |
| Required mark | `#d21e2b` asterisk |
| Grid | 2 columns (name/company, email/phone), then full-width rows |
| Inputs | `44px` min-height, `1px #ececec` border, `5px` radius, white fill |
| Message | `120px` min-height textarea |
| Submit | Full-width red button, `14px`, `4px` radius, "Submit enquiry" |

## Home product types section

Placed immediately below the hero. Matches Knack "What We Offer" pattern.

| Element | Spec |
|---------|------|
| Eyebrow | `15px`, `#d21e2b`, centered |
| Title | `42px`, `#111`, weight `500`, centered |
| Accent line | `72px` x `3px`, red, centered |
| Lead | `15px`, `#999`, max-width `640px`, centered |
| Carousel | Single row, **3 cards visible** on desktop (`15px` gap), prev/next arrows |
| Card image | **1:1** square frame, full-bleed top, `object-fit: cover` |
| Card | Centered title `18px`, body `15px` `#aaa`, equal card width |
| Hover | `translateY(-8px)`, deeper shadow, image `scale(1.05)` |
| Scroll animation | Fade in up via `VpKnackReveal` (`vp-knack-reveal`) |

Copy keys: `homeProductsEyebrow`, `homeProductsTitle`, `homeProductsLead`.

## Mapping to `--vp-*` variables

All `--vp-*` theme variables are remapped in `src/styles/knack-tokens.css` to these Knack values. Do not introduce new hardcoded colors in components. Extend this file first.
