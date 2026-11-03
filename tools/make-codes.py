#!/usr/bin/env python3
"""Make Quokka Cafe codes for Payhip or for gifts.
   python3 tools/make-codes.py pack supporter 200      -> 200 Supporter Pack codes (QCS-...)
   python3 tools/make-codes.py pack island 200         -> 200 Island Style Pack codes
   python3 tools/make-codes.py pass magpie 50          -> 50 free Perth Pass codes for Magpie Madness buyers (QCP-...)
Writes two files in codes/ (git-ignored, keep them private):
   <name>.csv : the plain codes, one per line -> upload to Payhip (product -> license keys from a list) or email to buyers
   <name>.sql : only the hashes -> paste into Supabase SQL Editor and Run (needs supabase/qc_accounts_rank_shop.sql first)"""
import hashlib, os, secrets, sys, datetime
ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'   # no 0/O/1/I so codes are easy to type
kind, item, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
assert kind in ('pass', 'pack') and item.isalnum() and 0 < n <= 5000
pre = 'QCP' if kind == 'pass' else 'QCS'
codes = [pre + ''.join(secrets.choice(ABC) for _ in range(10)) for _ in range(n)]
pretty = lambda c: f'{c[:3]}-{c[3:7]}-{c[7:11]}-{c[11:]}'
os.makedirs('codes', exist_ok=True)
stamp = datetime.date.today().isoformat()
name = f'codes/{kind}-{item}-{stamp}-{secrets.token_hex(2)}'
open(name + '.csv', 'w').write('\n'.join(pretty(c) for c in codes) + '\n')
rows = ',\n'.join(f"('{hashlib.sha256(('qc-code|' + c).encode()).hexdigest()}','{kind}','{item}','{stamp}')" for c in codes)
open(name + '.sql', 'w').write(f'insert into public.qc_codes (hash, kind, item, note) values\n{rows}\non conflict do nothing;\n')
print(f'{n} codes -> {name}.csv (keep private) and {name}.sql (run in Supabase)')
