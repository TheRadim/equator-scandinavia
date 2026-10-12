# Future Sheets integration

No live synchronization is implemented. The initial tool at ../validate_leads.py performs local validation and merge preview only.

Before a live adapter: configure local OAuth without committing secrets, read and validate a fresh snapshot, back up to an ignored location, create a dry-run change plan keyed by stable IDs, detect stale snapshots, fill only empty approved discovery fields, use RAW input mode, apply the authorized plan and verify by readback. Test repeated runs, duplicate conflicts, branches, blanks and manual notes. Never issue whole-sheet replacement writes.
