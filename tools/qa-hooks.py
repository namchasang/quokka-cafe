#!/usr/bin/env python3
"""Make __t.html: a copy of index.html with window.__t test hooks (state, update loop, story helpers).
   python3 tools/qa-hooks.py   -> writes __t.html (listed in .git/info/exclude, never commit it)
   Hooks are getters so they always return the live value of each game variable."""
import re
s = open('index.html', encoding='utf-8').read()
i = s.find("<script>if('serviceWorker'")
j = s.rfind("})();", 0, i)
names = ['S', 'player', 'customers', 'staff', 'running', 'overlay', 'phase', 'cafeLv', 'ITEMS', 'WISH', 'CAFE_LV', 'FERRY_ARR', 'JMULT',
         'update', 'startGame', 'syncStaff', 'newDay', 'endDay', 'sleep', 'buy', 'save', 'zoneOf', 'dlgOpen', 'dlgQ', 'ui', 'unlocked',
         'BRANCHES', 'BOATS', 'hideOverlays', 'spawnCustomer', 'canMake', 'SEATS', 'storyTick', 'questText', 'GUIDE']
body = ','.join(f"get {n}(){{try{{return {n};}}catch(e){{return undefined;}}}}" for n in names)
hook = "window.__t={" + body + ",ev:(c)=>eval(c)};\n"
open('__t.html', 'w', encoding='utf-8').write(s[:j] + hook + s[j:])
print('__t.html written, hooks:', len(names))
