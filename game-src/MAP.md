# Map of index.html

Edit the part, then run `python3 tools/gamekit.py build`.
Find code: `grep -n 'name' game-src/*`.

| part | lines in game file | KB | top-level names |
|---|---|---|---|
| 000-part.html | 1-238 | 24 |  |
| 001-phones-and-touch-screens-dialog-sits-i.css | 239-329 | 8 |  |
| 002-studio-mode-hide-every-panel-so-only-i.css | 330-763 | 27 |  |
| 003-part.html | 764-866 | 7 | $, THAI_READY, LANG, TH, TH_CAP, trS, trNode, trWalk, trObs, setLang |
| 004-renderer-pixel-art-post-processing.js | 867-907 | 2 | stage, renderer, DPR, scene, FOG, camera, CAM_DIR, camDist, camOff, rt |
| 005-lights.js | 908-950 | 5 | hemi, sun, sc, noiseTile, dither, grassC, sandC, pathC, stoneC, plasterC |
| 006-sprites.js | 951-1066 | 14 | BB, DIR4, mkFrame, spriteMesh, showFrame, setFrame, dir4Tick, blobTex, blob, hex |
| 007-world.js | 1067-1311 | 36 | LAND, DECK, JETTY, colliders, col, ISL, isS1, isPhi, isW1, isWinv1 |
| 008-more-of-rottnest.js | 1312-1372 | 10 | SIGN_TEX, makeSign, signPost, COTTAGES, winMat, SNORK, snorks, flowerMats, canopy, TREE_COLS |
| 009-garden-perth-hills-produce.js | 1373-1429 | 8 | CROPS, PLOTS, soilCv, soilDry, bedMat, plantCanvas, plantCache, dropIcon, refreshPlots, fenceMat |
| 010-businesses-for-sale.js | 1430-1495 | 9 | BIZ, BIZ_BY, bizMesh, forSale, applyBiz, riders, BIKE_LANE, spawnRider |
| 011-beach-hammock-with-orange-juice.js | 1496-1560 | 9 | BEACH, JMULT, DOCKS, ferries, jettyParts, ship, applyJetty, HB, SPX, ferry2 |
| 012-south-perth-shops.js | 1561-1614 | 7 | SHOP_POS, asphC, LANES, brickC, HOUSES, bungalow, houseSpec |
| 013-south-perth-mends-street-mill-point-ro.js | 1615-1694 | 13 | pavC, plazaC, SP_FADE, segHitsBox, zebra, TL, plane, carMesh, CAR_COLS, CARS |
| 014-mill-point-road-continues-east-angelo.js | 1695-1768 | 11 | ANGELO, MILL, SWAN_ROWS, swanCv, SWANS, cardSwan, tom, spTick, SP_SIGHTS, paddleKayak |
| 015-fremantle-second-half-of-story.js | 1769-1824 | 11 | winTex, bld, freoFerry, wheel, NP |
| 016-painter-for-32px-creature-sprites.js | 1825-1886 | 11 | painter, roo32, roos, swans, pelican, VP_SHOPS, vpTrain, NM, vpLights, BUS_STOPS |
| 017-quokka-village-inland-bush-where-quokk.js | 1887-1943 | 10 | VILLAGE, VILLAGE_ELDER, elder, REG, eftFlash, NM_AW, MUSEUM, digMeshes, bottle, whale |
| 018-caf-levels-and-styles.js | 1944-2016 | 12 | CAFE_STYLES, CAFE_LV, texWall, texAwn, texDeck, texCounter, STYLE_DECOR, UP, upRoofMat, upper |
| 019-rest-of-rottnest-north-coast-oliver-hi.js | 2017-2056 | 6 | WEST, COACH |
| 020-animated-waves-rolling-onto-beaches.js | 2057-2145 | 12 | makeWaveTex, waveTex, waveMat, waves, outlineCanvas, pineVariant, tussockCanvas, tussockMats, limeMat, outcrop |
| 021-night-life-fairy-lights-glowing-plankt.js | 2146-2219 | 9 | NIGHT, fairy, nightLights, PLK, plkGeo, plankton, BFLY, butterflies, nightTick, MOTES |
| 022-state.js | 2220-2268 | 6 | LEGACY_KEY, readSlot, fresh, S, save, loadSave, FERRY_ARR, transit, CLOSE, OPEN |
| 023-input.js | 2269-2308 | 5 | keys, STUDIO, studioTip, studioClock, ptrs, joyId, rotDrag, joyEnd, ptrUp, rotateCam |
| 024-interactions.js | 2309-2539 | 46 | current, buildTargets, findTarget, lastAct, camReady, toggleRide, updateActButton, doAction, startBrew, serve |
| 025-home-interiors-furniture-and-decoratin.js | 2540-2593 | 9 | FURN, FURN_SHOPS, ROOM_W, roomOf, homeBonus, openHome, furnDraw, renderHome, homeTap |
| 026-bag-inventory-and-outfits.js | 2594-2634 | 8 | WARD, WARD_SHOP, wardOwn, outfit, drawOutfit, kipFrames, applyOutfit, bagTab, openBag, renderBag |
| 027-in-game-guide.js | 2635-2753 | 18 | GUIDE_PLACES, GUIDE_NPCS, GUIDE_ACTS, GUIDE_SYS, GUIDE_TRAVEL, GUIDE_KEYS, ZN, guideTab, openGuide, renderGuide |
| 028-friendship-digging-and-collection-syst.js | 2754-2823 | 11 | SEASONS, seasonOf, dayLabel, FESTIVALS, festToday, calSeason, openCalendar, renderCalendar, FRIENDS, HEARTS |
| 029-fishing-minigame.js | 2824-2865 | 8 | FISH, FISH_SPOTS, fishG, startFishing, fishTick, drawFish, endFishing, FOSSILS, BUGS, dayRng |
| 030-restoration-board-community-bundles.js | 2866-2940 | 14 | BUNDLES, openBoard, renderBoard, makeMail, openMail, renderMail, DTASK, dtInc, dtVal, checkDaily |
| 031-radio-generative-background-music-weba.js | 2941-2980 | 6 | RADIO, RSTATIONS, radioSave, radioInit, out, mtof, piano, epiano, pluck, pad |
| 032-crystal-harbour-10-original-rpg-style.js | 2981-3054 | 15 | CR_SCALES, CR_ROOT, CRYSTAL, crSemi, crChord, crChordDegSet, crCompile, flute, oboe, bell |
| 033-island-lo-fi-30-original-lo-fi-tracks.js | 3055-3190 | 13 | LF_V, LF_P, LOFI, LF_R, lfRng, lfVoice, lfCompile, rim, lkick, lsnare |
| 034-lo-fi-beats-30-original-lo-fi-hip-hop.js | 3191-3294 | 10 | HP_P, HP_MINOR, HOP, hpCompile, lohat, hpPlay, crPlay, TSTN, tsOf, crStart |
| 035-studio-playlists-fixed-track-order-wit.js | 3295-3351 | 11 | PL_GAP, STUDIO_PL, PL_SEL, plTracks, plLen, plClock, plNext, studioPlaylist, PROG, SCALE |
| 036-dream-code-visit-a-friend-s-island-no.js | 3352-3424 | 15 | VISIT, DREAM_KEYS, QC_URL, QC_BLOCKED, qcFetch, QC_DEEP, qcHome, qcStat, qcNames, qcSnapOf |
| 037-while-visiting-an-online-island.js | 3425-3471 | 9 | vaShow, vbBook, vbGift, applyAllVisuals, enterVisit, leaveVisit, STAM_MAX, eat, stamTick, blackT |
| 038-quokka-cafe-branches-in-other-towns.js | 3472-3518 | 9 | BRANCHES, BR_UP, BR_COL, brMeshes, brState, buildBranch, applyBranches, branchIncomeTick, branchMidnight, brGuestsTick |
| 039-ride-or-teleport-transport-fares.js | 3519-3572 | 8 | FARE_RIDE, RIDE, pay, rideAlong, rideTick, COACH_ROUTE, COACH_IDX, coachMesh, trainRide, busRide |
| 040-perth-pass-freemium.js | 3573-3622 | 8 | BUILD, PASS_LINKS, passBuyUrl, goBuyPass, passCodeShape, passDevice, passRedeemServer, hasPass, GM_HASH, isGM |
| 041-special-caf-events-one-random-event-on.js | 3623-3699 | 13 | EVENTS, evToday, evCur, evRoll, evAnnounce, evOnServe, evClose, propSel, openProp, renderProp |
| 042-ambient-crowds-tourists-joggers-cyclis.js | 3700-3754 | 7 | WALK_ROUTES, WALK_N, walkers, walkerZone, updateWalkers, zoneOf, hiWalk, vpWalk, HIB, ZONE_DEF |
| 043-phase-1-look-on-mainland-same-tussocks.js | 3755-3802 | 7 | LAMPS, CAFE_NL, cafeNightTick, lampTick |
| 044-bus-between-south-perth-heirisson-isla.js | 3803-3869 | 17 | busTo, VP_BUSKER, rollKey, zoneTick, STARS, PCAT, at, PCS, isSpecial, pcThumbKey |
| 045-area-stories-chapters-per-area-that-le.js | 3870-3921 | 9 | _story, STORY_DEF, STORY_ORDER, storyChap, chapSteps, stepDone, stepTarget, storyOpen, storyT, storyTick |
| 046-side-quests-funny-and-heartfelt-errand.js | 3922-4054 | 28 | SIDEQ, sqPos, sqOpen, sqStep, sqReady, sqT, sqTick, sqQuests, sqTarget, snapPending |
| 047-caf-pantry.js | 4055-4170 | 20 | STOCK_INFO, RECIPE, addStock, canMake, useStock, missingFor, lowStock, GSTORE, strandRolled, spawnStranded |
| 048-customers.js | 4171-4215 | 8 | spawnCustomer, STAFF_COL, syncStaff, dadAtTill, staffIcon, updateStaff, removeCustomer, leave, stepWalker, updateCustomers |
| 049-movement.js | 4216-4274 | 9 | groundY, blocked, updatePlayer, updateWilds, C_MORN, T_MORN, tmpC, KEYS, NIGHT_FOG, applyTime |
| 050-overlays.js | 4275-4369 | 27 | showOverlay, hideOverlays, closeOverlays, openWish, hqTpSpot, hqTpTarget, hqTpButton, hqTeleport, jHas, RW_MULT |
| 051-maps-quest-guidance.js | 4370-4484 | 19 | mmC, MM, mmFW, MAP_LABELS, mapper, SPB, renderSPBase, spMini, renderMapBase, mmBase |
| 052-island-scale-spread-island-out-runs-on.js | 4485-4527 | 4 | islandWarp, islandData |
| 053-camera-render.js | 4528-4612 | 12 | camTarget, TITLE_SHOTS, MIR, updateMirror, updateCamera, ambient, last, errShown, reportErr, safeRun |
| 054-island-scale-wave-a-settlement-heritag.js | 4613-4743 | 25 | WAV1, islGround, islGroundBlock, islAddGround, ISC, iscGrid, islOldLake, islSiteOK, islFindSite, islClear |
| 055-island-scale-wave-b-north-coast-bays-s.js | 4744-4812 | 10 | WB, wbS, SPOT, spotOpen, spotPos, spotTick, spotXY, spotTap, spotClose, srand |
| 056-inside-oliver-hill-tunnels-with-a-torc.js | 4813-4941 | 22 | tunnelDraw, tunnelTour, wbTargets, WB_SPOT, wbSmin, wbCoastZ, wbGrad, wbCarve, wbClearWet, wbUmbrella |
| 057-island-scale-wave-c-salmon-bay-henriet.js | 4942-4987 | 8 | WC, wcS, binoWrap, seaView, WHALE_ART, lookoutWatch, SEAL_ART, sealView |
| 058-snorkelling-out-to-old-wreck-at-henrie.js | 4988-5059 | 13 | WRECK_ART, wreckDive, wcTargets, WC_SPOT |
| 059-island-scale-phase-6-six-island-lookou.js | 5060-5141 | 14 | LK, lkS, VISTA_ART, vistaDraw, LOOKOUTS, lkDone, lkView, lkTargets, lkTrail, lkPlatform |
| 060-phase-8-east-cape-and-south-point-get.js | 5142-5201 | 10 | P8, p8S, BIRD_ART, birdHide, p8Targets, P8_SPOT |
| 061-perth-cbd-city-across-river-from-south.js | 5202-5365 | 28 | CBDB, CBD, cbdWalk, cbdNPC, bellView, cbdTargets, ferryCross, cbdArrive, CBD_SPOT |
| 062-island-loop-bus-a-19-stop-loop-bus-lik.js | 5366-5419 | 7 | XPL_STOPS, XPL, islInland, coachRide, coachMinutes, flipIslandSigns, hot |
| 063-live-mode-live-1-kip-runs-caf-on-his-o.js | 5420-5494 | 8 | LIVEM |
| 064-look-lab-landscape-layers-of-each-real.js | 5495-5651 | 16 | LAB |
| 065-part.js | 5652-5654 | 0 |  |
