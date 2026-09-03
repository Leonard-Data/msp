# Assets

Brand and icon assets extracted from the MSP Documentation Protocol source artifact (`docs-protocol.html`).

## Files

| File | Description | Source |
|------|-------------|--------|
| `logo-mark.svg` | 28×28 black badge with "M" — brand icon | Extracted from docs-protocol.html logo-mark pattern |
| `wordmark.svg` | Logo mark + "MSP Docs" wordmark | Extracted from topnav brand pattern |
| `favicon.svg` | 32×32 black badge with "M" — browser favicon | Extracted from logo-mark proportion |
| `icons.svg` | SVG sprite with 10 icons used in the source artifact | Extracted byte-for-byte from docs-protocol.html inline SVGs |

## Icon Sprite Usage

```html
<svg><use href="icons.svg#icon-book"/></svg>
```

Available sprite IDs: `icon-menu`, `icon-book`, `icon-share`, `icon-settings`, `icon-copy`, `icon-share-2`, `icon-arrow-right`, `icon-burst`, `icon-linkedin`.

## Source Evidence

All icons were extracted from `docs-protocol.html` (46 KB) at the project root. The SVG paths, stroke widths, and viewBox values match the original artifact's inline SVGs exactly.
