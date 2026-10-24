# Map of index.html

Edit the part, then run `python3 tools/gamekit.py build`.
Find code: `grep -n 'name' game-src/*`.

| part | lines in game file | KB | top-level names |
|---|---|---|---|
| 000-part.html | 1-238 | 24 |  |
| 001-phones-and-touch-screens-dialog-sits-i.css | 239-329 | 8 |  |
| 002-studio-mode-hide-every-panel-so-only-i.css | 330-759 | 26 |  |
| 003-part.html | 760-840 | 3 | $, mulberry32, R, mk, clamp, lerp, QK_TOP, QK_LEGS, HU_HEAD, HU_HAT |
| 004-renderer-pixel-art-post-processing.js | 841-881 | 2 | stage, renderer, DPR, scene, FOG, camera, CAM_DIR, camDist, camOff, rt |
| 005-lights.js | 882-924 | 5 | hemi, sun, sc, noiseTile, dither, grassC, sandC, pathC, stoneC, plasterC |
| 006-sprites.js | 925-1040 | 14 | BB, DIR4, mkFrame, spriteMesh, showFrame, setFrame, dir4Tick, blobTex, blob, hex |
| 007-world.js | 1041-1285 | 36 | LAND, DECK, JETTY, colliders, col, ISL, isS1, isPhi, isW1, isWinv1 |
| 008-more-of-rottnest.js | 1286-1346 | 10 | SIGN_TEX, makeSign, signPost, COTTAGES, winMat, SNORK, snorks, flowerMats, canopy, TREE_COLS |
| 009-garden-perth-hills-produce.js | 1347-1403 | 8 | CROPS, PLOTS, soilCv, soilDry, bedMat, plantCanvas, plantCache, dropIcon, refreshPlots, fenceMat |
| 010-businesses-for-sale.js | 1404-1469 | 9 | BIZ, BIZ_BY, bizMesh, forSale, applyBiz, riders, BIKE_LANE, spawnRider |
| 011-beach-hammock-with-orange-juice.js | 1470-1534 | 9 | BEACH, JMULT, DOCKS, ferries, jettyParts, ship, applyJetty, HB, SPX, ferry2 |
| 012-south-perth-shops.js | 1535-1588 | 7 | SHOP_POS, asphC, LANES, brickC, HOUSES, bungalow, houseSpec |
| 013-south-perth-mends-street-mill-point-ro.js | 1589-1668 | 13 | pavC, plazaC, SP_FADE, segHitsBox, zebra, TL, plane, carMesh, CAR_COLS, CARS |
| 014-mill-point-road-continues-east-angelo.js | 1669-1742 | 11 | ANGELO, MILL, SWAN_ROWS, swanCv, SWANS, cardSwan, tom, spTick, SP_SIGHTS, paddleKayak |
| 015-fremantle-second-half-of-story.js | 1743-1798 | 11 | winTex, bld, freoFerry, wheel, NP |
| 016-painter-for-32px-creature-sprites.js | 1799-1860 | 11 | painter, roo32, roos, swans, pelican, VP_SHOPS, vpTrain, NM, vpLights, BUS_STOPS |
| 017-quokka-village-inland-bush-where-quokk.js | 1861-1917 | 10 | VILLAGE, VILLAGE_ELDER, elder, REG, eftFlash, NM_AW, MUSEUM, digMeshes, bottle, whale |
| 018-caf-levels-and-styles.js | 1918-1990 | 12 | CAFE_STYLES, CAFE_LV, texWall, texAwn, texDeck, texCounter, STYLE_DECOR, UP, upRoofMat, upper |
| 019-rest-of-rottnest-north-coast-oliver-hi.js | 1991-2030 | 6 | WEST, COACH |
| 020-animated-waves-rolling-onto-beaches.js | 2031-2119 | 12 | makeWaveTex, waveTex, waveMat, waves, outlineCanvas, pineVariant, tussockCanvas, tussockMats, limeMat, outcrop |
| 021-night-life-fairy-lights-glowing-plankt.js | 2120-2193 | 9 | NIGHT, fairy, nightLights, PLK, plkGeo, plankton, BFLY, butterflies, nightTick, MOTES |
| 022-state.js | 2194-2242 | 5 | LEGACY_KEY, readSlot, fresh, S, save, loadSave, FERRY_ARR, transit, CLOSE, OPEN |
| 023-input.js | 2243-2282 | 5 | keys, STUDIO, studioTip, studioClock, ptrs, joyId, rotDrag, joyEnd, ptrUp, rotateCam |
| 024-interactions.js | 2283-2513 | 46 | current, buildTargets, findTarget, lastAct, camReady, toggleRide, updateActButton, doAction, startBrew, serve |
| 025-home-interiors-furniture-and-decoratin.js | 2514-2567 | 9 | FURN, FURN_SHOPS, ROOM_W, roomOf, homeBonus, openHome, furnDraw, renderHome, homeTap |
| 026-bag-inventory-and-outfits.js | 2568-2608 | 8 | WARD, WARD_SHOP, wardOwn, outfit, drawOutfit, kipFrames, applyOutfit, bagTab, openBag, renderBag |
| 027-in-game-guide.js | 2609-2727 | 18 | GUIDE_PLACES, GUIDE_NPCS, GUIDE_ACTS, GUIDE_SYS, GUIDE_TRAVEL, GUIDE_KEYS, ZN, guideTab, openGuide, renderGuide |
| 028-friendship-digging-and-collection-syst.js | 2728-2797 | 11 | SEASONS, seasonOf, dayLabel, FESTIVALS, festToday, calSeason, openCalendar, renderCalendar, FRIENDS, HEARTS |
| 029-fishing-minigame.js | 2798-2839 | 8 | FISH, FISH_SPOTS, fishG, startFishing, fishTick, drawFish, endFishing, FOSSILS, BUGS, dayRng |
| 030-restoration-board-community-bundles.js | 2840-2914 | 14 | BUNDLES, openBoard, renderBoard, makeMail, openMail, renderMail, DTASK, dtInc, dtVal, checkDaily |
| 031-radio-generative-background-music-weba.js | 2915-3027 | 21 | RADIO, RSTATIONS, radioSave, radioInit, out, mtof, piano, epiano, pluck, pad |
| 032-island-lo-fi-30-original-lo-fi-tracks.js | 3028-3174 | 15 | LF_V, LF_P, LOFI, LF_R, lfRng, lfVoice, lfCompile, rim, lkick, lsnare |
| 033-studio-playlists-fixed-track-order-wit.js | 3175-3229 | 10 | PL_GAP, STUDIO_PL, PL_SEL, plTracks, plLen, plClock, plNext, studioPlaylist, PROG, SCALE |
| 034-dream-code-visit-a-friend-s-island-no.js | 3230-3302 | 15 | VISIT, DREAM_KEYS, QC_URL, QC_BLOCKED, qcFetch, QC_DEEP, qcHome, qcStat, qcNames, qcSnapOf |
| 035-while-visiting-an-online-island.js | 3303-3349 | 9 | vaShow, vbBook, vbGift, applyAllVisuals, enterVisit, leaveVisit, STAM_MAX, eat, stamTick, blackT |
| 036-quokka-cafe-branches-in-other-towns.js | 3350-3396 | 9 | BRANCHES, BR_UP, BR_COL, brMeshes, brState, buildBranch, applyBranches, branchIncomeTick, branchMidnight, brGuestsTick |
| 037-ride-or-teleport-transport-fares.js | 3397-3450 | 8 | FARE_RIDE, RIDE, pay, rideAlong, rideTick, COACH_ROUTE, COACH_IDX, coachMesh, trainRide, busRide |
| 038-perth-pass-freemium.js | 3451-3499 | 8 | BUILD, PASS_LINKS, passBuyUrl, goBuyPass, passCodeShape, passDevice, passRedeemServer, hasPass, GM_HASH, isGM |
| 039-special-caf-events-one-random-event-on.js | 3500-3576 | 13 | EVENTS, evToday, evCur, evRoll, evAnnounce, evOnServe, evClose, propSel, openProp, renderProp |
| 040-ambient-crowds-tourists-joggers-cyclis.js | 3577-3630 | 7 | WALK_ROUTES, WALK_N, walkers, walkerZone, updateWalkers, zoneOf, hiWalk, vpWalk, HIB, ZONE_DEF |
| 041-phase-1-look-on-mainland-same-tussocks.js | 3631-3678 | 7 | LAMPS, CAFE_NL, cafeNightTick, lampTick |
| 042-bus-between-south-perth-heirisson-isla.js | 3679-3745 | 16 | busTo, VP_BUSKER, rollKey, zoneTick, STARS, PCAT, at, PCS, isSpecial, pcThumbKey |
| 043-area-stories-chapters-per-area-that-le.js | 3746-3797 | 9 | _story, STORY_DEF, STORY_ORDER, storyChap, chapSteps, stepDone, stepTarget, storyOpen, storyT, storyTick |
| 044-side-quests-funny-and-heartfelt-errand.js | 3798-3930 | 28 | SIDEQ, sqPos, sqOpen, sqStep, sqReady, sqT, sqTick, sqQuests, sqTarget, snapPending |
| 045-caf-pantry.js | 3931-4045 | 20 | STOCK_INFO, RECIPE, addStock, canMake, useStock, missingFor, lowStock, GSTORE, strandRolled, spawnStranded |
| 046-customers.js | 4046-4090 | 8 | spawnCustomer, STAFF_COL, syncStaff, dadAtTill, staffIcon, updateStaff, removeCustomer, leave, stepWalker, updateCustomers |
| 047-movement.js | 4091-4149 | 9 | groundY, blocked, updatePlayer, updateWilds, C_MORN, T_MORN, tmpC, KEYS, NIGHT_FOG, applyTime |
| 048-overlays.js | 4150-4244 | 27 | showOverlay, hideOverlays, closeOverlays, openWish, hqTpSpot, hqTpTarget, hqTpButton, hqTeleport, jHas, RW_MULT |
| 049-maps-quest-guidance.js | 4245-4359 | 19 | mmC, MM, mmFW, MAP_LABELS, mapper, SPB, renderSPBase, spMini, renderMapBase, mmBase |
| 050-island-scale-spread-island-out-runs-on.js | 4360-4402 | 4 | islandWarp, islandData |
| 051-camera-render.js | 4403-4487 | 12 | camTarget, TITLE_SHOTS, MIR, updateMirror, updateCamera, ambient, last, errShown, reportErr, safeRun |
| 052-island-scale-wave-a-settlement-heritag.js | 4488-4618 | 25 | WAV1, islGround, islGroundBlock, islAddGround, ISC, iscGrid, islOldLake, islSiteOK, islFindSite, islClear |
| 053-island-scale-wave-b-north-coast-bays-s.js | 4619-4687 | 10 | WB, wbS, SPOT, spotOpen, spotPos, spotTick, spotXY, spotTap, spotClose, srand |
| 054-inside-oliver-hill-tunnels-with-a-torc.js | 4688-4816 | 22 | tunnelDraw, tunnelTour, wbTargets, WB_SPOT, wbSmin, wbCoastZ, wbGrad, wbCarve, wbClearWet, wbUmbrella |
| 055-island-scale-wave-c-salmon-bay-henriet.js | 4817-4862 | 8 | WC, wcS, binoWrap, seaView, WHALE_ART, lookoutWatch, SEAL_ART, sealView |
| 056-snorkelling-out-to-old-wreck-at-henrie.js | 4863-4934 | 13 | WRECK_ART, wreckDive, wcTargets, WC_SPOT |
| 057-island-scale-phase-6-six-island-lookou.js | 4935-5016 | 14 | LK, lkS, VISTA_ART, vistaDraw, LOOKOUTS, lkDone, lkView, lkTargets, lkTrail, lkPlatform |
| 058-phase-8-east-cape-and-south-point-get.js | 5017-5110 | 13 | P8, p8S, BIRD_ART, birdHide, p8Targets, P8_SPOT |
| 059-island-loop-bus-a-19-stop-loop-bus-lik.js | 5111-5164 | 7 | XPL_STOPS, XPL, islInland, coachRide, coachMinutes, flipIslandSigns, hot |
| 060-live-mode-live-1-kip-runs-caf-on-his-o.js | 5165-5239 | 8 | LIVEM |
| 061-look-lab-landscape-layers-of-each-real.js | 5240-5396 | 16 | LAB |
| 062-part.js | 5397-5399 | 0 |  |
