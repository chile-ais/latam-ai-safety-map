# LatAm AI Safety Map

A field map of the organizations, programs, and communities that work on AI safety in Latin America. The map is an illustrated island. Each region of the island is one category.

Live at [map.chais.cl](https://map.chais.cl).

The format follows the [AISafety.com field map](https://aisafety.com/map). This project is not affiliated with AISafety.com.

## Files

- `public/index.html` is the page.
- `public/data.js` holds the categories and the organizations.
- `public/map.js` draws the island and the pins with D3.
- `public/app.js` renders the cards and connects the filters to the map.
- `public/styles.css` holds the styles.
- `public/icons/` holds the organization logos shown on the pins.
- `wrangler.jsonc` configures the deploy to Cloudflare Workers.

## Edit the data

Add or correct an organization in the `ORGS` array in `public/data.js`. Set `status: "inactive"` to move an organization to the graveyard islet.

## Run locally

Serve the `public/` folder, then open http://localhost:8000:

```bash
python3 -m http.server --directory public
```

## Deploy

```bash
npx wrangler deploy
```
