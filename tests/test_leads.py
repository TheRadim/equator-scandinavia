import copy
import unittest
from scripts.validate_leads import preview, validate

def lead(**updates):
    row = {'Lead ID':'LEAD-one','Business name':'Example Bikes','Country':'Denmark','City':'Copenhagen','Website':'https://example.com'}
    row.update(updates)
    return row

class LeadTests(unittest.TestCase):
    def test_domain_alias_duplicate(self):
        with self.assertRaises(ValueError):
            validate([lead(), lead(**{'Lead ID':'LEAD-two','Business name':'Other name','Website':'http://www.example.com/path?tracking=1'})])

    def test_name_duplicate_without_site(self):
        with self.assertRaises(ValueError):
            validate([lead(), lead(**{'Lead ID':'LEAD-two','Business name':' EXAMPLE   BIKES ','Website':''})])

    def test_separate_city_branch(self):
        validate([lead(), lead(**{'Lead ID':'LEAD-two','City':'Aarhus'})])

    def test_manual_protection_and_idempotence(self):
        old = lead(**{'Qualification notes':'Keep','Contact status':'Interested'})
        original = copy.deepcopy(old)
        incoming = lead(**{'Qualification notes':'Overwrite','Contact status':'Contacted','Brands carried':'Example Brand'})
        changes = preview([old], [incoming])
        self.assertEqual(changes[0]['fields'], {'Brands carried':'Example Brand'})
        self.assertEqual(old, original)
        old.update(changes[0]['fields'])
        self.assertEqual(preview([old], [incoming]), [])

    def test_cross_batch_duplicate(self):
        with self.assertRaises(ValueError): preview([lead()], [lead(**{'Lead ID':'LEAD-new'})])

    def test_identity_change(self):
        with self.assertRaises(ValueError): preview([lead()], [lead(**{'City':'Odense'})])

    def test_invalid_values(self):
        for updates in [{'Last contact date':'2026-02-30'}, {'Equator fit (High/Medium/Low)':'Excellent'}, {'Business name':'=IMPORTXML("x")'}, {'Website':'file:///tmp/x'}]:
            with self.subTest(updates=updates), self.assertRaises(ValueError): validate([lead(**updates)])

    def test_insert_strips_manual_fields(self):
        changes = preview([], [lead(**{'Conversation notes':'Untrusted discovery note'})])
        self.assertNotIn('Conversation notes', changes[0]['fields'])

if __name__ == '__main__': unittest.main()
