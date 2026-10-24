# Map of index.html

Edit the part, then run `python3 tools/gamekit.py build`.
Find code: `grep -n 'name' game-src/*`.

| part | lines in game file | KB | top-level names |
|---|---|---|---|
| 000-part.html | 1-53 | 3 |  |
| 001-map-opens-full-screen-with-back-in-top.css | 54-251 | 22 |  |
| 002-phones-and-touch-screens-dialog-sits-i.css | 252-342 | 8 |  |
| 003-studio-mode-hide-every-panel-so-only-i.css | 343-777 | 27 |  |
| 004-part.html | 778-804 | 3 | $, THAI_READY, LANG, TH, TH_CAP, trS, trNode, trWalk, trObs, setLang |
| 005-thload-check-your-mailbox-nbsp-nbsp-lo.js | 805-805 | 451 | embedded data, do not open |
| 006-trstart-document-queryselectorall-lang.js | 806-882 | 3 | mulberry32, R, mk, clamp, lerp, QK_TOP, QK_LEGS, HU_HEAD, HU_HAT, HU_REST |
| 007-renderer-pixel-art-post-processing.js | 883-923 | 2 | stage, renderer, DPR, scene, FOG, camera, CAM_DIR, camDist, camOff, rt |
| 008-lights.js | 924-966 | 5 | hemi, sun, sc, noiseTile, dither, grassC, sandC, pathC, stoneC, plasterC |
| 009-sprites.js | 967-1082 | 14 | BB, DIR4, mkFrame, spriteMesh, showFrame, setFrame, dir4Tick, blobTex, blob, hex |
| 010-world.js | 1083-1327 | 36 | LAND, DECK, JETTY, colliders, col, ISL, isS1, isPhi, isW1, isWinv1 |
| 011-more-of-rottnest.js | 1328-1388 | 10 | SIGN_TEX, makeSign, signPost, COTTAGES, winMat, SNORK, snorks, flowerMats, canopy, TREE_COLS |
| 012-garden-perth-hills-produce.js | 1389-1445 | 8 | CROPS, PLOTS, soilCv, soilDry, bedMat, plantCanvas, plantCache, dropIcon, refreshPlots, fenceMat |
| 013-businesses-for-sale.js | 1446-1511 | 9 | BIZ, BIZ_BY, bizMesh, forSale, applyBiz, riders, BIKE_LANE, spawnRider |
| 014-beach-hammock-with-orange-juice.js | 1512-1576 | 9 | BEACH, JMULT, DOCKS, ferries, jettyParts, ship, applyJetty, HB, SPX, ferry2 |
| 015-south-perth-shops.js | 1577-1630 | 7 | SHOP_POS, asphC, LANES, brickC, HOUSES, bungalow, houseSpec |
| 016-south-perth-mends-street-mill-point-ro.js | 1631-1710 | 13 | pavC, plazaC, SP_FADE, segHitsBox, zebra, TL, plane, carMesh, CAR_COLS, CARS |
| 017-mill-point-road-continues-east-angelo.js | 1711-1784 | 11 | ANGELO, MILL, SWAN_ROWS, swanCv, SWANS, cardSwan, tom, spTick, SP_SIGHTS, paddleKayak |
| 018-fremantle-second-half-of-story.js | 1785-1840 | 11 | winTex, bld, freoFerry, wheel, NP |
| 019-painter-for-32px-creature-sprites.js | 1841-1902 | 11 | painter, roo32, roos, swans, pelican, VP_SHOPS, vpTrain, NM, vpLights, BUS_STOPS |
| 020-quokka-village-inland-bush-where-quokk.js | 1903-1959 | 10 | VILLAGE, VILLAGE_ELDER, elder, REG, eftFlash, NM_AW, MUSEUM, digMeshes, bottle, whale |
| 021-caf-levels-and-styles.js | 1960-2032 | 12 | CAFE_STYLES, CAFE_LV, texWall, texAwn, texDeck, texCounter, STYLE_DECOR, UP, upRoofMat, upper |
| 022-rest-of-rottnest-north-coast-oliver-hi.js | 2033-2072 | 6 | WEST, COACH |
| 023-animated-waves-rolling-onto-beaches.js | 2073-2161 | 12 | makeWaveTex, waveTex, waveMat, waves, outlineCanvas, pineVariant, tussockCanvas, tussockMats, limeMat, outcrop |
| 024-night-life-fairy-lights-glowing-plankt.js | 2162-2235 | 9 | NIGHT, fairy, nightLights, PLK, plkGeo, plankton, BFLY, butterflies, nightTick, MOTES |
| 025-state.js | 2236-2284 | 6 | LEGACY_KEY, readSlot, fresh, S, save, loadSave, FERRY_ARR, transit, CLOSE, OPEN |
| 026-input.js | 2285-2324 | 5 | keys, STUDIO, studioTip, studioClock, ptrs, joyId, rotDrag, joyEnd, ptrUp, rotateCam |
| 027-interactions.js | 2325-2555 | 46 | current, buildTargets, findTarget, lastAct, camReady, toggleRide, updateActButton, doAction, startBrew, serve |
| 028-home-interiors-furniture-and-decoratin.js | 2556-2609 | 9 | FURN, FURN_SHOPS, ROOM_W, roomOf, homeBonus, openHome, furnDraw, renderHome, homeTap |
| 029-bag-inventory-and-outfits.js | 2610-2650 | 8 | WARD, WARD_SHOP, wardOwn, outfit, drawOutfit, kipFrames, applyOutfit, bagTab, openBag, renderBag |
| 030-in-game-guide.js | 2651-2769 | 18 | GUIDE_PLACES, GUIDE_NPCS, GUIDE_ACTS, GUIDE_SYS, GUIDE_TRAVEL, GUIDE_KEYS, ZN, guideTab, openGuide, renderGuide |
| 031-friendship-digging-and-collection-syst.js | 2770-2839 | 11 | SEASONS, seasonOf, dayLabel, FESTIVALS, festToday, calSeason, openCalendar, renderCalendar, FRIENDS, HEARTS |
| 032-fishing-minigame.js | 2840-2881 | 8 | FISH, FISH_SPOTS, fishG, startFishing, fishTick, drawFish, endFishing, FOSSILS, BUGS, dayRng |
| 033-restoration-board-community-bundles.js | 2882-2956 | 14 | BUNDLES, openBoard, renderBoard, makeMail, openMail, renderMail, DTASK, dtInc, dtVal, checkDaily |
| 034-radio-generative-background-music-weba.js | 2957-2996 | 6 | RADIO, RSTATIONS, radioSave, radioInit, out, mtof, piano, epiano, pluck, pad |
| 035-crystal-harbour-10-original-rpg-style.js | 2997-3070 | 15 | CR_SCALES, CR_ROOT, CRYSTAL, crSemi, crChord, crChordDegSet, crCompile, flute, oboe, bell |
| 036-island-lo-fi-30-original-lo-fi-tracks.js | 3071-3206 | 13 | LF_V, LF_P, LOFI, LF_R, lfRng, lfVoice, lfCompile, rim, lkick, lsnare |
| 037-lo-fi-beats-30-original-lo-fi-hip-hop.js | 3207-3310 | 10 | HP_P, HP_MINOR, HOP, hpCompile, lohat, hpPlay, crPlay, TSTN, tsOf, crStart |
| 038-studio-playlists-fixed-track-order-wit.js | 3311-3367 | 11 | PL_GAP, STUDIO_PL, PL_SEL, plTracks, plLen, plClock, plNext, studioPlaylist, PROG, SCALE |
| 039-dream-code-visit-a-friend-s-island-no.js | 3368-3440 | 15 | VISIT, DREAM_KEYS, QC_URL, QC_BLOCKED, qcFetch, QC_DEEP, qcHome, qcStat, qcNames, qcSnapOf |
| 040-while-visiting-an-online-island.js | 3441-3487 | 9 | vaShow, vbBook, vbGift, applyAllVisuals, enterVisit, leaveVisit, STAM_MAX, eat, stamTick, blackT |
| 041-quokka-cafe-branches-in-other-towns.js | 3488-3557 | 14 | BRANCHES, BR_UP, BR_COL, brMeshes, brState, buildBranch, buildKiosk, applyBranches, branchIncomeTick, branchMidnight |
| 042-ride-or-teleport-transport-fares.js | 3558-3611 | 8 | FARE_RIDE, RIDE, pay, rideAlong, rideTick, COACH_ROUTE, COACH_IDX, coachMesh, trainRide, busRide |
| 043-perth-pass-freemium.js | 3612-3661 | 8 | BUILD, PASS_LINKS, passBuyUrl, goBuyPass, passCodeShape, passDevice, passRedeemServer, hasPass, GM_HASH, isGM |
| 044-special-caf-events-one-random-event-on.js | 3662-3738 | 13 | EVENTS, evToday, evCur, evRoll, evAnnounce, evOnServe, evClose, propSel, openProp, renderProp |
| 045-ambient-crowds-tourists-joggers-cyclis.js | 3739-3793 | 7 | WALK_ROUTES, WALK_N, walkers, walkerZone, updateWalkers, zoneOf, hiWalk, vpWalk, HIB, ZONE_DEF |
| 046-phase-1-look-on-mainland-same-tussocks.js | 3794-3841 | 7 | LAMPS, CAFE_NL, cafeNightTick, lampTick |
| 047-bus-between-south-perth-heirisson-isla.js | 3842-3908 | 17 | busTo, VP_BUSKER, rollKey, zoneTick, STARS, PCAT, at, PCS, isSpecial, pcThumbKey |
| 048-area-stories-chapters-per-area-that-le.js | 3909-3960 | 9 | _story, STORY_DEF, STORY_ORDER, storyChap, chapSteps, stepDone, stepTarget, storyOpen, storyT, storyTick |
| 049-side-quests-funny-and-heartfelt-errand.js | 3961-4093 | 28 | SIDEQ, sqPos, sqOpen, sqStep, sqReady, sqT, sqTick, sqQuests, sqTarget, snapPending |
| 050-caf-pantry.js | 4094-4209 | 20 | STOCK_INFO, RECIPE, addStock, canMake, useStock, missingFor, lowStock, GSTORE, strandRolled, spawnStranded |
| 051-customers.js | 4210-4254 | 8 | spawnCustomer, STAFF_COL, syncStaff, dadAtTill, staffIcon, updateStaff, removeCustomer, leave, stepWalker, updateCustomers |
| 052-movement.js | 4255-4313 | 9 | groundY, blocked, updatePlayer, updateWilds, C_MORN, T_MORN, tmpC, KEYS, NIGHT_FOG, applyTime |
| 053-overlays.js | 4314-4408 | 27 | showOverlay, hideOverlays, closeOverlays, openWish, hqTpSpot, hqTpTarget, hqTpButton, hqTeleport, jHas, RW_MULT |
| 054-maps-quest-guidance.js | 4409-4529 | 20 | mmC, MM, mmFW, MAP_LABELS, mapper, SPB, renderSPBase, spMini, renderMapBase, mmBase |
| 055-island-scale-spread-island-out-runs-on.js | 4530-4572 | 4 | islandWarp, islandData |
| 056-camera-render.js | 4573-4657 | 12 | camTarget, TITLE_SHOTS, MIR, updateMirror, updateCamera, ambient, last, errShown, reportErr, safeRun |
| 057-island-scale-wave-a-settlement-heritag.js | 4658-4788 | 25 | WAV1, islGround, islGroundBlock, islAddGround, ISC, iscGrid, islOldLake, islSiteOK, islFindSite, islClear |
| 058-island-scale-wave-b-north-coast-bays-s.js | 4789-4857 | 10 | WB, wbS, SPOT, spotOpen, spotPos, spotTick, spotXY, spotTap, spotClose, srand |
| 059-inside-oliver-hill-tunnels-with-a-torc.js | 4858-4986 | 22 | tunnelDraw, tunnelTour, wbTargets, WB_SPOT, wbSmin, wbCoastZ, wbGrad, wbCarve, wbClearWet, wbUmbrella |
| 060-island-scale-wave-c-salmon-bay-henriet.js | 4987-5032 | 8 | WC, wcS, binoWrap, seaView, WHALE_ART, lookoutWatch, SEAL_ART, sealView |
| 061-snorkelling-out-to-old-wreck-at-henrie.js | 5033-5104 | 13 | WRECK_ART, wreckDive, wcTargets, WC_SPOT |
| 062-island-scale-phase-6-six-island-lookou.js | 5105-5186 | 14 | LK, lkS, VISTA_ART, vistaDraw, LOOKOUTS, lkDone, lkView, lkTargets, lkTrail, lkPlatform |
| 063-phase-8-east-cape-and-south-point-get.js | 5187-5246 | 10 | P8, p8S, BIRD_ART, birdHide, p8Targets, P8_SPOT |
| 064-perth-cbd-city-across-river-from-south.js | 5247-5376 | 24 | CBDB, CBD, cbdWalk, cbdNPC, bellView, cbdTargets, ferryCross, cbdArrive, CBD_SPOT |
| 065-city-detail-for-perth-cbd-a-look-lab-l.js | 5377-5771 | 48 | CITY_DETAIL_LIVE, CDET |
| 066-part.js | 5772-5833 | 6 |  |
| 067-island-loop-bus-a-19-stop-loop-bus-lik.js | 5834-5887 | 7 | XPL_STOPS, XPL, islInland, coachRide, coachMinutes, flipIslandSigns, hot |
| 068-live-mode-live-1-kip-runs-caf-on-his-o.js | 5888-5962 | 8 | LIVEM |
| 069-look-lab-landscape-layers-of-each-real.js | 5963-6142 | 21 | LAB |
| 070-part.js | 6143-6145 | 0 |  |
