import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from scripts.discovery.core import new_record, reconcile, validate, phone, norm
from scripts.discovery.sources import Client, parse_osm, parse_brreg
from scripts.qualification.scoring import score, geography
from scripts.sheets.safe_sync import plan, apply, compact


def lead(name='Example Cycles', city='Copenhagen', source='sample:1'):
    return new_record(name, 'DK', city, 'https://example.com/', source, Website='https://example.com/')

def reviewed():
    r = lead()
    c = {key: {'points': 0} for key in ('product','custom','brand','commercial','frame')}
    c['product'] = {'points': 25, 'reason': 'Premium frames', 'evidence': 'https://example.com/frames'}
    r.update(score(r,c)); r.update({'Research Stage':'Enriched', 'Research Confidence':'HIGH',
        'Description':' '.join(['Evidence']*40), 'Last Verified':'2026-10-12',
        'Product Evidence':'https://example.com/frames', 'Website Evidence':'https://example.com/',
        'Qualification Evidence':'https://example.com/frames'})
    return r

class DiscoveryTests(unittest.TestCase):
    def test_repeat_preserves_identity_and_manual_fields(self):
        a=lead(); a['Contact status']='Responded'; a['Conversation notes']='Keep'
        b=lead(); b['Contact status']='Not contacted'; b['Conversation notes']='Replace'
        rows,events=reconcile([a],[b,b]); self.assertEqual(rows,[a]); self.assertEqual(len(events),2)
    def test_stable_identity_survives_rebranding(self):
        a=lead(); b=lead('Changed'); b['Website']='https://new.example.com/'
        rows,_=reconcile([a],[b]); self.assertEqual(rows[0]['Lead ID'],a['Lead ID']); self.assertEqual(rows[0]['Business name'],a['Business name'])
    def test_ambiguous_match_is_quarantined(self):
        a=lead(); b=lead(source='other:2'); rows,events=reconcile([a],[b])
        self.assertEqual(len(rows),1); self.assertEqual(events[0]['action'],'quarantined')
    def test_branches_in_different_cities_are_separate(self):
        rows,_=reconcile([lead()],[lead(city='Aarhus',source='branch:2')]); self.assertEqual(len(rows),2)
    def test_same_city_other_address_requires_review(self):
        a=lead(); b=lead(source='branch:2'); a['Street Address']='One 1'; b['Street Address']='Two 2'
        rows,events=reconcile([a],[b]); self.assertEqual(len(rows),1); self.assertEqual(events[0]['action'],'quarantined')
    def test_conflicting_source_ids_rejected(self):
        a=lead(); b=lead(city='Aarhus',source='other:2'); c=lead(); c['Source IDs']='sample:1;other:2'
        with self.assertRaises(ValueError): reconcile([a,b],[c])
    def test_enrichment_promotes_stage_without_manual_changes(self):
        a=lead(); a['Qualification notes']='My assessment'
        rows,_=reconcile([a],[reviewed()]); self.assertEqual(rows[0]['Research Stage'],'Enriched')
        self.assertEqual(rows[0]['Qualification notes'],'My assessment'); self.assertFalse(validate(rows)['errors'])
    def test_malformed_enrichment_is_rejected(self):
        b=reviewed(); b['Product Evidence']=''
        with self.assertRaises(ValueError): reconcile([lead()],[b])
    def test_blank_input_does_not_erase(self):
        a=lead(); a['Region']='Capital'; b=lead(); b['Region']=''
        self.assertEqual(reconcile([a],[b])[0][0]['Region'],'Capital')
    def test_phone_normalization_and_uninterpretable_values(self):
        self.assertEqual(phone('31 22 33 44','DK'),'+4531223344')
        self.assertEqual(phone('+46 (0)8 123 4567','SE'),'+4681234567')
        self.assertEqual(phone('0047 9222 0919','NO'),'+4792220919')
        self.assertEqual(phone('12345 ext 8','SE'),'')
    def test_accent_city_alias_and_geography(self):
        self.assertEqual(norm('Malmö'),norm('Malmo')); self.assertEqual(geography('Denmark','Brøndby'),10)
    def test_score_requires_evidence_and_inference(self):
        c={k:{'points':0} for k in ('product','custom','brand','commercial','frame')}
        c['commercial']={'points':15,'reason':'Supplier route','evidence':'https://example.com/'}
        with self.assertRaises(ValueError): score(lead(),c)
        c['commercial']['inference']=True
        self.assertEqual(score(lead(),c)['Lead Score'],25)
    def test_unknown_is_not_no(self):
        r=lead(); self.assertNotIn('Lead Score',r); self.assertNotIn('Titanium experience (Yes/No/Unknown)',r)
    def test_quality_rejects_formula_date_score_and_contact_without_evidence(self):
        r=reviewed(); r.update({'Business name':'=bad()', 'Lead Score':101, 'Last Verified':'2026-02-30','Public business email':'hello@example.com'})
        errors=validate([r])['errors']; self.assertGreaterEqual(len(errors),4)
    def test_map_partial_results_fail_and_contacts_not_verified(self):
        with self.assertRaises(ValueError): parse_osm({'remark':'timeout'},'DK')
        rows=parse_osm({'elements':[{'type':'node','id':1,'tags':{'name':'Example','phone':'12345678'}}]},'DK')
        self.assertNotIn('Public business phone',rows[0]); self.assertEqual(rows[0]['Research Stage'],'Discovered')
    def test_registry_filters_clubs_and_closed_companies(self):
        data={'_embedded':{'enheter':[{'navn':'Example','organisasjonsnummer':'123','naeringskode1':{'kode':'93.120'}}, {'navn':'Closed','konkurs':True,'naeringskode1':{'kode':'47.631'}}]}}
        self.assertEqual(parse_brreg(data),[])
    def test_cache_avoids_network(self):
        import hashlib
        with tempfile.TemporaryDirectory() as d:
            url='https://example.com/data'; Path(d,hashlib.sha256(url.encode()).hexdigest()+'.json').write_text('{"ok": true}')
            with patch('scripts.discovery.sources.urlopen',side_effect=AssertionError('network')):
                self.assertEqual(Client(d).get(url),{'ok':True})
    def test_retry_after_long_pause_is_respected(self):
        from scripts.discovery.sources import retry_delay
        self.assertEqual(retry_delay('12',0),12)
        with self.assertRaises(RuntimeError): retry_delay('120',0)
    def test_duplicate_source_identity_and_grade_are_invalid(self):
        a=reviewed(); b=reviewed(); b['City']='Aarhus'; b['Lead Grade']='A'
        errors=validate([a,b])['errors']
        self.assertTrue(any('source identity' in x for x in errors))
        self.assertTrue(any('grade mismatch' in x for x in errors))

class SyncTests(unittest.TestCase):
    def setUp(self):
        self.r=lead(); self.headers=['Lead ID','Business name','Country','City','Website','Contact status','Conversation notes','Region']
        self.rows=[[self.r.get(h,'') for h in self.headers]]
    def test_dry_run_and_stale_rejection(self):
        self.r['Region']='Capital'; p=plan(self.headers,self.rows,[self.r],1)
        called=[]; result=apply(p,lambda:(self.headers,self.rows),lambda x:called.append(x))
        self.assertTrue(result['dry_run']); self.assertFalse(called)
        self.rows[0][5]='Responded'
        with self.assertRaises(ValueError): apply(p,lambda:(self.headers,self.rows),lambda x:None)
    def test_manual_and_populated_cells_protected(self):
        self.r.update({'Contact status':'Contacted','Conversation notes':'new','Website':'https://new.example.com/'})
        self.assertEqual(plan(self.headers,self.rows,[self.r],1)['requests'],[])
    def test_apply_backup_readback_and_idempotence(self):
        self.r['Region']='Capital'; p=plan(self.headers,self.rows,[self.r],1)
        def writer(requests):
            for req in requests:
                x=req['updateCells']; self.rows[x['start']['rowIndex']-1][x['start']['columnIndex']]=next(iter(x['rows'][0]['values'][0]['userEnteredValue'].values()))
        with tempfile.TemporaryDirectory() as d:
            result=apply(p,lambda:(self.headers,self.rows),writer,d,False)
            self.assertTrue(Path(result['backup']).exists())
        self.assertFalse(plan(self.headers,self.rows,[self.r],1)['requests'])
    def test_readback_failure_is_not_success(self):
        self.r['Region']='Capital'; p=plan(self.headers,self.rows,[self.r],1)
        with tempfile.TemporaryDirectory() as d, self.assertRaises(ValueError):
            apply(p,lambda:(self.headers,self.rows),lambda x:None,d,False)
    def test_unknown_live_identity_blocks_append(self):
        other=lead(source='different:1')
        with self.assertRaises(ValueError): plan(self.headers,self.rows,[other],1)
    def test_nonempty_row_without_id_blocks(self):
        with self.assertRaises(ValueError): plan(self.headers,[['','Someone']],[self.r],1)
    def test_compaction_writes_exactly_planned_cells(self):
        other=lead(city='Aarhus',source='branch:2')
        p=plan(self.headers,[],[self.r,other],1)
        def expand(requests):
            cells={}
            for request in requests:
                x=request['updateCells']; start=x['start']
                for offset,row in enumerate(x['rows']):
                    for col,cell in enumerate(row['values']):
                        cells[(start['rowIndex']+offset,start['columnIndex']+col)]=cell['userEnteredValue']
            return cells
        self.assertEqual(expand(p['requests']),expand(compact(p['requests'])))
        self.assertFalse(any(col in (5,6) for _,col in expand(compact(p['requests']))))
    def test_unknown_columns_are_not_automatically_owned(self):
        self.r['Human custom field']='Do not write'
        p=plan(self.headers+['Human custom field'],[],[self.r],1)
        self.assertFalse(any(x['updateCells']['start']['columnIndex']==8 for x in p['requests']))
    def test_google_null_cells_are_empty(self):
        self.rows[0][7]=None; self.r['Region']='Capital'
        p=plan(self.headers,self.rows+[[None]*8],[self.r],1)
        self.assertEqual(len(p['requests']),1)
        self.assertEqual(p['requests'][0]['updateCells']['start']['columnIndex'],7)

if __name__=='__main__': unittest.main()
