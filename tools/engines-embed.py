#!/usr/bin/env python3
"""Re-embed the Paul Perth Library engines (lib/engines/*) into the game parts game-src/188-engine-*.js.
Run after any engine change, then python3 tools/gamekit.py build."""
import os
P={'terrain':('Terrain Engine','terrain/terrain.js'),'foliage':('Foliage Engine','foliage/foliage.js'),'road':('Road Engine','road/road.js'),
 'building':('Building Kit','building/building.js'),'props':('Props Engine','props/props.js'),'vehicle':('Vehicle Engine','vehicle/vehicle.js'),
 'life':('Life Engine','life/life.js'),'waterlife':('Water Life','water-sea/waterlife.js'),'sky':('Sky & Weather Engine','sky/sky.js'),
 'islandmap':('Island Map loader','islandmap/islandmap.js')}
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
order=open(os.path.join(root,'game-src/ORDER.txt')).read().split('\n')
for k,(name,rel) in P.items():
  part='188-engine-%s.js'%k;fp=os.path.join(root,'game-src',part)
  head='// ---------- %s (Paul Perth Library, lib/engines/%s), embedded for the engine-built maps. Re-embed after engine changes (tools/engines-embed.py). ----------'%(name,rel)
  if os.path.exists(fp):
    h0=open(fp).readline().rstrip('\n')
    if h0.startswith('// ----------'):head=h0
  open(fp,'w').write(head+'\n'+open(os.path.join(root,'lib/engines',rel)).read())
  if part not in order:
    i=order.index('188-engine-islandmap.js');order.insert(i,part)
open(os.path.join(root,'game-src/ORDER.txt'),'w').write('\n'.join(order))
print('embedded',len(P))
