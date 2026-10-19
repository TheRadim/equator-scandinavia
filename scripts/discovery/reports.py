"""Private research outputs, ordered by the user's qualification priorities."""
import csv
import json
from pathlib import Path
from scripts.qualification.scoring import geography
from .core import COUNTRIES, validate

def rank(r):
    return (r.get('Lead Grade', 'Z'), {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}.get(r.get('Research Confidence'), 3),
            -geography(r['Country'], r.get('City', '')), -r.get('Lead Score', 0), r['Business name'])

def write_csv(path, rows, headers):
    with Path(path).open('w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction='ignore')
        writer.writeheader(); writer.writerows(rows)

def reports(rows, headers, output):
    output = Path(output); output.mkdir(parents=True, exist_ok=True)
    qualified = sorted((r for r in rows if r.get('Research Stage') == 'Enriched' and r.get('Lead Score', 0) >= 60), key=rank)
    write_csv(output / 'full-database.csv', rows, headers)
    write_csv(output / 'qualified-shortlist.csv', qualified, headers)
    summary = {}
    for country in COUNTRIES.values():
        group = [r for r in rows if r['Country'] == country]
        enriched = [r for r in group if r.get('Research Stage') == 'Enriched']
        summary[country] = {'discovered': len(group), 'enriched': len(enriched),
            'qualified': sum(r.get('Lead Score', 0) >= 60 for r in enriched),
            'grade_a': sum(r.get('Lead Grade') == 'A' for r in enriched),
            'grade_b': sum(r.get('Lead Grade') == 'B' for r in enriched),
            'verified_emails': sum(bool(r.get('Public business email') and r.get('Contact Evidence')) for r in enriched),
            'verified_phones': sum(bool(r.get('Public business phone') and r.get('Contact Evidence')) for r in enriched),
            'missing_websites': sum(not r.get('Website') for r in group),
            'missing_city': sum(not r.get('City') for r in group),
            'manual_review': sum(r.get('Manual Review Required') == 'Yes' for r in group)}
    (output / 'country-summary.json').write_text(json.dumps(summary, indent=2))
    (output / 'data-quality.json').write_text(json.dumps(validate(rows), indent=2))
    text = ['# Scandinavian dealer research', '',
            'Discovery records are a research backlog, not confirmed active or qualified shops. Scores measure evidenced fit, not supplier interest. Commercial suitability is an inference. Public contacts were checked on the recorded Last Verified date; no outreach has occurred.', '',
            '| Country | Discovered | Enriched | Qualified ≥60 | A | B | Emails | Phones | Missing website | Missing city | Review |',
            '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|']
    for country, s in summary.items():
        text.append('| ' + country + ' | ' + ' | '.join(str(x) for x in s.values()) + ' |')
    for country in COUNTRIES.values():
        top = [r for r in qualified if r['Country'] == country][:10]
        text += ['', f'## {country}: {len(top)} qualified prospects', '']
        for r in top:
            text += [f"### {r['Business name']} — {r['City']} ({r['Lead Score']}, {r['Lead Grade']}, {r['Research Confidence']})", '',
                f"Website: {r['Website']}", f"Email: {r.get('Public business email') or 'Not verified'}; phone: {r.get('Public business phone') or 'Not verified'}", '',
                r['Description'], '', f"Approach: {r['Recommended Partnership']}. {r['Why It Fits']}",
                f"Concerns: {r.get('Potential Concerns', 'Supplier interest unverified')}",
                f"Evidence: {r['Product Evidence']}", f"Contact evidence: {r.get('Contact Evidence', '')}",
                f"Verified: {r['Last Verified']}; stable ID: {r['Lead ID']}", '']
    (output / 'research-report.md').write_text('\n'.join(text), encoding='utf-8')
    return summary
