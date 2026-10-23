// ---------- in-game guide ----------
const GUIDE_PLACES=[
 ['island','Quokka Cafe','Kip’s café by Main Jetty. Open 7:00 to 16:00; customers arrive with each Fremantle ferry. Rain closes it for the day.'],
 ['island','Kip’s garden','Six beds beside the café. Plant, water every day, harvest when it sparkles.'],
 ['island','Main Jetty and harbour board','Ferries to South Perth and, later, Fremantle. Upgrade the jetty to level 4 for the big cruise ferry.'],
 ['island','General Store','In the Settlement. Food for stamina, bait, caps and bush hats.'],
 ['island','Kip’s Pedal Hire and Rotto Scoops','Businesses you can buy. They earn from every ferry wave; collect the till.'],
 ['island','Quokka Village','Teepees and Fremantle-style cottages in the bush between the Settlement and the salt lakes. Talk to Elder Wattle.'],
 ['island','Lighthouses, salt lakes, The Basin, East Beach','Explore after closing. Lore stones and lost shells are hidden around the island.'],
 ['island','Beach hammock','Lie down with an orange juice and watch the day go by.'],
 ['island','Geordie Bay and Longreach Bay','North coast bays with holiday cottages, moored boats, the Geordie Bay Store and a fishing jetty.'],
 ['island','Oliver Hill','Old WWII gun battery on a hill. The Quokka Express train runs here from Settlement Station.'],
 ['island','Parker Point and Little Salmon Bay','South coast snorkel trails over the reef, with umbrellas on the sand.'],
 ['island','Strickland Bay','The island\u2019s surf break. Bigger waves and surfers.'],
 ['island','Cape Vlamingh (West End)','Boardwalk lookout, the Vlamingh memorial and New Zealand fur seals on Cathedral Rocks.'],
 ['sp','Mends Street Jetty and plaza','Ferry stop with city views, shade umbrellas and the Origami Quokka sculpture.'],
 ['sp','Swan River Grocer (Mei)','Sell your garden basket here.'],
 ['sp','Swan Market','Snacks and buffs.'],
 ['sp','Mends Servo','Buy your own bike and sunglasses.'],
 ['sp','Swan Seeds Nursery','Tomato, lemon and avocado seeds, plus the garden sprinkler.'],
 ['sp','Mends Street shops','Mends Gelato, Piccolo Trattoria, Swan Home & Living (furniture) and Mends Lane.'],
 ['sp','The Mill Point Hotel and Old Post Office','Heritage buildings at the Mends St and Mill Point Road corner.'],
 ['sp','Homes for sale','Mill Point Towers apartment 40,000 (rent 250/night), Federation bungalow 50,000 (300), riverfront house 120,000 (700). Decorate inside for a cosy bonus. Sleep at any of your homes to wake well rested: full stamina and +1 tip all day.'],
 ['island','Settlement cottage','Kip\u2019s own home on Rottnest behind the caf\u00e9: 6,000 coins, rent 100 a night, wake up on the island.'],
 ['sp','The Old Mill','Shenton\u2019s Mill (1835) on Mill Point. Help Miller Tom grind flour once a day for coins and a scone.'],['sp','East foreshore and Coode St Jetty','Jacarandas, picnic benches, black swans and Swan Kayaks (15 coins, 40 min on the river).'],['sp','Swan River Zoo sign','At the end of Angelo St. The zoo is coming soon.'],
 ['sp','Bus stop, Mill Point Road','Buses to Heirisson Island (15 min) and Victoria Park (30 min).'],
 ['hi','Kangaroo sanctuary','Western grey kangaroos, including a mother with a joey. Great for postcards.'],
 ['hi','Yagan Memorial','Statue honouring the Noongar leader Yagan. Read the plaque.'],
 ['hi','The Causeway','Bridge over the Swan River. Black swans and a pelican nearby.'],
 ['vp','Albany Highway restaurants','Pho, Korean BBQ, ramen, bubble tea, dumplings, Thai, Malaysian, Indian, pub food and coffee.'],
 ['vp','Lotus Pantry Mart','Chilli, lemongrass, bok choy and dragon fruit seeds.'],
 ['vp','Homebox','Aprons, beanies, scarves; Homebox Home & Electricals sells TVs, fridges and more.'],
 ['vp','Night market and station','Stalls light up from 17:30. Trains pass Victoria Park Station.'],
 ['freo','Fremantle (unlocks later)','Upgrade Main Jetty to level 3, then start Kip\u2019s Ferry Co. at the harbour board.'],
 ['freo','Cappuccino Strip, Freo Markets, Fishing Boat Harbour','Cafés, fish & chips, Tasty Thai, the market (seeds, vintage furniture, hats).'],
 ['freo','Round House, Prison, Esplanade, ferris wheel','Landmarks for the “A day out in Freo” quest and postcards.']];
const GUIDE_NPCS=[
 ['Gus','Ferry master at Main Jetty. Sails you to South Perth and gives harbour tips.','island'],['Nana Wren','A fairy-wren who starts the lost shells quest.','island'],['Curator Banksia','Runs the Wadjemup Museum. Donate fish, bugs and fossils.','island'],['Elder Wattle','Leader of Quokka Village. Tells you about island quokkas.','island'],
 ['Mum & Dad','Move in mid-story. Mum helps make drinks; Dad runs the till and card machine.','island'],['Café staff','Hire up to 3 (50 coins each). They serve, then fish and garden after closing.','island'],
 ['Star guests','Fictional celebrities from Australia, China, Korea, England and the USA. Look for the gold star.','island'],['Stranded tourists','Missed the last ferry. Offer the spare room for 10 coins.','island'],
 ['Miller Tom','Runs the Old Mill on Mill Point.','sp'],['Grandma Joy','Sits on the same foreshore bench every afternoon.','sp'],['Priya','Jogs the foreshore all day and counts the swans.','sp'],['Jett','Rents kayaks on the east foreshore.','sp'],
 ['Mei','Buys your produce at the Swan River Grocer.','sp'],['Captain Ruth','Ferry skipper at Mends Street Jetty.','sp'],['Ollie','Runs Swan Seeds Nursery.','sp'],
 ['Albany Hwy shopkeepers','One at each restaurant and shop.','vp'],['Busker','Tip 2 coins for a song.','vp'],
 ['Nino, Sal, Khun Noi, Rosa, Jay','Fremantle shopkeepers with recipes and gifts.','freo'],['Skipper Lou','Runs the Fremantle ferry.','freo']];
const GUIDE_ACTS=[
 ['Run the café','Make drinks at the counter stations and carry them to customers before their patience runs out. Faster service means bigger tips.'],
 ['Garden','Plant seeds, water daily (or rain, or a sprinkler), harvest, then sell to Mei or use fruit in smoothies.'],
 ['Sell by ferry','After closing, take Gus’s ferry to South Perth with your basket.'],
 ['Fish','Staff fish off the jetty after closing. Fish is needed for fish & chips.'],
 ['Postcards','100 postcards plus 5 Star postcards. Press Photo when it glows. 5 coins each, 50 bonus at 25, 50, 75 and 100.'],
 ['Explore and collect','Lore stones, lost shells, Freo stops and a dish at every Albany Hwy restaurant.'],
 ['Host guests','Offer stranded tourists a room. They come back with family the next morning.'],
 ['Decorate homes','Buy furniture in three districts and place it in any home you own.'],
 ['Dress Kip','Buy aprons, hats and accessories, then change in the Bag.'],
 ['Relax','Lie in the beach hammock to refill stamina (full in about 3 game hours) and watch fireflies and glowing plankton until 22:00.'],
 ['Make friends','Press \u2665 Friend (F) near Gus, Nana Wren, Elder Wattle, Mei, Captain Ruth, Ollie, Khun Noi, Rosa or the busker. Chat daily, give one gift a day, unlock heart events at 3, 6 and 10 hearts.'],
 ['Fish','Fishing spots: Main Jetty, Mends St Jetty and the Causeway. Hold the reel button (or Space) to keep the fish in the green bar. Different fish by season, river and night.'],
 ['Dig and beachcomb','Four dig spots (an X in the ground) appear on Rottnest each day: fossils, coins or seeds. A message in a bottle sometimes washes up on the beach.'],
 ['Catch bugs','Catch butterflies by day and fireflies near Quokka Village at night.'],
 ['Museum','Donate fish, bugs and fossils to the Wadjemup Museum in the Settlement. 10 coins each, 100 for a full wing.'],
 ['Restoration Board','Six community bundles next to the museum, each unlocking an island-wide reward.'],
 ['Festivals','Seven festivals a year, from the Channel Swim to Whale Week and the Swan River Fireworks. Each has a special postcard.']];
const GUIDE_SYS=[
 ['Day and time','Time never stops. The caf\u00e9 opens at 7:00 and closes at 16:00, and a new day begins at midnight while you keep playing. Sleep in the caf\u00e9 back room (after 18:00) or a home you own to skip to 7:00. Last ferry leaves at 18:00.'],
 ['Stamina','Kip\u2019s stamina lasts about 3 days. Eat to refill it: pies and sandwiches at the General Store, gelato on Mends St, dishes on Albany Hwy, Freo takeaway, or snacks from your basket in the Bag. At 0 Kip faints and wakes up at the nursing post with a 200 coin bill.'],
 ['Weather','Sunny, partly cloudy, Fremantle Doctor wind, showers. Showers close the café and water your garden.'],
 ['Coins and wishlist','Save for the wishlist to bring Mum & Dad to Wadjemup, then keep growing your businesses forever.'],
 ['Businesses and harbour','Buy island businesses, collect tills, upgrade the jetty for more ferries and customers.'],
 ['Homes and rent','Owned homes pay rent every night, plus 2 coins for each piece of furniture placed.'],
 ['Bag','See basket, furniture, seeds, keys and collections. Change outfits.'],
 ['Perth Pass','Rottnest Island, South Perth and Heirisson Island are free. Fremantle and Victoria Park need the Perth Pass: buy it on itch.io or Payhip, then open \u2630 \u2192 Perth Pass and type your code. The full itch.io and Google Play versions include it.'],
 ['Side quests','19 funny and heartfelt errands across Rottnest, South Perth, Heirisson Island, Fremantle and Victoria Park. They show in Quests with a laughing or heart icon. Track one to follow the red line; walk up to the marked place to talk. Some need a drink carried from the café counter, fish in your basket, or a visit after dark.'],
 ['Area stories','Each area has its own story in chapters: Rottnest (3), South Perth (3), Heirisson Island (1), Fremantle (3) and Victoria Park (2). A chapter starts when you arrive and leads you to places, people and activities, mostly by taking their postcards. Open Quests and press Track to follow the red line. Each finished chapter pays coins and opens the next one.'],
 ['Pause','Press the pause button (two bars) at the top right, or Esc on a keyboard, to stop time. The game also pauses by itself when you switch apps or tabs.'],
 ['Special events','Some mornings bring a surprise: a staff sick day (serve everyone yourself for bonus coins), a cruise crowd (double tourists), a heatwave (smoothies sell best) or a food critic (serve them fast for 80 coins). The event shows at 7:00 and in the clock box.'],
 ['Unstuck','If Kip ever gets stuck or can\u2019t move, open \u2630 \u2192 Unstuck. Kip hops to the nearest road sign or bus stop and any stuck ride or dialog is cleared.'],
 ['Saving','The game saves automatically to one of 6 slots. Load another slot from the title screen.'],
 ['Island Code (visit friends online)','\u2630 \u2192 Island Code \u2192 Get my island code. You get a code like QK-4821 and your game backs up to the cloud by itself. Friends type your code to visit the newest version of your island, even when you are offline. While visiting you can \u2661 like the caf\u00e9, \u270e sign the guestbook and \U0001F381 leave a gift. Gifts and notes arrive in Island Code \u2192 Mailbox. Keep your recovery key secret: with it you can restore the island on a new phone. No internet? The Offline code tab still makes a Dream Code to paste.'],
 ['Caf\u00e9 chain','Buy Quokka Cafe branches at Geordie Bay (900), South Perth (1,500), Victoria Park (1,800) and Fremantle (2,500). Each earns every hour 7:00\u201316:00. Open \u2630 \u2192 Caf\u00e9 HQ from anywhere to collect tills, upgrade to Level 4, change style or hire a manager who banks the till at midnight.'],
 ['Radio','\u2630 \u2192 Radio: three stations of gentle background music (Seaside Piano, Island Lo-fi, Asian Breeze), volume control, or turn it off.'],
 ['Caf\u00e9 upgrades and styles','Use the Caf\u00e9 plans sign beside the deck (or \u2630 \u2192 Caf\u00e9). Four levels: Kiosk, Caf\u00e9 (450), Bistro (900) and Destination caf\u00e9 (1,500), each adding a table and bonuses. Five styles: Classic Rotto, English Cottage, French Riviera, Japanese Ryokan and Seaside Mykonos (250 coins each to unlock, then switch for free).'],
 ['Seasons and calendar','Four Australian seasons of 28 days: Summer, Autumn, Winter, Spring. Weather follows the season (wetter winters). Tap the day in the clock card, or press C.'],
 ['Mail','Check the mailbox beside the caf\u00e9. Letters from Mum, friends and the notice board, sometimes with coins.'],
 ['Daily tasks','Three small tasks every morning, 15 coins each, plus a bonus for all three.'],
 ['Hearts','Friendship goes from 0 to 10 hearts. Birthdays double gift hearts.']];
const GUIDE_TRAVEL=[
 ['Walk, bike, ride','Drag or WASD to walk. Use the bike rack, or buy your own bike at Mends Servo and press V or the Ride button.'],
 ['Ride or teleport','At every bus stop and station choose Ride (3 coins) to travel on board, or Teleport (30 coins) to arrive straight away. Riding the Quokka Coach or Express plays a sightseeing cut-scene past The Basin, the lighthouses, salt lakes, Geordie Bay, Oliver Hill, the south coast bays and Cape Vlamingh, with a short fact for each. Tap Skip ride to jump to the stop.'],
 ['Quokka Coach','Blue BUS signs loop the island: Settlement, The Basin, Wadjemup Lighthouse, Geordie Bay, Little Salmon Bay and West End. Starts on day 3.'],
 ['Quokka Express','Little train from Settlement Station to Oliver Hill, 15 minutes.'],
 ['Ferry: Rottnest ↔ South Perth','From the end of Main Jetty, about 1 hour. Runs until 18:00.'],
 ['Bus: South Perth ↔ Heirisson Island ↔ Victoria Park','From the Mill Point Road stop. 15 minutes a leg.'],
 ['Ferry: Rottnest ↔ Fremantle','Unlocks in the second half of the story. 30 minutes.'],
 ['Sleep away from home','Sleep in a South Perth home and you wake up on the 7:00 ferry back to Rottnest.'],
 ['Maps','Tap the minimap (M) for the local map. In the map, press Perth map to see all districts and routes. The red line always points to your tracked quest.']];
const GUIDE_KEYS=[['Move','Drag left side · WASD / arrows'],['Act','Round button · Space or E'],['Camera','Right-drag · ⟲ ⟳ · Q / R'],['Zoom','+ − · pinch · wheel'],['Ride','V'],['Photo','P'],['Album','O'],['Bag','G'],['Quests','J'],['Map','M'],['Wishlist','I'],['Guide','H'],['Friend','F'],['Calendar','C']];
const ZN={island:'Rottnest',sp:'South Perth',hi:'Heirisson Island',vp:'Victoria Park',freo:'Fremantle'};
let guideTab='start',guideZone='all';
function openGuide(){if(!running||overlay)return;renderGuide();showOverlay('guide');}
function renderGuide(){const T=$('#gdTabs');T.innerHTML='';[['start','How to play'],['places','Places'],['quests','Quests'],['people','People'],['acts','Activities'],['sys','Systems'],['travel','Travel & maps']].forEach(([k,l])=>{const b=document.createElement('button');b.type='button';b.className='qtab'+(guideTab===k?' on':'');b.id='gdt-'+k;b.textContent=l;b.onclick=()=>{guideTab=k;renderGuide();$('#gdBody').scrollTop=0;};T.appendChild(b);});
  const B=$('#gdBody');B.innerHTML='';const card=(title,text,tag,extra)=>{const d=document.createElement('div');d.className='gdC';const h=document.createElement('div');h.className='gdT';h.textContent=title;if(tag){const s=document.createElement('span');s.className='gdTag';s.textContent=tag;h.appendChild(s);}const p=document.createElement('p');p.textContent=text;d.append(h,p);if(extra)d.appendChild(extra);B.appendChild(d);return d;};
  const zoneFilter=()=>{const row=document.createElement('div');row.className='qtabs';[['all','All']].concat(Object.keys(ZN).map(k=>[k,ZN[k]])).forEach(([k,l])=>{const b=document.createElement('button');b.type='button';b.className='qtab'+(guideZone===k?' on':'');b.textContent=l;b.onclick=()=>{guideZone=k;renderGuide();};row.appendChild(b);});B.appendChild(row);};
  if(guideTab==='start'){card('Your story','Kip the quokka opens a tiny café on Wadjemup (Rottnest Island). Serve the ferry crowds, grow Perth Hills produce, save for the wishlist and bring Mum & Dad over. After that the game keeps going: buy businesses, homes and explore Perth.');
    card('A typical day','7:00 open the café → serve each ferry wave → 16:00 close → garden, explore, take the ferry or bus → 22:00 sleep. Check the tracked quest at the top of the screen, or under the minimap on phones.');
    const g=document.createElement('div');g.className='gdKeys';GUIDE_KEYS.forEach(([a,b])=>{const x=document.createElement('b');x.textContent=a;const y=document.createElement('span');y.textContent=b;g.append(x,y);});card('Controls','Keyboard keys in brackets work on desktop; on phones use the on-screen buttons and the ☰ menu.',null,g);}
  if(guideTab==='places'){zoneFilter();GUIDE_PLACES.filter(p=>guideZone==='all'||p[0]===guideZone).forEach(([z,n,t])=>card(n,t,ZN[z]));}
  if(guideTab==='quests'){QUESTS().forEach(q=>{const done=q.steps.length&&q.steps.every(s=>s[1]);const tag=!q.open?'Locked':done?'Done':S.track===q.id?'Tracking':'Open';const ul=document.createElement('ul');ul.className='gdSteps';q.steps.forEach(s=>{const li=document.createElement('li');li.textContent=(s[1]?'✓ ':'○ ')+s[0];if(s[1])li.className='ok';ul.appendChild(li);});
    const ex=document.createElement('div');ex.appendChild(ul);const rw=document.createElement('p');rw.className='gdRw';rw.textContent='Reward: '+q.reward;ex.appendChild(rw);if(q.open&&!done){const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=S.track===q.id?'Tracking on map':'Track on map';b.disabled=S.track===q.id;b.onclick=()=>{S.track=q.id;save();renderGuide();toast('Tracking: '+q.title);};ex.appendChild(b);}
    card(q.title,(q.giver?q.giver+'. ':'')+q.desc,tag,ex);});}
  if(guideTab==='people'){zoneFilter();GUIDE_NPCS.filter(p=>guideZone==='all'||p[2]===guideZone).forEach(([n,t,z])=>card(n,t,ZN[z]));}
  if(guideTab==='acts')GUIDE_ACTS.forEach(([n,t])=>card(n,t));
  if(guideTab==='sys'){const g=document.createElement('div');g.className='gdKeys';UNLOCKS.forEach(u=>{const a=document.createElement('b');a.textContent=(u.ok()?'\u2713 ':'\u{1F512} ')+u.name;const b=document.createElement('span');b.textContent=u.ok()?'Unlocked':u.how;g.append(a,b);});card('Progress and unlocks','New systems open up as the story moves on. Each one arrives with a letter in your mailbox.',null,g);GUIDE_SYS.forEach(([n,t])=>card(n,t));}
  if(guideTab==='travel')GUIDE_TRAVEL.forEach(([n,t])=>card(n,t));}

