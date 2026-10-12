# Equator Scandinavia

A low-cost Danish market-development pilot for Equator Cycling, starting October 12, 2026. Prioritize learning and useful relationships. Copenhagen comes first, Denmark next, Sweden and Norway only after evidence supports expansion.

## Workspace

- Google Sheets: current operational state. See [workspace links](docs/workspace-links.md).
- Private GitHub repository: code, schemas, technical decisions and development history.
- Google Drive: product assets, catalogs, meeting notes and sensitive research.
- Python standard library: local validation and future discovery tools. No paid infrastructure.

The tracker has seven tabs, including Events & Partnerships for a small event-partnership exploration alongside retail outreach.

Start with [operating guide](docs/operating-guide.md), [roadmap](docs/roadmap.md), and [progress log](docs/progress-log.md). Repository data contains schemas and sanitized planning examples only, never the live CRM.

## Local setup

Python 3.10+ is sufficient; there are no runtime dependencies yet.

```sh
python3 -m unittest discover -s tests -v
python3 scripts/validate_leads.py --existing data/samples/leads.json --incoming data/samples/leads-incoming.json
```

The validator is a local, read-only preflight. It validates stable IDs, required fields, dates, controlled options and duplicates, then previews inserts or missing-field enrichment. It never writes to Google Sheets. No discovery scraper or automatic outreach is installed.

## Repository layout

`docs/` contains the project and operating decisions; `data/schemas/` defines tracker headers; `data/samples/` contains synthetic records and the sanitized roadmap; `scripts/` contains small tools; `tests/` verifies behavior. `research/` and `marketing/` are reserved for non-sensitive methodology and reusable materials. Store live exports in ignored `data/private/` or `backups/`.

## Immediate use

1. Open the tracker and review this week's tasks and provisional due dates.
2. Add initial meeting findings in Drive and link them from the task.
3. Research products and a small partner shortlist, retaining source URLs and verification dates.
4. Draft the Equator follow-up and partner introductions for explicit approval before sending.

Next technical task: investigate a permitted public source for 10 Copenhagen business records, run validation locally, and design a dry-run Sheets merge before extending collection.
