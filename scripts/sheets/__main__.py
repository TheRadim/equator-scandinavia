"""OAuth Sheets bridge; dry-run by default. Tokens stay in the environment."""
import argparse
import json
import os
import time
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from .safe_sync import plan, apply, compact
from scripts.discovery.sources import retry_delay
from scripts.discovery.core import EXTRA

class Sheets:
    def __init__(self, spreadsheet_id, sheet_name):
        token=os.environ.get('GOOGLE_ACCESS_TOKEN')
        if not token: raise ValueError('GOOGLE_ACCESS_TOKEN is not configured. Use the connected Google Drive tools or the CSV export.')
        self.base='https://sheets.googleapis.com/v4/spreadsheets/'+quote(spreadsheet_id,safe='')
        self.token=token; self.sheet_name=sheet_name
    def request(self, suffix, data=None):
        headers={'Authorization':'Bearer '+self.token,'Content-Type':'application/json'}
        for attempt in range(3):
            try:
                req=Request(self.base+suffix, data=json.dumps(data).encode() if data is not None else None, headers=headers)
                with urlopen(req, timeout=45) as response: return json.load(response)
            except HTTPError as exc:
                # Only reads are retried. An uncertain write requires a fresh plan.
                if data is not None or exc.code not in (429,500,502,503,504) or attempt==2: raise
                pause=exc.headers.get('Retry-After','')
                time.sleep(retry_delay(pause, attempt))
    def read(self):
        # Column range allows future row growth; unknown extra columns are protected by the allowlist.
        name="'"+self.sheet_name.replace("'","''")+"'!A:ZZ"
        values=self.request('/values/'+quote(name,safe='')+'?valueRenderOption=UNFORMATTED_VALUE').get('values',[])
        if not values: raise ValueError('Target has no headers; initialize its schema first')
        return values[0],values[1:]
    def write(self, requests):
        self.request(':batchUpdate',{'requests':compact(requests)})

def main():
    p=argparse.ArgumentParser(description='Preview or explicitly apply fill-empty research updates to an existing Sheet.')
    p.add_argument('--spreadsheet-id',required=True); p.add_argument('--sheet-id',required=True,type=int)
    p.add_argument('--sheet-name',default='LEADS & PARTNERS')
    p.add_argument('--database',type=Path,default=Path('data/private/leads.json'))
    p.add_argument('--apply',action='store_true'); p.add_argument('--plan',type=Path,default=Path('outputs/discovery/sheets-plan.json'))
    args=p.parse_args(); api=Sheets(args.spreadsheet_id,args.sheet_name)
    meta=api.request('?fields=sheets.properties')
    target=next((x['properties'] for x in meta['sheets'] if x['properties']['title']==args.sheet_name),None)
    if not target or target['sheetId']!=args.sheet_id: raise ValueError('Sheet name and ID do not identify the same target')
    headers,rows=api.read(); records=json.loads(args.database.read_text())
    missing=set(EXTRA)-set(headers)
    if missing: raise ValueError('Extend the existing research schema before syncing; missing: '+', '.join(sorted(missing)))
    change=plan(headers,rows,records,args.sheet_id)
    if any(x['updateCells']['start']['rowIndex']>=target['gridProperties']['rowCount'] for x in change['requests']):
        raise ValueError('Target capacity is too small; extend the existing table before applying')
    args.plan.parent.mkdir(parents=True,exist_ok=True); args.plan.write_text(json.dumps(change,ensure_ascii=False))
    # A single atomic API batch keeps partial-write recovery simple. Large plans use an operator bridge.
    if len(json.dumps(compact(change['requests'])).encode())>1_800_000:
        raise SystemExit('Plan exceeds conservative request size. Use reviewed smaller record batches or the CSV fallback.')
    print(json.dumps(apply(change,api.read,api.write,dry_run=not args.apply)))

if __name__=='__main__': main()
