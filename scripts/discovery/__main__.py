"""python -m scripts.discovery --help"""
import argparse
from datetime import datetime, timezone
import json
import logging
from pathlib import Path
from .core import COUNTRIES, EXTRA, norm, reconcile, validate
from .sources import Client, osm, brreg
from scripts.enrichment.review import enrich
from .reports import reports, write_csv

def main():
    p = argparse.ArgumentParser(description='Public bicycle discovery; exports locally, never writes Sheets automatically.')
    p.add_argument('--countries', nargs='+', choices=COUNTRIES, default=list(COUNTRIES))
    p.add_argument('--country', choices=COUNTRIES)
    p.add_argument('--city')
    p.add_argument('--source', choices=('osm','brreg','reviewed','all'), default='all')
    p.add_argument('--reviewed', type=Path, default=Path('data/private/reviewed.json'))
    p.add_argument('--database', type=Path, default=Path('data/private/leads.json'))
    p.add_argument('--refresh-existing', action='store_true', help='Bypass API cache; existing populated research/manual fields remain protected')
    p.add_argument('--export', action='store_true', help='Export existing database without network calls')
    p.add_argument('--category', choices=('custom-build', 'wheels'))
    p.add_argument('--min-score', type=int, default=0)
    p.add_argument('--output', type=Path, default=Path('outputs/discovery'))
    args = p.parse_args(); logging.basicConfig(level=logging.INFO)
    if not 0 <= args.min_score <= 100: p.error('--min-score must be 0–100')
    countries = [args.country] if args.country else args.countries
    run = datetime.now(timezone.utc).strftime('RUN-%Y%m%dT%H%M%SZ')
    candidates, failures = [], []
    if not args.export and args.source in ('osm','all'):
        client = Client()
        for country in countries:
            try: candidates.extend(osm(client, country, args.refresh_existing))
            except Exception as e:
                failures.append({'source': 'osm', 'country': country, 'error': str(e)}); logging.warning('%s', failures[-1])
    if not args.export and args.source in ('brreg','all') and 'NO' in countries:
        try: candidates.extend(brreg(Client(), args.refresh_existing))
        except Exception as e: failures.append({'source':'brreg', 'error':str(e)})
    if not args.export and args.source in ('reviewed','all') and args.reviewed.exists():
        candidates.extend(enrich(x, run) for x in json.loads(args.reviewed.read_text()) if x['country'] in countries)
    elif not args.export and args.source == 'reviewed':
        p.error('Reviewed evidence file is missing: ' + str(args.reviewed))
    existing = json.loads(args.database.read_text()) if args.database.exists() else []
    rows, events = reconcile(existing, candidates)
    for r in rows:
        r.setdefault('Research Run ID', run)
    quality = validate(rows)
    if quality['errors']: raise SystemExit(json.dumps(quality, indent=2))
    args.database.parent.mkdir(parents=True, exist_ok=True)
    args.database.write_text(json.dumps(rows, indent=2, ensure_ascii=False))
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / 'run.json').write_text(json.dumps({'run_id':run, 'failures': failures,'events': events,'quality':quality}, indent=2, ensure_ascii=False))
    selected = [r for r in rows if r['Country'] in [COUNTRIES[c] for c in countries] and (not args.city or norm(r.get('City'))==norm(args.city)) and r.get('Lead Score',0)>=args.min_score]
    if args.category:
        key = 'Custom bike builds (Yes/No/Unknown)' if args.category == 'custom-build' else 'Carbon Wheels'
        selected = [r for r in selected if r.get(key) == 'Yes']
    headers = json.loads(Path('data/schemas/workspace.json').read_text())['LEADS & PARTNERS']
    headers += [h for h in EXTRA if h not in headers]
    write_csv(args.output / 'leads.csv', selected, headers)
    reports(rows, headers, args.output)
    print(json.dumps({'run_id':run,'records':len(rows),'exported':len(selected),'added':sum(e['action']=='added' for e in events),'quarantined':sum(e['action']=='quarantined' for e in events),'failures':failures}))

if __name__ == '__main__': main()
