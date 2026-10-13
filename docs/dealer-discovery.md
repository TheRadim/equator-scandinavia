# Scandinavian dealer discovery

Python 3.10+, standard library only. Sheets owns operational state; private local JSON is a discovery cache, never a substitute for reading the live Sheet before writes. This implementation performs research, not outreach.

## Commands

Run from the repository root:

```sh
python3 -m scripts.discovery --countries DK SE NO
python3 -m scripts.discovery --country DK --source osm
python3 -m scripts.discovery --country NO --source brreg
python3 -m scripts.discovery --country SE --city Malmo --source reviewed
python3 -m scripts.discovery --countries DK SE NO --category custom-build --export
python3 -m scripts.discovery --category wheels --export
python3 -m scripts.discovery --refresh-existing --source all
python3 -m scripts.discovery --export --min-score 60
python3 -m unittest discover -s tests -v
```

Default `--source all` combines national Overpass discovery, Norwegian register searches and an optional private reviewed-evidence file. `--export` makes no network calls. Country/city/category/min-score filters control `leads.csv`; the full database, summary and shortlist always cover the complete retained database. `Malmo` matches `Malmö`; other city aliases require review. Category filters include only verified Yes flags and therefore exclude unknown capability. City filtering does not reverse-geocode map entries.

`--refresh-existing` bypasses API caches, not ownership protections. Existing populated research and manual fields are not automatically replaced. A reviewed source can promote a locally Discovered record to Enriched; live populated stage/confidence fields require an explicitly reviewed correction outside the fill-empty adapter. Human decisions, rebranding and conflicting evidence require a reviewed field-level change. Never regenerate the persistent database to refresh it: it owns permanent UUIDs and source-ID mappings.

Paths can be set with `--database`, `--reviewed`, `--output`. Defaults are ignored `data/private/leads.json`, `data/private/reviewed.json`, `outputs/discovery/`. Runs overwrite the latest output files; archive dated snapshots when needed. `run.json` records source failures, additions, exact matches, quarantines and quality checks. A partial-source failure is reported explicitly while successful sources remain usable. Do not equate an exit with successful complete source coverage; inspect `failures`.

## Two stages and evidence

1. **Discovery:** national `shop=bicycle` / named bicycle-repair map objects; Norwegian registered businesses with bicycle-related names and selected SN2025 retail, repair, wholesale or manufacturing codes. Exclude club categories and exposed closure flags. Names, URLs, registered/map addresses and source IDs are discovery evidence only. OSM contact tags are deliberately not labelled verified.
2. **Enrichment:** manually review official product, workshop, about and contact pages, assisted by local-language search, brand dealer directories and public cycling networks. Enter source-backed claims in private reviewed JSON; `scripts.enrichment.review` computes a consistent record. This is an evidence-review workflow, not an autonomous website or search-engine scraper. Search/directory research was actually performed during the initial run, but is not an automated search adapter.

Copy the synthetic `data/samples/reviewed.json` structure into an ignored private file. Each item has name, ISO country, city, discovery_source, permanent source_id, verified_on, fields, and five score components. Each positive component needs points, a reason and an evidence URL. Commercial suitability must have `inference: true`. Every enriched profile needs a 40–80-word description, product/website/qualification evidence, confidence and a verification date. Contact details need contact evidence. Use exact public contact values, never inferred addresses or de-obfuscation beyond clearly printed human-readable text. Keep unknown capability Unknown; zero evidence points do not mean a confirmed absence.

Validation checks structure, dates, URLs, email/phone format, controlled flags, score range/grade, source IDs, evidence presence and formula-like strings. It cannot establish that a website supports a semantic claim; the reviewer must check that. Scores are research priorities, never proof of supplier receptiveness or a commercial agreement.

## Scoring and reports

Product 0/5/15/25; custom builds 0/10/20; brand 0/10/20; commercial 0/8/15; titanium/frameset 0/5/10. Geography adds 10 for named Greater Copenhagen/Malmö/Lund locations, 8 for other Denmark or listed nearby southern Swedish cities, 6 for other Sweden, 5 Norway. Geographic city lists are intentionally explicit and incomplete; extend only after review. A ≥80, B ≥60, C ≥40, D <40. High technical alignment can coexist with own-brand competition or weak commercial priority.

Outputs: full-database.csv, qualified-shortlist.csv (≥60; grade, confidence, geography, score), country-summary.json, data-quality.json, and research-report.md with up to ten qualified profiles per country, descriptions, contacts, approaches and source links. A run-specific commercial narrative and first-ten recommendations live in the private dated report, not in source control. CSVs use UTF-8 BOM for spreadsheet compatibility; import phone, ID, postcode and date text columns as text. The live connector writes explicit string values, preventing formula evaluation.

## Identity, branches and manual protection

Assign a UUID once; preserve it through name/domain changes. Exact source IDs/lead IDs match automatically. Normalized domain/name, organization, phone, address and country/city flag candidates. Domain or organization alone does not merge branches. Missing city makes matching more conservative. Ambiguous matches are quarantined with possible stable IDs, not silently merged. A quarantine is not proof of a duplicate. Different domains/names with no shared evidence can still evade detection; manual reconciliation remains necessary.

Live research writes are allowlisted, fill-empty only, and never clear cells. Manual fit, qualification notes, contact person, contact status/dates, conversation notes, partnership model, response state, next action and assigned priority are protected. See the [Sheets operator workflow](../scripts/sheets/README.md). Existing native dropdowns and manual columns remain in place; the schema adds 36 research/location fields, including independent research score and recommendations.

## Source limits and access

- [OpenStreetMap attribution/ODbL](https://www.openstreetmap.org/copyright); source object URLs travel with every record. [Overpass public-instance guidance](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html). Only low-volume national queries; seven-day cache, two-second minimum request gap, three bounded attempts. Respect numeric and HTTP-date Retry-After; a requested delay over 60 seconds stops for a later run. Partial/error responses are rejected. No access restrictions are bypassed.
- [Brønnøysund API](https://data.brreg.no/enhetsregisteret/api/dokumentasjon/no/index.html): searches `sykkel` and `sykler`, paginates, filters SN2025 codes. Keyword/code filtering is incomplete and may admit weak fits. Registered addresses can differ from shop locations. It is not an exhaustive Norwegian dealer census.
- [CVR access](https://datafordeler.dk/vejledning/brugeradgang/anmodning-om-adgang/det-centrale-virksomhedsregister-cvr/): appropriate access was not configured. No claim that all Danish register data requires payment.
- [Bolagsverket API FAQ](https://bolagsverket.se/apierochoppnadata/driftochsupport/fragorochsvaromapierna.4611.html): free high-value data requires access setup and organization-number lookup; broader company-information access differs. No account or paid subscription was created.
- Official-site/search/directory research can encounter stale relationships, old footers, masked contact details, inaccessible pages or contradictory addresses. Record those conflicts; don't silently assume current authorization or defeat restrictions.

These policies were checked during the initial October 2026 run; verify again before materially increasing traffic. No scheduler or new service has been installed.

## Initial run and next work

National discovery and targeted enrichment ran on 12 October; import verified on 13 October 2026 Copenhagen time. Retained 1,287 discovery records; 31 enriched, 23 scored ≥60 (17 A / 6 B); 264 possible matches held. Many records are incomplete: 988 lack city, 660 lack website. The 11/10/10 enriched country split is below the Danish/Swedish depth goals. Do not treat broad record counts as verified active businesses.

Next: resolve high-potential locations, deepen Danish/Swedish qualification, review held identities, verify missing contacts/social links and expand specialist-directory coverage. Later possibilities include field-level research ownership/staleness, branch alias mapping, competitor networks and event/club research. Keep these small and evidence-driven; no large crawler or CRM is justified yet.

Technical follow-up: [location and alias reconciliation #4](https://github.com/TheRadim/equator-scandinavia/issues/4), [reviewed refresh ownership and OAuth integration #5](https://github.com/TheRadim/equator-scandinavia/issues/5). The connected GitHub plugin did not have repository access in this session; the existing authenticated GitHub CLI was used successfully without broadening permissions.
