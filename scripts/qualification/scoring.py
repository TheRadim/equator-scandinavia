"""Evidence-reviewed component scores; unknown is zero evidence, never a negative fact."""
from scripts.discovery.core import norm
ALLOWED = {'product': {0, 5, 15, 25}, 'custom': {0, 10, 20}, 'brand': {0, 10, 20},
           'commercial': {0, 8, 15}, 'frame': {0, 5, 10}}
NEAR = {'copenhagen','københavn','frederiksberg','gentofte','lyngby','hellerup','klampenborg','charlottenlund','brøndby','malmö','malmo','lund'}
SOUTH = {'helsingborg','landskrona','kristianstad','ystad','trelleborg','staffanstorp','halmstad','båstad','skåne'}

def geography(country, city):
    if norm(city) in {norm(x) for x in NEAR} and country in ('Denmark', 'Sweden'): return 10
    if country == 'Denmark' or country == 'Sweden' and norm(city) in {norm(x) for x in SOUTH}: return 8
    return 6 if country == 'Sweden' else 5

def score(record, components):
    if set(components) != set(ALLOWED): raise ValueError('Provide all five reviewed score components')
    for key, item in components.items():
        if type(item.get('points')) is not int or item['points'] not in ALLOWED[key]: raise ValueError('Invalid component: ' + key)
        if item['points'] and (not item.get('evidence') or not item.get('reason')): raise ValueError('Points require evidence and reasoning: ' + key)
        if key == 'commercial' and item['points'] and not item.get('inference'): raise ValueError('Commercial receptiveness must be labelled an inference')
    geo = geography(record['Country'], record['City'])
    total = sum(x['points'] for x in components.values()) + geo
    grade = 'A' if total >= 80 else 'B' if total >= 60 else 'C' if total >= 40 else 'D'
    breakdown = '; '.join(f"{k}={v['points']}: {v.get('reason', 'No verified evidence')} [{v.get('evidence', '')}]" for k,v in components.items()) + f'; geography={geo}'
    return {'Lead Score': total, 'Lead Grade': grade, 'Score Breakdown': breakdown}
