# BuyLand Land Data API

A free, keyless, read-only JSON API for UK land data, run by [BuyLand.co.uk](https://buyland.co.uk).

- **Sold prices** — HM Land Registry price-paid sales at or near a postcode, uprated to today's value
- **Land values** — a guide value range for a plot from location, size, land type and planning status
- **Property values** — an indicative value for a dwelling from local sold prices uprated to today
- **Registered parcels** — the HM Land Registry INSPIRE parcel containing a point, with area and GeoJSON
- **Planning constraints** — national designations at a point: flood zone, green belt, AONB, national park, conservation area, listed buildings, SSSI, ancient woodland, TPO zones, common land, Article 4, brownfield

No API key, no sign-up. Base URL: `https://buyland.co.uk/api/v1`

Full documentation: **https://buyland.co.uk/developers** · OpenAPI 3.1 spec: [`openapi.json`](./openapi.json) (canonical copy at `https://buyland.co.uk/api/v1/openapi.json`)

## Quick start

```bash
curl "https://buyland.co.uk/api/v1/sold-prices?postcode=SW1A%201AA&limit=3"
```

```js
const r = await fetch("https://buyland.co.uk/api/v1/constraints?lat=51.2287&lng=-0.4");
const data = await r.json();
console.log(data.flagged, data.source_url);
```

```python
import requests
r = requests.get("https://buyland.co.uk/api/v1/land-value",
                 params={"postcode": "GL7 5NX", "acres": 2.5, "land_type": "Pasture"})
print(r.json()["mid"])
```

More in [`examples/`](./examples).

## Endpoints

| Endpoint | Required | Optional | Returns |
|---|---|---|---|
| `GET /sold-prices` | `postcode` | `limit` (1–25, default 10) | Sales with `price_paid`, `date`, `address`, `estimated_today` |
| `GET /land-value` | `postcode`, `acres` | `land_type`, `planning`, `road_access` | `low` / `mid` / `high`, `price_per_acre`, `method`, `factors` |
| `GET /property-value` | `postcode` | `bedrooms` (1–6), `bathrooms` (1–4) | `low` / `mid` / `high`, `comparables_used`, `comparables_scope`, `method` |
| `GET /parcel` | `lat`, `lng` | `postcode` (loads the area if not cached) | `found`, `inspire_id`, `area_sqm`, `area_acres`, `centroid`, `buildings_count`, `suggested_valuation`, `geometry` |
| `GET /constraints` | `lat`, `lng` | `radius_m` (5–250, default 25) | 13 `checks`, each with `present` and matching `entities`; `flagged` list |

`land_type` is one of `Agricultural`, `Woodland`, `Pasture`, `Equestrian`, `Residential Plot`, `Commercial`, `Mixed`. Plots under 0.05 acres use a small-plot (adjacency) model — see [why](https://buyland.co.uk/guides/how-much-is-a-small-strip-of-land-worth).

### Land value or property value?

They answer different questions and give very different numbers for the same postcode. `/land-value` prices the *ground* (fields, paddocks, woodland, plots); `/property-value` prices a *dwelling* (what a house or flat there sells for).

1. Know the land type? A house or flat → `/property-value`. A field, paddock, woodland, plot or garden strip → `/land-value` (add `planning=true` if consent exists).
2. Only have a location? Call `/parcel` first: it returns `buildings_count` (mapped buildings inside the registered parcel) and `suggested_valuation`, plus `area_acres` to pass to `/land-value`.
3. A house with grounds is both — don't add the two mechanically.

Coverage: England for parcels and constraints; England and Wales for sold prices and values.

## Rules

- **Rate limit:** 120 requests per minute per IP. Beyond that you get `429` with a `Retry-After` header.
- **Attribution:** every response includes `attribution` and `source_url`. Display the attribution and link to the source URL wherever the data appears.
- **No SLA.** Responses are cached for 5 minutes. This is a free service from a small company; for volume or guarantees, [get in touch](https://buyland.co.uk/contact).
- **What isn't here:** anything that carries an HM Land Registry fee (title registers, plans, filed deeds) is ordered at cost on the site, never through the API. The full 35-check [Plot Report](https://buyland.co.uk/report) is a product; `/constraints` gives you the free third of it.

## Using it with AI agents

Point any tool-using agent at the spec: `https://buyland.co.uk/api/v1/openapi.json`. For Claude Desktop, Cursor and other MCP clients there is a ready-made server: [BuyLandUK/land-data-mcp](https://github.com/BuyLandUK/land-data-mcp).

## Licences

Sold prices contain HM Land Registry data © Crown copyright and database right 2026. Parcels are derived from HM Land Registry INSPIRE Index Polygons © Crown copyright and database rights. Designations come from planning.data.gov.uk. All are licensed under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). Valuations and constraint groupings are BuyLand's own work and are indicative information, not advice.

The contents of this repository (spec and examples) are MIT licensed.

## Feedback

Issues and pull requests welcome here. Built something with it? We'd like to hear: info@buyland.co.uk
