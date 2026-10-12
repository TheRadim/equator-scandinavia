"""Read-only validation and merge preview. No network or write side effects."""
import argparse
from datetime import date
import json
import re
import unicodedata
from urllib.parse import urlsplit
from uuid import uuid4

SAFE_FIELDS = {'Website', 'Public business email', 'Public business phone',
               'Business category', 'Brands carried', 'Lead source', 'Date discovered'}
OPTIONS = {
    'Custom bike builds (Yes/No/Unknown)': {'Yes', 'No', 'Unknown'},
    'Titanium experience (Yes/No/Unknown)': {'Yes', 'No', 'Unknown'},
    'Response received (Yes/No/Unknown)': {'Yes', 'No', 'Unknown'},
    'Equator fit (High/Medium/Low)': {'High', 'Medium', 'Low'},
    'Contact status': {'Not contacted', 'Contacted', 'Responded', 'Active conversation',
                       'Interested', 'Not interested', 'On hold', 'Closed'},
}

def normalized(value):
    return ' '.join(unicodedata.normalize('NFKC', value).casefold().split())

def domain(value):
    if not value:
        return ''
    parsed = urlsplit(value if '://' in value else 'https://' + value)
    if parsed.scheme not in {'http', 'https'} or not parsed.hostname or '.' not in parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Website must be an HTTP(S) business URL without credentials')
    return parsed.hostname.lower().removeprefix('www.').rstrip('.')

def identity(row):
    return tuple(normalized(row.get(k, '')) for k in ('Business name', 'Country', 'City'))

def validate(rows):
    if not isinstance(rows, list):
        raise ValueError('Expected a JSON array of objects')
    ids, names, sites = set(), set(), set()
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError('Every lead must be an object')
        for key in ('Lead ID', 'Business name', 'Country', 'City'):
            if not isinstance(row.get(key), str) or not row[key].strip():
                raise ValueError(f'Missing {key}')
        if not re.fullmatch(r'LEAD-[A-Za-z0-9-]+', row['Lead ID']):
            raise ValueError('Invalid Lead ID')
        for key, value in row.items():
            if value is not None and not isinstance(value, str):
                raise ValueError(f'{key} must be text or null')
            if value and value.lstrip().startswith(('=', '+', '-', '@')):
                # International telephone prefixes are valid; Sheets writes must use RAW.
                if key != 'Public business phone' or not re.fullmatch(r'\+?[0-9 ()-]+', value):
                    raise ValueError(f'Formula-like input in {key}')
            if value and key in OPTIONS and value not in OPTIONS[key]:
                raise ValueError(f'Invalid option for {key}')
            if value and (key.endswith('date') or key in {'Date discovered', 'Last updated'}):
                date.fromisoformat(value)
        key = identity(row)
        site = (domain(row.get('Website')), key[1], key[2])
        if row['Lead ID'] in ids or key in names or (site[0] and site in sites):
            raise ValueError('Duplicate ID or business identity; review before merging')
        ids.add(row['Lead ID']); names.add(key)
        if site[0]:
            sites.add(site)

def preview(existing, incoming):
    validate(existing); validate(incoming)
    current = {r['Lead ID']: dict(r) for r in existing}
    changes = []
    for row in incoming:
        lead_id = row['Lead ID']
        if lead_id in current:
            old = current[lead_id]
            if identity(old) != identity(row):
                raise ValueError('Identity changed for an existing ID; manual review required')
            if old.get('Website') and row.get('Website') and domain(old['Website']) != domain(row['Website']):
                raise ValueError('Website changed for an existing ID; manual review required')
            fields = {k: v for k, v in row.items() if k in SAFE_FIELDS and v and not old.get(k)}
            if fields:
                changes.append({'action': 'fill_empty', 'id': lead_id, 'fields': fields})
                old.update(fields)
        else:
            # Manual fields from discovery input are deliberately not inserted.
            accepted = {k: v for k, v in row.items() if k in SAFE_FIELDS | {'Lead ID', 'Business name', 'Country', 'City'}}
            current[lead_id] = accepted
            changes.append({'action': 'insert', 'id': lead_id, 'fields': accepted})
    validate(list(current.values()))
    return changes

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--new-id', action='store_true')
    parser.add_argument('--existing'); parser.add_argument('--incoming')
    args = parser.parse_args()
    if args.new_id:
        print('LEAD-' + str(uuid4())); return
    if not args.existing or not args.incoming:
        parser.error('--existing and --incoming are required for a dry-run preview')
    try:
        with open(args.existing) as f: existing = json.load(f)
        with open(args.incoming) as f: incoming = json.load(f)
        print(json.dumps({'dry_run': True, 'changes': preview(existing, incoming)}, indent=2))
    except (ValueError, OSError, TypeError) as error:
        parser.exit(1, f'Validation failed: {error}\n')

if __name__ == '__main__':
    main()
