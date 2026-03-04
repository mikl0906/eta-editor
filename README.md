# Eta Template Editor

A live, browser-based editor for [Eta](https://eta.js.org/) templates. Write your template on the left, supply a JavaScript data object, and see the rendered HTML update instantly on the right — no build step, no server.

## Features

- **Live preview** — template and data are evaluated on every keystroke
- **Monaco editor** — the same editor that powers VS Code, with syntax highlighting for HTML and JavaScript
- **JavaScript data object** — supply the template context as a plain JS object literal (unquoted keys, trailing commas, and comments all work)
- **Print to PDF** — send the rendered preview directly to the browser print dialog
- **Persistent state** — template and data are saved to `localStorage` and restored on reload
- **Light / dark / system theme** — toggle in the toolbar

(Web app)[https://eta-editor.fly.dev]

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Template

Write an Eta template in the **Template** panel. Inside the template, `it` refers to the data object you provide:

```html
<h1>Hello, <%= it.name %>!</h1>
<% if (it.items.length) { %>
<ul>
  <% it.items.forEach(item => { %>
  <li><%= item %></li>
  <% }) %>
</ul>
<% } %>
```

See the [Eta docs](https://eta.js.org/) for the full template syntax.

### Data

Write a JavaScript object literal in the **Data** panel. The object is passed to the template as `it`:

```js
return {
  name: "World",
  items: ["foo", "bar", "baz"],
}
```

### Print

Click **Print** in the Preview header to open the browser print dialog. Add `@page` rules directly in your template `<style>` block to control paper size and margins:

```html
<style>
  @page {
    size: A4 portrait;
    margin: 20mm;
  }
</style>
```

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Template engine | Eta v4 |
| UI components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| State | Jotai (`atomWithStorage`) |
| Layout | `react-resizable-panels` |

## License

MIT