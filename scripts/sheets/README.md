# Safe Sheets operator workflow

`scripts/validate_leads.py` remains the original read-only local preview. `safe_sync.py` adds a tested transport-neutral live change planner. The optional standard-library OAuth bridge is `python3 -m scripts.sheets`; the initial live import used the connected Google Drive tools with the same plan and readback checks. Connections must be verified per session.

## Python bridge

Provide a short-lived, appropriately scoped `GOOGLE_ACCESS_TOKEN` through the environment; never put it in a command argument, committed file or log. Token acquisition/refresh is deliberately not implemented. Existing Codex Drive authentication does not automatically become a local Python credential.

```sh
python3 -m scripts.sheets --spreadsheet-id ID --sheet-id NUMERIC_TAB_ID
# Review outputs/discovery/sheets-plan.json before explicitly applying:
python3 -m scripts.sheets --spreadsheet-id ID --sheet-id NUMERIC_TAB_ID --apply
```

Default is dry run. Name/ID must identify the same tab. Use an existing initialized schema and sufficient native-table capacity; the bridge refuses an undersized target rather than restructuring it automatically. Requests larger than 1.8 MB require smaller reviewed record batches or the connected-tool workflow. No new paid service is needed. Without authentication, use the import-ready CSV and report the limitation; do not claim a live sync.

## Connected-tool bridge

1. Read live metadata and values, including existing native table/dropdown properties. Save a backup in ignored `backups/`.
2. Extend only missing schema columns and required row capacity, preserving the original column order and native table. Re-read after structural changes, since Sheets can adjust formulas automatically.
3. Build `plan(headers, live_rows, records, sheet_id)` and inspect additions, updates, evidence and ambiguity warnings. Persist the plan privately. No rows without a stable ID or duplicate live IDs are allowed.
4. Immediately before writing, re-read the same target and call `assert_fresh`; a changed snapshot rejects the plan. Use a single writer and avoid concurrent user edits during this brief window. Sheets does not offer an atomic compare-and-swap precondition for cell values, so a small read/write race remains.
5. `compact` coalesces only planned adjacent cells; it never includes manual gaps or unrelated cells. Send explicit `userEnteredValue.stringValue` / numberValue writes in one atomic batch when within limits. Do not blindly retry an uncertain write: re-read and rebuild the plan first.
6. Read back every affected row; `verify` checks all planned cells. Replan against that readback and require zero further writes. Keep before/after snapshots and aggregate results privately.

The first import added 1,287 rows and verified 18,581 cells; repeat planning returned zero writes. This establishes the tested initial import, not a standing synchronization service. The OAuth transport itself has not been exercised with a local token; its core plan/apply logic is tested, and the live connector path was verified.

All populated live fields are protected by this first version, even research fields. Revised scores, new verified addresses or stage promotion on already-populated live rows require a deliberate, freshly read, field-specific correction. Never use whole-sheet replacement or import a CSV over manually maintained data.
