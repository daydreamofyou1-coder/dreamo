/* =================================================================
   AeroFly — hotel.js (Cinematic Luxe Edition)
================================================================= */
console.log("AeroFly v6: Map Fixed & Cinematic Ready!"); 

/* -----------------------------------------------------------------
   DATE & GUEST PICKER
----------------------------------------------------------------- */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const today = new Date(); today.setHours(0,0,0,0);
let dpY = today.getFullYear(), dpM = today.getMonth(), dpStart = null, dpEnd = null, dpSel = 0;
let guests = { adult: 2, child: 0, room: 1 };

function toggleDatePopup(e) { e.stopPropagation(); document.getElementById('guests-popup').classList.remove('active'); const p = document.getElementById('date-popup'); if (p.classList.contains('active')) { p.classList.remove('active'); return; } renderCal(); p.classList.add('active'); }
function dpNav(d) { dpM += d; if (dpM > 11) { dpM = 0; dpY++; } if (dpM < 0) { dpM = 11; dpY--; } renderCal(); }
function renderCal() { document.getElementById('dp-month-lbl').textContent = MONTHS[dpM] + ' ' + dpY; const fd = new Date(dpY, dpM, 1).getDay(), off = (fd === 0 ? 6 : fd - 1), dim = new Date(dpY, dpM + 1, 0).getDate(); let h = ''; for (let i = 0; i < off; i++) h += '<button class="dp-d empty" disabled></button>'; for (let d = 1; d <= dim; d++) { const dt = new Date(dpY, dpM, d); let c = 'dp-d'; if (dt < today) c += ' past'; else if (dpStart && dpEnd && dt > dpStart && dt < dpEnd) c += ' inrange'; if (dpStart && dt.getTime() === dpStart.getTime()) c += ' rs'; if (dpEnd && dt.getTime() === dpEnd.getTime()) c += ' re'; if (dt.getTime() === today.getTime()) c += ' today'; h += `<button class="${c}" onclick="dpPick(${dpY},${dpM},${d})">${d}</button>`; } document.getElementById('dp-grid').innerHTML = h; updDpFoot(); }
function dpPick(y, m, d) { const dt = new Date(y, m, d); if (dt < today) return; if (dpSel === 0 || dpEnd) { dpStart = dt; dpEnd = null; dpSel = 1; } else { if (dt < dpStart) { dpEnd = dpStart; dpStart = dt; } else dpEnd = dt; dpSel = 0; } renderCal(); }
function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); }
function updDpFoot() { const h = document.getElementById('dp-hint'), s = document.getElementById('dp-sel-txt'); if (!dpStart) { h.textContent = 'Select check-in'; s.textContent = 'No dates'; } else if (!dpEnd) { h.textContent = 'Select check-out'; s.textContent = fmt(dpStart) + ' → ?'; } else { h.textContent = ''; s.textContent = fmt(dpStart) + ' – ' + fmt(dpEnd); } }
function confirmDates() { if (dpStart) document.getElementById('sb-dates-val').textContent = dpEnd ? fmt(dpStart) + ' – ' + fmt(dpEnd) : fmt(dpStart); document.getElementById('date-popup').classList.remove('active'); }
function toggleGuestsPopup(e) { e.stopPropagation(); document.getElementById('date-popup').classList.remove('active'); document.getElementById('guests-popup').classList.toggle('active'); updGuestBtns(); }
function adjG(t, d) { guests[t] = Math.max(t === 'adult' ? 1 : 0, guests[t] + d); if (t === 'room') guests.room = Math.max(1, guests.room); document.getElementById(t[0] + '-val').textContent = guests[t]; updGuestBtns(); }
function updGuestBtns() { document.getElementById('a-minus').disabled = guests.adult <= 1; document.getElementById('c-minus').disabled = guests.child <= 0; document.getElementById('r-minus').disabled = guests.room <= 1; }
function setRT(el) { document.querySelectorAll('.rt-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); }
function confirmGuests() { const p = []; if (guests.adult) p.push(guests.adult + ' adult' + (guests.adult > 1 ? 's' : '')); if (guests.child) p.push(guests.child + ' child' + (guests.child > 1 ? 'ren' : '')); document.getElementById('sb-guests-val').textContent = p.join(', ') + ' · ' + guests.room + ' room' + (guests.room > 1 ? 's' : ''); document.getElementById('guests-popup').classList.remove('active'); }
document.addEventListener('click', () => { document.querySelectorAll('.sb-popup').forEach(p => p.classList.remove('active')); });

/* -----------------------------------------------------------------
   HOTEL DATA & RENDERING
----------------------------------------------------------------- */
const hotels = [
  { id: 'h1', name: 'Marina Bay Sands', stars: 5, loc: 'Marina Bay · 0.8 km from centre', score: 9.2, scoreLbl: 'Superb', reviews: 2847, price: 320, tags: ['Infinity Pool','Casino','Spa'], featured: true, imgs: ['https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80'] },
  { id: 'h2', name: 'Raffles Singapore', stars: 5, loc: 'City Hall · 1.2 km from centre', score: 9.5, scoreLbl: 'Exceptional', reviews: 3410, price: 480, tags: ['Historic','Colonial','Garden'], featured: false, imgs: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80'] },
  { id: 'h3', name: 'The Capitol Kempinski', stars: 5, loc: 'St Andrews Road · 0.5 km centre', score: 8.8, scoreLbl: 'Excellent', reviews: 1204, price: 215, tags: ['Heritage','Modern','Rooftop'], featured: false, imgs: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80'] },
  { id: 'h4', name: 'Capella Singapore', stars: 5, loc: 'Sentosa Island · 4.1 km from centre', score: 9.0, scoreLbl: 'Wonderful', reviews: 876, price: 390, tags: ['Beach','Resort','Private'], featured: false, imgs: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80'] }
];

let maxPriceFilter = 600, starFilter = 'all';
function renderHotels() {
  const filtered = hotels.filter(h => h.price <= maxPriceFilter && (starFilter === 'all' || h.stars === parseInt(starFilter)));
  document.getElementById('res-count').textContent = filtered.length + ' hotel' + (filtered.length !== 1 ? 's' : '');
  document.getElementById('hotels-list').innerHTML = filtered.map(h => `
    <div class="hotel-card${h.featured ? ' featured-card' : ''}" onclick="openDetail('${h.id}')">
      <div class="hc-img"><img src="${h.imgs[0]}" onerror="this.style.background='#1E293B'">${h.featured ? '<div class="hc-badge gold">✦ Featured</div>' : '<div class="hc-badge">Singapore</div>'}</div>
      <div class="hc-body">
        <div>
          <div class="hc-name">${h.name}</div>
          <div class="hc-loc"><i class="fa-solid fa-location-dot"></i> ${h.loc}</div>
          <div style="margin: .8rem 0; display:flex; align-items:center; gap:10px;">
            <div class="hc-score${h.score >= 9 ? ' hi' : ''}">${h.score}</div>
            <div style="font-size:.8rem; color:var(--text-muted); font-weight:600;">${h.scoreLbl}</div>
          </div>
          <div style="display:flex; gap:6px;">${h.tags.map(t => `<span class="hc-tag">${t}</span>`).join('')}</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:1rem;">
          <div><div class="hc-price">$${h.price} <span class="hc-price-night">/ night</span></div><div style="font-size:.75rem;color:var(--text-sub)">$${(h.price * 11).toLocaleString()} for 11 nights</div></div>
          <button class="hc-book-btn" onclick="event.stopPropagation();openDetail('${h.id}')">View Deal</button>
        </div>
      </div>
    </div>`).join('') || '<div style="text-align:center;padding:3rem;color:var(--text-muted);">No hotels match your filters.</div>';
}

function setSort(el, type) { document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); if (type === 'price') hotels.sort((a, b) => a.price - b.price); else if (type === 'score') hotels.sort((a, b) => b.score - a.score); else hotels.sort((a, b) => b.featured - a.featured); renderHotels(); }
function setPriceFilter(v) { maxPriceFilter = parseInt(v); document.getElementById('price-lbl').textContent = '$' + v; renderHotels(); }
function toggleStar(el, v) { document.querySelectorAll('.star-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); starFilter = v; renderHotels(); }
function resetFilters() { maxPriceFilter = 600; starFilter = 'all'; document.querySelector('input[type=range]').value = 600; document.getElementById('price-lbl').textContent = '$600'; document.querySelectorAll('.star-pill').forEach((p, i) => p.classList.toggle('active', i === 0)); renderHotels(); }

/* -----------------------------------------------------------------
   DETAIL MODAL 
----------------------------------------------------------------- */
let dmIdx = 0, dmTotal = 0, currentHotel = null;

function openDetail(hid) {
  currentHotel = hotels.find(h => h.id === hid);
  if (!currentHotel) return;
  document.getElementById('dm-name').textContent = currentHotel.name;
  document.getElementById('dm-score').textContent = currentHotel.score;
  document.getElementById('dm-score-lbl').textContent = currentHotel.scoreLbl;
  document.getElementById('dm-score-cnt').textContent = currentHotel.reviews.toLocaleString() + ' reviews';
  document.getElementById('dm-rev-score').textContent = currentHotel.score;
  document.getElementById('dbs-amount').textContent = '$' + currentHotel.price;
  
  dmIdx = 0; dmTotal = currentHotel.imgs.length;
  document.getElementById('dm-track').innerHTML = currentHotel.imgs.map(s => `<div class="dm-slide"><img src="${s}" onerror="this.style.background='#1E293B'"></div>`).join('');
  renderDmDots(); updateDmGallery();
  
  document.querySelectorAll('.dm-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  document.querySelectorAll('.dm-tc').forEach((c, i) => c.classList.toggle('active', i === 0));
  
  document.getElementById('detail-overlay').classList.add('active');
}

function closeDetail() { document.getElementById('detail-overlay').classList.remove('active'); }
function dmSlide(d) { dmIdx = Math.max(0, Math.min(dmTotal - 1, dmIdx + d)); updateDmGallery(); renderDmDots(); }
function updateDmGallery() { document.getElementById('dm-track').style.transform = `translateX(${-dmIdx * 100}%)`; document.getElementById('dm-count').textContent = (dmIdx + 1) + ' / ' + dmTotal; }
function renderDmDots() { document.getElementById('dm-dots').innerHTML = Array.from({ length: dmTotal }, (_, i) => `<div class="dm-dot${i === dmIdx ? ' active' : ''}" onclick="dmIdx=${i};updateDmGallery();renderDmDots()"></div>`).join(''); }
function switchTab(el, id) { document.querySelectorAll('.dm-tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); document.querySelectorAll('.dm-tc').forEach(c => c.classList.remove('active')); document.getElementById('dtc-' + id).classList.add('active'); }
document.getElementById('detail-overlay').addEventListener('click', function(e) { if (e.target === this) closeDetail(); });

/* -----------------------------------------------------------------
   MAP CANVAS & FULLSCREEN OVERLAY
----------------------------------------------------------------- */
const mapDests = [ { name: 'Marina Bay Sands', price: '$320', x: 62, y: 55, color: '#3B6B9A', size: 20 }, { name: 'Raffles', price: '$480', x: 38, y: 35, color: '#C9A84C', size: 18 }, { name: 'The Capitol', price: '$215', x: 45, y: 28, color: '#22a05a', size: 14 } ];
function drawMap(canvasId) {
  const canvas = document.getElementById(canvasId); if(!canvas) return;
  canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight;
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#080c16'; ctx.fillRect(0, 0, w, h); 
  ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.ellipse(w*.55, h*.6, w*.25, h*.2, 0.2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*.2, h*.7, w*.15, h*.15, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; for (let x=0; x<w; x+=w/8) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); } for (let y=0; y<h; y+=h/6) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(155,114,203,0.3)'; ctx.lineWidth = 2; [[w*.1,h*.3,w*.9,h*.5],[w*.3,h*.1,w*.4,h*.9],[w*.5,h*.2,w*.6,h*.8]].forEach(([x1,y1,x2,y2])=>{ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
}
function initMap() { 
  drawMap('map-canvas'); 
  const area = document.getElementById('map-area');
  mapDests.forEach(d => { const dot = document.createElement('div'); dot.className = 'map-dest-dot'; dot.style.left = d.x + '%'; dot.style.top = d.y + '%'; dot.innerHTML = `<div class="dot-pulse" style="width:${d.size}px;height:${d.size}px;"></div><div class="dot-circle" style="width:${d.size}px;height:${d.size}px;background:${d.color};"></div>`; area.appendChild(dot); });
}

function openFullMap() {
  document.getElementById('full-map-overlay').classList.add('active');
  setTimeout(() => drawMap('full-map-canvas'), 100); 
}
function closeFullMap() { document.getElementById('full-map-overlay').classList.remove('active'); }

/* =================================================================
   ELEVATOR BOOKING FLOW (4 Steps)
================================================================= */
let elevatorStep = 1; const ELEVATOR_TOTAL = 4; const ELEV_FLOOR_NAMES = ['Dates', 'Guests', 'Extras', 'Review'];
let elevSelectedRoom = ''; let elevSelectedRoomPrice = 0;

function openElevatorFlow(roomName, roomPrice) {
  closeDetail(); 
  elevatorStep = 1; elevSelectedRoom = roomName; elevSelectedRoomPrice = roomPrice;
  
  // Re-build UI logic dynamically
  document.querySelectorAll('.elev-panel').forEach((p, i) => p.classList.toggle('active', i + 1 === elevatorStep));
  const car = document.getElementById('elev-car'); if (car) { car.classList.remove('going-up'); void car.offsetWidth; car.classList.add('going-up'); }
  renderElevatorFloors();
  document.getElementById('elev-back').style.display = 'none';
  document.getElementById('elev-next').textContent = 'Next floor ↑';
  
  document.getElementById('elev-overlay').classList.add('active'); 
}

function renderElevatorFloors() { 
  const container = document.getElementById('elev-floors'); if (!container) return; 
  container.innerHTML = Array.from({ length: ELEVATOR_TOTAL }, (_, i) => { 
    const floorNum = ELEVATOR_TOTAL - i, isDone = floorNum < elevatorStep, isActive = floorNum === elevatorStep; 
    return `<div class="elev-floor-row"><span class="elev-floor-num">${floorNum}</span><div class="elev-floor-bar${isActive ? ' active' : isDone ? ' done' : ''}"></div><span class="elev-floor-label${isActive ? ' active' : ''}">${ELEV_FLOOR_NAMES[floorNum - 1]}</span></div>`; 
  }).join(''); 
}

function renderElevatorStep() { 
  document.querySelectorAll('.elev-panel').forEach((p, i) => p.classList.toggle('active', i + 1 === elevatorStep)); 
  const car = document.getElementById('elev-car'); if (car) { car.classList.remove('going-up'); void car.offsetWidth; car.classList.add('going-up'); } 
  renderElevatorFloors(); 
  const backBtn = document.getElementById('elev-back'), nextBtn = document.getElementById('elev-next'); 
  if (backBtn) backBtn.style.display = elevatorStep > 1 ? 'block' : 'none'; 
  if (nextBtn) nextBtn.textContent = elevatorStep === ELEVATOR_TOTAL ? '✦ Confirm Booking' : 'Next floor ↑'; 
  if (elevatorStep === ELEVATOR_TOTAL) buildElevSummary(); 
}

function buildElevSummary() { 
  const box = document.getElementById('elev-summary-box'); if (!box || !currentHotel) return; 
  const total = (elevSelectedRoomPrice * 11); 
  box.innerHTML = `<div class="elev-sum-hotel"><div style="width:60px;height:50px;border-radius:10px;overflow:hidden;flex-shrink:0;"><img src="${currentHotel.imgs[0]}" style="width:100%;height:100%;object-fit:cover;"></div><div><div style="color:white;font-weight:700;">${currentHotel.name}</div><div style="font-size:.75rem;color:var(--text-muted)">${currentHotel.loc}</div></div></div><div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px dashed rgba(255,255,255,0.1);"><span style="color:var(--text-muted)">Room</span><span style="color:white;font-weight:600;">${elevSelectedRoom}</span></div><div style="display:flex;justify-content:space-between;padding:.8rem 0 0;"><span style="color:var(--text-muted)">Total</span><span style="color:var(--purple);font-size:1.2rem;font-weight:800;">$${total.toLocaleString()}</span></div>`; 
}

function elevAutofill() { 
  const fields = [['ef-fname','Sarah'],['ef-lname','Mitchell'],['ef-email','sarah@email.com'],['ef-phone','+32 478 123 456']]; 
  fields.forEach(([id, val], i) => { setTimeout(() => { const el = document.getElementById(id); if (el) { el.value = val; el.classList.add('filled'); } }, i * 100); }); 
  setTimeout(() => { elevatorStep++; renderElevatorStep(); }, fields.length * 100 + 400); 
}
function elevNext() { if (elevatorStep === ELEVATOR_TOTAL) { closeElevator(); openDestinationReveal(); return; } elevatorStep++; renderElevatorStep(); }
function elevPrev() { if (elevatorStep > 1) { elevatorStep--; renderElevatorStep(); } }
function closeElevator() { document.getElementById('elev-overlay').classList.remove('active'); }

/* =================================================================
   DESTINATION REVEAL CINEMATIC (FULL CANVAS ENGINE)
================================================================= */
const T = {
  storm:  { sky:['#080810','#121220','#222230'], stars:0, sun:false, moon:false, cloud:'rgba(30,30,50,0.92)', mount:'#0c0c18', water:['#222230','#080810'], ground:'#181820', rain:true, lightning:true, season:'storm' },
  summer: { sky:['#0858a8','#2888d0','#50b0e0'], stars:0, sun:true, sunC:'#ffee44', sunGlow:'rgba(255,238,30,0.3)', cloud:'rgba(255,255,255,0.88)', mount:'#286028', water:['#2888d0','#0858a8'], ground:'#387828', season:'summer' },
  spring: { sky:['#70c0ee','#a8d8f8','#c8eeff'], stars:0, sun:true, sunC:'#fff8b0', sunGlow:'rgba(255,240,100,0.28)', cloud:'rgba(255,255,255,0.78)', mount:'#508858', water:['#70c0ee','#3880b0'], ground:'#58a050', season:'spring' },
  winter: { sky:['#162030','#304a60','#7899aa'], stars:.28, sun:true, sunC:'#ffeecc', sunGlow:'rgba(255,240,200,0.18)', cloud:'rgba(190,205,215,0.65)', mount:'#304a58', water:['#6090a0','#162030'], ground:'#ccdde8', season:'winter', snow:true }
};

const TREES = [ {xp:0.1, h:200, t:'dec'}, {xp:0.25, h:130, t:'pine'}, {xp:0.4, h:220, t:'dec'}, {xp:0.7, h:150, t:'pine'}, {xp:0.85, h:240, t:'dec'} ];

let S = { theme: 'storm', currentThemeKey: null, clouds:[], stars:[], particles:[], lt:0, la:0 };
let revealCanvas, revealCtx, offCv, offCtx, transitionAlpha = 0, loopActive = false;

function initRevealCanvas() {
  revealCanvas = document.getElementById('reveal-canvas');
  if(!revealCanvas) return;
  revealCtx = revealCanvas.getContext('2d');
  offCv = document.createElement('canvas'); offCtx = offCv.getContext('2d');
  
  S.stars = Array.from({length:300}, () => ({ x: Math.random()*3000, y: Math.random()*1500, s: Math.random()*1.6+.25, ph: Math.random()*Math.PI*2, sp: Math.random()*.04+.008 }));
  S.clouds = Array.from({length:8}, () => ({ x: Math.random()*3000, y: 48+Math.random()*90, spd: .08+Math.random()*.14, a: .35+Math.random()*.45, puffs: Array.from({length:5}, () => ({ dx:(Math.random()-.5)*60, dy:(Math.random()-.5)*20, rx:20+Math.random()*30, ry:12+Math.random()*20 })) }));
  
  window.addEventListener('resize', resizeCanvas); resizeCanvas(); 
  loopActive = true; requestAnimationFrame(renderCanvas);
}

function resizeCanvas() { if(!revealCanvas) return; revealCanvas.width = window.innerWidth; revealCanvas.height = window.innerHeight; offCv.width = window.innerWidth; offCv.height = window.innerHeight; }

function triggerThemeChange(newTheme) {
  if (S.theme === newTheme) return;
  if (transitionAlpha <= 0 && offCv.width > 0) { offCtx.clearRect(0,0,offCv.width,offCv.height); offCtx.drawImage(revealCanvas, 0, 0); transitionAlpha = 1.0; }
  S.theme = newTheme; S.currentThemeKey = newTheme; S.particles = []; 
}

/* Base Canvas Rendering */
function dSky(ctx, th, W, H) { const g = ctx.createLinearGradient(0,0,0,H); th.sky.forEach((c,i)=>g.addColorStop(i/(th.sky.length-1),c)); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
function dStars(ctx, th, W, H) { const op=th.stars||0; if(op<=0) return; S.stars.forEach((st)=>{ if(st.y > H*0.6) return; st.ph+=st.sp; const a=(.4+Math.sin(st.ph)*.5)*op; ctx.beginPath(); ctx.arc(st.x%(W+20), st.y, st.s, 0, Math.PI*2); ctx.fillStyle=`rgba(255,255,245,${a})`; ctx.fill(); }); }
function dSun(ctx, th, W, H) { if(!th.sun) return; const sx=W*0.3, sy=H*0.3; const g=ctx.createRadialGradient(sx,sy,0,sx,sy,200); g.addColorStop(0,th.sunGlow||'rgba(255,255,100,0.4)'); g.addColorStop(0.5,'rgba(255,200,80,0.1)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation='screen'; ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.beginPath(); ctx.arc(sx,sy,45,0,Math.PI*2); ctx.fillStyle=th.sunC||'#fff5a0'; ctx.shadowBlur=40; ctx.shadowColor=th.sunC||'#fff'; ctx.fill(); ctx.restore(); }
function dClouds(ctx, th, W) { const cc=th.cloud||'rgba(255,255,255,0.6)', stormy=!!th.rain; S.clouds.forEach(cl=>{ cl.x+=cl.spd; if(cl.x>W+100) cl.x=-100; ctx.save(); ctx.globalAlpha=cl.a*(stormy?1.4:1); ctx.shadowBlur=stormy?0:25; ctx.shadowColor=cc; cl.puffs.forEach(p=>{ ctx.save(); ctx.translate(cl.x+p.dx, cl.y+p.dy); ctx.scale(1, p.ry/p.rx); ctx.beginPath(); ctx.arc(0,0,p.rx,0,Math.PI*2); ctx.fillStyle=cc; ctx.fill(); ctx.restore(); }); ctx.restore(); }); }
function dRain(ctx, th, t, W, H) { if(!th.rain) return; ctx.save(); ctx.globalAlpha=.35; ctx.strokeStyle='#8899bb'; ctx.lineWidth=1.5; for(let i=0;i<150;i++){ const x=(i*137+t*.5)%W, y=(i*89+t*.8)%H; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-4,y+25); ctx.stroke(); } ctx.restore(); }
function dLightning(ctx, th, W, H) { if(!th.lightning) return; S.lt--; if(S.lt<=0){ S.lt=100+Math.random()*200; S.la=1.0; } if(S.la>0){ ctx.save(); const f=ctx.createRadialGradient(W/2,H/4,100,W/2,H/4,W); f.addColorStop(0,`rgba(180,200,255,${S.la*0.4})`); f.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=f; ctx.fillRect(0,0,W,H); if(S.la>0.8){ ctx.beginPath(); let lx=W/2+(Math.random()-0.5)*300; ctx.moveTo(lx,0); for(let i=0;i<8;i++){ lx+=(Math.random()-0.5)*80; ctx.lineTo(lx, 50+i*60); } ctx.strokeStyle=`rgba(255,255,255,${S.la})`; ctx.lineWidth=4; ctx.shadowBlur=30; ctx.shadowColor='#88aaff'; ctx.stroke(); } S.la-=0.04; ctx.restore(); } }
function dMountains(ctx, th, W, H) { const my=H*0.7; ctx.beginPath(); ctx.moveTo(0,my); for(let x=0;x<=W;x+=60){ ctx.lineTo(x, my-80-Math.sin(x*0.01)*50-Math.cos(x*0.023)*30); } ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.fillStyle=th.mount||'#3a5030'; ctx.fill(); }
function dGround(ctx, th, W, H) { const gY=H*0.75; ctx.beginPath(); ctx.moveTo(0,gY); for(let x=0;x<=W+20;x+=20) ctx.lineTo(x, gY+Math.sin(x*0.02)*15); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.fillStyle=(th.season==='winter'||th.snow)?'#ccdbe8':th.ground||'#4a7830'; ctx.fill(); }
function dWater(ctx, th, t, W, H) { const wY=H*0.77; if (wY >= H) return; const wc=th.water||['#3a90d0','#1050a0']; const g=ctx.createLinearGradient(0,wY,0,H); wc.forEach((c,i)=>g.addColorStop(i/(wc.length-1),c)); ctx.fillStyle=g; ctx.fillRect(0,wY,W,H-wY); ctx.save(); ctx.globalAlpha=0.15; ctx.strokeStyle='#fff'; ctx.lineWidth=2; for(let i=0;i<8;i++){ const ry=wY+20+i*40; if(ry>H) break; const ph=t*.001+i*.5; ctx.beginPath(); for(let x=0;x<=W;x+=15){ const y=ry+Math.sin(x*.01+ph)*8; x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke(); } ctx.restore(); }

/* Trees & Particles */
function dPine(ctx, x, top, h, season) { const isW = season==='winter'; for(let i=0;i<3;i++){ const ly=top+(i/3)*h*.65, lw=25+(i/3)*45; ctx.beginPath(); ctx.moveTo(x,ly); ctx.lineTo(x-lw,ly+h*.38); ctx.lineTo(x+lw,ly+h*.38); ctx.closePath(); ctx.fillStyle=isW?'#1e3d2a':'#163a16'; ctx.fill(); if(isW){ ctx.beginPath(); ctx.moveTo(x,ly); ctx.lineTo(x-lw*.58,ly+h*.16); ctx.lineTo(x+lw*.58,ly+h*.16); ctx.closePath(); ctx.fillStyle='rgba(210,225,238,0.75)'; ctx.fill(); } } }
function dDeciduous(ctx, x, top, cr, season) { 
  if(season==='winter'||season==='storm'){ ctx.strokeStyle='#3a2a18'; ctx.lineWidth=5; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x,top); ctx.lineTo(x-cr*.5,top-cr*.6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x,top); ctx.lineTo(x+cr*.5,top-cr*.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x,top); ctx.lineTo(x,top-cr*.8); ctx.stroke(); return; } 
  const cols=season==='spring'?['#ffb0c0','#ffc0cc','#ff9aaa','#f8a8b8']:['#2a7218','#389222','#1a6210','#48a22a']; 
  for(let i=0;i<5;i++){ const a=(i/5)*Math.PI*2; ctx.beginPath(); ctx.arc(x+Math.cos(a)*cr*.38, top+Math.sin(a)*cr*.28-cr*.08, cr*.48, 0, Math.PI*2); ctx.fillStyle=cols[i%cols.length]; ctx.fill(); } 
  ctx.beginPath(); ctx.arc(x, top, cr*.52, 0, Math.PI*2); ctx.fillStyle=cols[0]; ctx.fill(); 
}
function spawnParticle(type, W, H) { 
  if(type==='petal') S.particles.push({x:Math.random()*W, y:H*0.75-300+Math.random()*200, vx:1.5+Math.random()*2.5, vy:0.5+Math.random()*1.5, rot:Math.random()*Math.PI*2, rs:(Math.random()-0.5)*0.2, sz:4+Math.random()*5, life:250, type});
  else S.particles.push({x:Math.random()*W, y:-10, vx:(Math.random()-0.5)*1.5, vy:2+Math.random()*3, rot:0, rs:0, sz:3+Math.random()*4, life:350, type}); 
}
function dTreesAndParticles(ctx, th, W, H) {
  const season = th.season || 'summer'; const gY = H * 0.75;
  TREES.forEach(tr => { const x=tr.xp*W, h=tr.h*(H/800+0.5), trunkH=h*0.32, top=gY-trunkH; ctx.fillStyle='#3a2a18'; ctx.fillRect(x-6, top, 12, trunkH); if(tr.t==='pine') dPine(ctx,x,top,h*.75,season); else dDeciduous(ctx,x,top,h*.68,season); });
  if (season === 'spring' && Math.random() < 0.6) spawnParticle('petal', W, H);
  if ((season === 'winter' || th.snow) && Math.random() < 0.7) spawnParticle('snow', W, H);
  S.particles = S.particles.filter(p => {
    p.x+=p.vx; p.y+=p.vy; p.rot+=p.rs; p.life--; const a=Math.max(0,Math.min(1,p.life/25))*0.88;
    ctx.save(); ctx.globalAlpha=a; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    if(p.type==='petal'){ ctx.scale(1,0.55); ctx.beginPath(); ctx.arc(0,0,p.sz,0,Math.PI*2); ctx.fillStyle='#ffb0c0'; ctx.fill(); } 
    else { ctx.beginPath(); ctx.arc(0,0,p.sz,0,Math.PI*2); ctx.fillStyle='#dce8f4'; ctx.fill(); }
    ctx.restore(); return p.life>0 && p.y<H && p.x>-20 && p.x<W+20;
  });
}

function renderCanvas(ts) {
  if (!loopActive) return; requestAnimationFrame(renderCanvas);
  const W = revealCanvas.width, H = revealCanvas.height, th = T[S.theme];
  if (!th) return;
  revealCtx.clearRect(0,0,W,H);
  dSky(revealCtx, th, W, H); dStars(revealCtx, th, W, H); dSun(revealCtx, th, W, H); dClouds(revealCtx, th, W);
  dRain(revealCtx, th, ts, W, H); dLightning(revealCtx, th, W, H); dMountains(revealCtx, th, W, H); dGround(revealCtx, th, W, H);
  dTreesAndParticles(revealCtx, th, W, H); dWater(revealCtx, th, ts, W, H);
  if (transitionAlpha > 0) { revealCtx.save(); revealCtx.globalAlpha = Math.max(0, transitionAlpha); revealCtx.drawImage(offCv, 0, 0); revealCtx.restore(); transitionAlpha -= 0.02; }
}

function openDestinationReveal() {
  document.getElementById('reveal-overlay').classList.add('active');
  initRevealCanvas();
  runRevealSequence();
}

function runRevealSequence() {
  const dt = document.getElementById('rv-dyn-text'); const cta = document.getElementById('rv-cta');
  
  // 1. Storm (Antwerp)
  triggerThemeChange('storm'); dt.innerHTML = "Antwerp, Belgium · Now"; setTimeout(() => dt.classList.add('show'), 200); setTimeout(() => dt.classList.remove('show'), 3000);
  
  // 2. Summer
  setTimeout(() => { triggerThemeChange('summer'); dt.innerHTML = "Need a sand beach and a cold drink?"; dt.classList.add('show'); }, 3800); setTimeout(() => dt.classList.remove('show'), 6500);

  // 3. Spring (Blossoms)
  setTimeout(() => { triggerThemeChange('spring'); dt.innerHTML = "Or dreaming of Japanese blossoms?"; dt.classList.add('show'); }, 7300); setTimeout(() => dt.classList.remove('show'), 10000);

  // 4. Winter
  setTimeout(() => { triggerThemeChange('winter'); dt.innerHTML = "In the mood for some skiing?"; dt.classList.add('show'); }, 10800); setTimeout(() => dt.classList.remove('show'), 13500);

  // Final CTA
  setTimeout(() => { dt.innerHTML = "Your Vibe.<br><span style='background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'>Your Choice.</span>"; dt.classList.add('show'); cta.classList.add('show'); }, 14300);
}

function closeReveal() { const el = document.getElementById('reveal-overlay'); if (el) { el.classList.remove('active'); setTimeout(() => { loopActive = false; }, 500); } }

/* -----------------------------------------------------------------
   INIT
----------------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  renderHotels();
  setTimeout(initMap, 200); 
});
