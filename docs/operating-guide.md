# Operating guide

## Weekly routine

Open DASHBOARD, set the current phase and three weekly priorities, and enter the next Equator meeting when agreed. Filter TASKS & ROADMAP by status and due date. Update actual hours and last-updated date as work happens. Period-end due dates are provisional; adjust to available time. Backlog is intentionally not a promise to perform everything.

## Leads and research

One lead row represents one business location. Assign a permanent ID with `python3 scripts/validate_leads.py --new-id`. Never use row numbers as IDs. Check the website, country/city and business name before adding a lead. Keep unknown fields blank or choose Unknown; don't invent email addresses or people. Record source URL and discovery/updated dates. Shared-domain branches in different cities can be separate records. Multiple locations in one city need human review before an exception is accepted.

Contact status describes the current relationship, not a history. Fill Last contact date only for outreach that actually happened, and Response received when a reply really arrives. The dashboard counts contacted businesses by a recorded Last contact date; qualified leads have High/Medium fit plus qualification notes. Active conversations and interested partners use their explicit status. Negative replies still count as responses.

Each research row is one observation/product with a source URL, price currency, VAT status, research date and last verification date. Use Evidence status explicitly. User-supplied background remains an assumption until checked against a source. Do not compare prices without checking frameset contents, VAT, currency, geography and date.

## Opportunities and content

Events & Partnerships holds Event ID, event name, organizer, date, audience, estimated participants, sponsorship opportunities, product fit, existing contacts, proposed contribution and next action. Assign permanent EVENT- identifiers and distinguish separate event editions. Keep unknowns blank. Include source URLs and verification dates alongside research notes in the relevant fields; label estimates and proposed contributions explicitly. Existing contacts and private terms belong only in the live tracker or Drive. The initial October 12–25 track is capped at 2–3 hours, with suggested task allocations totaling 2.5 hours.

Create opportunities only when there is a real next action. Link a valid Lead ID. Keep estimates in estimated fields and confirmed values in their separate columns, with confirmation evidence. Leave commission blank until agreed. Draft content only as demand justifies it. No message may be sent without explicit approval.

## Capacity and validation

Dropdowns and duplicate-ID/website highlighting cover rows 2–1001. Dashboard counts use the same 1,000-record capacity. Extend these ranges before exceeding capacity. Highlighted duplicates require review, not deletion. Scripts perform stricter checks on JSON exports. Spreadsheet dropdowns are input guidance; pasted data can still need validation.

The local preflight takes JSON arrays of objects matching data/schemas/workspace.json. Use ignored data/private/ for real data. It rejects duplicate IDs, likely duplicate businesses, invalid options/dates, changed identity and formula-like input. It previews only safe empty-field discovery enrichment. It never contacts sites or writes Sheets, and does not create backups itself.

## Backups and authentication

Weekly, download the live Google Sheet as XLSX into ignored backups/ with the date in the filename. Keep a Drive copy before large edits. Never commit those backups. The imported local template is only a build artifact; editing it does not update the live tracker.

Google Drive connector access is available in the setup session. GitHub CLI is authenticated as TheRadim. Future sessions must verify both independently. No Google API credentials or unattended access have been configured. A future Python integration should use locally stored OAuth credentials with minimum required scope, referenced through environment variables, and documented dry-run/readback behavior.

If GitHub must be reconnected: run `gh auth login`, check `gh repo view TheRadim/equator-scandinavia --json isPrivate,url`, then set the private repository as origin and push normally. Never change visibility or force-push without approval.
