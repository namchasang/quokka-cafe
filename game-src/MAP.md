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
| 007-world.js | 1041-1281 | 36 | LAND, DECK, JETTY, colliders, col, ISL, isS1, isPhi, isW1, isWinv1 |
| 008-more-of-wadjemup.js | 1282-1342 | 10 | SIGN_TEX, makeSign, signPost, COTTAGES, winMat, SNORK, snorks, flowerMats, canopy, TREE_COLS |
| 009-garden-perth-hills-produce.js | 1343-1399 | 8 | CROPS, PLOTS, soilCv, soilDry, bedMat, plantCanvas, plantCache, dropIcon, refreshPlots, fenceMat |
| 010-businesses-for-sale.js | 1400-1465 | 9 | BIZ, BIZ_BY, bizMesh, forSale, applyBiz, riders, BIKE_LANE, spawnRider |
| 011-beach-hammock-with-orange-juice.js | 1466-1530 | 9 | BEACH, JMULT, DOCKS, ferries, jettyParts, ship, applyJetty, HB, SPX, ferry2 |
| 012-south-perth-shops.js | 1531-1584 | 7 | SHOP_POS, asphC, LANES, brickC, HOUSES, bungalow, houseSpec |
| 013-south-perth-mends-street-mill-point-ro.js | 1585-1664 | 13 | pavC, plazaC, SP_FADE, segHitsBox, zebra, TL, plane, carMesh, CAR_COLS, CARS |
| 014-mill-point-road-continues-east-angelo.js | 1665-1738 | 11 | ANGELO, MILL, SWAN_ROWS, swanCv, SWANS, cardSwan, tom, spTick, SP_SIGHTS, paddleKayak |
| 015-fremantle-second-half-of-story.js | 1739-1794 | 11 | winTex, bld, freoFerry, wheel, NP |
| 016-painter-for-32px-creature-sprites.js | 1795-1856 | 11 | painter, roo32, roos, swans, pelican, VP_SHOPS, vpTrain, NM, vpLights, BUS_STOPS |
| 017-quokka-village-inland-bush-where-quokk.js | 1857-1913 | 10 | VILLAGE, VILLAGE_ELDER, elder, REG, eftFlash, NM_AW, MUSEUM, digMeshes, bottle, whale |
| 018-caf-levels-and-styles.js | 1914-1986 | 12 | CAFE_STYLES, CAFE_LV, texWall, texAwn, texDeck, texCounter, STYLE_DECOR, UP, upRoofMat, upper |
| 019-rest-of-wadjemup-north-coast-oliver-hi.js | 1987-2026 | 6 | WEST, COACH |
| 020-animated-waves-rolling-onto-beaches.js | 2027-2115 | 12 | makeWaveTex, waveTex, waveMat, waves, outlineCanvas, pineVariant, tussockCanvas, tussockMats, limeMat, outcrop |
| 021-night-life-fairy-lights-glowing-plankt.js | 2116-2189 | 9 | NIGHT, fairy, nightLights, PLK, plkGeo, plankton, BFLY, butterflies, nightTick, MOTES |
| 022-state.js | 2190-2238 | 5 | LEGACY_KEY, readSlot, fresh, S, save, loadSave, FERRY_ARR, transit, CLOSE, OPEN |
| 023-input.js | 2239-2278 | 5 | keys, STUDIO, studioTip, studioClock, ptrs, joyId, rotDrag, joyEnd, ptrUp, rotateCam |
| 024-interactions.js | 2279-2509 | 46 | current, buildTargets, findTarget, lastAct, camReady, toggleRide, updateActButton, doAction, startBrew, serve |
| 025-home-interiors-furniture-and-decoratin.js | 2510-2563 | 9 | FURN, FURN_SHOPS, ROOM_W, roomOf, homeBonus, openHome, furnDraw, renderHome, homeTap |
| 026-bag-inventory-and-outfits.js | 2564-2604 | 8 | WARD, WARD_SHOP, wardOwn, outfit, drawOutfit, kipFrames, applyOutfit, bagTab, openBag, renderBag |
| 027-in-game-guide.js | 2605-2723 | 18 | GUIDE_PLACES, GUIDE_NPCS, GUIDE_ACTS, GUIDE_SYS, GUIDE_TRAVEL, GUIDE_KEYS, ZN, guideTab, openGuide, renderGuide |
| 028-friendship-digging-and-collection-syst.js | 2724-2793 | 11 | SEASONS, seasonOf, dayLabel, FESTIVALS, festToday, calSeason, openCalendar, renderCalendar, FRIENDS, HEARTS |
| 029-fishing-minigame.js | 2794-2835 | 8 | FISH, FISH_SPOTS, fishG, startFishing, fishTick, drawFish, endFishing, FOSSILS, BUGS, dayRng |
| 030-restoration-board-community-bundles.js | 2836-2910 | 14 | BUNDLES, openBoard, renderBoard, makeMail, openMail, renderMail, DTASK, dtInc, dtVal, checkDaily |
| 031-radio-generative-background-music-weba.js | 2911-3023 | 21 | RADIO, RSTATIONS, radioSave, radioInit, out, mtof, piano, epiano, pluck, pad |
| 032-island-lo-fi-30-original-lo-fi-tracks.js | 3024-3170 | 15 | LF_V, LF_P, LOFI, LF_R, lfRng, lfVoice, lfCompile, rim, lkick, lsnare |
| 033-studio-playlists-fixed-track-order-wit.js | 3171-3225 | 10 | PL_GAP, STUDIO_PL, PL_SEL, plTracks, plLen, plClock, plNext, studioPlaylist, PROG, SCALE |
| 034-dream-code-visit-a-friend-s-island-no.js | 3226-3298 | 15 | VISIT, DREAM_KEYS, QC_URL, QC_BLOCKED, qcFetch, QC_DEEP, qcHome, qcStat, qcNames, qcSnapOf |
| 035-while-visiting-an-online-island.js | 3299-3345 | 9 | vaShow, vbBook, vbGift, applyAllVisuals, enterVisit, leaveVisit, STAM_MAX, eat, stamTick, blackT |
| 036-quokka-cafe-branches-in-other-towns.js | 3346-3392 | 9 | BRANCHES, BR_UP, BR_COL, brMeshes, brState, buildBranch, applyBranches, branchIncomeTick, branchMidnight, brGuestsTick |
| 037-ride-or-teleport-transport-fares.js | 3393-3446 | 8 | FARE_RIDE, RIDE, pay, rideAlong, rideTick, COACH_ROUTE, COACH_IDX, coachMesh, trainRide, busRide |
| 038-perth-pass-freemium.js | 3447-3495 | 8 | BUILD, PASS_LINKS, passBuyUrl, goBuyPass, passCodeShape, passDevice, passRedeemServer, hasPass, GM_HASH, isGM |
| 039-special-caf-events-one-random-event-on.js | 3496-3572 | 13 | EVENTS, evToday, evCur, evRoll, evAnnounce, evOnServe, evClose, propSel, openProp, renderProp |
| 040-ambient-crowds-tourists-joggers-cyclis.js | 3573-3626 | 7 | WALK_ROUTES, WALK_N, walkers, walkerZone, updateWalkers, zoneOf, hiWalk, vpWalk, HIB, ZONE_DEF |
| 041-phase-1-look-on-mainland-same-tussocks.js | 3627-3674 | 7 | LAMPS, CAFE_NL, cafeNightTick, lampTick |
| 042-bus-between-south-perth-heirisson-isla.js | 3675-3741 | 16 | busTo, VP_BUSKER, rollKey, zoneTick, STARS, PCAT, at, PCS, isSpecial, pcThumbKey |
| 043-area-stories-chapters-per-area-that-le.js | 3742-3793 | 9 | _story, STORY_DEF, STORY_ORDER, storyChap, chapSteps, stepDone, stepTarget, storyOpen, storyT, storyTick |
| 044-side-quests-funny-and-heartfelt-errand.js | 3794-3926 | 28 | SIDEQ, sqPos, sqOpen, sqStep, sqReady, sqT, sqTick, sqQuests, sqTarget, snapPending |
| 045-caf-pantry.js | 3927-4041 | 20 | STOCK_INFO, RECIPE, addStock, canMake, useStock, missingFor, lowStock, GSTORE, strandRolled, spawnStranded |
| 046-customers.js | 4042-4086 | 8 | spawnCustomer, STAFF_COL, syncStaff, dadAtTill, staffIcon, updateStaff, removeCustomer, leave, stepWalker, updateCustomers |
| 047-movement.js | 4087-4145 | 9 | groundY, blocked, updatePlayer, updateWilds, C_MORN, T_MORN, tmpC, KEYS, NIGHT_FOG, applyTime |
| 048-overlays.js | 4146-4240 | 27 | showOverlay, hideOverlays, closeOverlays, openWish, hqTpSpot, hqTpTarget, hqTpButton, hqTeleport, jHas, RW_MULT |
| 049-maps-quest-guidance.js | 4241-4354 | 19 | mmC, MM, mmFW, MAP_LABELS, mapper, SPB, renderSPBase, spMini, renderMapBase, mmBase |
| 050-island-scale-spread-island-out-runs-on.js | 4355-4394 | 4 | islandWarp, islandData |
| 051-camera-render.js | 4395-4479 | 12 | camTarget, TITLE_SHOTS, MIR, updateMirror, updateCamera, ambient, last, errShown, reportErr, safeRun |
| 052-island-scale-wave-a-settlement-heritag.js | 4480-4606 | 24 | WAV1, islGround, islGroundBlock, islAddGround, islOldLake, islSiteOK, islFindSite, islClear, islStampPath, islLinkPath |
| 053-island-scale-wave-b-north-coast-bays-s.js | 4607-4674 | 10 | WB, wbS, SPOT, spotOpen, spotPos, spotTick, spotXY, spotTap, spotClose, srand |
| 054-inside-oliver-hill-tunnels-with-a-torc.js | 4675-4803 | 22 | tunnelDraw, tunnelTour, wbTargets, WB_SPOT, wbSmin, wbCoastZ, wbGrad, wbCarve, wbClearWet, wbUmbrella |
| 055-island-scale-wave-c-salmon-bay-henriet.js | 4804-4849 | 8 | WC, wcS, binoWrap, seaView, WHALE_ART, lookoutWatch, SEAL_ART, sealView |
| 056-snorkelling-out-to-old-wreck-at-henrie.js | 4850-4921 | 13 | WRECK_ART, wreckDive, wcTargets, WC_SPOT |
| 057-island-scale-phase-6-six-island-lookou.js | 4922-5037 | 18 | LK, lkS, VISTA_ART, vistaDraw, LOOKOUTS, lkDone, lkView, lkTargets, lkTrail, lkPlatform |
| 058-island-explorer-a-19-stop-loop-bus-lik.js | 5038-5084 | 6 | XPL_STOPS, XPL, islInland, coachRide, coachMinutes, flipIslandSigns, hot |
| 059-live-mode-live-1-kip-runs-caf-on-his-o.js | 5085-5159 | 8 | LIVEM |
| 060-look-lab-landscape-layers-of-each-real.js | 5160-5316 | 16 | LAB |
| 061-part.js | 5317-5319 | 0 |  |
