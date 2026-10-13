# Technical decisions

## 2026-10-12: three simple systems

Use Sheets for operations, private GitHub for technical history, and Drive for assets and private notes. No hosted database, paid CRM, paid enrichment or scheduled automation. Python uses the standard library initially.

## 2026-10-12: stable identifiers and conservative enrichment

Lead IDs are UUID-based and assigned once. Normalized website+city and normalized name+country+city flag duplicates. Branches may share domains; ambiguous matches require review. Automated enrichment fills only empty permitted discovery fields and never changes manually owned fields. Initial implementation produces a local preview only.

## 2026-10-12: tracker extensions

Add Evidence status to research to distinguish Verified / Assumption / Hypothesis / Recommendation. Add Response received to leads so negative replies can still count as responses. Add separate confirmed order value, confirmed commission and confirmation source to sales. Keep opportunities empty at launch.

## 2026-10-12: dates and capacity

Use the brief's calendar dates and month labels rather than inconsistent week numbering. Period-end deadlines and January 10 review are provisional. Do not invent per-task time estimates. Week 1 budget is 8–12 hours; weeks 2–3 each 6–10 hours. The full initial roadmap may exceed capacity; reprioritize weekly.

## 2026-10-12: privacy

Store sanitized roadmap and synthetic test data in Git. Raw briefs, contacts, operational exports and commercial information stay outside Git. No outreach, purchase or public sharing is performed by setup.

## 2026-10-13: broad discovery, reviewed enrichment and protected live writes

Expand discovery to all three countries at the user's request while retaining Copenhagen-first outreach. Use cached public national map queries and Norway's register, supplemented by operator-reviewed search, brand directories and official sites. Keep unverified discovery separate from sourced profiles. Do not infer contact details or score from keywords. Commercial suitability is an inference, distinct from confidence in the underlying business claims.

Append 36 columns to the original 24 rather than creating a competing CRM tab. Research scoring is separate from manual qualification. Source/lead IDs are immutable; ambiguous matches are held, not merged. Every live write is fill-empty, allowlisted, freshly checked, backed up and verified. A connected-tool bridge performed the initial import; optional local OAuth transport is available but not authenticated in this workspace. No unattended sync or new service. Retain complete operational data only in private Drive, ignored local outputs and backups.
