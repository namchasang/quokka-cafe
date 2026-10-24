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
| 011-more-of-rottnest.js | 1328-1377 | 7 | SIGN_TEX, makeSign, signPost, COTTAGES, winMat, SNORK, snorks, flowerMats, canopy, TREE_COLS |
| 012-hd-trees-and-bushes-look-lab-layer-lab.js | 1378-1429 | 7 | TREES_HD_LIVE, TREES_HD, canopyHD, TREE_PAL, trees, KEEP, treeOK |
| 013-garden-perth-hills-produce.js | 1430-1486 | 8 | CROPS, PLOTS, soilCv, soilDry, bedMat, plantCanvas, plantCache, dropIcon, refreshPlots, fenceMat |
| 014-businesses-for-sale.js | 1487-1552 | 9 | BIZ, BIZ_BY, bizMesh, forSale, applyBiz, riders, BIKE_LANE, spawnRider |
| 015-beach-hammock-with-orange-juice.js | 1553-1617 | 9 | BEACH, JMULT, DOCKS, ferries, jettyParts, ship, applyJetty, HB, SPX, ferry2 |
| 016-south-perth-shops.js | 1618-1671 | 7 | SHOP_POS, asphC, LANES, brickC, HOUSES, bungalow, houseSpec |
| 017-south-perth-mends-street-mill-point-ro.js | 1672-1751 | 13 | pavC, plazaC, SP_FADE, segHitsBox, zebra, TL, plane, carMesh, CAR_COLS, CARS |
| 018-mill-point-road-continues-east-angelo.js | 1752-1825 | 11 | ANGELO, MILL, SWAN_ROWS, swanCv, SWANS, cardSwan, tom, spTick, SP_SIGHTS, paddleKayak |
| 019-fremantle-second-half-of-story.js | 1826-1881 | 11 | winTex, bld, freoFerry, wheel, NP |
| 020-painter-for-32px-creature-sprites.js | 1882-1943 | 11 | painter, roo32, roos, swans, pelican, VP_SHOPS, vpTrain, NM, vpLights, BUS_STOPS |
| 021-quokka-village-inland-bush-where-quokk.js | 1944-2000 | 10 | VILLAGE, VILLAGE_ELDER, elder, REG, eftFlash, NM_AW, MUSEUM, digMeshes, bottle, whale |
| 022-caf-levels-and-styles.js | 2001-2073 | 12 | CAFE_STYLES, CAFE_LV, texWall, texAwn, texDeck, texCounter, STYLE_DECOR, UP, upRoofMat, upper |
| 023-rest-of-rottnest-north-coast-oliver-hi.js | 2074-2113 | 6 | WEST, COACH |
| 024-animated-waves-rolling-onto-beaches.js | 2114-2202 | 12 | makeWaveTex, waveTex, waveMat, waves, outlineCanvas, pineVariant, tussockCanvas, tussockMats, limeMat, outcrop |
| 025-night-life-fairy-lights-glowing-plankt.js | 2203-2276 | 9 | NIGHT, fairy, nightLights, PLK, plkGeo, plankton, BFLY, butterflies, nightTick, MOTES |
| 026-state.js | 2277-2325 | 6 | LEGACY_KEY, readSlot, fresh, S, save, loadSave, FERRY_ARR, transit, CLOSE, OPEN |
| 027-input.js | 2326-2365 | 5 | keys, STUDIO, studioTip, studioClock, ptrs, joyId, rotDrag, joyEnd, ptrUp, rotateCam |
| 028-interactions.js | 2366-2596 | 46 | current, buildTargets, findTarget, lastAct, camReady, toggleRide, updateActButton, doAction, startBrew, serve |
| 029-home-interiors-furniture-and-decoratin.js | 2597-2650 | 9 | FURN, FURN_SHOPS, ROOM_W, roomOf, homeBonus, openHome, furnDraw, renderHome, homeTap |
| 030-bag-inventory-and-outfits.js | 2651-2691 | 8 | WARD, WARD_SHOP, wardOwn, outfit, drawOutfit, kipFrames, applyOutfit, bagTab, openBag, renderBag |
| 031-in-game-guide.js | 2692-2810 | 18 | GUIDE_PLACES, GUIDE_NPCS, GUIDE_ACTS, GUIDE_SYS, GUIDE_TRAVEL, GUIDE_KEYS, ZN, guideTab, openGuide, renderGuide |
| 032-friendship-digging-and-collection-syst.js | 2811-2880 | 11 | SEASONS, seasonOf, dayLabel, FESTIVALS, festToday, calSeason, openCalendar, renderCalendar, FRIENDS, HEARTS |
| 033-fishing-minigame.js | 2881-2922 | 8 | FISH, FISH_SPOTS, fishG, startFishing, fishTick, drawFish, endFishing, FOSSILS, BUGS, dayRng |
| 034-restoration-board-community-bundles.js | 2923-2997 | 14 | BUNDLES, openBoard, renderBoard, makeMail, openMail, renderMail, DTASK, dtInc, dtVal, checkDaily |
| 035-radio-generative-background-music-weba.js | 2998-3037 | 6 | RADIO, RSTATIONS, radioSave, radioInit, out, mtof, piano, epiano, pluck, pad |
| 036-crystal-harbour-10-original-rpg-style.js | 3038-3111 | 15 | CR_SCALES, CR_ROOT, CRYSTAL, crSemi, crChord, crChordDegSet, crCompile, flute, oboe, bell |
| 037-island-lo-fi-30-original-lo-fi-tracks.js | 3112-3247 | 13 | LF_V, LF_P, LOFI, LF_R, lfRng, lfVoice, lfCompile, rim, lkick, lsnare |
| 038-lo-fi-beats-30-original-lo-fi-hip-hop.js | 3248-3351 | 10 | HP_P, HP_MINOR, HOP, hpCompile, lohat, hpPlay, crPlay, TSTN, tsOf, crStart |
| 039-studio-playlists-fixed-track-order-wit.js | 3352-3408 | 11 | PL_GAP, STUDIO_PL, PL_SEL, plTracks, plLen, plClock, plNext, studioPlaylist, PROG, SCALE |
| 040-dream-code-visit-a-friend-s-island-no.js | 3409-3481 | 15 | VISIT, DREAM_KEYS, QC_URL, QC_BLOCKED, qcFetch, QC_DEEP, qcHome, qcStat, qcNames, qcSnapOf |
| 041-while-visiting-an-online-island.js | 3482-3528 | 9 | vaShow, vbBook, vbGift, applyAllVisuals, enterVisit, leaveVisit, STAM_MAX, eat, stamTick, blackT |
| 042-quokka-cafe-branches-in-other-towns.js | 3529-3598 | 14 | BRANCHES, BR_UP, BR_COL, brMeshes, brState, buildBranch, buildKiosk, applyBranches, branchIncomeTick, branchMidnight |
| 043-ride-or-teleport-transport-fares.js | 3599-3652 | 8 | FARE_RIDE, RIDE, pay, rideAlong, rideTick, COACH_ROUTE, COACH_IDX, coachMesh, trainRide, busRide |
| 044-perth-pass-freemium.js | 3653-3702 | 8 | BUILD, PASS_LINKS, passBuyUrl, goBuyPass, passCodeShape, passDevice, passRedeemServer, hasPass, GM_HASH, isGM |
| 045-special-caf-events-one-random-event-on.js | 3703-3779 | 13 | EVENTS, evToday, evCur, evRoll, evAnnounce, evOnServe, evClose, propSel, openProp, renderProp |
| 046-ambient-crowds-tourists-joggers-cyclis.js | 3780-3834 | 7 | WALK_ROUTES, WALK_N, walkers, walkerZone, updateWalkers, zoneOf, hiWalk, vpWalk, HIB, ZONE_DEF |
| 047-phase-1-look-on-mainland-same-tussocks.js | 3835-3882 | 7 | LAMPS, CAFE_NL, cafeNightTick, lampTick |
| 048-bus-between-south-perth-heirisson-isla.js | 3883-3949 | 17 | busTo, VP_BUSKER, rollKey, zoneTick, STARS, PCAT, at, PCS, isSpecial, pcThumbKey |
| 049-area-stories-chapters-per-area-that-le.js | 3950-4001 | 9 | _story, STORY_DEF, STORY_ORDER, storyChap, chapSteps, stepDone, stepTarget, storyOpen, storyT, storyTick |
| 050-side-quests-funny-and-heartfelt-errand.js | 4002-4134 | 28 | SIDEQ, sqPos, sqOpen, sqStep, sqReady, sqT, sqTick, sqQuests, sqTarget, snapPending |
| 051-caf-pantry.js | 4135-4250 | 20 | STOCK_INFO, RECIPE, addStock, canMake, useStock, missingFor, lowStock, GSTORE, strandRolled, spawnStranded |
| 052-customers.js | 4251-4295 | 8 | spawnCustomer, STAFF_COL, syncStaff, dadAtTill, staffIcon, updateStaff, removeCustomer, leave, stepWalker, updateCustomers |
| 053-movement.js | 4296-4354 | 9 | groundY, blocked, updatePlayer, updateWilds, C_MORN, T_MORN, tmpC, KEYS, NIGHT_FOG, applyTime |
| 054-overlays.js | 4355-4449 | 27 | showOverlay, hideOverlays, closeOverlays, openWish, hqTpSpot, hqTpTarget, hqTpButton, hqTeleport, jHas, RW_MULT |
| 055-maps-quest-guidance.js | 4450-4570 | 20 | mmC, MM, mmFW, MAP_LABELS, mapper, SPB, renderSPBase, spMini, renderMapBase, mmBase |
| 056-island-scale-spread-island-out-runs-on.js | 4571-4613 | 4 | islandWarp, islandData |
| 057-camera-render.js | 4614-4698 | 12 | camTarget, TITLE_SHOTS, MIR, updateMirror, updateCamera, ambient, last, errShown, reportErr, safeRun |
| 058-island-scale-wave-a-settlement-heritag.js | 4699-4829 | 25 | WAV1, islGround, islGroundBlock, islAddGround, ISC, iscGrid, islOldLake, islSiteOK, islFindSite, islClear |
| 059-island-scale-wave-b-north-coast-bays-s.js | 4830-4898 | 10 | WB, wbS, SPOT, spotOpen, spotPos, spotTick, spotXY, spotTap, spotClose, srand |
| 060-inside-oliver-hill-tunnels-with-a-torc.js | 4899-5027 | 22 | tunnelDraw, tunnelTour, wbTargets, WB_SPOT, wbSmin, wbCoastZ, wbGrad, wbCarve, wbClearWet, wbUmbrella |
| 061-island-scale-wave-c-salmon-bay-henriet.js | 5028-5073 | 8 | WC, wcS, binoWrap, seaView, WHALE_ART, lookoutWatch, SEAL_ART, sealView |
| 062-snorkelling-out-to-old-wreck-at-henrie.js | 5074-5145 | 13 | WRECK_ART, wreckDive, wcTargets, WC_SPOT |
| 063-island-scale-phase-6-six-island-lookou.js | 5146-5227 | 14 | LK, lkS, VISTA_ART, vistaDraw, LOOKOUTS, lkDone, lkView, lkTargets, lkTrail, lkPlatform |
| 064-phase-8-east-cape-and-south-point-get.js | 5228-5287 | 10 | P8, p8S, BIRD_ART, birdHide, p8Targets, P8_SPOT |
| 065-perth-cbd-city-across-river-from-south.js | 5288-5417 | 24 | CBDB, CBD, cbdWalk, cbdNPC, bellView, cbdTargets, ferryCross, cbdArrive, CBD_SPOT |
| 066-city-detail-for-perth-cbd-a-look-lab-l.js | 5418-5824 | 49 | CITY_DETAIL_LIVE, CDET |
| 067-part.js | 5825-5886 | 6 |  |
| 068-island-loop-bus-a-19-stop-loop-bus-lik.js | 5887-5940 | 7 | XPL_STOPS, XPL, islInland, coachRide, coachMinutes, flipIslandSigns, hot |
| 069-live-mode-live-1-kip-runs-caf-on-his-o.js | 5941-6015 | 8 | LIVEM |
| 070-look-lab-landscape-layers-of-each-real.js | 6016-6197 | 21 | LAB |
| 071-part.js | 6198-6200 | 0 |  |
