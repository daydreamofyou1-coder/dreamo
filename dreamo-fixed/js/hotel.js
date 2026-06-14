/* =================================================================
   AeroFly — hotel.js (Living Canvas & Integrated Rooms)
================================================================= */

/* -----------------------------------------------------------------
   DATE & GUEST PICKER
----------------------------------------------------------------- */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const today = new Date(); today.setHours(0,0,0,0);
let dpY = today.getFullYear(), dpM = today.getMonth();
let dpStart = null, dpEnd = null, dpSel = 0;
let guests = { adult: 2, child: 0, room: 1 };

function toggleDatePopup(e) { e.stopPropagation(); const p = document.getElementById('date-popup'); document.getElementById('guests-popup').classList.remove('active'); if (p.classList.contains('active')) { p.classList.remove('active'); return; } renderCal(); p.classList.add('active'); }
function dpNav(d) { dpM += d; if (dpM > 11) { dpM = 0; dpY++; } if (dpM < 0) { dpM = 11; dpY--; } renderCal(); }
function renderCal() { document.getElementById('dp-month-lbl').textContent = MONTHS[dpM] + ' ' + dpY; const fd = new Date(dpY, dpM, 1).getDay(); const off = (fd === 0 ? 6 : fd - 1); const dim = new Date(dpY, dpM + 1, 0).getDate(); let h = ''; for (let i = 0; i < off; i++) h += '<button class="dp-d empty" disabled></button>'; for (let d = 1; d <= dim; d++) { const dt = new Date(dpY, dpM, d); let c = 'dp-d'; if (dt < today) c += ' past'; else if (dpStart && dpEnd && dt > dpStart && dt < dpEnd) c += ' inrange'; if (dpStart && dt.getTime() === dpStart.getTime()) c += ' rs'; if (dpEnd && dt.getTime() === dpEnd.getTime()) c += ' re'; if (dt.getTime() === today.getTime()) c += ' today'; h += `<button class="${c}" onclick="dpPick(${dpY},${dpM},${d})">${d}</button>`; } document.getElementById('dp-grid').innerHTML = h; updDpFoot(); }
function dpPick(y, m, d) { const dt = new Date(y, m, d); if (dt < today) return; if (dpSel === 0 || dpEnd) { dpStart = dt; dpEnd = null; dpSel = 1; } else { if (dt < dpStart) { dpEnd = dpStart; dpStart = dt; } else dpEnd = dt; dpSel = 0; } renderCal(); }
function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); }
function updDpFoot() { const h = document.getElementById('dp-hint'); const s = document.getElementById('dp-sel-txt'); if (!dpStart) { h.textContent = 'Select check-in date'; s.textContent = 'No dates selected'; } else if (!dpEnd) { h.textContent = 'Now select check-out date'; s.textContent = fmt(dpStart) + ' → ?'; } else { h.textContent = ''; s.textContent = fmt(dpStart) + ' – ' + fmt(dpEnd); } }
function confirmDates() { if (dpStart) { const t = dpEnd ? fmt(dpStart) + ' – ' + fmt(dpEnd) : fmt(dpStart); document.getElementById('sb-dates-val').textContent = t; } document.getElementById('date-popup').classList.remove('active'); }
function toggleGuestsPopup(e) { e.stopPropagation(); document.getElementById('date-popup').classList.remove('active'); document.getElementById('guests-popup').classList.toggle('active'); updGuestBtns(); }
function adjG(t, d) { guests[t] = Math.max(t === 'adult' ? 1 : 0, guests[t] + d); if (t === 'room') guests.room = Math.max(1, guests.room); document.getElementById(t[0] + '-val').textContent = guests[t]; updGuestBtns(); }
function updGuestBtns() { document.getElementById('a-minus').disabled = guests.adult <= 1; document.getElementById('c-minus').disabled = guests.child <= 0; document.getElementById('r-minus').disabled = guests.room <= 1; }
function setRT(el) { document.querySelectorAll('.rt-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); }
function confirmGuests() { const p = []; if (guests.adult) p.push(guests.adult + ' adult' + (guests.adult > 1 ? 's' : '')); if (guests.child) p.push(guests.child + ' child' + (guests.child > 1 ? 'ren' : '')); document.getElementById('sb-guests-val').textContent = p.join(', ') + ' · ' + guests.room + ' room' + (guests.room > 1 ? 's' : ''); document.getElementById('guests-popup').classList.remove('active'); }
document.addEventListener('click', () => { document.querySelectorAll('.sb-popup').forEach(p => p.classList.remove('active')); });

/* -----------------------------------------------------------------
   HOTEL DATA
----------------------------------------------------------------- */
const hotels = [
  { id: 'h1', name: 'Marina Bay Sands', stars: 5, loc: 'Marina Bay · 0.8 km from centre', score: 9.2, scoreLbl: 'Superb', reviews: 2847, price: 320, tags: ['Infinity Pool','Casino','5-Star','Spa'], featured: true, imgs: ['https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80'], mapX: 62, mapY: 55, dotColor: '#3B6B9A' },
  { id: 'h2', name: 'Raffles Singapore', stars: 5, loc: 'City Hall · 1.2 km from centre', score: 9.5, scoreLbl: 'Exceptional', reviews: 3410, price: 480, tags: ['Historic','Butler Service','Colonial','Garden'], featured: false, imgs: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80'], mapX: 38, mapY: 35, dotColor: '#C9A84C' },
  { id: 'h3', name: 'The Capitol Kempinski', stars: 5, loc: 'St Andrews Road · 0.5 km centre', score: 8.8, scoreLbl: 'Excellent', reviews: 1204, price: 215, tags: ['Heritage','City Center','Modern','Rooftop'], featured: false, imgs: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80'], mapX: 45, mapY: 28, dotColor: '#22a05a' },
  { id: 'h4', name: 'Capella Singapore', stars: 5, loc: 'Sentosa Island · 4.1 km from centre', score: 9.0, scoreLbl: 'Wonderful', reviews: 876, price: 390, tags: ['Beach','Resort','Adults+','Private'], featured: false, imgs: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80'], mapX: 55, mapY: 78, dotColor: '#3B6B9A' }
];

const mockRooms = [
  { name: 'Deluxe City View', feats: '1 King · 32m² · Free WiFi', price: 320, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80' },
  { name: 'Premier Suite Bay View', feats: '1 King · 55m² · Pool · Breakfast', price: 580, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80' },
  { name: 'Garden Studio', feats: '2 Twin · 28m² · Garden View', price: 195, img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80' }
];

let maxPriceFilter = 600, starFilter = 'all';

function renderHotels() {
  const filtered = hotels.filter(h => h.price <= maxPriceFilter && (starFilter === 'all' || h.stars === parseInt(starFilter)));
  document.getElementById('res-count').textContent = filtered.length + ' hotel' + (filtered.length !== 1 ? 's' : '');
  document.getElementById('hotels-list').innerHTML = filtered.map(h => `
    <div class="hotel-card${h.featured ? ' featured-card' : ''}" onclick="openDetail('${h.id}')">
      <div class="hc-img">
        <img src="${h.imgs[0]}" alt="${h.name}" onerror="this.style.background='#1E293B'">
        ${h.featured ? '<div class="hc-badge gold">✦ Featured</div>' : '<div class="hc-badge">Singapore</div>'}
      </div>
      <div class="hc-body">
        <div>
          <div class="hc-top">
            <div><div class="hc-name">${h.name}</div><div class="hc-loc"><i class="fa-solid fa-location-dot"></i> ${h.loc}</div></div>
            <div class="hc-score-wrap"><div class="hc-score${h.score >= 9 ? ' hi' : ''}">${h.score}</div><div class="hc-score-lbl">${h.scoreLbl}</div></div>
          </div>
          <div class="hc-tags">${h.tags.map(t => `<span class="hc-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="hc-bottom">
          <div class="hc-price-block">
            <div class="hc-price">$${h.price} <span class="hc-price-night">/ night</span></div>
            <div class="hc-price-total">$${(h.price * 11).toLocaleString()} for 11 nights</div>
          </div>
          <div class="hc-btns">
            <button class="hc-save-btn" onclick="event.stopPropagation();this.innerHTML=this.innerHTML.includes('heart')?'<i class=\'fa-solid fa-heart\' style=\'color:var(--red)\'></i> Saved':'<i class=\'fa-regular fa-heart\'></i> Save'"><i class="fa-regular fa-heart"></i> Save</button>
            <button class="hc-book-btn" onclick="event.stopPropagation();openDetail('${h.id}')">View Deal</button>
          </div>
        </div>
      </div>
    </div>`).join('') || '<div style="text-align:center;padding:3rem;color:var(--text-muted);">No hotels match your filters.</div>';
}

function setSort(el, type) { document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); if (type === 'price') hotels.sort((a, b) => a.price - b.price); else if (type === 'score') hotels.sort((a, b) => b.score - a.score); else if (type === 'distance') hotels.sort((a, b) => parseFloat(a.loc) - parseFloat(b.loc)); else hotels.sort((a, b) => b.featured - a.featured); renderHotels(); }
function setPriceFilter(v) { maxPriceFilter = parseInt(v); document.getElementById('price-lbl').textContent = '$' + v; renderHotels(); }
function toggleStar(el, v) { document.querySelectorAll('.star-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); starFilter = v; renderHotels(); }
function resetFilters() { maxPriceFilter = 600; starFilter = 'all'; document.querySelector('input[type=range]').value = 600; document.getElementById('price-lbl').textContent = '$600'; document.querySelectorAll('.star-pill').forEach((p, i) => p.classList.toggle('active', i === 0)); renderHotels(); }

/* -----------------------------------------------------------------
   DETAIL MODAL & ROOMS TAB
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
  
  // Render Rooms Inside the Tab
  const roomsContainer = document.getElementById('dtc-rooms');
  if (roomsContainer) {
    roomsContainer.innerHTML = mockRooms.map(r => `
      <div class="room-card">
        <div class="rc-top">
          <div class="rc-img"><img src="${r.img}"></div>
          <div class="rc-info">
            <div class="rc-name">${r.name}</div>
            <div class="rc-feats">${r.feats.split(' · ').map(f=>`<span class="rc-feat">${f}</span>`).join('')}</div>
            <div class="rc-cancel free"><i class="fa-solid fa-check"></i> Free cancellation</div>
          </div>
        </div>
        <div class="rc-bottom">
          <div><div class="rc-price">$${r.price}</div><div class="rc-price-sub">per night</div></div>
          <button class="rc-btn" onclick="openElevatorFlow('${r.name}', ${r.price})">Book Room</button>
        </div>
      </div>
    `).join('');
  }

  document.querySelectorAll('.dm-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  document.querySelectorAll('.dm-tc').forEach((c, i) => c.classList.toggle('active', i === 0));
  
  // Wire "Select Room" sticky button
  const selectRoomBtn = document.querySelector('.dbs-book');
  if (selectRoomBtn) {
    selectRoomBtn.onclick = () => {
      switchTab(document.querySelectorAll('.dm-tab')[1], 'rooms');
      const body = document.querySelector('.dm-body');
      const rc = document.getElementById('dtc-rooms');
      if(body && rc) { body.scrollTo({ top: rc.offsetTop - 20, behavior: 'smooth' }); }
    };
  }

  document.getElementById('detail-overlay').classList.add('active');
}

function closeDetail() { document.getElementById('detail-overlay').classList.remove('active'); }
function dmSlide(d) { dmIdx = Math.max(0, Math.min(dmTotal - 1, dmIdx + d)); updateDmGallery(); renderDmDots(); }
function updateDmGallery() { document.getElementById('dm-track').style.transform = `translateX(${-dmIdx * 100}%)`; document.getElementById('dm-count').textContent = (dmIdx + 1) + ' / ' + dmTotal; }
function renderDmDots() { document.getElementById('dm-dots').innerHTML = Array.from({ length: dmTotal }, (_, i) => `<div class="dm-dot${i === dmIdx ? ' active' : ''}" onclick="dmIdx=${i};updateDmGallery();renderDmDots()"></div>`).join(''); }
function switchTab(el, id) { document.querySelectorAll('.dm-tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); document.querySelectorAll('.dm-tc').forEach(c => c.classList.remove('active')); document.getElementById('dtc-' + id).classList.add('active'); }
function toggleDmFav() { const i = document.getElementById('dbs-fav-icon'); const b = document.getElementById('dbs-fav'); const saved = i.className.includes('regular'); i.className = saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'; i.style.color = saved ? 'var(--red)' : ''; b.innerHTML = saved ? '<i id="dbs-fav-icon" class="fa-solid fa-heart" style="color:var(--red)"></i> Saved' : '<i id="dbs-fav-icon" class="fa-regular fa-heart"></i> Save'; }

document.getElementById('detail-overlay').addEventListener('click', function(e) { if (e.target === this) closeDetail(); });

/* -----------------------------------------------------------------
   MAP (canvas)
----------------------------------------------------------------- */
const mapDests = [
  { name: 'Marina Bay Sands', price: '$320', x: 62, y: 55, color: '#3B6B9A', size: 20 },
  { name: 'Raffles',          price: '$480', x: 38, y: 35, color: '#C9A84C', size: 18 },
  { name: 'The Capitol',      price: '$215', x: 45, y: 28, color: '#22a05a', size: 14 },
  { name: 'Capella',          price: '$390', x: 55, y: 78, color: '#3B6B9A', size: 16 }
];
function initMap() {
  const area = document.getElementById('map-area'); if (!area) return;
  const canvas = document.getElementById('map-canvas'); canvas.width = area.offsetWidth; canvas.height = area.offsetHeight;
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#D6D0C4'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#B8CDDC';
  ctx.beginPath(); ctx.ellipse(w*.55, h*.6, w*.25, h*.2, 0.2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*.2, h*.7, w*.15, h*.15, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#C8C0B0';
  [[w*.1,h*.2,w*.4,h*.35],[w*.5,h*.1,w*.35,h*.45],[w*.3,h*.6,w*.2,h*.2]].forEach(([x,y,bw,bh])=>{ ctx.beginPath(); ctx.ellipse(x,y,bw,bh,0,0,Math.PI*2); ctx.fill(); });
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; for (let x = 0; x < w; x += w/8) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); } for (let y = 0; y < h; y += h/6) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; [[w*.1,h*.3,w*.9,h*.5],[w*.3,h*.1,w*.4,h*.9],[w*.5,h*.2,w*.6,h*.8]].forEach(([x1,y1,x2,y2])=>{ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
  mapDests.forEach(d => { const dot = document.createElement('div'); dot.className = 'map-dest-dot'; dot.style.left = d.x + '%'; dot.style.top = d.y + '%'; dot.innerHTML = `<div class="dot-pulse" style="width:${d.size}px;height:${d.size}px;"></div><div class="dot-circle" style="width:${d.size}px;height:${d.size}px;background:${d.color};"></div><div class="dot-price">${d.price}</div>`; area.appendChild(dot); });
}

/* =================================================================
   ELEVATOR BOOKING FLOW (Reduced to 4 Steps)
================================================================= */
let elevatorStep = 1;
const ELEVATOR_TOTAL = 4;
const ELEV_FLOOR_NAMES = ['Dates', 'Guests', 'Extras', 'Review'];
let elevSelectedRoom = 'Deluxe City View';
let elevSelectedRoomPrice = 320;

function openElevatorFlow(roomName, roomPrice) {
  closeDetail();
  elevatorStep = 1;
  elevSelectedRoom = roomName || mockRooms[0].name;
  elevSelectedRoomPrice = roomPrice || mockRooms[0].price;
  buildElevatorModal();
  document.getElementById('elev-overlay').classList.add('active');
  renderElevatorStep();
  setTimeout(() => injectElevatorCSS(), 0);
}

function injectElevatorCSS() {
  if (document.getElementById('elev-style')) return;
  const s = document.createElement('style'); s.id = 'elev-style';
  s.textContent = `
    .elev-modal{background:var(--surface);border:1px solid var(--border);border-radius:24px;width:100%;max-width:520px;max-height:92vh;overflow:hidden;display:flex;flex-direction:column;transform:translateY(24px);transition:transform .4s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 30px 80px rgba(0,0,0,0.5)}
    #elev-overlay.active .elev-modal{transform:translateY(0)}
    .elev-car{width:44px;height:44px;background:var(--gradient);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;box-shadow:0 4px 12px rgba(155,114,203,0.4);transition:transform .5s cubic-bezier(0.34,1.56,0.64,1)}
    .elev-car.going-up{animation:elevGo .5s cubic-bezier(0.34,1.56,0.64,1)}
    @keyframes elevGo{0%{transform:translateY(12px) scale(.9)}60%{transform:translateY(-6px) scale(1.05)}100%{transform:translateY(0) scale(1)}}
    .elev-floors{display:flex;flex-direction:column;gap:3px;flex:1}
    .elev-floor-row{display:flex;align-items:center;gap:.5rem}
    .elev-floor-num{font-size:.6rem;font-weight:700;color:rgba(241,245,249,0.5);width:16px;text-align:right;font-family:'Outfit', sans-serif}
    .elev-floor-bar{flex:1;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;transition:background .3s}
    .elev-floor-bar.active{background:var(--gradient)}
    .elev-floor-bar.done{background:rgba(155,114,203,0.3)}
    .elev-floor-label{font-size:.62rem;color:rgba(241,245,249,0.4);font-family:'Roboto', sans-serif;white-space:nowrap;transition:color .3s}
    .elev-floor-label.active{color:var(--purple);font-weight:600}
    .elev-close{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.8rem;transition:all .2s;flex-shrink:0}
    .elev-close:hover{background:rgba(255,255,255,0.2);color:#fff}
    .elev-body{overflow-y:auto;flex:1;padding:1.5rem}
    .elev-body::-webkit-scrollbar{width:4px}
    .elev-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
    .elev-panel{display:none;animation:elevIn .3s cubic-bezier(0.34,1.56,0.64,1)}
    .elev-panel.active{display:block}
    @keyframes elevIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .elev-section-title{font-family:'Outfit',sans-serif;font-size:1.3rem;font-weight:700;color:white;margin-bottom:1.2rem}
    .elev-date-row{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-bottom:1rem}
    .elev-date-box{border:2px solid var(--border);border-radius:14px;padding:1rem;cursor:pointer;transition:all .2s;background:var(--surface);text-align:center}
    .elev-date-box:hover,.elev-date-box.active{border-color:var(--purple);box-shadow:0 4px 16px rgba(155,114,203,0.2)}
    .elev-date-lbl{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin-bottom:.3rem}
    .elev-date-val{font-family:'Outfit',sans-serif;font-size:1.2rem;font-weight:700;color:white}
    .elev-nights-badge{display:inline-block;background:var(--gradient);color:white;font-size:.75rem;font-weight:700;padding:.3rem .8rem;border-radius:20px;margin-bottom:1rem}
    .elev-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
    .elev-field{display:flex;flex-direction:column;gap:.3rem}
    .elev-field.full{grid-column:1/-1}
    .elev-field label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted)}
    .elev-field input{border:1.5px solid var(--border);border-radius:10px;padding:.65rem .9rem;font-family:'Roboto',sans-serif;font-size:.9rem;color:white;background:var(--bg);outline:none;transition:all .2s}
    .elev-field input:focus{border-color:var(--purple);box-shadow:0 0 0 3px rgba(155,114,203,0.15)}
    .elev-field input.filled{border-color:rgba(34,160,90,0.5);background:rgba(34,160,90,0.04)}
    .elev-autofill{display:flex;align-items:center;gap:.4rem;background:rgba(155,114,203,0.1);border:1px solid rgba(155,114,203,0.3);color:#c4b5fd;border-radius:20px;padding:.35rem .9rem;font-size:.8rem;font-weight:600;cursor:pointer;font-family:'Roboto', sans-serif;transition:all .2s;margin-bottom:1rem}
    .elev-extra-grid{display:flex;flex-direction:column;gap:.6rem}
    .elev-extra{border:2px solid var(--border);border-radius:14px;padding:.9rem 1rem;display:flex;align-items:center;gap:.9rem;cursor:pointer;transition:all .2s;background:var(--surface)}
    .elev-extra.active{border-color:var(--purple);background:rgba(155,114,203,0.1)}
    .elev-extra-icon{font-size:1.2rem;flex-shrink:0}
    .elev-extra-name{font-weight:700;font-size:.9rem;font-family:'Outfit',sans-serif;color:white}
    .elev-extra-desc{font-size:.73rem;color:var(--text-muted)}
    .elev-extra-price{margin-left:auto;font-weight:700;font-family:'Outfit',sans-serif;color:white;flex-shrink:0}
    .elev-chk{width:20px;height:20px;border-radius:6px;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.7rem;transition:all .2s}
    .elev-extra.active .elev-chk{background:var(--purple);border-color:var(--purple);color:white}
    .elev-summary{background:var(--surface-2);border:1px solid var(--border);border-radius:16px;padding:1.2rem;margin-bottom:1rem}
    .elev-sum-hotel{display:flex;align-items:center;gap:.9rem;padding-bottom:.9rem;border-bottom:1px solid var(--border);margin-bottom:.9rem}
    .elev-sum-img{width:64px;height:50px;border-radius:10px;overflow:hidden;flex-shrink:0}
    .elev-sum-img img{width:100%;height:100%;object-fit:cover}
    .elev-sum-name{font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;color:white}
    .elev-sum-loc{font-size:.73rem;color:var(--text-muted);margin-top:.15rem}
    .elev-sum-row{display:flex;justify-content:space-between;align-items:center;font-size:.88rem;padding:.3rem 0;border-bottom:1px dashed var(--border)}
    .elev-sum-row:last-child{border-bottom:none;font-weight:700;font-size:.95rem;padding-top:.5rem}
    .elev-sum-lbl{color:var(--text-muted)}
    .elev-sum-val{color:white;font-weight:500}
    .elev-sum-row:last-child .elev-sum-val{font-family:'Outfit',sans-serif;font-size:1.1rem;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .elev-footer{padding:1rem 1.5rem 1.5rem;border-top:1px solid var(--border);display:flex;gap:.75rem;flex-shrink:0}
    .elev-btn-back{background:var(--surface-2);border:1px solid var(--border);color:var(--text-muted);border-radius:50px;padding:.85rem 1.4rem;font-size:.9rem;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s}
    .elev-btn-next{flex:1;background:var(--gradient);color:white;border:none;border-radius:50px;padding:.85rem 1.5rem;font-size:1rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;box-shadow:0 8px 24px rgba(155,114,203,0.3)}
  `;
  document.head.appendChild(s);
}

function buildElevatorModal() {
  if (document.getElementById('elev-overlay')) return;
  const el = document.createElement('div');
  el.id = 'elev-overlay';
  el.innerHTML = `
    <div class="elev-modal">
      <div class="elev-shaft">
        <div class="elev-car" id="elev-car">🛎️</div>
        <div class="elev-floors" id="elev-floors"></div>
        <button class="elev-close" onclick="closeElevator()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="elev-body">
        <!-- Floor 1: Dates -->
        <div class="elev-panel active" id="ep-1">
          <div class="elev-section-title">When are you staying?</div>
          <div class="elev-date-row">
            <div class="elev-date-box active"><div class="elev-date-lbl">Check-in</div><div class="elev-date-val" id="elev-cin">14 May</div></div>
            <div class="elev-date-box"><div class="elev-date-lbl">Check-out</div><div class="elev-date-val" id="elev-cout">25 May</div></div>
          </div>
          <div class="elev-nights-badge">✦ 11 nights selected</div>
          <p style="font-size:.82rem;color:var(--text-muted);line-height:1.6;">Dates pre-filled from search. Confirm to proceed to guest details.</p>
        </div>
        <!-- Floor 2: Guests -->
        <div class="elev-panel" id="ep-2">
          <div class="elev-section-title">Guest details</div>
          <button class="elev-autofill" onclick="elevAutofill()"><i class="fa-solid fa-bolt"></i> Autofill from profile</button>
          <div class="elev-form-grid">
            <div class="elev-field"><label>First Name</label><input type="text" id="ef-fname" placeholder="First name"></div>
            <div class="elev-field"><label>Last Name</label><input type="text" id="ef-lname" placeholder="Last name"></div>
            <div class="elev-field"><label>Email</label><input type="email" id="ef-email" placeholder="email@example.com"></div>
            <div class="elev-field"><label>Phone</label><input type="tel" id="ef-phone" placeholder="+32 ..."></div>
            <div class="elev-field full"><label>Special Requests</label><input type="text" id="ef-requests" placeholder="High floor, early check-in, etc."></div>
          </div>
        </div>
        <!-- Floor 3: Extras -->
        <div class="elev-panel" id="ep-3">
          <div class="elev-section-title">Enhance your stay</div>
          <div class="elev-extra-grid">
            <div class="elev-extra active" onclick="this.classList.toggle('active')">
              <div class="elev-extra-icon">🍳</div>
              <div><div class="elev-extra-name">Daily Breakfast</div><div class="elev-extra-desc">For 2 guests · Full buffet each morning</div></div>
              <div class="elev-extra-price">+$38/night</div>
              <div class="elev-chk"><i class="fa-solid fa-check"></i></div>
            </div>
            <div class="elev-extra" onclick="this.classList.toggle('active')">
              <div class="elev-extra-icon">🚗</div>
              <div><div class="elev-extra-name">Airport Transfer</div><div class="elev-extra-desc">Private car · Airport ↔ Hotel</div></div>
              <div class="elev-extra-price">+$65</div>
              <div class="elev-chk"><i class="fa-solid fa-check"></i></div>
            </div>
          </div>
        </div>
        <!-- Floor 4: Review -->
        <div class="elev-panel" id="ep-4">
          <div class="elev-section-title">Review your booking</div>
          <div class="elev-summary" id="elev-summary-box"></div>
        </div>
      </div>
      <div class="elev-footer">
        <button class="elev-btn-back" id="elev-back" onclick="elevPrev()" style="display:none">← Back</button>
        <button class="elev-btn-next" id="elev-next" onclick="elevNext()">Next floor ↑</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  renderElevatorFloors();
}

function renderElevatorFloors() {
  const container = document.getElementById('elev-floors'); if (!container) return;
  container.innerHTML = Array.from({ length: ELEVATOR_TOTAL }, (_, i) => {
    const floorNum = ELEVATOR_TOTAL - i;
    const isDone = floorNum < elevatorStep;
    const isActive = floorNum === elevatorStep;
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
  const fname = document.getElementById('ef-fname')?.value || '—', lname = document.getElementById('ef-lname')?.value || '—';
  const extras = [...document.querySelectorAll('.elev-extra.active')];
  const extrasTotal = extras.reduce((sum, e) => { const txt = e.querySelector('.elev-extra-price').textContent; const num = parseInt(txt.replace(/[^0-9]/g, '')) || 0; return sum + (txt.includes('night') ? num * 11 : num); }, 0);
  const total = (elevSelectedRoomPrice * 11) + extrasTotal;
  box.innerHTML = `
    <div class="elev-sum-hotel">
      <div class="elev-sum-img"><img src="${currentHotel.imgs[0]}" onerror="this.style.background='#1E293B'"></div>
      <div><div class="elev-sum-name">${currentHotel.name}</div><div class="elev-sum-loc">${currentHotel.loc}</div></div>
    </div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Guest</span><span class="elev-sum-val">${(fname + ' ' + lname).trim()}</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Dates</span><span class="elev-sum-val">14 May – 25 May · 11 nights</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Room</span><span class="elev-sum-val">${elevSelectedRoom}</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Extras</span><span class="elev-sum-val">${extras.map(e => e.querySelector('.elev-extra-name').textContent).join(', ') || 'None'}</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Total</span><span class="elev-sum-val">$${total.toLocaleString()}</span></div>`;
}

function elevAutofill() {
  const fields = [['ef-fname','Sarah'],['ef-lname','Mitchell'],['ef-email','sarah@email.com'],['ef-phone','+32 478 123 456']];
  fields.forEach(([id, val], i) => { setTimeout(() => { const el = document.getElementById(id); if (el) { el.value = val; el.classList.add('filled'); } }, i * 100); });
  setTimeout(() => { elevatorStep++; renderElevatorStep(); }, fields.length * 100 + 400);
}

function elevNext() { if (elevatorStep === ELEVATOR_TOTAL) { closeElevator(); openDestinationReveal(); return; } elevatorStep++; renderElevatorStep(); }
function elevPrev() { if (elevatorStep > 1) { elevatorStep--; renderElevatorStep(); } }
function closeElevator() { const el = document.getElementById('elev-overlay'); if (el) el.classList.remove('active'); }

/* =================================================================
   DESTINATION REVEAL CINEMATIC (LIVING CANVAS INTEGRATION)
================================================================= */
const T = {
  storm:  { sw:['#080810','#222230','#505070'], sky:['#080810','#121220','#222230'], stars:0, sun:false, moon:false, cloud:'rgba(30,30,50,0.92)', mount:'#0c0c18', city:'#080810', water:['#222230','#080810'], ground:'#181820', fog:.5, cityLights:true, rain:true, lightning:true },
  summer: { sw:['#0858a8','#ffee44','#387828'], sky:['#0858a8','#2888d0','#50b0e0'], stars:0, sun:true, sunC:'#ffee44', sunGlow:'rgba(255,238,30,0.3)', cloud:'rgba(255,255,255,0.88)', mount:'#286028', city:'#3a5060', water:['#2888d0','#0858a8'], ground:'#387828', fog:0, cityLights:false, season:'summer' },
  winter: { sw:['#162030','#7899aa','#ccdde8'], sky:['#162030','#304a60','#7899aa'], stars:.28, sun:true, sunC:'#ffeecc', sunGlow:'rgba(255,240,200,0.18)', cloud:'rgba(190,205,215,0.65)', mount:'#304a58', city:'#203040', water:['#6090a0','#162030'], ground:'#ccdde8', fog:.28, cityLights:false, season:'winter', snow:true },
  aurora: { sw:['#000608','#00ff88','#0055ff'], sky:['#000608','#000e18','#001c28'], stars:.9, moon:true, moonPhase:.35, moonY:.35, moonC:'#b8ccd0', aurora:true, auroraCols:['rgba(0,255,130','rgba(0,160,255','rgba(120,0,255'], cloud:'rgba(0,40,22,0.3)', mount:'#001010', city:'#000808', water:['#001c28','#000608'], ground:'#000a0c', fog:0, cityLights:true }
};

let S = { auto: false, theme: 'storm', currentThemeKey: null, clouds:[], stars:[], particles:[], auroraBands:[], lt:0, la:0 };
let revealCanvas, revealCtx, offCv, offCtx;
let transitionAlpha = 0;
let loopActive = false;

function initRevealCanvas() {
  if (document.getElementById('reveal-canvas')) return;
  revealCanvas = document.createElement('canvas'); revealCanvas.id = 'reveal-canvas';
  revealCanvas.style.cssText = 'position:absolute;inset:0;z-index:0;width:100%;height:100%;';
  document.getElementById('reveal-overlay').prepend(revealCanvas);
  revealCtx = revealCanvas.getContext('2d');
  offCv = document.createElement('canvas'); offCtx = offCv.getContext('2d');
  
  // Setup Particles
  S.stars = Array.from({length:300}, () => ({ x: Math.random()*2000, y: Math.random()*1000, s: Math.random()*1.6+.25, ph: Math.random()*Math.PI*2, sp: Math.random()*.04+.008 }));
  S.clouds = Array.from({length:8}, () => ({ x: Math.random()*2000, y: 48+Math.random()*90, spd: .08+Math.random()*.14, a: .35+Math.random()*.45, puffs: Array.from({length:5}, () => ({ dx:(Math.random()-.5)*60, dy:(Math.random()-.5)*20, rx:20+Math.random()*30, ry:12+Math.random()*20 })) }));
  S.auroraBands = Array.from({length:6}, (_,i)=>({ cx:100+i*150, w:80+Math.random()*80, ph:Math.random()*Math.PI*2, sp:.0006+Math.random()*.0004, colIdx:i%3 }));
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); loopActive = true; requestAnimationFrame(renderCanvas);
}

function resizeCanvas() {
  if(!revealCanvas) return;
  revealCanvas.width = window.innerWidth; revealCanvas.height = window.innerHeight;
  offCv.width = window.innerWidth; offCv.height = window.innerHeight;
}

function triggerThemeChange(newTheme) {
  if (S.theme === newTheme) return;
  if (transitionAlpha <= 0) {
    offCtx.clearRect(0,0,offCv.width,offCv.height);
    offCtx.drawImage(revealCanvas, 0, 0);
    transitionAlpha = 1.0;
  }
  S.theme = newTheme; S.currentThemeKey = newTheme;
}

// Fullscreen Canvas Drawing Functions ported from Living Watch
function dSky(ctx, th, W, H) { const g = ctx.createLinearGradient(0,0,0,H); th.sky.forEach((c,i)=>g.addColorStop(i/(th.sky.length-1),c)); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
function dAurora(ctx, th, t, W) { if(!th.aurora) return; ctx.save(); ctx.globalCompositeOperation='screen'; const cols=th.auroraCols; S.auroraBands.forEach((b,i)=>{ const wave=Math.sin(t*b.sp+b.ph); const ox=wave*150; const g=ctx.createLinearGradient(0,20,0,400); const a=(0.2+Math.abs(wave)*0.15)/(i+1); const col=cols[b.colIdx]; g.addColorStop(0,col+',0)'); g.addColorStop(0.4,col+`,${a})`); g.addColorStop(1,col+',0)'); ctx.beginPath(); ctx.moveTo(b.cx+ox-b.w, 20); ctx.bezierCurveTo(b.cx+ox, -10, b.cx+ox+b.w, 20, b.cx+ox+b.w, 400); ctx.lineTo(b.cx+ox-b.w, 400); ctx.closePath(); ctx.fillStyle=g; ctx.filter='blur(20px)'; ctx.fill(); }); ctx.restore(); }
function dStars(ctx, th, t, W, H) { const op=th.stars||0; if(op<=0) return; S.stars.forEach((st)=>{ if(st.y > H*0.6) return; st.ph+=st.sp; const a=(.4+Math.sin(st.ph)*.5)*op; ctx.beginPath(); ctx.arc(st.x%(W+20), st.y, st.s, 0, Math.PI*2); ctx.fillStyle=`rgba(255,255,245,${a})`; ctx.fill(); }); }
function dSun(ctx, th, W, H) { if(!th.sun) return; const sx=W*0.3, sy=H*0.3; const g=ctx.createRadialGradient(sx,sy,0,sx,sy,150); g.addColorStop(0,th.sunGlow||'rgba(255,255,100,0.4)'); g.addColorStop(0.5,'rgba(255,200,80,0.1)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation='screen'; ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.beginPath(); ctx.arc(sx,sy,35,0,Math.PI*2); ctx.fillStyle=th.sunC||'#fff5a0'; ctx.shadowBlur=30; ctx.shadowColor=th.sunC||'#fff'; ctx.fill(); ctx.restore(); }
function dMoon(ctx, th, W, H) { if(!th.moon) return; const mx=W*0.7, my=H*0.25; ctx.save(); ctx.globalCompositeOperation='screen'; const g=ctx.createRadialGradient(mx,my,0,mx,my,100); g.addColorStop(0,'rgba(200,200,180,0.15)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.restore(); ctx.beginPath(); ctx.arc(mx,my,30,0,Math.PI*2); ctx.fillStyle=th.moonC||'#e8e5cc'; ctx.fill(); }
function dClouds(ctx, th, t, W) { const cc=th.cloud||'rgba(255,255,255,0.6)', stormy=!!th.rain; S.clouds.forEach(cl=>{ cl.x+=cl.spd; if(cl.x>W+100) cl.x=-100; ctx.save(); ctx.globalAlpha=cl.a*(stormy?1.4:1); ctx.shadowBlur=stormy?0:25; ctx.shadowColor=cc; cl.puffs.forEach(p=>{ ctx.save(); ctx.translate(cl.x+p.dx, cl.y+p.dy); ctx.scale(1, p.ry/p.rx); ctx.beginPath(); ctx.arc(0,0,p.rx,0,Math.PI*2); ctx.fillStyle=cc; ctx.fill(); ctx.restore(); }); ctx.restore(); }); }
function dRain(ctx, th, t, W, H) { if(!th.rain) return; ctx.save(); ctx.globalAlpha=.35; ctx.strokeStyle='#8899bb'; ctx.lineWidth=1.5; for(let i=0;i<150;i++){ const x=(i*137+t*.5)%W, y=(i*89+t*.8)%H; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-4,y+18); ctx.stroke(); } ctx.restore(); }
function dLightning(ctx, th, t, W, H) { if(!th.lightning) return; S.lt--; if(S.lt<=0){ S.lt=100+Math.random()*200; S.la=1.0; } if(S.la>0){ ctx.save(); const f=ctx.createRadialGradient(W/2,H/4,100,W/2,H/4,W); f.addColorStop(0,`rgba(180,200,255,${S.la*0.4})`); f.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=f; ctx.fillRect(0,0,W,H); if(S.la>0.8){ ctx.beginPath(); let lx=W/2+(Math.random()-0.5)*300; ctx.moveTo(lx,0); for(let i=0;i<8;i++){ lx+=(Math.random()-0.5)*80; ctx.lineTo(lx, 50+i*60); } ctx.strokeStyle=`rgba(255,255,255,${S.la})`; ctx.lineWidth=3; ctx.shadowBlur=30; ctx.shadowColor='#88aaff'; ctx.stroke(); } S.la-=0.04; ctx.restore(); } }
function dMountains(ctx, th, W, H) { const my=H*0.6; ctx.beginPath(); ctx.moveTo(0,my); for(let x=0;x<=W;x+=60){ ctx.lineTo(x, my-60-Math.sin(x*0.01)*40-Math.cos(x*0.023)*20); } ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.fillStyle=th.mount||'#3a5030'; ctx.fill(); }
function dCity(ctx, th, t, W, H) { const isN=!!th.cityLights, cc=th.city||'#1a2a3a', gY=H*0.65; for(let bx=40; bx<W; bx+=80+Math.random()*40){ const bw=40+Math.random()*60, bh=80+Math.random()*150; ctx.fillStyle=cc; ctx.fillRect(bx, gY-bh, bw, bh); if(isN){ ctx.fillStyle=`rgba(255,215,90,${0.4+Math.sin(bx)*0.2})`; for(let r=0;r<bh/15-1;r++) for(let c=0;c<bw/12-1;c++) if(Math.random()>0.3) ctx.fillRect(bx+6+c*12, gY-bh+6+r*15, 6, 8); } } }
function dGround(ctx, th, W, H) { const gY=H*0.65; ctx.beginPath(); ctx.moveTo(0,gY); for(let x=0;x<=W;x+=20) ctx.lineTo(x, gY+Math.sin(x*0.02)*10); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.fillStyle=(th.season==='winter'||th.snow)?'#ccdbe8':th.ground||'#4a7830'; ctx.fill(); }
function dWater(ctx, th, t, W, H) { const wY=H*0.66; const wc=th.water||['#3a90d0','#1050a0']; const g=ctx.createLinearGradient(0,wY,0,H); wc.forEach((c,i)=>g.addColorStop(i/(wc.length-1),c)); ctx.fillStyle=g; ctx.fillRect(0,wY,W,H-wY); ctx.save(); ctx.globalAlpha=0.15; ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; for(let i=0;i<8;i++){ const ry=wY+20+i*30, ph=t*.001+i*.5; ctx.beginPath(); for(let x=0;x<=W;x+=10){ const y=ry+Math.sin(x*.01+ph)*6; x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.stroke(); } ctx.restore(); }

function renderCanvas(ts) {
  if (!loopActive) return;
  requestAnimationFrame(renderCanvas);
  
  const W = revealCanvas.width, H = revealCanvas.height;
  const th = T[S.theme];

  revealCtx.clearRect(0,0,W,H);
  dSky(revealCtx, th, W, H);
  dAurora(revealCtx, th, ts, W);
  dStars(revealCtx, th, ts, W, H);
  dSun(revealCtx, th, W, H);
  dMoon(revealCtx, th, W, H);
  dClouds(revealCtx, th, ts, W);
  dRain(revealCtx, th, ts, W, H);
  dLightning(revealCtx, th, ts, W, H);
  dMountains(revealCtx, th, W, H);
  dCity(revealCtx, th, ts, W, H);
  dGround(revealCtx, th, W, H);
  dWater(revealCtx, th, ts, W, H);

  // Crossfade logic
  if (transitionAlpha > 0) {
    revealCtx.save();
    revealCtx.globalAlpha = Math.max(0, transitionAlpha);
    revealCtx.drawImage(offCv, 0, 0);
    revealCtx.restore();
    transitionAlpha -= 0.02;
  }
}

function openDestinationReveal() {
  injectRevealCSS();
  buildRevealDOM();
  setTimeout(() => {
    document.getElementById('reveal-overlay').classList.add('active');
    initRevealCanvas();
    runRevealSequence();
  }, 100);
}

function injectRevealCSS() {
  if (document.getElementById('reveal-style')) return;
  const s = document.createElement('style'); s.id = 'reveal-style';
  s.textContent = `
    #reveal-overlay{position:fixed;inset:0;z-index:3000;background:#000;opacity:0;pointer-events:none;transition:opacity .5s;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;font-family:'Outfit',sans-serif}
    #reveal-overlay.active{opacity:1;pointer-events:all}
    .rv-overlay-text{position:absolute;top:10%;text-align:center;color:rgba(255,255,255,0.8);font-size:1.2rem;letter-spacing:.1em;text-transform:uppercase;z-index:10;opacity:0;transition:opacity .6s;}
    .rv-flip-stage{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;height:200px;perspective:1000px;opacity:0;transition:opacity .4s;z-index:10;}
    .rv-flip-stage.show{opacity:1}
    .rv-card{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 1.2s cubic-bezier(0.645,0.045,0.355,1.000)}
    .rv-card.flipped{transform:rotateY(180deg)}
    .rv-card-face{position:absolute;inset:0;border-radius:20px;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .rv-card-front{background:var(--surface-2);border:1px solid var(--border)}
    .rv-card-back{background:var(--gradient);transform:rotateY(180deg);border:1px solid rgba(201,168,76,0.3)}
    .rv-card-front-content{text-align:center;color:rgba(255,255,255,0.6);}
    .rv-card-front-content i{font-size:2rem;display:block;margin-bottom:.5rem;color:var(--purple);}
    .rv-card-front-content span{font-size:.85rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
    .rv-card-back-content{text-align:center;color:white;}
    .rv-card-back-content i{font-size:2.5rem;display:block;margin-bottom:.4rem;color:#fbbf24;}
    .rv-card-back-content span{font-size:1.1rem;font-weight:700;}
    
    .rv-destinations{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;gap:1.2rem;opacity:0;transition:opacity .5s;z-index:10;}
    .rv-destinations.show{opacity:1}
    .rv-dest-card{width:180px;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.4);transform:translateY(30px) scale(.9);opacity:0;transition:all .6s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;flex-shrink:0;border:1.5px solid var(--border);}
    .rv-dest-card.pop{transform:translateY(0) scale(1);opacity:1}
    .rv-dest-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 16px 40px rgba(0,0,0,.5)}
    .rv-dest-img{height:130px;position:relative;overflow:hidden}
    .rv-dest-img-bg{width:100%;height:100%;object-fit:cover}
    .rv-dest-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.5),transparent)}
    .rv-dest-info{padding:.75rem 1rem;background:rgba(15,23,42,0.85);backdrop-filter:blur(10px);}
    .rv-dest-name{font-size:1rem;font-weight:700;color:white;margin-bottom:.15rem}
    .rv-dest-vibe{font-size:.7rem;color:var(--text-muted);}
    .rv-dest-badge{position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.55);color:#fff;font-size:.6rem;font-weight:700;padding:.2rem .5rem;border-radius:6px;backdrop-filter:blur(4px);text-transform:uppercase;}

    .rv-neon-title{position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:10;opacity:0;transition:opacity .8s;font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;}
    .rv-neon-title.show{opacity:1;}
    .rv-neon-title .line1{display:block;color:white;}
    .rv-neon-title .line2{display:block;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
    .rv-cta{position:absolute;bottom:15%;left:50%;transform:translateX(-50%);background:var(--gradient);color:white;border:none;border-radius:50px;padding:.85rem 2.5rem;font-size:1rem;font-weight:700;cursor:pointer;opacity:0;transition:all .3s;z-index:20;}
    .rv-cta.show{opacity:1;}
    .rv-cta:hover{transform:translateX(-50%) translateY(-3px);box-shadow:0 14px 40px rgba(155,114,203,0.5)}
    .rv-skip{position:absolute;bottom:2rem;right:2rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:white;padding:.5rem 1.1rem;border-radius:50px;font-size:.8rem;cursor:pointer;transition:all .2s;backdrop-filter:blur(4px);z-index:20}
    .rv-skip:hover{background:rgba(255,255,255,0.25);}
  `;
  document.head.appendChild(s);
}

function buildRevealDOM() {
  if (document.getElementById('reveal-overlay')) document.getElementById('reveal-overlay').remove();
  const el = document.createElement('div'); el.id = 'reveal-overlay';
  el.innerHTML = `
    <div class="rv-overlay-text" id="rv-loc-text">Brussels, Belgium · Now</div>
    <div class="rv-flip-stage" id="rv-flip">
      <div class="rv-card" id="rv-card">
        <div class="rv-card-face rv-card-front"><div class="rv-card-front-content"><i class="fa-solid fa-map-location-dot"></i><span>Your next destination</span></div></div>
        <div class="rv-card-face rv-card-back"><div class="rv-card-back-content"><i class="fa-solid fa-sun"></i><span>It could be here ✦</span></div></div>
      </div>
    </div>
    <div class="rv-destinations" id="rv-dests">
      <div class="rv-dest-card" onclick="selectRevealDest('summer', this)">
        <div class="rv-dest-img"><img class="rv-dest-img-bg" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"><div class="rv-dest-overlay"></div><div class="rv-dest-badge">☀️ Summer</div></div>
        <div class="rv-dest-info"><div class="rv-dest-name">Tropical Beach</div><div class="rv-dest-vibe">Bali · Maldives · Phuket</div></div>
      </div>
      <div class="rv-dest-card" onclick="selectRevealDest('winter', this)">
        <div class="rv-dest-img"><img class="rv-dest-img-bg" src="https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&q=80"><div class="rv-dest-overlay"></div><div class="rv-dest-badge">❄️ Winter</div></div>
        <div class="rv-dest-info"><div class="rv-dest-name">Winterland</div><div class="rv-dest-vibe">Lapland · Zermatt · Banff</div></div>
      </div>
      <div class="rv-dest-card" onclick="selectRevealDest('aurora', this)">
        <div class="rv-dest-img"><img class="rv-dest-img-bg" src="https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=400&q=80"><div class="rv-dest-overlay"></div><div class="rv-dest-badge">🌆 Neon City</div></div>
        <div class="rv-dest-info"><div class="rv-dest-name">City of Lights</div><div class="rv-dest-vibe">Vegas · Shanghai · Tokyo</div></div>
      </div>
    </div>
    <div class="rv-neon-title" id="rv-neon-title"><span class="line1">Your Vibe.</span><span class="line2">Your Choice.</span></div>
    <button class="rv-cta" id="rv-cta" onclick="closeReveal()">✦ Explore Now</button>
    <button class="rv-skip" onclick="closeReveal()">Skip <i class="fa-solid fa-forward-step" style="margin-left:4px"></i></button>
  `;
  document.body.appendChild(el);
}

function runRevealSequence() {
  triggerThemeChange('storm');
  setTimeout(() => document.getElementById('rv-loc-text').style.opacity = '1', 200);
  setTimeout(() => { document.getElementById('rv-loc-text').style.opacity = '0'; document.getElementById('rv-flip').classList.add('show'); }, 2500);
  setTimeout(() => document.getElementById('rv-card').classList.add('flipped'), 3200);
  setTimeout(() => {
    document.getElementById('rv-flip').classList.remove('show');
    document.getElementById('rv-dests').classList.add('show');
    document.querySelectorAll('.rv-dest-card').forEach((c, i) => setTimeout(() => c.classList.add('pop'), i * 180));
  }, 4800);
}

function selectRevealDest(theme, card) {
  document.querySelectorAll('.rv-dest-card').forEach(c => c.style.transform = '');
  card.style.transform = 'translateY(-8px) scale(1.04)';
  card.style.boxShadow = '0 16px 40px rgba(155,114,203,0.5)';
  triggerThemeChange(theme);
  setTimeout(() => {
    document.getElementById('rv-dests').classList.remove('show');
    setTimeout(() => document.getElementById('rv-neon-title').classList.add('show'), 300);
    setTimeout(() => document.getElementById('rv-cta').classList.add('show'), 800);
  }, 800);
}

function closeReveal() { const el = document.getElementById('reveal-overlay'); if (el) { el.style.opacity = '0'; setTimeout(() => { loopActive = false; el.remove(); }, 500); } }

/* -----------------------------------------------------------------
   INIT
----------------------------------------------------------------- */
renderHotels();
window.addEventListener('load', () => { initMap(); });
setTimeout(initMap, 100);
