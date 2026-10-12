# Project instructions

Read this file, README.md, docs/roadmap.md and docs/progress-log.md before changing the project. Check current Git status and workspace links. Do not assume connections available in one ChatGPT or Codex session exist in another.

## Purpose and boundaries

Equator Scandinavia is a side-project market-development pilot for a Czech titanium bicycle and wheel brand. Start in Copenhagen, then Denmark. Optimize for learning, relationships, experimentation and low financial risk. There is no established pipeline, agreed commission or exclusivity. Background supplied by the user is not independently verified.

## Stack and structure

Google Sheets owns operational state. Private GitHub owns code, schemas and technical history. Drive owns assets, meeting notes and sensitive commercial information. Use simple Python with standard-library-first dependencies. Explain any proposed new service. Follow the layout in README.md; avoid a CRM or large scraper before demand is understood.

## Coding and data

Write small functions with clear validation and actionable errors. Test duplicate handling, identity preservation and manual-field protection. Do not fabricate unknown data. Label verified facts, assumptions, hypotheses and recommendations. Record source URLs and retrieval/verification dates. Respect terms, robots.txt and API limits. Do not bypass access restrictions.

Never commit credentials, personal contact information, private commercial terms, live research or CRM exports, even to this private repository. Use environment variables; .env.example contains names only. Put local operational files in ignored data/private/ or backups/. Review staged files before every commit. Do not copy the raw brief into Git because it contains contact names.

## Sheets updates

No live synchronization exists yet. scripts/validate_leads.py is a read-only preview. Every future sync must read the live target immediately before writing, validate incoming data, use stable IDs, reject ambiguous matches and default to dry run. IDs never depend on row numbers, and do not change when a business changes name or website. Match canonical website plus city to flag likely duplicate branches; business name plus country and city is a second check. Never merge uncertain matches automatically.

Protect all manual fields: qualification, contact person/status/dates, notes, partnership model, fit and response state. Automated enrichment may fill only empty approved discovery fields. Never clear a field because a source is blank. Reject stale snapshots before applying an approved change set. Repeated runs must be idempotent; verify by readback. Back up before bulk updates. Do not store operational snapshots in Git.

## Completion and continuity

Update relevant documentation, decisions and progress log at each meaningful milestone. Run appropriate checks, commit meaningful changes, then push non-destructively to the verified private remote. Use GitHub Issues for development tasks; Sheets for business operations. Report actual completion, blockers and next actions accurately.

Explicit approval is required before any outreach/message, purchase, financial commitment, public publication, access broadening, destructive Git change or commercial agreement. Ordinary reversible setup, tests, documentation and authorized private-repository work can proceed.
