# LatAm AI Safety Map

A field map of the AI safety ecosystem in Latin America. Each island on the map is one category: community, training, governance, research, career support, and media. The scope is AI safety proper; general AI policy institutions are out of scope.

The format follows the [AISafety.com field map](https://aisafety.com/map). This project is not affiliated with AISafety.com.

## Files

- `public/index.html` renders the map and the card directory. It loads D3 from cdnjs.
- `public/icons/` holds the organization favicons shown in the map pins.
- `wrangler.jsonc` deploys `public/` to Cloudflare Workers at map.chais.cl (`npx wrangler deploy`).

## Run locally

Serve the `public/` folder, then open http://localhost:8000:

```bash
python3 -m http.server --directory public
```

## Data

The entries were compiled on 26 November 2026 from each organization's public pages, and the June 2026 EA Forum mapping of the LatAm AI safety ecosystem. The data lives in the `DATA` array in `public/index.html`. To add or correct an entry, edit that array.
