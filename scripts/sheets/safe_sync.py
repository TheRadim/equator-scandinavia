"""Transport-neutral, cell-level Sheets plans with stale checks and readback.

The caller supplies a live reader and writer (OAuth API or connected tool bridge).
Plans never include manual fields and default to a preview. Existing research
cells are fill-empty only until explicit field ownership is implemented.
"""
from datetime import datetime, timezone
import json
from pathlib import Path
from scripts.discovery.core import MANUAL, EXTRA, fingerprint, likely_matches, validate

APPROVED = set(EXTRA) | {'Lead ID', 'Business name', 'Country', 'City', 'Website',
    'Public business email', 'Public business phone', 'Business category', 'Brands carried',
    'Custom bike builds (Yes/No/Unknown)', 'Titanium experience (Yes/No/Unknown)',
    'Road / Gravel / MTB focus', 'Lead source', 'Date discovered', 'Last updated'}

def blank(value):
    return value is None or value == ''

def compact(requests):
    """Coalesce adjacent cells within each row; never include untouched cells."""
    result = []
    for request in requests:
        cell = request['updateCells']; start = cell['start']
        previous = result[-1]['updateCells'] if result else None
        if (previous and previous['start']['sheetId'] == start['sheetId']
                and previous['start']['rowIndex'] == start['rowIndex']
                and previous['start']['columnIndex'] + len(previous['rows'][0]['values']) == start['columnIndex']):
            previous['rows'][0]['values'].extend(cell['rows'][0]['values'])
        else:
            result.append({'updateCells': {'start': dict(start), 'rows': [{'values': list(cell['rows'][0]['values'])}], 'fields': 'userEnteredValue'}})
    vertical, last = [], {}
    for request in result:
        cell = request['updateCells']; start = cell['start']
        key = (start['sheetId'], start['columnIndex'], len(cell['rows'][0]['values']))
        previous = last.get(key)
        if previous and previous['start']['rowIndex'] + len(previous['rows']) == start['rowIndex']:
            previous['rows'].extend(cell['rows'])
        else:
            vertical.append(request); last[key] = cell
    return vertical

def plan(headers, live_rows, records, sheet_id):
    quality = validate(records)
    if quality['errors']: raise ValueError('; '.join(quality['errors']))
    if len(headers) != len(set(headers)) or 'Lead ID' not in headers: raise ValueError('Invalid headers')
    id_col = headers.index('Lead ID'); ids = {}; existing = []
    for offset, row in enumerate(live_rows, start=1):
        if not any(not blank(v) for v in row): continue
        if len(row) <= id_col or not row[id_col]: raise ValueError('Nonempty row without Lead ID')
        if row[id_col] in ids: raise ValueError('Duplicate live ID')
        ids[row[id_col]] = (offset, row)
        existing.append(dict(zip(headers, row)))
    requests, added, updated = [], 0, 0
    last = max((offset for offset, row in enumerate(live_rows, start=1) if any(not blank(v) for v in row)), default=0)
    for r in records:
        if r['Lead ID'] in ids:
            row_index, old = ids[r['Lead ID']]
        else:
            if any(likely_matches(r, x) for x in existing): raise ValueError('Ambiguous live match: ' + r['Business name'])
            last += 1; row_index, old = last, []; added += 1
            existing.append(r)
        changed = False
        for col, key in enumerate(headers):
            value = r.get(key, '')
            if key not in APPROVED or key in MANUAL or blank(value) or (col < len(old) and not blank(old[col])): continue
            cell = {'numberValue': value} if type(value) in (int, float) else {'stringValue': str(value)}
            requests.append({'updateCells': {'start': {'sheetId': sheet_id, 'rowIndex': row_index, 'columnIndex': col},
                'rows': [{'values': [{'userEnteredValue': cell}]}], 'fields': 'userEnteredValue'}})
            changed = True
        if old and changed: updated += 1
    return {'snapshot_hash': fingerprint([headers, live_rows]), 'created_at': datetime.now(timezone.utc).isoformat(),
            'added': added, 'updated': updated, 'requests': requests, 'quality': quality}

def assert_fresh(change_set, headers, live_rows):
    if fingerprint([headers, live_rows]) != change_set['snapshot_hash']: raise ValueError('Stale snapshot; rebuild dry-run plan')

def verify(change_set, live_rows):
    for request in change_set['requests']:
        x = request['updateCells']; row = x['start']['rowIndex'] - 1; col = x['start']['columnIndex']
        expected = next(iter(x['rows'][0]['values'][0]['userEnteredValue'].values()))
        if row >= len(live_rows) or col >= len(live_rows[row]) or live_rows[row][col] != expected:
            raise ValueError(f'Readback mismatch at row {row+2}, column {col+1}')

def apply(change_set, reader, writer, backup_dir='backups', dry_run=True):
    headers, live_rows = reader()
    assert_fresh(change_set, headers, live_rows)
    if dry_run: return {'dry_run': True, 'added': change_set['added'], 'updated': change_set['updated']}
    target = Path(backup_dir); target.mkdir(parents=True, exist_ok=True)
    path = target / ('leads-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f') + '.json')
    path.write_text(json.dumps([headers, live_rows], ensure_ascii=False))
    # A writer must propagate errors; never retry an uncertain write without re-reading.
    writer(change_set['requests'])
    _, result = reader(); verify(change_set, result)
    return {'dry_run': False, 'backup': str(path), 'added': change_set['added'], 'updated': change_set['updated']}
