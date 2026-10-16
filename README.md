# Equator Scandinavia

A low-cost Danish market-development pilot for Equator Cycling, starting October 12, 2026. Prioritize learning and useful relationships. Copenhagen remains the first outreach priority. Discovery now covers Denmark, Sweden and Norway in parallel; commercial expansion remains exploratory.

## Workspace

- Google Sheets: current operational state. See [workspace links](docs/workspace-links.md).
- Private GitHub repository: code, schemas, technical decisions and development history.
- Google Drive: product assets, catalogs, meeting notes and sensitive research.
- Python standard library: cached discovery, reviewed enrichment, scoring, reports and safe Sheets plans. No paid infrastructure.

The tracker has seven tabs, including Events & Partnerships for a small event-partnership exploration alongside retail outreach.

Start with [operating guide](docs/operating-guide.md), [roadmap](docs/roadmap.md), and [progress log](docs/progress-log.md). Repository data contains schemas and sanitized planning examples only, never the live CRM.

## Local setup

Python 3.10+ is sufficient; there are no third-party Python runtime dependencies.

```sh
python3 -m unittest discover -s tests -v
python3 scripts/validate_leads.py --existing data/samples/leads.json --incoming data/samples/leads-incoming.json
```

The validator is a local, read-only preflight. It validates stable IDs, required fields, dates, controlled options and duplicates, then previews inserts or missing-field enrichment. It never writes to Google Sheets. The separate discovery CLI and reviewed-enrichment pipeline are documented in [dealer discovery](docs/dealer-discovery.md). No automatic outreach is installed.

## Repository layout

`docs/` contains the project and operating decisions; `data/schemas/` defines tracker headers; `data/samples/` contains synthetic records and the sanitized roadmap; `scripts/` contains small tools; `tests/` verifies behavior. `research/` and `marketing/` are reserved for non-sensitive methodology and reusable materials. Store live exports in ignored `data/private/` or `backups/`.

## Immediate use

1. Open the tracker and review this week's tasks and provisional due dates.
2. Add initial meeting findings in Drive and link them from the task.
3. Research products and a small partner shortlist, retaining source URLs and verification dates.
4. Draft the Equator follow-up and partner introductions for explicit approval before sending.

The first Scandinavian run is imported and verified. Start with the scored shortlist filter in Sheets; broad discovery rows remain unverified. Next, deepen Danish/Swedish qualification and resolve missing locations and ambiguous identities. See [dealer discovery](docs/dealer-discovery.md) for repeatable commands, reports, evidence requirements and source limits.

## Website

The storefront is a separate workstream in `website/` (Astro, static) with an inquiry endpoint in `worker/` (Cloudflare Worker). Start with [PROJECT_STATUS.md](PROJECT_STATUS.md), [architecture](ARCHITECTURE.md), [product sources](PRODUCT_DATA.md) and [website decisions](DECISIONS.md).

```sh
cd website && npm ci
npm run dev        # http://127.0.0.1:4321/equator-scandinavia/
npm test           # catalog, cart and image checks
npm run build      # astro check + static build into website/dist
npm run images     # regenerate WebP variants after adding photos
cd ../worker && npm test   # inquiry endpoint tests (no install needed)
```

Inquiries run in demo mode until `PUBLIC_INQUIRY_ENDPOINT` is set at build time (see `website/.env.example` and `worker/README.md`). Publication to GitHub Pages and live inquiry delivery each require an explicit go-ahead; the operational Sheets tooling remains independent.
