"""Small cached public API adapters; no search-engine scraping or personal roles."""
import hashlib
import json
import logging
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from email.utils import parsedate_to_datetime
from .core import new_record
LOG = logging.getLogger(__name__)

def retry_delay(value, attempt):
    try:
        delay = int(value) if value.isdigit() else max(0, parsedate_to_datetime(value).timestamp() - time.time())
    except (ValueError, TypeError, AttributeError):
        delay = 2 ** (attempt + 1)
    if delay > 60: raise RuntimeError('Source requests a longer pause; retry later')
    return delay

class Client:
    def __init__(self, cache='data/private/cache', delay=2, ttl=604800):
        self.cache = Path(cache); self.cache.mkdir(parents=True, exist_ok=True)
        self.delay, self.ttl, self.last = delay, ttl, 0
    def get(self, url, post=None, refresh=False):
        key = hashlib.sha256((url + (post or '')).encode()).hexdigest()
        path = self.cache / (key + '.json')
        if not refresh and path.exists() and time.time() - path.stat().st_mtime < self.ttl:
            return json.loads(path.read_text())
        for attempt in range(3):
            time.sleep(max(0, self.delay - (time.monotonic() - self.last)))
            self.last = time.monotonic()
            try:
                req = Request(url, data=post.encode() if post else None, headers={'User-Agent': 'EquatorResearch/0.1 (low-volume public business discovery)'})
                with urlopen(req, timeout=45) as response:
                    data = json.load(response)
                path.write_text(json.dumps(data, ensure_ascii=False))
                return data
            except HTTPError as e:
                if e.code not in (429, 500, 502, 503, 504) or attempt == 2: raise
                retry = e.headers.get('Retry-After', '')
                time.sleep(retry_delay(retry, attempt))
            except (URLError, TimeoutError):
                if attempt == 2: raise
                time.sleep(2 ** (attempt + 1))
        raise RuntimeError('Source unavailable')

def osm(client, country, refresh=False, endpoint='https://overpass-api.de/api/interpreter'):
    query = f'[out:json][timeout:30];area["ISO3166-1"="{country}"][admin_level=2]->.a;(nwr[shop=bicycle](area.a);nwr["service:bicycle:repair"=yes][name](area.a););out center tags;'
    return parse_osm(client.get(endpoint + '?' + urlencode({'data': query}), refresh=refresh), country)

def parse_osm(data, country):
    if data.get('remark'): raise ValueError('Overpass returned partial/error result: ' + data['remark'])
    result = []
    for item in data.get('elements', []):
        t = item.get('tags', {})
        if not t.get('name') or t.get('disused') == 'yes' or t.get('shop') == 'vacant': continue
        source = f"https://www.openstreetmap.org/{item['type']}/{item['id']}"
        website = t.get('website', t.get('contact:website', ''))
        if website and not website.startswith(('https://', 'http://')): website = 'https://' + website
        try:
            r = new_record(t['name'], country, t.get('addr:city', ''), source, 'osm:' + item['type'] + ':' + str(item['id']),
                Website=website, **{'Street Address': ' '.join(filter(None, [t.get('addr:street'), t.get('addr:housenumber')])),
                'Postal Code': t.get('addr:postcode', ''), 'Business category': 'Unknown',
                'Potential Concerns': 'OSM discovery only; current trading status, location and product fit need verification. Contact tags not treated as verified.'})
        except ValueError:
            continue
        result.append(r)
    return result

def brreg(client, refresh=False):
    rows = []
    for keyword in ('sykkel', 'sykler'):
        page = 0
        while True:
            url = 'https://data.brreg.no/enhetsregisteret/api/enheter?' + urlencode({'navn': keyword, 'size': 1000, 'page': page})
            data = client.get(url, refresh=refresh)
            rows.extend(parse_brreg(data))
            page += 1
            if page >= data.get('page', {}).get('totalPages', 1): break
    return rows

def parse_brreg(data):
    result = []
    for x in data.get('_embedded', {}).get('enheter', []):
        # SN2025 sports retail, repairs, sporting wholesale, bicycle manufacture, used retail.
        code = x.get('naeringskode1', {}).get('kode', '')
        if code not in {'47.631', '95.290', '46.490', '30.920', '47.790'}: continue
        if x.get('konkurs') or x.get('underAvvikling') or x.get('underTvangsavviklingEllerTvangsopplosning'): continue
        loc = x.get('forretningsadresse', {})
        if loc.get('landkode', 'NO') != 'NO': continue
        org = x['organisasjonsnummer']; website = x.get('hjemmeside', '')
        if website and not website.startswith(('http://', 'https://')): website = 'https://' + website
        try:
            r = new_record(x['navn'], 'NO', loc.get('poststed', ''), 'https://data.brreg.no/enhetsregisteret/api/enheter/' + org, 'brreg:' + org,
                Website=website, **{'Organization Number': org, 'Street Address': ', '.join(loc.get('adresse', [])),
                'Postal Code': loc.get('postnummer', ''), 'Region': loc.get('kommune', ''),
                'Potential Concerns': 'Registered business discovery only. Registered address may not be a shop; trading status and product fit unverified. SN2025 ' + code})
        except ValueError: continue
        result.append(r)
    return result
