"""Import human-reviewed official-source evidence; never infer claims from keywords."""
from datetime import date
from scripts.discovery.core import new_record, phone, domain
from scripts.qualification.scoring import score

def enrich(item, run_id):
    r = new_record(item['name'], item['country'], item['city'], item['discovery_source'], item['source_id'])
    r.update(item['fields'])
    r['Website Domain'] = domain(r.get('Website', ''))
    r.update(score(r, item['components']))
    r['Research Stage'] = 'Enriched'
    r['Research Run ID'] = run_id
    r['Last updated'] = date.today().isoformat()
    r['Last Verified'] = item['verified_on']
    r['Public business phone'] = phone(r.get('Public business phone', ''), item['country'])
    if r['Research Confidence'] == 'LOW' or not r.get('City'):
        r['Manual Review Required'] = 'Yes'
    return r
