# Quokka Cafe and Friends: notes for Claude

Cozy café sim RPG on Rottnest Island and Perth. Live (free soft opening): https://namchasang.github.io/quokka-cafe/
Owner: Paul (Paul Perth AI Lab). Replies to Paul in Thai unless he writes English.

## Save tokens: never read index.html whole
- The game is ONE file, `index.html` (~640 KB). Its source lives in `game-src/` as ~50 numbered parts.
- Open `game-src/MAP.md` first: it says which part holds which code and lists its top-level names.
- Find code with `grep -n 'name' game-src/*`, then Read only that part (or a line range of it).
- Edit the part, then run `python3 tools/gamekit.py build` (joins parts into index.html and bumps the sw.js cache).
- `build` is safe if someone edited index.html directly: it re-splits. If both changed, it stops; nothing is lost.

## Every change
1. `git pull` first: another Claude session also commits to this repo.
2. Edit `game-src/`, then `python3 tools/gamekit.py build`.
3. Test: `node tools/smoke.mjs index.html 40 shot.png`. The game takes ~30 s to start on software WebGL; check the screenshot.
   Deeper tests: copy index.html to `__t.html` (listed in .git/info/exclude), insert `window.__t={...}` before the final `})();`.
4. Commit with a plain-English message, then push. GitHub Pages deploys in about a minute.

## Standing rules (Paul's decisions)
- No third-party trade names anywhere: game, README, comments, posts (no Stardew, Animal Crossing, Nook, HD-2D, Octopath, Eftpos...).
- Protected areas (Paul, Nov 2026): once the outer-world Perth CBD (about 8 towers + Elizabeth Quay), the Swan River (Perth Water, real proportions) and South Perth are set, later map edits (rescaling, road rebuilds, terrain smoothing, thinning, new layers) must NOT change them: no moving, removing, resizing or re-generating anything there, in the outer world or in the town maps. Exclude them explicitly in any global pass. Changes there only when Paul asks for that area by name. The boxes are `OW_PROTECT` / `owProtected(x,z)` in the part with `const HG=` (outer world); any global pass must call `owProtected` and skip.
- Names to avoid (Paul, Oct 2026, before any App Store sale): no "Wadjemup", no Aboriginal history sites or memorials (the Quod, burial ground, Yagan Memorial), no Rottnest Island Authority name/logo/slogan, and no real island operators or businesses (the real bus is "Island Explorer", so ours is the "Island Loop bus"). Use plain place names (Rottnest Island, Thomson Bay, Parker Point...) and fictional names for everything else.
- Kip's story: just graduated from university, dreamed since childhood of owning a business, leaves his little home in Victoria Park for a café by the jetty on Rottnest. Ending: Mum and Dad move to the island.
- Music is original and generated in code (WebAudio). Crystal Harbour + Island Lo-fi stations; Studio mode (K) hides UI for recording; `node tools/studio-timestamps.js` prints YouTube timestamps.
- Island Codes use Supabase (tables `qc_*`, RPCs `qc_register`, `qc_sync`, `qc_visit`...). The anon key in the game is public by design. Never scrape or list other players' codes.
- Freemium plan: Fremantle and Victoria Park are paid unlocks (Perth Pass); Paul has a Game Master account.
- Planned next: Thai language (menus + main story) with a TH/EN switch. Needs a Thai-capable font.
- Paul wants playable links, never zip files. Visual changes: show him a preview before going live.
- Art style (Paul, 13 Nov 2026, live): Rottnest uses the 3D toon look: 3D leaf-card trees and bushes (part `188-tree3d-...`), 3D toon characters that follow their sprites (part `188-toon-...`; frame canvases carry `__toon`), clear sea over white sand, smooth buildings, tufts, rocks, birds and butterflies (parts `188-*-look-lab-toon.js`). One global `TOON_ON` (part 010) turns it on; `?notoon` shows the old pixel look for comparison. The pixel sprite pipeline (`treeVariants`/`canopy`/`canopyHD`, `plantHDApply`, `plant2Apply`, `charHD`) still makes the sprites the 3D models follow and is what other maps show. New plants: add the sprite as before; the toon layers pick it up. When listing assets, tag each one `sprite` or `3d`.
- Pixel look (Paul, Oct 2026, live): buildings, vehicles and props stay low-poly 3D shapes but every surface is a pixel skin at 32 px per metre from PXKIT (part with `var PXK=`; also in the shared library `lib/models/buildings/pxkit.js`). `pxbScene()` runs once at load: plain walls get kit façades in their own colour (windows every storey, cornices, quoins, moss), walls painted from photos keep their design redrawn as pixel art, roofs get tiles/slate/tin, props get pixel faces; one game palette (`PXPAL`), no tilt-shift blur, depth outline in the post shader, people/animals slightly brighter. Kip's café is rebuilt with the kit (`CAFE_PX`, follows the five styles). New buildings: build with PXK, not flat colours. Flag `PXB_LIVE`.
- Look Lab: open the game with `?lab` (part `051-look-lab-landscape-layers.js`). It sorts every scene object into landscape layers (ground, water, paths, buildings, plants, props, characters, lights, effects) by shape and colour, orbits each area, and shows real place names. New look work goes in as a lab layer first.
- 3D toon look: live on Rottnest since 13 Nov 2026 (see Art style). The outer world toon look (`OWTOON`, `?ow2&toon`) is still Look Lab. Recipe: skills `paul-perth-game-engine` and `toon-characters`.
- Rottnest ?toon is the approved map recipe (Paul, Nov 2026): parts `188-*-look-lab-toon.js` (no filter, clear sea over sand, white sand, tufts, 3D trees/rocks/people/cyclists/birds/butterflies, smooth buildings, only this map shows). Use the same layers for every other map; the steps are in skill `paul-perth-game-engine` (Map recipe).
- Rottnest sea (Paul, 13 Nov 2026, live): the real Water Sea Engine (part `188-sea-real-engine-...`, `SEA4_LIVE`): seabed and sloping beaches from its own distance-to-shore field, engine pre-pass before the game render, old water layers hidden only on Rottnest. The engine source of truth is `lib/engines/water-sea/water-sea.js` (copy also in paulperthailab `lib/env/water-sea.js`); re-embed it in the part after changes.
- Rottnest ground (Paul, 13 Nov 2026, live): one 3D surface with the seabed (part `188-ground3d-...`, `GROUND3D_LIVE`): smooth beaches, even lawn inland (painted paths and bike lanes removed for now, 3D ones to come), salt lakes kept from a one-time bake of the old ground; objects within 2 units of water moved inland; Kip's bike, seals, swans, dolphins, pelicans, dogs, surfers and the campfire are 3D (`188-more3d-...`). Four houses by the rail near The Basin are hidden and kept in `ISLAND_STORE` for the Island Builder; flat picture props hidden (`188-island-tidy-and-gfx.js`). Graphics Low/Medium/High in the menu and home settings (`GFX`, saved as `qc-gfx`; phones start on Medium).
- Engines on maps (Paul, 13 Nov 2026): when Paul asks for an engine on a map, use the real engine 100% like its lab (real seabed/geometry, real depth, the engine's own shaders). Never imitate it with paint or an overlay shader. Build what the map lacks so the engine can run; offer a quality setting for phones instead of a look-alike. Compare a screenshot with the lab before sending.
- Map Editor: open the game with `?edit` (part with `EDIT_ON`). Paul's edits come as `QCMAP1 [...]` text, or in the Game Builder app's db collection `mapedits` (field `edits` is that JSON, `status` new/doing/done). Build them into the game as real code through the Look Lab; keys look like `zone|GeometryType|x|z`.

## Map of the game (see game-src/MAP.md for exact parts)
renderer + pixel post-processing, lights, textures, 32px sprites, world (Rottnest, South Perth, Fremantle, Heirisson, Victoria Park, Quokka Village), café levels, characters, state, UI, input, interactions, guide, seasons/friends/fishing/digging/museum/mail/daily tasks, unlocks, radio + music, Island Codes, stamina, branches, transport, Perth Pass, events, crowds, zones, postcards, area stories, side quests, customers.

## Lessons and work queue (Paul Game Builder app)
- App: https://claude.ai/artifact/BMNwcV6Y2cfjgEeNg3uBzk (tabs: briefs, games, lessons, roadmap, Look Lab).
- Before starting: ArtifactData `list` collection `lessons` (out_dir to a scratch folder), read the ones for this game and `all`.
- Paul may queue work: collection `briefs` (status new/doing/done). Set `status` to doing, then done with a short `result`.
- Roadmap for this game: collection `roadmaps`, doc id `quokka` (phases t/s/d, s = แผน/ถัดไป/เสร็จ). Update it when a phase finishes.
- After the job: propose 1-3 new lessons to Paul; on his OK, add them to `lessons` ({text, game, topic, createdAt, src}).
