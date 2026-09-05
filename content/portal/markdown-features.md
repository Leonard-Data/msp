# Markdown features

MSP keeps Markdown readable while adding small, progressively enhanced helpers for documentation authors.

## Images and accordions

![Documentation sync flow](/_sources/firstmate-docs/assets/portal-sync-flow.svg "Documentation sync flow")

Click an image to open it at full size. Native details elements provide accessible accordions without a dependency:

<details>
<summary>Show the authoring notes</summary>

The image zoom, copy buttons, and previews work without changing the source repository's Markdown ownership.

</details>

## Code blocks

Fenced code blocks show their language and include copy and preview actions. Add `preview` after `html` for an instant sandboxed preview:

```html preview
<div class="demo-card">
  <strong>Live preview</strong>
  <p>This HTML is rendered in an isolated frame.</p>
</div>
<style>
  .demo-card { padding: 1rem; border: 2px solid #f2b632; border-radius: 8px; font-family: sans-serif; }
</style>
```

A saved JSFiddle can be embedded with a `jsfiddle` fenced block containing its URL:

```jsfiddle
https://jsfiddle.net/
```

<button type="button" class="button button--ghost button--sm" data-copy-to-clipboard="npm run check">Copy to clipboard</button>
