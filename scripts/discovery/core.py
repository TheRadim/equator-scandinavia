"""Conservative discovery records, immutable IDs, validation and deduplication."""
import hashlib
import json
import re
import unicodedata
import uuid
from datetime import date
from urllib.parse import urlsplit

COUNTRIES = {'DK': 'Denmark', 'SE': 'Sweden', 'NO': 'Norway'}
MANUAL = {'Equator fit (High/Medium/Low)', 'Qualification notes', 'Contact person',
          'Contact status', 'Last contact date', 'Next follow-up date', 'Conversation notes',
          'Potential partnership model', 'Response received (Yes/No/Unknown)', 'Next Action', 'Assigned Priority'}
EXTRA = ['Parent Company', 'Organization Number', 'Region', 'Street Address', 'Postal Code',
         'Website Domain', 'Contact Form', 'Instagram', 'Facebook', 'Contact Source', 'Description',
         'Road Bikes', 'Gravel Bikes', 'MTB', 'Framesets', 'Carbon Wheels', 'Independent / Chain / Unknown',
         'Lead Score', 'Lead Grade', 'Research Confidence', 'Recommended Partnership', 'Secondary Opportunities',
         'Why It Fits', 'Potential Concerns', 'Manual Review Required', 'Next Action', 'Assigned Priority',
         'Website Evidence', 'Product Evidence', 'Contact Evidence', 'Qualification Evidence', 'Last Verified',
         'Research Run ID', 'Research Stage', 'Score Breakdown', 'Source IDs']

def norm(value):
    text = unicodedata.normalize('NFKD', str(value or '')).casefold()
    return ' '.join(''.join(c for c in text if not unicodedata.combining(c)).split())

def domain(url):
    if not url:
        return ''
    p = urlsplit(url)
    if p.scheme not in ('http', 'https') or not p.hostname or '.' not in p.hostname or p.username:
        raise ValueError(f'Invalid public website URL: {url}')
    return p.hostname.lower().removeprefix('www.')

def phone(value, country):
    raw = str(value or '').strip()
    if not raw:
        return ''
    if re.search(r'[^\d+() .\-]', raw):
        return ''
    digits = re.sub(r'\D', '', raw)
    if raw.startswith('00'):
        digits = digits[2:]; raw = '+' + digits
    if raw.startswith('+46') and '(0)' in raw:
        digits = re.sub(r'\D', '', raw.replace('(0)', ''))
    if raw.startswith('+') and 8 <= len(digits) <= 15:
        return '+' + digits
    if country in ('DK', 'NO') and len(digits) == 8:
        return ('+45' if country == 'DK' else '+47') + digits
    if country == 'SE' and digits.startswith('0') and 7 <= len(digits) <= 11:
        return '+46' + digits[1:]
    return ''

def new_record(name, country, city, source, source_id='', **fields):
    if country not in COUNTRIES:
        raise ValueError('country must be DK, SE or NO')
    r = {'Lead ID': 'LEAD-' + str(uuid.uuid4()), 'Business name': name, 'Country': COUNTRIES[country],
         'City': city, 'Lead source': source, 'Source IDs': source_id, 'Date discovered': date.today().isoformat(),
         'Research Stage': 'Discovered', 'Research Confidence': 'LOW', 'Manual Review Required': 'Yes',
         'Business category': 'Unknown'}
    r.update(fields)
    if r.get('Website'):
        r['Website Domain'] = domain(r['Website'])
    return r

def likely_matches(a, b):
    """Candidates only; never fuzzy-merge. Organization/domain alone can be branches."""
    if a['Country'] != b['Country']:
        return False
    same_city = norm(a.get('City')) == norm(b.get('City')) and bool(a.get('City'))
    same_address = bool(a.get('Street Address')) and norm(a['Street Address']) == norm(b.get('Street Address'))
    same_name = norm(a['Business name']) == norm(b['Business name'])
    same_domain = bool(a.get('Website')) and domain(a['Website']) == domain(b.get('Website', ''))
    same_org = bool(a.get('Organization Number')) and a['Organization Number'] == b.get('Organization Number')
    same_phone = bool(a.get('Public business phone')) and a['Public business phone'] == b.get('Public business phone')
    return (same_city and (same_name or same_domain or same_org or same_phone)
            or same_address and (same_name or same_org or same_domain)
            or (not a.get('City') or not b.get('City')) and (same_domain or same_name or same_org))

def reconcile(existing, incoming):
    """Only persistent source IDs/lead IDs match automatically; quarantine ambiguity."""
    result = [dict(r) for r in existing]
    events = []
    for candidate in incoming:
        source_ids = set(filter(None, candidate.get('Source IDs', '').split(';')))
        exact = [r for r in result if r['Lead ID'] == candidate['Lead ID'] or
                 source_ids & set(filter(None, r.get('Source IDs', '').split(';')))]
        if len(exact) > 1:
            raise ValueError('Conflicting stable source IDs; resolve manually')
        if exact:
            target = exact[0]
            if target['Country'] != candidate['Country']:
                raise ValueError('Stable identity has conflicting country; resolve manually')
            if candidate.get('Research Stage') == 'Enriched' and target.get('Research Stage') == 'Discovered':
                errors = validate([candidate])['errors']
                if errors: raise ValueError('; '.join(errors))
                # Only machine-created stage/confidence defaults may be promoted.
                for key in ('Research Stage', 'Research Confidence', 'Research Run ID', 'Last updated'):
                    if key in candidate: target[key] = candidate[key]
            # Stable IDs permit business name/site changes. Never replace populated fields.
            for key, value in candidate.items():
                if key not in MANUAL | {'Lead ID', 'Date discovered'} and value != '' and target.get(key, '') == '':
                    target[key] = value
            target['Source IDs'] = ';'.join(sorted(source_ids | set(filter(None, target.get('Source IDs', '').split(';')))))
            events.append({'action': 'matched', 'id': target['Lead ID']})
            continue
        possible = [r for r in result if likely_matches(r, candidate)]
        if possible:
            events.append({'action': 'quarantined', 'candidate': candidate, 'possible_ids': [r['Lead ID'] for r in possible]})
            continue
        result.append(dict(candidate))
        events.append({'action': 'added', 'id': candidate['Lead ID']})
    return result, events

def validate(records):
    errors, warnings, ids, sources = [], [], set(), set()
    for r in records:
        ident = r.get('Lead ID', '')
        if not re.fullmatch(r'LEAD-[A-Za-z0-9-]+', ident) or ident in ids:
            errors.append(f'{ident}: invalid/duplicate ID')
        ids.add(ident)
        source_ids = set(filter(None, r.get('Source IDs', '').split(';')))
        if source_ids & sources: errors.append(f'{ident}: duplicate stable source identity')
        sources.update(source_ids)
        if not r.get('Business name') or r.get('Country') not in COUNTRIES.values():
            errors.append(f'{ident}: missing name/invalid country')
        if not r.get('City'):
            warnings.append(f'{ident}: missing city; manual review')
        try:
            domain(r.get('Website', ''))
        except ValueError as e:
            errors.append(f'{ident}: {e}')
        email = r.get('Public business email', '')
        if email and not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email):
            errors.append(f'{ident}: invalid email')
        p = r.get('Public business phone', '')
        if p and not re.fullmatch(r'\+[1-9]\d{7,14}', p):
            errors.append(f'{ident}: invalid phone')
        for key in ('Date discovered', 'Last updated', 'Last Verified'):
            if r.get(key):
                try: date.fromisoformat(r[key])
                except (ValueError, TypeError): errors.append(f'{ident}: invalid {key}')
        for key in ('Road Bikes', 'Gravel Bikes', 'MTB', 'Framesets', 'Carbon Wheels',
                    'Custom bike builds (Yes/No/Unknown)', 'Titanium experience (Yes/No/Unknown)', 'Manual Review Required'):
            if r.get(key) and r[key] not in ('Yes', 'No', 'Unknown'): errors.append(f'{ident}: invalid {key}')
        if r.get('Research Confidence') not in ('HIGH', 'MEDIUM', 'LOW'):
            errors.append(f'{ident}: invalid research confidence')
        if r.get('Research Stage') not in ('Discovered', 'Enriched'): errors.append(f'{ident}: invalid research stage')
        for key in ('Contact Form', 'Instagram', 'Facebook'):
            if r.get(key):
                try: domain(r[key])
                except ValueError: errors.append(f'{ident}: invalid {key} URL')
        if r.get('Research Stage') == 'Enriched':
            score = r.get('Lead Score')
            if type(score) is not int or not 0 <= score <= 100:
                errors.append(f'{ident}: invalid score')
            elif r.get('Lead Grade') != ('A' if score >= 80 else 'B' if score >= 60 else 'C' if score >= 40 else 'D'):
                errors.append(f'{ident}: score/grade mismatch')
            for key in ('Product Evidence', 'Qualification Evidence', 'Website Evidence', 'Last Verified', 'Description'):
                if not r.get(key): errors.append(f'{ident}: missing {key}')
            for key in ('Product Evidence', 'Qualification Evidence', 'Website Evidence', 'Contact Evidence'):
                if r.get(key) and not re.search(r'https?://[^\s]+\.[^\s]+', r[key]):
                    errors.append(f'{ident}: {key} needs a source URL')
            if not 40 <= len(r.get('Description', '').split()) <= 80:
                errors.append(f'{ident}: description must have 40–80 words')
            if (email or p) and not r.get('Contact Evidence'):
                errors.append(f'{ident}: contact has no evidence')
        for key, value in r.items():
            if isinstance(value, str) and value.lstrip().startswith(('=', '@', '+', '-')) and key != 'Public business phone':
                errors.append(f'{ident}: spreadsheet formula-like value in {key}')
    for i, r in enumerate(records):
        for other in records[:i]:
            if likely_matches(r, other):
                warnings.append(f"Potential duplicate/branch: {r['Lead ID']} / {other['Lead ID']}")
    return {'errors': errors, 'warnings': warnings, 'records': len(records)}

def fingerprint(rows):
    return hashlib.sha256(json.dumps(rows, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
