# LatAm AI Safety Map

A map of the AI safety ecosystem in Latin America: communities, training programs, research groups, and field-building efforts. A toggle shows the wider AI governance landscape of the region.

The format follows the [AISafety.com field map](https://aisafety.com/map). This project is not affiliated with AISafety.com.

## Files

- `index.html` renders the map and the card directory. It loads D3 and TopoJSON from cdnjs.
- `countries-110m.json` holds the country geometry (world-atlas 2.0.2). The page fetches it with a relative URL.

## Run locally

Serve the folder, then open http://localhost:8000:

```bash
python3 -m http.server
```

A direct `file://` open does not work because the page fetches the geometry file.

## Data

The entries were compiled on 26 November 2026 from each organization's public pages, legislative trackers, and the June 2026 EA Forum mapping of the LatAm AI safety ecosystem. The data lives in the `DATA` array in `index.html`. To add or correct an entry, edit that array.
