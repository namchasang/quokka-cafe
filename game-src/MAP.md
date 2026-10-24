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
| 007-world.js | 1041-1228 | 22 | LAND, DECK, JETTY, colliders, col, ISL, isS, isPhi, isW, isWinv |
| 008-more-of-wadjemup.js | 1229-1289 | 10 | SIGN_TEX, makeSign, signPost, COTTAGES, winMat, SNORK, snorks, flowerMats, canopy, TREE_COLS |
| 009-garden-perth-hills-produce.js | 1290-1346 | 8 | CROPS, PLOTS, soilCv, soilDry, bedMat, plantCanvas, plantCache, dropIcon, refreshPlots, fenceMat |
| 010-businesses-for-sale.js | 1347-1412 | 9 | BIZ, BIZ_BY, bizMesh, forSale, applyBiz, riders, BIKE_LANE, spawnRider |
| 011-beach-hammock-with-orange-juice.js | 1413-1477 | 9 | BEACH, JMULT, DOCKS, ferries, jettyParts, ship, applyJetty, HB, SPX, ferry2 |
| 012-south-perth-shops.js | 1478-1531 | 7 | SHOP_POS, asphC, LANES, brickC, HOUSES, bungalow, houseSpec |
| 013-south-perth-mends-street-mill-point-ro.js | 1532-1611 | 13 | pavC, plazaC, SP_FADE, segHitsBox, zebra, TL, plane, carMesh, CAR_COLS, CARS |
| 014-mill-point-road-continues-east-angelo.js | 1612-1685 | 11 | ANGELO, MILL, SWAN_ROWS, swanCv, SWANS, cardSwan, tom, spTick, SP_SIGHTS, paddleKayak |
| 015-fremantle-second-half-of-story.js | 1686-1741 | 11 | winTex, bld, freoFerry, wheel, NP |
| 016-painter-for-32px-creature-sprites.js | 1742-1803 | 11 | painter, roo32, roos, swans, pelican, VP_SHOPS, vpTrain, NM, vpLights, BUS_STOPS |
| 017-quokka-village-inland-bush-where-quokk.js | 1804-1860 | 10 | VILLAGE, VILLAGE_ELDER, elder, REG, eftFlash, NM_AW, MUSEUM, digMeshes, bottle, whale |
| 018-caf-levels-and-styles.js | 1861-1933 | 12 | CAFE_STYLES, CAFE_LV, texWall, texAwn, texDeck, texCounter, STYLE_DECOR, UP, upRoofMat, upper |
| 019-rest-of-wadjemup-north-coast-oliver-hi.js | 1934-1973 | 6 | WEST, COACH |
| 020-animated-waves-rolling-onto-beaches.js | 1974-2062 | 12 | makeWaveTex, waveTex, waveMat, waves, outlineCanvas, pineVariant, tussockCanvas, tussockMats, limeMat, outcrop |
| 021-night-life-fairy-lights-glowing-plankt.js | 2063-2136 | 9 | NIGHT, fairy, nightLights, PLK, plkGeo, plankton, BFLY, butterflies, nightTick, MOTES |
| 022-state.js | 2137-2185 | 5 | LEGACY_KEY, readSlot, fresh, S, save, loadSave, FERRY_ARR, transit, CLOSE, OPEN |
| 023-input.js | 2186-2225 | 5 | keys, STUDIO, studioTip, studioClock, ptrs, joyId, rotDrag, joyEnd, ptrUp, rotateCam |
| 024-interactions.js | 2226-2456 | 46 | current, buildTargets, findTarget, lastAct, camReady, toggleRide, updateActButton, doAction, startBrew, serve |
| 025-home-interiors-furniture-and-decoratin.js | 2457-2510 | 9 | FURN, FURN_SHOPS, ROOM_W, roomOf, homeBonus, openHome, furnDraw, renderHome, homeTap |
| 026-bag-inventory-and-outfits.js | 2511-2551 | 8 | WARD, WARD_SHOP, wardOwn, outfit, drawOutfit, kipFrames, applyOutfit, bagTab, openBag, renderBag |
| 027-in-game-guide.js | 2552-2670 | 18 | GUIDE_PLACES, GUIDE_NPCS, GUIDE_ACTS, GUIDE_SYS, GUIDE_TRAVEL, GUIDE_KEYS, ZN, guideTab, openGuide, renderGuide |
| 028-friendship-digging-and-collection-syst.js | 2671-2740 | 11 | SEASONS, seasonOf, dayLabel, FESTIVALS, festToday, calSeason, openCalendar, renderCalendar, FRIENDS, HEARTS |
| 029-fishing-minigame.js | 2741-2782 | 8 | FISH, FISH_SPOTS, fishG, startFishing, fishTick, drawFish, endFishing, FOSSILS, BUGS, dayRng |
| 030-restoration-board-community-bundles.js | 2783-2857 | 14 | BUNDLES, openBoard, renderBoard, makeMail, openMail, renderMail, DTASK, dtInc, dtVal, checkDaily |
| 031-radio-generative-background-music-weba.js | 2858-2970 | 21 | RADIO, RSTATIONS, radioSave, radioInit, out, mtof, piano, epiano, pluck, pad |
| 032-island-lo-fi-30-original-lo-fi-tracks.js | 2971-3117 | 15 | LF_V, LF_P, LOFI, LF_R, lfRng, lfVoice, lfCompile, rim, lkick, lsnare |
| 033-studio-playlists-fixed-track-order-wit.js | 3118-3172 | 10 | PL_GAP, STUDIO_PL, PL_SEL, plTracks, plLen, plClock, plNext, studioPlaylist, PROG, SCALE |
| 034-dream-code-visit-a-friend-s-island-no.js | 3173-3245 | 15 | VISIT, DREAM_KEYS, QC_URL, QC_BLOCKED, qcFetch, QC_DEEP, qcHome, qcStat, qcNames, qcSnapOf |
| 035-while-visiting-an-online-island.js | 3246-3292 | 9 | vaShow, vbBook, vbGift, applyAllVisuals, enterVisit, leaveVisit, STAM_MAX, eat, stamTick, blackT |
| 036-quokka-cafe-branches-in-other-towns.js | 3293-3339 | 9 | BRANCHES, BR_UP, BR_COL, brMeshes, brState, buildBranch, applyBranches, branchIncomeTick, branchMidnight, brGuestsTick |
| 037-ride-or-teleport-transport-fares.js | 3340-3393 | 8 | FARE_RIDE, RIDE, pay, rideAlong, rideTick, COACH_ROUTE, COACH_IDX, coachMesh, trainRide, busRide |
| 038-perth-pass-freemium.js | 3394-3442 | 8 | BUILD, PASS_LINKS, passBuyUrl, goBuyPass, passCodeShape, passDevice, passRedeemServer, hasPass, GM_HASH, isGM |
| 039-special-caf-events-one-random-event-on.js | 3443-3519 | 13 | EVENTS, evToday, evCur, evRoll, evAnnounce, evOnServe, evClose, propSel, openProp, renderProp |
| 040-ambient-crowds-tourists-joggers-cyclis.js | 3520-3573 | 7 | WALK_ROUTES, WALK_N, walkers, walkerZone, updateWalkers, zoneOf, hiWalk, vpWalk, HIB, ZONE_DEF |
| 041-phase-1-look-on-mainland-same-tussocks.js | 3574-3621 | 7 | LAMPS, CAFE_NL, cafeNightTick, lampTick |
| 042-bus-between-south-perth-heirisson-isla.js | 3622-3688 | 16 | busTo, VP_BUSKER, rollKey, zoneTick, STARS, PCAT, at, PCS, isSpecial, pcThumbKey |
| 043-area-stories-chapters-per-area-that-le.js | 3689-3740 | 9 | _story, STORY_DEF, STORY_ORDER, storyChap, chapSteps, stepDone, stepTarget, storyOpen, storyT, storyTick |
| 044-side-quests-funny-and-heartfelt-errand.js | 3741-3873 | 28 | SIDEQ, sqPos, sqOpen, sqStep, sqReady, sqT, sqTick, sqQuests, sqTarget, snapPending |
| 045-caf-pantry.js | 3874-3988 | 20 | STOCK_INFO, RECIPE, addStock, canMake, useStock, missingFor, lowStock, GSTORE, strandRolled, spawnStranded |
| 046-customers.js | 3989-4033 | 8 | spawnCustomer, STAFF_COL, syncStaff, dadAtTill, staffIcon, updateStaff, removeCustomer, leave, stepWalker, updateCustomers |
| 047-movement.js | 4034-4092 | 9 | groundY, blocked, updatePlayer, updateWilds, C_MORN, T_MORN, tmpC, KEYS, NIGHT_FOG, applyTime |
| 048-overlays.js | 4093-4187 | 27 | showOverlay, hideOverlays, closeOverlays, openWish, hqTpSpot, hqTpTarget, hqTpButton, hqTeleport, jHas, RW_MULT |
| 049-maps-quest-guidance.js | 4188-4297 | 18 | mmC, MM, mmFW, MAP_LABELS, mapper, SPB, renderSPBase, spMini, renderMapBase, mmBase |
| 050-island-scale-spread-island-out-runs-on.js | 4298-4337 | 4 | islandWarp, islandData |
| 051-camera-render.js | 4338-4422 | 12 | camTarget, TITLE_SHOTS, MIR, updateMirror, updateCamera, ambient, last, errShown, reportErr, safeRun |
| 052-island-scale-wave-a-settlement-heritag.js | 4423-4543 | 23 | islGround, islGroundBlock, islAddGround, islOldLake, islSiteOK, islFindSite, islClear, islStampPath, islLinkPath, islRepaint |
| 053-island-scale-wave-b-north-coast-bays-s.js | 4544-4611 | 10 | WB, wbS, SPOT, spotOpen, spotPos, spotTick, spotXY, spotTap, spotClose, srand |
| 054-inside-oliver-hill-tunnels-with-a-torc.js | 4612-4740 | 22 | tunnelDraw, tunnelTour, wbTargets, WB_SPOT, wbSmin, wbCoastZ, wbGrad, wbCarve, wbClearWet, wbUmbrella |
| 055-island-scale-wave-c-salmon-bay-henriet.js | 4741-4786 | 8 | WC, wcS, binoWrap, seaView, WHALE_ART, lookoutWatch, SEAL_ART, sealView |
| 056-snorkelling-out-to-old-wreck-at-henrie.js | 4787-4858 | 13 | WRECK_ART, wreckDive, wcTargets, WC_SPOT |
| 057-island-scale-phase-6-six-island-lookou.js | 4859-4970 | 17 | LK, lkS, VISTA_ART, vistaDraw, LOOKOUTS, lkDone, lkView, lkTargets, lkTrail, lkPlatform |
| 058-island-explorer-a-19-stop-loop-bus-lik.js | 4971-5017 | 6 | XPL_STOPS, XPL, islInland, coachRide, coachMinutes, flipIslandSigns, hot |
| 059-live-mode-live-1-kip-runs-caf-on-his-o.js | 5018-5092 | 8 | LIVEM |
| 060-look-lab-landscape-layers-of-each-real.js | 5093-5249 | 16 | LAB |
| 061-part.js | 5250-5252 | 0 |  |
