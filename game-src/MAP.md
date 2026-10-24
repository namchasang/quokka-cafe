# Map of index.html

Edit the part, then run `python3 tools/gamekit.py build`.
Find code: `grep -n 'name' game-src/*`.

| part | lines in game file | KB | top-level names |
|---|---|---|---|
| 000-part.html | 1-238 | 24 |  |
| 001-phones-and-touch-screens-dialog-sits-i.css | 239-329 | 8 |  |
| 002-studio-mode-hide-every-panel-so-only-i.css | 330-750 | 26 |  |
| 003-part.html | 751-831 | 3 | $, mulberry32, R, mk, clamp, lerp, QK_TOP, QK_LEGS, HU_HEAD, HU_HAT |
| 004-renderer-pixel-art-post-processing.js | 832-872 | 2 | stage, renderer, DPR, scene, FOG, camera, CAM_DIR, camDist, camOff, rt |
| 005-lights.js | 873-915 | 5 | hemi, sun, sc, noiseTile, dither, grassC, sandC, pathC, stoneC, plasterC |
| 006-sprites.js | 916-1031 | 14 | BB, DIR4, mkFrame, spriteMesh, showFrame, setFrame, dir4Tick, blobTex, blob, hex |
| 007-world.js | 1032-1170 | 15 | LAND, DECK, JETTY, colliders, col, GARDEN, LOTS, inGarden, TB, BAYS |
| 008-more-of-wadjemup.js | 1171-1231 | 10 | SIGN_TEX, makeSign, signPost, COTTAGES, winMat, SNORK, snorks, flowerMats, canopy, TREE_COLS |
| 009-garden-perth-hills-produce.js | 1232-1288 | 8 | CROPS, PLOTS, soilCv, soilDry, bedMat, plantCanvas, plantCache, dropIcon, refreshPlots, fenceMat |
| 010-businesses-for-sale.js | 1289-1353 | 9 | BIZ, BIZ_BY, bizMesh, forSale, applyBiz, riders, BIKE_LANE, spawnRider |
| 011-beach-hammock-with-orange-juice.js | 1354-1418 | 9 | BEACH, JMULT, DOCKS, ferries, jettyParts, ship, applyJetty, HB, SPX, ferry2 |
| 012-south-perth-shops.js | 1419-1472 | 7 | SHOP_POS, asphC, LANES, brickC, HOUSES, bungalow, houseSpec |
| 013-south-perth-mends-street-mill-point-ro.js | 1473-1552 | 13 | pavC, plazaC, SP_FADE, segHitsBox, zebra, TL, plane, carMesh, CAR_COLS, CARS |
| 014-mill-point-road-continues-east-angelo.js | 1553-1626 | 11 | ANGELO, MILL, SWAN_ROWS, swanCv, SWANS, cardSwan, tom, spTick, SP_SIGHTS, paddleKayak |
| 015-fremantle-second-half-of-story.js | 1627-1682 | 11 | winTex, bld, freoFerry, wheel, NP |
| 016-painter-for-32px-creature-sprites.js | 1683-1744 | 11 | painter, roo32, roos, swans, pelican, VP_SHOPS, vpTrain, NM, vpLights, BUS_STOPS |
| 017-quokka-village-inland-bush-where-quokk.js | 1745-1801 | 10 | VILLAGE, VILLAGE_ELDER, elder, REG, eftFlash, NM_AW, MUSEUM, digMeshes, bottle, whale |
| 018-caf-levels-and-styles.js | 1802-1874 | 12 | CAFE_STYLES, CAFE_LV, texWall, texAwn, texDeck, texCounter, STYLE_DECOR, UP, upRoofMat, upper |
| 019-rest-of-wadjemup-north-coast-oliver-hi.js | 1875-1928 | 8 | WEST, COACH, waveTex, waveMat, waves |
| 020-rottnest-details.js | 1929-2001 | 10 | outlineCanvas, pineVariant, tussockCanvas, tussockMats, limeMat, outcrop, bikeCanvas, sgC, sparkWaterC, sparkWater |
| 021-night-life-fairy-lights-glowing-plankt.js | 2002-2075 | 9 | NIGHT, fairy, nightLights, PLK, plkGeo, plankton, BFLY, butterflies, nightTick, MOTES |
| 022-state.js | 2076-2124 | 5 | LEGACY_KEY, readSlot, fresh, S, save, loadSave, FERRY_ARR, transit, CLOSE, OPEN |
| 023-input.js | 2125-2164 | 5 | keys, STUDIO, studioTip, studioClock, ptrs, joyId, rotDrag, joyEnd, ptrUp, rotateCam |
| 024-interactions.js | 2165-2395 | 46 | current, buildTargets, findTarget, lastAct, camReady, toggleRide, updateActButton, doAction, startBrew, serve |
| 025-home-interiors-furniture-and-decoratin.js | 2396-2449 | 9 | FURN, FURN_SHOPS, ROOM_W, roomOf, homeBonus, openHome, furnDraw, renderHome, homeTap |
| 026-bag-inventory-and-outfits.js | 2450-2490 | 8 | WARD, WARD_SHOP, wardOwn, outfit, drawOutfit, kipFrames, applyOutfit, bagTab, openBag, renderBag |
| 027-in-game-guide.js | 2491-2604 | 17 | GUIDE_PLACES, GUIDE_NPCS, GUIDE_ACTS, GUIDE_SYS, GUIDE_TRAVEL, GUIDE_KEYS, ZN, guideTab, openGuide, renderGuide |
| 028-friendship-digging-and-collection-syst.js | 2605-2674 | 11 | SEASONS, seasonOf, dayLabel, FESTIVALS, festToday, calSeason, openCalendar, renderCalendar, FRIENDS, HEARTS |
| 029-fishing-minigame.js | 2675-2716 | 8 | FISH, FISH_SPOTS, fishG, startFishing, fishTick, drawFish, endFishing, FOSSILS, BUGS, dayRng |
| 030-restoration-board-community-bundles.js | 2717-2791 | 14 | BUNDLES, openBoard, renderBoard, makeMail, openMail, renderMail, DTASK, dtInc, dtVal, checkDaily |
| 031-radio-generative-background-music-weba.js | 2792-2904 | 21 | RADIO, RSTATIONS, radioSave, radioInit, out, mtof, piano, epiano, pluck, pad |
| 032-island-lo-fi-30-original-lo-fi-tracks.js | 2905-3051 | 15 | LF_V, LF_P, LOFI, LF_R, lfRng, lfVoice, lfCompile, rim, lkick, lsnare |
| 033-studio-playlists-fixed-track-order-wit.js | 3052-3106 | 10 | PL_GAP, STUDIO_PL, PL_SEL, plTracks, plLen, plClock, plNext, studioPlaylist, PROG, SCALE |
| 034-dream-code-visit-a-friend-s-island-no.js | 3107-3179 | 15 | VISIT, DREAM_KEYS, QC_URL, QC_BLOCKED, qcFetch, QC_DEEP, qcHome, qcStat, qcNames, qcSnapOf |
| 035-while-visiting-an-online-island.js | 3180-3226 | 9 | vaShow, vbBook, vbGift, applyAllVisuals, enterVisit, leaveVisit, STAM_MAX, eat, stamTick, blackT |
| 036-quokka-cafe-branches-in-other-towns.js | 3227-3273 | 9 | BRANCHES, BR_UP, BR_COL, brMeshes, brState, buildBranch, applyBranches, branchIncomeTick, branchMidnight, brGuestsTick |
| 037-ride-or-teleport-transport-fares.js | 3274-3330 | 8 | FARE_RIDE, RIDE, pay, rideAlong, rideTick, COACH_ROUTE, COACH_IDX, coachMesh, coachRide, trainRide |
| 038-perth-pass-freemium.js | 3331-3376 | 7 | BUILD, PASS_LINKS, passBuyUrl, goBuyPass, PC_AB, pcSum, passCodeOk, hasPass, GM_HASH, isGM |
| 039-special-caf-events-one-random-event-on.js | 3377-3453 | 13 | EVENTS, evToday, evCur, evRoll, evAnnounce, evOnServe, evClose, propSel, openProp, renderProp |
| 040-ambient-crowds-tourists-joggers-cyclis.js | 3454-3507 | 7 | WALK_ROUTES, WALK_N, walkers, walkerZone, updateWalkers, zoneOf, hiWalk, vpWalk, HIB, ZONE_DEF |
| 041-phase-1-look-on-mainland-same-tussocks.js | 3508-3555 | 7 | LAMPS, CAFE_NL, cafeNightTick, lampTick |
| 042-bus-between-south-perth-heirisson-isla.js | 3556-3622 | 16 | busTo, VP_BUSKER, rollKey, zoneTick, STARS, PCAT, at, PCS, isSpecial, pcThumbKey |
| 043-area-stories-chapters-per-area-that-le.js | 3623-3674 | 9 | _story, STORY_DEF, STORY_ORDER, storyChap, chapSteps, stepDone, stepTarget, storyOpen, storyT, storyTick |
| 044-side-quests-funny-and-heartfelt-errand.js | 3675-3807 | 28 | SIDEQ, sqPos, sqOpen, sqStep, sqReady, sqT, sqTick, sqQuests, sqTarget, snapPending |
| 045-caf-pantry.js | 3808-3922 | 20 | STOCK_INFO, RECIPE, addStock, canMake, useStock, missingFor, lowStock, GSTORE, strandRolled, spawnStranded |
| 046-customers.js | 3923-3967 | 8 | spawnCustomer, STAFF_COL, syncStaff, dadAtTill, staffIcon, updateStaff, removeCustomer, leave, stepWalker, updateCustomers |
| 047-movement.js | 3968-4026 | 9 | groundY, blocked, updatePlayer, updateWilds, C_MORN, T_MORN, tmpC, KEYS, NIGHT_FOG, applyTime |
| 048-overlays.js | 4027-4121 | 26 | showOverlay, hideOverlays, closeOverlays, openWish, hqTpSpot, hqTpTarget, hqTpButton, hqTeleport, jHas, RW_MULT |
| 049-maps-quest-guidance.js | 4122-4204 | 13 | mmC, MM, MAP_LABELS, mapper, SPB, renderSPBase, spMini, renderMapBase, mmBase, drawMapDynamic |
| 050-camera-render.js | 4205-4298 | 13 | camTarget, TITLE_SHOTS, MIR, updateMirror, updateCamera, ambient, last, errShown, reportErr, safeRun |
| 051-live-mode.js | 4299-4373 | 8 | LIVEM |
| 051-look-lab-landscape-layers.js | 4374-4530 | 16 | LAB |
| 051-part.js | 4531-4533 | 0 |  |
