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
- Names to avoid (Paul, Oct 2026, before any App Store sale): no "Wadjemup", no Aboriginal history sites or memorials (the Quod, burial ground, Yagan Memorial), no Rottnest Island Authority name/logo/slogan, and no real island operators or businesses (the real bus is "Island Explorer", so ours is the "Island Loop bus"). Use plain place names (Rottnest Island, Thomson Bay, Parker Point...) and fictional names for everything else.
- Kip's story: just graduated from university, dreamed since childhood of owning a business, leaves his little home in Victoria Park for a café by the jetty on Rottnest. Ending: Mum and Dad move to the island.
- Music is original and generated in code (WebAudio). Crystal Harbour + Island Lo-fi stations; Studio mode (K) hides UI for recording; `node tools/studio-timestamps.js` prints YouTube timestamps.
- Island Codes use Supabase (tables `qc_*`, RPCs `qc_register`, `qc_sync`, `qc_visit`...). The anon key in the game is public by design. Never scrape or list other players' codes.
- Freemium plan: Fremantle and Victoria Park are paid unlocks (Perth Pass); Paul has a Game Master account.
- Planned next: Thai language (menus + main story) with a TH/EN switch. Needs a Thai-capable font.
- Paul wants playable links, never zip files. Visual changes: show him a preview before going live.
- Art style (Paul, Oct 2026): trees, bushes, flowers, palms, people and animals are pixel-art sprites that face the camera (32px-style canvases, `treeVariants`/`canopy`/`canopyHD`). Low-poly 3D is only for buildings, vehicles, street furniture and props. All plants use ONE look. Draw new plants with `canopy` + `TREE_COLS` at the original pixel size; at load `plantHDApply()` turns every plant sprite in `BB` into the HD look (2x pixels, 7 shades, sunlit rim, sky gaps, bark with branches, wind sway), so new plants get it automatically. Never mix in a low-poly 3D tree or a hand-made sprite at another resolution. When listing assets, tag each one `sprite` or `3d`.
- Look Lab: open the game with `?lab` (part `051-look-lab-landscape-layers.js`). It sorts every scene object into landscape layers (ground, water, paths, buildings, plants, props, characters, lights, effects) by shape and colour, orbits each area, and shows real place names. New look work goes in as a lab layer first.

## Map of the game (see game-src/MAP.md for exact parts)
renderer + pixel post-processing, lights, textures, 32px sprites, world (Rottnest, South Perth, Fremantle, Heirisson, Victoria Park, Quokka Village), café levels, characters, state, UI, input, interactions, guide, seasons/friends/fishing/digging/museum/mail/daily tasks, unlocks, radio + music, Island Codes, stamina, branches, transport, Perth Pass, events, crowds, zones, postcards, area stories, side quests, customers.

## Lessons and work queue (Paul Game Builder app)
- App: https://claude.ai/artifact/BMNwcV6Y2cfjgEeNg3uBzk (tabs: briefs, games, lessons, roadmap, Look Lab).
- Before starting: ArtifactData `list` collection `lessons` (out_dir to a scratch folder), read the ones for this game and `all`.
- Paul may queue work: collection `briefs` (status new/doing/done). Set `status` to doing, then done with a short `result`.
- Roadmap for this game: collection `roadmaps`, doc id `quokka` (phases t/s/d, s = แผน/ถัดไป/เสร็จ). Update it when a phase finishes.
- After the job: propose 1-3 new lessons to Paul; on his OK, add them to `lessons` ({text, game, topic, createdAt, src}).
