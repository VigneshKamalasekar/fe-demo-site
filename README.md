# BrandName JSON-Driven Website

## Structure

- `index.html` — page shell
- `css/style.css` — all presentation/styles
- `js/app.js` — loads section JSON and renders the page
- `content/header.json` — header/navigation content
- `content/hero.json` — hero/banner content
- `content/about.json` — about/features content
- `content/contact.json` — contact/form content
- `content/footer.json` — footer content

## Run locally

Because the site loads JSON files using `fetch()`, do not open `index.html` directly with `file://`.

From the website folder, run:

```bash
python3 -m http.server 8000
```

Then open:

http://localhost:8000

## Batch content changes

Edit only the relevant JSON file. For example:

`content/hero.json`

can be changed without modifying the HTML, CSS, or JavaScript.

This makes each section independently manageable and suitable for later connection to a CMS, API, or experiment/personalization system.
