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
