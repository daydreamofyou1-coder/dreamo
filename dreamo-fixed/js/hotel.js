/* =================================================================
   AeroFly — hotel.js
   Hotel search, filters, detail modal, elevator booking flow,
   and destination reveal cinematic animation.
================================================================= */


/* -----------------------------------------------------------------
   DATE PICKER
----------------------------------------------------------------- */
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const today = new Date(); today.setHours(0,0,0,0);
let dpY = today.getFullYear(), dpM = today.getMonth();
let dpStart = null, dpEnd = null, dpSel = 0;

function toggleDatePopup(e) {
  e.stopPropagation();
  const p = document.getElementById('date-popup');
  const g = document.getElementById('guests-popup');
  g.classList.remove('active');
  if (p.classList.contains('active')) { p.classList.remove('active'); return; }
  renderCal(); p.classList.add('active');
}

function dpNav(d) {
  dpM += d;
  if (dpM > 11) { dpM = 0; dpY++; }
  if (dpM < 0)  { dpM = 11; dpY--; }
  renderCal();
}

function renderCal() {
  document.getElementById('dp-month-lbl').textContent = MONTHS[dpM] + ' ' + dpY;
  const fd = new Date(dpY, dpM, 1).getDay();
  const off = (fd === 0 ? 6 : fd - 1);
  const dim = new Date(dpY, dpM + 1, 0).getDate();
  let h = '';
  for (let i = 0; i < off; i++) h += '<button class="dp-d empty" disabled></button>';
  for (let d = 1; d <= dim; d++) {
    const dt = new Date(dpY, dpM, d); let c = 'dp-d';
    if (dt < today) c += ' past';
    else if (dpStart && dpEnd && dt > dpStart && dt < dpEnd) c += ' inrange';
    if (dpStart && dt.getTime() === dpStart.getTime()) c += ' rs';
    if (dpEnd   && dt.getTime() === dpEnd.getTime())   c += ' re';
    if (dt.getTime() === today.getTime()) c += ' today';
    h += `<button class="${c}" onclick="dpPick(${dpY},${dpM},${d})">${d}</button>`;
  }
  document.getElementById('dp-grid').innerHTML = h;
  updDpFoot();
}

function dpPick(y, m, d) {
  const dt = new Date(y, m, d); if (dt < today) return;
  if (dpSel === 0 || dpEnd) { dpStart = dt; dpEnd = null; dpSel = 1; }
  else { if (dt < dpStart) { dpEnd = dpStart; dpStart = dt; } else dpEnd = dt; dpSel = 0; }
  renderCal();
}

function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); }

function updDpFoot() {
  const h = document.getElementById('dp-hint');
  const s = document.getElementById('dp-sel-txt');
  if (!dpStart)      { h.textContent = 'Select check-in date';   s.textContent = 'No dates selected'; }
  else if (!dpEnd)   { h.textContent = 'Now select check-out date'; s.textContent = fmt(dpStart) + ' → ?'; }
  else               { h.textContent = ''; s.textContent = fmt(dpStart) + ' – ' + fmt(dpEnd); }
}

function confirmDates() {
  if (dpStart) {
    const t = dpEnd ? fmt(dpStart) + ' – ' + fmt(dpEnd) : fmt(dpStart);
    document.getElementById('sb-dates-val').textContent = t;
  }
  document.getElementById('date-popup').classList.remove('active');
}


/* -----------------------------------------------------------------
   GUESTS PICKER
----------------------------------------------------------------- */
let guests = { adult: 2, child: 0, room: 1 };

function toggleGuestsPopup(e) {
  e.stopPropagation();
  const p = document.getElementById('guests-popup');
  document.getElementById('date-popup').classList.remove('active');
  p.classList.toggle('active');
  updGuestBtns();
}

function adjG(t, d) {
  guests[t] = Math.max(t === 'adult' ? 1 : 0, guests[t] + d);
  if (t === 'room') guests.room = Math.max(1, guests.room);
  document.getElementById(t[0] + '-val').textContent = guests[t];
  updGuestBtns();
}

function updGuestBtns() {
  document.getElementById('a-minus').disabled = guests.adult <= 1;
  document.getElementById('c-minus').disabled = guests.child <= 0;
  document.getElementById('r-minus').disabled = guests.room  <= 1;
}

function setRT(el) {
  document.querySelectorAll('.rt-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}

function confirmGuests() {
  const p = [];
  if (guests.adult) p.push(guests.adult + ' adult' + (guests.adult > 1 ? 's' : ''));
  if (guests.child) p.push(guests.child + ' child' + (guests.child > 1 ? 'ren' : ''));
  document.getElementById('sb-guests-val').textContent =
    p.join(', ') + ' · ' + guests.room + ' room' + (guests.room > 1 ? 's' : '');
  document.getElementById('guests-popup').classList.remove('active');
}

document.addEventListener('click', () => {
  document.querySelectorAll('.sb-popup').forEach(p => p.classList.remove('active'));
});


/* -----------------------------------------------------------------
   HOTEL DATA
----------------------------------------------------------------- */
const hotels = [
  {
    id: 'h1', name: 'Marina Bay Sands', stars: 5,
    loc: 'Marina Bay · 0.8 km from centre',
    score: 9.2, scoreLbl: 'Superb', reviews: 2847, price: 320,
    tags: ['Infinity Pool','Casino','5-Star','Spa'],
    featured: true,
    imgs: [
      'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80',
      'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80'
    ],
    mapX: 62, mapY: 55, dotColor: '#3B6B9A'
  },
  {
    id: 'h2', name: 'Raffles Singapore', stars: 5,
    loc: 'City Hall · 1.2 km from centre',
    score: 9.5, scoreLbl: 'Exceptional', reviews: 3410, price: 480,
    tags: ['Historic','Butler Service','Colonial','Garden'],
    featured: false,
    imgs: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80'
    ],
    mapX: 38, mapY: 35, dotColor: '#C9A84C'
  },
  {
    id: 'h3', name: 'The Capitol Kempinski', stars: 5,
    loc: 'St Andrews Road · 0.5 km centre',
    score: 8.8, scoreLbl: 'Excellent', reviews: 1204, price: 215,
    tags: ['Heritage','City Center','Modern','Rooftop'],
    featured: false,
    imgs: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
      'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80'
    ],
    mapX: 45, mapY: 28, dotColor: '#22a05a'
  },
  {
    id: 'h4', name: 'Capella Singapore', stars: 5,
    loc: 'Sentosa Island · 4.1 km from centre',
    score: 9.0, scoreLbl: 'Wonderful', reviews: 876, price: 390,
    tags: ['Beach','Resort','Adults+','Private'],
    featured: false,
    imgs: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80',
      'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80'
    ],
    mapX: 55, mapY: 78, dotColor: '#3B6B9A'
  }
];

let maxPriceFilter = 600, starFilter = 'all';

function renderHotels() {
  const filtered = hotels.filter(h =>
    h.price <= maxPriceFilter && (starFilter === 'all' || h.stars === parseInt(starFilter))
  );
  document.getElementById('res-count').textContent =
    filtered.length + ' hotel' + (filtered.length !== 1 ? 's' : '');
  document.getElementById('hotels-list').innerHTML = filtered.map(h => `
    <div class="hotel-card${h.featured ? ' featured-card' : ''}" onclick="openDetail('${h.id}')">
      <div class="hc-img">
        <img src="${h.imgs[0]}" alt="${h.name}" onerror="this.style.background='#1E293B'">
        ${h.featured
          ? '<div class="hc-badge gold">✦ Featured</div>'
          : '<div class="hc-badge">Singapore</div>'}
        <button class="hc-fav" onclick="event.stopPropagation();this.classList.toggle('saved');this.querySelector('i').className=this.classList.contains('saved')?'fa-solid fa-heart':'fa-regular fa-heart'">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
      <div class="hc-body">
        <div>
          <div class="hc-top">
            <div>
              <div class="hc-name">${h.name}</div>
              <div class="hc-loc"><i class="fa-solid fa-location-dot"></i> ${h.loc}</div>
            </div>
            <div class="hc-score-wrap">
              <div class="hc-score${h.score >= 9 ? ' hi' : ''}">${h.score}</div>
              <div class="hc-score-lbl">${h.scoreLbl}</div>
            </div>
          </div>
          <div class="hc-tags">${h.tags.map(t => `<span class="hc-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="hc-bottom">
          <div class="hc-price-block">
            <div class="hc-price">$${h.price} <span class="hc-price-night">/ night</span></div>
            <div class="hc-price-total">$${(h.price * 11).toLocaleString()} for 11 nights</div>
          </div>
          <div class="hc-btns">
            <button class="hc-save-btn" onclick="event.stopPropagation();this.innerHTML=this.innerHTML.includes('heart')?'<i class=\'fa-solid fa-heart\' style=\'color:var(--red)\'></i> Saved':'<i class=\'fa-regular fa-heart\'></i> Save'">
              <i class="fa-regular fa-heart"></i> Save
            </button>
            <button class="hc-book-btn" onclick="event.stopPropagation();openDetail('${h.id}')">View Deal</button>
          </div>
        </div>
      </div>
    </div>`).join('') ||
    '<div style="text-align:center;padding:3rem;color:var(--text-muted);">No hotels match your filters.</div>';
}

function setSort(el, type) {
  document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  if (type === 'price')    hotels.sort((a, b) => a.price - b.price);
  else if (type === 'score')    hotels.sort((a, b) => b.score - a.score);
  else if (type === 'distance') hotels.sort((a, b) => parseFloat(a.loc) - parseFloat(b.loc));
  else hotels.sort((a, b) => b.featured - a.featured);
  renderHotels();
}

function setPriceFilter(v) {
  maxPriceFilter = parseInt(v);
  document.getElementById('price-lbl').textContent = '$' + v;
  renderHotels();
}

function toggleStar(el, v) {
  document.querySelectorAll('.star-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active'); starFilter = v; renderHotels();
}

function resetFilters() {
  maxPriceFilter = 600; starFilter = 'all';
  document.querySelector('input[type=range]').value = 600;
  document.getElementById('price-lbl').textContent = '$600';
  document.querySelectorAll('.star-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
  renderHotels();
}


/* -----------------------------------------------------------------
   DETAIL MODAL
----------------------------------------------------------------- */
let dmIdx = 0, dmTotal = 0, currentHotel = null;

function openDetail(hid) {
  currentHotel = hotels.find(h => h.id === hid);
  if (!currentHotel) return;
  document.getElementById('dm-name').textContent      = currentHotel.name;
  document.getElementById('dm-score').textContent     = currentHotel.score;
  document.getElementById('dm-score-lbl').textContent = currentHotel.scoreLbl;
  document.getElementById('dm-score-cnt').textContent = currentHotel.reviews.toLocaleString() + ' reviews';
  document.getElementById('dm-rev-score').textContent = currentHotel.score;
  document.getElementById('dbs-amount').textContent   = '$' + currentHotel.price;
  dmIdx = 0; dmTotal = currentHotel.imgs.length;
  document.getElementById('dm-track').innerHTML = currentHotel.imgs
    .map(s => `<div class="dm-slide"><img src="${s}" alt="${currentHotel.name}" onerror="this.style.background='#1E293B'"></div>`)
    .join('');
  renderDmDots(); updateDmGallery();
  document.querySelectorAll('.dm-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  document.querySelectorAll('.dm-tc').forEach((c, i) => c.classList.toggle('active', i === 0));
  document.getElementById('detail-overlay').classList.add('active');
}

function closeDetail() { document.getElementById('detail-overlay').classList.remove('active'); }

function dmSlide(d) {
  dmIdx = Math.max(0, Math.min(dmTotal - 1, dmIdx + d));
  updateDmGallery(); renderDmDots();
}

function updateDmGallery() {
  document.getElementById('dm-track').style.transform = `translateX(${-dmIdx * 100}%)`;
  document.getElementById('dm-count').textContent = (dmIdx + 1) + ' / ' + dmTotal;
}

function renderDmDots() {
  document.getElementById('dm-dots').innerHTML = Array.from({ length: dmTotal }, (_, i) =>
    `<div class="dm-dot${i === dmIdx ? ' active' : ''}" onclick="dmIdx=${i};updateDmGallery();renderDmDots()"></div>`
  ).join('');
}

function switchTab(el, id) {
  document.querySelectorAll('.dm-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.dm-tc').forEach(c => c.classList.remove('active'));
  document.getElementById('dtc-' + id).classList.add('active');
}

function toggleDmFav() {
  const i = document.getElementById('dbs-fav-icon');
  const b = document.getElementById('dbs-fav');
  const saved = i.className.includes('regular');
  i.className = saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  i.style.color = saved ? 'var(--red)' : '';
  b.innerHTML = saved
    ? '<i id="dbs-fav-icon" class="fa-solid fa-heart" style="color:var(--red)"></i> Saved'
    : '<i id="dbs-fav-icon" class="fa-regular fa-heart"></i> Save';
}

document.getElementById('detail-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeDetail();
});


/* -----------------------------------------------------------------
   MAP (canvas)
----------------------------------------------------------------- */
const mapDests = [
  { name: 'Marina Bay Sands', price: '$320', x: 62, y: 55, color: '#3B6B9A', size: 20 },
  { name: 'Raffles',          price: '$480', x: 38, y: 35, color: '#C9A84C', size: 18 },
  { name: 'The Capitol',      price: '$215', x: 45, y: 28, color: '#22a05a', size: 14 },
  { name: 'Capella',          price: '$390', x: 55, y: 78, color: '#3B6B9A', size: 16 },
];

function initMap() {
  const area   = document.getElementById('map-area'); if (!area) return;
  const canvas = document.getElementById('map-canvas');
  canvas.width  = area.offsetWidth;
  canvas.height = area.offsetHeight;
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#D6D0C4'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#B8CDDC';
  ctx.beginPath(); ctx.ellipse(w*.55, h*.6,  w*.25, h*.2,   0.2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*.2,  h*.7,  w*.15, h*.15, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#C8C0B0';
  [[w*.1,h*.2,w*.4,h*.35],[w*.5,h*.1,w*.35,h*.45],[w*.3,h*.6,w*.2,h*.2]].forEach(([x,y,bw,bh])=>{
    ctx.beginPath(); ctx.ellipse(x,y,bw,bh,0,0,Math.PI*2); ctx.fill();
  });
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += w/8) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y = 0; y < h; y += h/6) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
  [[w*.1,h*.3,w*.9,h*.5],[w*.3,h*.1,w*.4,h*.9],[w*.5,h*.2,w*.6,h*.8]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });
  mapDests.forEach(d => {
    const dot = document.createElement('div'); dot.className = 'map-dest-dot';
    dot.style.left = d.x + '%'; dot.style.top = d.y + '%';
    dot.innerHTML = `<div class="dot-pulse" style="width:${d.size}px;height:${d.size}px;"></div><div class="dot-circle" style="width:${d.size}px;height:${d.size}px;background:${d.color};"></div><div class="dot-price">${d.price}</div>`;
    area.appendChild(dot);
  });
}


/* =================================================================
   ELEVATOR BOOKING FLOW
   Triggered when "Book Now" is clicked inside the detail modal.
   Steps: 1-Dates  2-Room  3-Guests  4-Extras  5-Confirm
================================================================= */
let elevatorStep     = 1;
const ELEVATOR_TOTAL = 5;
const ELEVATOR_TITLES = ['Your Dates', 'Choose a Room', 'Guest Details', 'Add Extras', 'Review & Book'];

function openElevatorFlow() {
  closeDetail();
  elevatorStep = 1;
  buildElevatorModal();
  document.getElementById('elev-overlay').classList.add('active');
  renderElevatorStep();
  setTimeout(() => injectElevatorCSS(), 0);
}

function injectElevatorCSS() {
  if (document.getElementById('elev-style')) return;
  const s = document.createElement('style');
  s.id = 'elev-style';
  s.textContent = `
    #elev-overlay{position:fixed;inset:0;background:rgba(13,13,13,0.75);backdrop-filter:blur(6px);z-index:950;opacity:0;pointer-events:none;transition:opacity .3s;display:flex;justify-content:center;align-items:center;padding:1rem}
    #elev-overlay.active{opacity:1;pointer-events:all}
    .elev-modal{background:var(--surface);border:1px solid var(--border);border-radius:24px;width:100%;max-width:520px;max-height:92vh;overflow:hidden;display:flex;flex-direction:column;transform:translateY(24px);transition:transform .4s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 30px 80px rgba(0,0,0,0.5)}
    #elev-overlay.active .elev-modal{transform:translateY(0)}
    .elev-shaft{display:flex;align-items:center;gap:1rem;padding:1.2rem 1.5rem;background:linear-gradient(135deg,#1E293B,#0F172A);border-radius:24px 24px 0 0;position:relative;overflow:hidden;border-bottom:1px solid var(--border)}
    .elev-shaft::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.03) 40px,rgba(255,255,255,0.03) 41px);pointer-events:none}
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
    .elev-room-list{display:flex;flex-direction:column;gap:.7rem}
    .elev-room-opt{border:2px solid var(--border);border-radius:16px;padding:1rem 1.2rem;cursor:pointer;transition:all .2s;background:var(--surface);display:flex;align-items:center;gap:1rem}
    .elev-room-opt:hover{border-color:var(--purple);transform:translateY(-1px)}
    .elev-room-opt.active{border-color:var(--purple);background:rgba(155,114,203,0.08);box-shadow:0 4px 16px rgba(155,114,203,0.2)}
    .elev-room-icon{width:46px;height:46px;border-radius:12px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
    .elev-room-name{font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;color:white;margin-bottom:.2rem}
    .elev-room-feats{font-size:.72rem;color:var(--text-muted)}
    .elev-room-price{font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:700;color:white;margin-left:auto;flex-shrink:0}
    .elev-radio{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .elev-room-opt.active .elev-radio{border-color:var(--purple);background:var(--purple)}
    .elev-room-opt.active .elev-radio::after{content:'';width:6px;height:6px;border-radius:50%;background:white}
    .elev-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
    .elev-field{display:flex;flex-direction:column;gap:.3rem}
    .elev-field.full{grid-column:1/-1}
    .elev-field label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted)}
    .elev-field input,.elev-field select{border:1.5px solid var(--border);border-radius:10px;padding:.65rem .9rem;font-family:'Roboto',sans-serif;font-size:.9rem;color:white;background:var(--bg);outline:none;transition:all .2s}
    .elev-field input:focus,.elev-field select:focus{border-color:var(--purple);box-shadow:0 0 0 3px rgba(155,114,203,0.15)}
    .elev-field input.filled{border-color:rgba(34,160,90,0.5);background:rgba(34,160,90,0.04)}
    .elev-autofill{display:flex;align-items:center;gap:.4rem;background:rgba(155,114,203,0.1);border:1px solid rgba(155,114,203,0.3);color:#c4b5fd;border-radius:20px;padding:.35rem .9rem;font-size:.8rem;font-weight:600;cursor:pointer;font-family:'Roboto', sans-serif;transition:all .2s;margin-bottom:1rem}
    .elev-autofill:hover{background:rgba(155,114,203,0.2)}
    .elev-extra-grid{display:flex;flex-direction:column;gap:.6rem}
    .elev-extra{border:2px solid var(--border);border-radius:14px;padding:.9rem 1rem;display:flex;align-items:center;gap:.9rem;cursor:pointer;transition:all .2s;background:var(--surface)}
    .elev-extra:hover{border-color:var(--purple)}
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
    .elev-btn-back:hover{background:var(--border)}
    .elev-btn-next{flex:1;background:var(--gradient);color:white;border:none;border-radius:50px;padding:.85rem 1.5rem;font-size:1rem;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;box-shadow:0 8px 24px rgba(155,114,203,0.3)}
    .elev-btn-next:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(155,114,203,0.4)}
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
        <div class="elev-panel active" id="ep-1">
          <div class="elev-section-title">When are you staying?</div>
          <div class="elev-date-row">
            <div class="elev-date-box active"><div class="elev-date-lbl">Check-in</div><div class="elev-date-val" id="elev-cin">14 May</div></div>
            <div class="elev-date-box"><div class="elev-date-lbl">Check-out</div><div class="elev-date-val" id="elev-cout">25 May</div></div>
          </div>
          <div class="elev-nights-badge">✦ 11 nights selected</div>
          <p style="font-size:.82rem;color:var(--text-muted);line-height:1.6;">Dates are pre-filled from your search. Adjust them above or continue to choose your room.</p>
        </div>
        <div class="elev-panel" id="ep-2">
          <div class="elev-section-title">Select your room</div>
          <div class="elev-room-list">
            <div class="elev-room-opt active" onclick="elevSelectRoom(this,'Deluxe City View','$320/night')">
              <div class="elev-room-icon">🏙️</div>
              <div><div class="elev-room-name">Deluxe – City View</div><div class="elev-room-feats">1 King · 32m² · Free WiFi · Non-refundable</div></div>
              <div class="elev-room-price">$320</div>
              <div class="elev-radio"></div>
            </div>
            <div class="elev-room-opt" onclick="elevSelectRoom(this,'Premier Suite Bay View','$580/night')">
              <div class="elev-room-icon">🌊</div>
              <div><div class="elev-room-name">Premier Suite – Bay View</div><div class="elev-room-feats">1 King · 55m² · Pool · Breakfast · Free cancel</div></div>
              <div class="elev-room-price">$580</div>
              <div class="elev-radio"></div>
            </div>
            <div class="elev-room-opt" onclick="elevSelectRoom(this,'Garden Studio','$195/night')">
              <div class="elev-room-icon">🌿</div>
              <div><div class="elev-room-name">Garden Studio – Pool</div><div class="elev-room-feats">2 Twin · 28m² · Garden View · Pay at property</div></div>
              <div class="elev-room-price">$195</div>
              <div class="elev-radio"></div>
            </div>
          </div>
        </div>
        <div class="elev-panel" id="ep-3">
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
        <div class="elev-panel" id="ep-4">
          <div class="elev-section-title">Enhance your stay</div>
          <div class="elev-extra-grid">
            <div class="elev-extra active" onclick="this.classList.toggle('active')">
              <div class="elev-extra-icon">🍳</div>
              <div><div class="elev-extra-name">Daily Breakfast</div><div class="elev-extra-desc">For 2 guests · Full buffet each morning</div></div>
              <div class="elev-extra-price">+$38/night</div>
              <div class="elev-chk"><i class="fa-solid fa-check"></i></div>
            </div>
            <div class="elev-extra" onclick="this.classList.toggle('active')">
              <div class="elev-extra-icon">🍾</div>
              <div><div class="elev-extra-name">Welcome Package</div><div class="elev-extra-desc">Champagne, chocolates & flowers on arrival</div></div>
              <div class="elev-extra-price">+$85</div>
              <div class="elev-chk"><i class="fa-solid fa-check"></i></div>
            </div>
            <div class="elev-extra" onclick="this.classList.toggle('active')">
              <div class="elev-extra-icon">🚗</div>
              <div><div class="elev-extra-name">Airport Transfer</div><div class="elev-extra-desc">Private car · Changi Airport ↔ Hotel</div></div>
              <div class="elev-extra-price">+$65</div>
              <div class="elev-chk"><i class="fa-solid fa-check"></i></div>
            </div>
            <div class="elev-extra" onclick="this.classList.toggle('active')">
              <div class="elev-extra-icon">💆</div>
              <div><div class="elev-extra-name">Spa Credit</div><div class="elev-extra-desc">$150 credit at Banyan Tree Spa</div></div>
              <div class="elev-extra-price">+$120</div>
              <div class="elev-chk"><i class="fa-solid fa-check"></i></div>
            </div>
          </div>
        </div>
        <div class="elev-panel" id="ep-5">
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

let elevSelectedRoom = 'Deluxe City View';
let elevSelectedRoomPrice = '$320/night';

function elevSelectRoom(el, name, price) {
  document.querySelectorAll('.elev-room-opt').forEach(r => r.classList.remove('active'));
  el.classList.add('active');
  elevSelectedRoom = name;
  elevSelectedRoomPrice = price;
}

const ELEV_FLOOR_NAMES = ['Dates', 'Room', 'Guests', 'Extras', 'Review'];

function renderElevatorFloors() {
  const container = document.getElementById('elev-floors');
  if (!container) return;
  const total = ELEVATOR_TOTAL;
  container.innerHTML = Array.from({ length: total }, (_, i) => {
    const floorNum = total - i;
    const isDone   = floorNum < elevatorStep;
    const isActive = floorNum === elevatorStep;
    return `
      <div class="elev-floor-row">
        <span class="elev-floor-num">${floorNum}</span>
        <div class="elev-floor-bar${isActive ? ' active' : isDone ? ' done' : ''}"></div>
        <span class="elev-floor-label${isActive ? ' active' : ''}">${ELEV_FLOOR_NAMES[floorNum - 1]}</span>
      </div>`;
  }).join('');
}

function renderElevatorStep() {
  document.querySelectorAll('.elev-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === elevatorStep);
  });
  const car = document.getElementById('elev-car');
  if (car) { car.classList.remove('going-up'); void car.offsetWidth; car.classList.add('going-up'); }
  renderElevatorFloors();
  const backBtn = document.getElementById('elev-back');
  const nextBtn = document.getElementById('elev-next');
  if (backBtn) backBtn.style.display = elevatorStep > 1 ? 'block' : 'none';
  if (nextBtn) nextBtn.textContent   = elevatorStep === ELEVATOR_TOTAL ? '✦ Confirm Booking' : 'Next floor ↑';
  if (elevatorStep === ELEVATOR_TOTAL) buildElevSummary();
}

function buildElevSummary() {
  const box = document.getElementById('elev-summary-box');
  if (!box || !currentHotel) return;
  const fname = document.getElementById('ef-fname')?.value || '—';
  const lname = document.getElementById('ef-lname')?.value || '—';
  const extras = [...document.querySelectorAll('.elev-extra.active')];
  const extrasTotal = extras.reduce((sum, e) => {
    const txt = e.querySelector('.elev-extra-price').textContent;
    const num = parseInt(txt.replace(/[^0-9]/g, '')) || 0;
    const isPerNight = txt.includes('night');
    return sum + (isPerNight ? num * 11 : num);
  }, 0);
  const roomPrice = parseInt(elevSelectedRoomPrice.replace(/[^0-9]/g, '')) || 320;
  const total = (roomPrice * 11) + extrasTotal;
  box.innerHTML = `
    <div class="elev-sum-hotel">
      <div class="elev-sum-img"><img src="${currentHotel.imgs[0]}" alt="${currentHotel.name}" onerror="this.style.background='#1E293B'"></div>
      <div><div class="elev-sum-name">${currentHotel.name}</div><div class="elev-sum-loc">${currentHotel.loc}</div></div>
    </div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Guest</span><span class="elev-sum-val">${(fname + ' ' + lname).trim()}</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Dates</span><span class="elev-sum-val">14 May – 25 May · 11 nights</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Room</span><span class="elev-sum-val">${elevSelectedRoom}</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Extras</span><span class="elev-sum-val">${extras.map(e => e.querySelector('.elev-extra-name').textContent).join(', ') || 'None'}</span></div>
    <div class="elev-sum-row"><span class="elev-sum-lbl">Total</span><span class="elev-sum-val">$${total.toLocaleString()}</span></div>`;
}

function elevAutofill() {
  const fields = [
    ['ef-fname', 'Sarah'], ['ef-lname', 'Mitchell'],
    ['ef-email', 'sarah.mitchell@email.com'], ['ef-phone', '+32 478 123 456']
  ];
  fields.forEach(([id, val], i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) { el.value = val; el.classList.add('filled'); }
    }, i * 100);
  });
  setTimeout(() => { elevatorStep++; renderElevatorStep(); }, fields.length * 100 + 400);
}

function elevNext() {
  if (elevatorStep === ELEVATOR_TOTAL) {
    closeElevator();
    openDestinationReveal();
    return;
  }
  elevatorStep++;
  renderElevatorStep();
}

function elevPrev() {
  if (elevatorStep > 1) { elevatorStep--; renderElevatorStep(); }
}

function closeElevator() {
  const el = document.getElementById('elev-overlay');
  if (el) el.classList.remove('active');
}


/* =================================================================
   DESTINATION REVEAL CINEMATIC
   Rainy home → card flip → 3 destinations → neon city title
================================================================= */
function openDestinationReveal() {
  injectRevealCSS();
  buildRevealDOM();
  setTimeout(() => {
    document.getElementById('reveal-overlay').classList.add('active');
    runRevealSequence();
  }, 100);
}

function injectRevealCSS() {
  if (document.getElementById('reveal-style')) return;
  const s = document.createElement('style');
  s.id = 'reveal-style';
  s.textContent = `
    #reveal-overlay{position:fixed;inset:0;z-index:1000;background:var(--bg);opacity:0;pointer-events:none;transition:opacity .5s;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;font-family:'Outfit', sans-serif}
    #reveal-overlay.active{opacity:1;pointer-events:all}

    /* RAIN SCENE */
    .rv-scene{position:absolute;inset:0;opacity:0;transition:opacity .8s}
    .rv-scene.show{opacity:1}
    .rain-bg{position:absolute;inset:0;background:var(--bg)}
    .rain-window{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:340px;height:220px;background:var(--surface);border-radius:12px;border:2px solid rgba(255,255,255,0.08);overflow:hidden;box-shadow:0 0 60px rgba(0,0,0,0.6)}
    .rain-drops{position:absolute;inset:0;pointer-events:none}
    .rain-drop{position:absolute;width:1px;background:linear-gradient(to bottom,transparent,rgba(174,214,241,0.6));border-radius:1px;animation:rainFall linear infinite}
    @keyframes rainFall{0%{transform:translateY(-100px) scaleY(0)}20%{transform:translateY(-100px) scaleY(1)}100%{transform:translateY(300px) scaleY(1)}}
    .rain-street{position:absolute;bottom:0;left:0;right:0;height:70px;background:linear-gradient(180deg,#1a2535,#111820)}
    .rain-street-light{position:absolute;width:120px;height:2px;border-radius:1px;bottom:50px;animation:streetFlicker 4s ease-in-out infinite}
    .street-light-1{left:20px;background:linear-gradient(90deg,rgba(255,220,100,0),rgba(255,220,100,0.3),rgba(255,220,100,0))}
    .street-light-2{right:20px;background:linear-gradient(90deg,rgba(255,220,100,0),rgba(255,220,100,0.2),rgba(255,220,100,0))}
    @keyframes streetFlicker{0%,100%{opacity:1}45%{opacity:.6}50%{opacity:.9}}
    .rain-puddle{position:absolute;bottom:15px;border-radius:50%;background:rgba(174,214,241,0.1);animation:puddle 2s ease-out infinite}
    .puddle-1{left:80px;width:40px;height:8px;animation-delay:0s}
    .puddle-2{left:180px;width:28px;height:6px;animation-delay:.7s}
    .puddle-3{left:250px;width:34px;height:7px;animation-delay:1.3s}
    @keyframes puddle{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.15)}}
    .rain-text{position:absolute;top:24px;left:0;right:0;text-align:center;color:rgba(255,255,255,0.45);font-family:'Roboto', sans-serif;font-size:.78rem;font-weight:400;letter-spacing:.08em;text-transform:uppercase}
    .rain-home-label{position:absolute;bottom:82px;left:0;right:0;text-align:center;color:rgba(255,255,255,0.25);font-size:1.8rem;font-weight:600;letter-spacing:-.01em}
    .rain-city{position:absolute;top:50px;left:0;right:0;display:flex;justify-content:center;gap:6px;align-items:flex-end;height:80px}
    .rain-bldg{background:rgba(255,255,255,0.08);border-radius:3px 3px 0 0;flex-shrink:0}
    .rain-window-light{position:absolute;width:3px;height:3px;background:rgba(255,220,100,0.5);border-radius:1px;animation:winLights 3s ease-in-out infinite}
    @keyframes winLights{0%,100%{opacity:.5}50%{opacity:1}}

    /* CARD FLIP */
    .rv-flip-stage{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;height:200px;perspective:1000px;opacity:0;transition:opacity .4s}
    .rv-flip-stage.show{opacity:1}
    .rv-card{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 1.2s cubic-bezier(0.645,0.045,0.355,1.000)}
    .rv-card.flipped{transform:rotateY(180deg)}
    .rv-card-face{position:absolute;inset:0;border-radius:20px;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .rv-card-front{background:var(--surface-2);border:1px solid var(--border)}
    .rv-card-back{background:var(--gradient);transform:rotateY(180deg);border:1px solid rgba(201,168,76,0.3)}
    .rv-card-front-content{text-align:center;color:rgba(255,255,255,0.6);font-family:'Roboto',sans-serif}
    .rv-card-front-content i{font-size:2rem;display:block;margin-bottom:.5rem}
    .rv-card-front-content span{font-size:.85rem;font-weight:400;letter-spacing:.05em;text-transform:uppercase}
    .rv-card-back-content{text-align:center;color:#F1F5F9}
    .rv-card-back-content i{font-size:2.5rem;display:block;margin-bottom:.4rem}
    .rv-card-back-content span{font-size:1.1rem;font-weight:700;letter-spacing:.03em}

    /* DESTINATION CARDS */
    .rv-destinations{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;gap:1.2rem;opacity:0;transition:opacity .5s}
    .rv-destinations.show{opacity:1}
    .rv-dest-card{width:180px;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.4);transform:translateY(30px) scale(.9);opacity:0;transition:all .6s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;flex-shrink:0}
    .rv-dest-card.pop{transform:translateY(0) scale(1);opacity:1}
    .rv-dest-img{height:130px;position:relative;overflow:hidden}
    .rv-dest-img-bg{width:100%;height:100%;object-fit:cover}
    .rv-dest-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.5),transparent)}
    .rv-dest-info{padding:.75rem 1rem;background:var(--surface-2)}
    .rv-dest-name{font-size:1rem;font-weight:700;color:white;font-family:'Outfit',sans-serif;margin-bottom:.15rem}
    .rv-dest-vibe{font-size:.7rem;color:var(--text-muted);font-family:'Roboto', sans-serif;font-weight:400}
    .rv-dest-badge{position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.55);color:#fff;font-size:.6rem;font-weight:700;padding:.2rem .5rem;border-radius:6px;font-family:'Roboto', sans-serif;letter-spacing:.04em;text-transform:uppercase;backdrop-filter:blur(4px)}
    .rv-beach .rv-dest-info{background:linear-gradient(135deg,#1E293B,#273549)}
    .rv-winter .rv-dest-info{background:linear-gradient(135deg,#1E293B,#273549)}
    .rv-city .rv-dest-info{background:linear-gradient(135deg,#0d0d14,#1a1a2e)}
    .rv-city .rv-dest-name{color:white;font-family:'Outfit',sans-serif}
    .rv-city .rv-dest-vibe{color:rgba(255,255,255,0.5)}

    /* NEON TITLE */
    .rv-neon-stage{position:absolute;inset:0;background:linear-gradient(180deg,#05050a 0%,#0a0014 40%,#050010 100%);opacity:0;transition:opacity .8s;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}
    .rv-neon-stage.show{opacity:1}
    .rv-neon-skyline{position:absolute;bottom:0;left:0;right:0;height:160px;display:flex;align-items:flex-end;justify-content:center;gap:3px}
    .rv-neon-bldg{border-radius:3px 3px 0 0;position:relative;flex-shrink:0}
    .rv-neon-bldg::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:inherit;filter:blur(6px);opacity:.4;z-index:-1;border-radius:inherit}
    .rv-neon-bldg-win{position:absolute;width:3px;height:3px;border-radius:1px;animation:neonWin 2s ease-in-out infinite}
    @keyframes neonWin{0%,100%{opacity:.8}50%{opacity:.3}}
    .rv-neon-title{font-family:'Outfit', sans-serif;font-size:clamp(2.5rem,6vw,4.5rem);font-weight:700;text-align:center;letter-spacing:.04em;line-height:1;margin-bottom:.5rem;opacity:0;transform:scale(.8);transition:all .8s cubic-bezier(0.34,1.56,0.64,1);position:relative;z-index:10}
    .rv-neon-title.show{opacity:1;transform:scale(1)}
    .rv-neon-title .line1{display:block;background:linear-gradient(90deg,#ff6ee7,#c344ff,#6b8eff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:none;filter:drop-shadow(0 0 20px rgba(195,68,255,0.6))}
    .rv-neon-title .line2{display:block;background:linear-gradient(90deg,#fff7a0,#ffd700,#ff9500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 20px rgba(255,200,0,0.7))}
    .rv-neon-subtitle{font-family:'Roboto', sans-serif;font-size:.9rem;color:rgba(255,255,255,0.4);letter-spacing:.15em;text-transform:uppercase;opacity:0;transition:opacity .6s .4s;position:relative;z-index:10}
    .rv-neon-subtitle.show{opacity:1}
    .rv-neon-stars{position:absolute;inset:0;pointer-events:none;overflow:hidden}
    .rv-neon-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:neonStar 3s ease-in-out infinite}
    @keyframes neonStar{0%,100%{opacity:.2}50%{opacity:.9}}
    .rv-laser{position:absolute;height:1px;width:200px;background:linear-gradient(90deg,transparent,rgba(195,68,255,0.6),transparent);animation:laserSweep 4s linear infinite;pointer-events:none}
    @keyframes laserSweep{0%{left:-200px;top:30%}100%{left:100%;top:70%}}
    .rv-laser-2{animation:laserSweep2 5s linear infinite 1.5s;background:linear-gradient(90deg,transparent,rgba(255,200,0,0.4),transparent)}
    @keyframes laserSweep2{0%{right:-200px;left:auto;top:60%}100%{right:100%;left:auto;top:25%}}

    /* SKIP + CTA */
    .rv-skip{position:absolute;bottom:2rem;right:2rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);padding:.5rem 1.1rem;border-radius:50px;font-family:'Roboto', sans-serif;font-size:.8rem;cursor:pointer;transition:all .2s;backdrop-filter:blur(4px);z-index:20}
    .rv-skip:hover{background:rgba(255,255,255,0.15);color:#fff}
    .rv-cta{position:absolute;bottom:3.5rem;left:50%;transform:translateX(-50%);background:var(--gradient);color:white;border:none;border-radius:50px;padding:.85rem 2.5rem;font-family:'Roboto', sans-serif;font-size:1rem;font-weight:700;cursor:pointer;transition:all .3s cubic-bezier(0.34,1.56,0.64,1);opacity:0;z-index:20;box-shadow:0 8px 32px rgba(155,114,203,0.4);white-space:nowrap}
    .rv-cta.show{opacity:1;transform:translateX(-50%) translateY(0)}
    .rv-cta:hover{transform:translateX(-50%) translateY(-3px);box-shadow:0 14px 40px rgba(155,114,203,0.5)}
  `;
  document.head.appendChild(s);
}

function buildRevealDOM() {
  if (document.getElementById('reveal-overlay')) {
    document.getElementById('reveal-overlay').remove();
  }
  const el = document.createElement('div');
  el.id = 'reveal-overlay';

  // Generate rain drops
  let rainDrops = '';
  for (let i = 0; i < 40; i++) {
    const left     = Math.random() * 100;
    const duration = 0.4 + Math.random() * 0.6;
    const delay    = Math.random() * 2;
    const height   = 12 + Math.random() * 20;
    rainDrops += `<div class="rain-drop" style="left:${left}%;height:${height}px;animation-duration:${duration}s;animation-delay:${delay}s"></div>`;
  }

  // Window lights in rain buildings
  let rainBldgs = '';
  const bldgData = [[14,55],[22,70],[18,45],[30,80],[16,60],[24,65],[20,50]];
  bldgData.forEach(([w,h]) => {
    let wins = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < Math.floor(w/7); c++) {
        if (Math.random() > 0.4) {
          wins += `<div class="rv-neon-bldg-win" style="top:${10+r*14}px;left:${4+c*7}px;background:rgba(255,220,100,0.6);animation-delay:${Math.random()*3}s"></div>`;
        }
      }
    }
    rainBldgs += `<div class="rain-bldg" style="width:${w}px;height:${h}px">${wins}</div>`;
  });

  // Neon skyline buildings
  const neonBldgs = [
    { w:18,h:80,  color:'#ff00ff' },
    { w:28,h:120, color:'#00ffff' },
    { w:22,h:95,  color:'#ffcc00' },
    { w:35,h:140, color:'#ff3399' },
    { w:15,h:70,  color:'#00ff88' },
    { w:40,h:160, color:'#cc44ff' },
    { w:25,h:110, color:'#ff6600' },
    { w:20,h:85,  color:'#00ccff' },
    { w:30,h:130, color:'#ff0088' },
    { w:18,h:75,  color:'#ffff00' },
    { w:38,h:145, color:'#8833ff' },
    { w:22,h:95,  color:'#00ffcc' },
    { w:16,h:65,  color:'#ff4400' },
    { w:28,h:115, color:'#4488ff' },
    { w:20,h:88,  color:'#ff44bb' },
  ];
  let neonSkyline = neonBldgs.map(b => {
    let wins = '';
    for (let i = 0; i < 6; i++) {
      wins += `<div class="rv-neon-bldg-win" style="top:${8+i*14}px;left:${3+Math.floor(i/2)*6}px;background:${b.color};opacity:.7;animation-delay:${i*.3}s"></div>`;
    }
    return `<div class="rv-neon-bldg" style="width:${b.w}px;height:${b.h}px;background:${b.color}22;border-top:2px solid ${b.color};">${wins}</div>`;
  }).join('');

  // Neon stars
  let neonStars = '';
  for (let i = 0; i < 60; i++) {
    neonStars += `<div class="rv-neon-star" style="left:${Math.random()*100}%;top:${Math.random()*70}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*2}s"></div>`;
  }

  el.innerHTML = `
    <div class="rv-scene" id="rv-rain">
      <div class="rain-bg"></div>
      <div class="rain-window">
        <div class="rain-drops">${rainDrops}</div>
        <div class="rain-city">${rainBldgs}</div>
        <div class="rain-street">
          <div class="rain-street-light street-light-1"></div>
          <div class="rain-street-light street-light-2"></div>
          <div class="rain-puddle puddle-1"></div>
          <div class="rain-puddle puddle-2"></div>
          <div class="rain-puddle puddle-3"></div>
        </div>
        <div class="rain-text">Brussels, Belgium · Now</div>
        <div class="rain-home-label">🌧️</div>
      </div>
    </div>

    <div class="rv-flip-stage" id="rv-flip">
      <div class="rv-card" id="rv-card">
        <div class="rv-card-face rv-card-front">
          <div class="rv-card-front-content">
            <i class="fa-solid fa-map-location-dot"></i>
            <span>Your next destination</span>
          </div>
        </div>
        <div class="rv-card-face rv-card-back">
          <div class="rv-card-back-content">
            <i class="fa-solid fa-sun"></i>
            <span>It could be here ✦</span>
          </div>
        </div>
      </div>
    </div>

    <div class="rv-destinations" id="rv-dests">
      <div class="rv-dest-card rv-beach" onclick="selectRevealDest(this)">
        <div class="rv-dest-img">
          <img class="rv-dest-img-bg" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" alt="Beach">
          <div class="rv-dest-overlay"></div>
          <div class="rv-dest-badge">☀️ Summer</div>
        </div>
        <div class="rv-dest-info">
          <div class="rv-dest-name">Tropical Beach</div>
          <div class="rv-dest-vibe">Bali · Maldives · Phuket</div>
        </div>
      </div>
      <div class="rv-dest-card rv-winter" onclick="selectRevealDest(this)">
        <div class="rv-dest-img">
          <img class="rv-dest-img-bg" src="https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&q=80" alt="Winter">
          <div class="rv-dest-overlay"></div>
          <div class="rv-dest-badge">❄️ Winter</div>
        </div>
        <div class="rv-dest-info">
          <div class="rv-dest-name">Winterland</div>
          <div class="rv-dest-vibe">Lapland · Zermatt · Banff</div>
        </div>
      </div>
      <div class="rv-dest-card rv-city" onclick="selectRevealDest(this)">
        <div class="rv-dest-img">
          <img class="rv-dest-img-bg" src="https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=400&q=80" alt="City">
          <div class="rv-dest-overlay"></div>
          <div class="rv-dest-badge">🌆 Neon City</div>
        </div>
        <div class="rv-dest-info">
          <div class="rv-dest-name">City of Lights</div>
          <div class="rv-dest-vibe">Las Vegas · Shanghai · Tokyo</div>
        </div>
      </div>
    </div>

    <div class="rv-neon-stage" id="rv-neon">
      <div class="rv-neon-stars">${neonStars}</div>
      <div class="rv-laser rv-laser-2"></div>
      <div class="rv-laser"></div>
      <div class="rv-neon-title" id="rv-neon-title">
        <span class="line1">Where Lights</span>
        <span class="line2">Never Sleep</span>
      </div>
      <div class="rv-neon-subtitle" id="rv-neon-sub">Las Vegas · Shanghai · Tokyo · Dubai</div>
      <div class="rv-neon-skyline">${neonSkyline}</div>
      <button class="rv-cta" id="rv-cta" onclick="closeReveal()">
        ✦ Book Your Escape Now
      </button>
    </div>

    <button class="rv-skip" onclick="closeReveal()">Skip <i class="fa-solid fa-forward-step" style="margin-left:4px"></i></button>
  `;
  document.body.appendChild(el);
}

function runRevealSequence() {
  // Step 1: Rain scene
  setTimeout(() => document.getElementById('rv-rain').classList.add('show'), 200);

  // Step 2: Fade rain → card flip
  setTimeout(() => {
    document.getElementById('rv-rain').classList.remove('show');
    document.getElementById('rv-flip').classList.add('show');
  }, 2800);

  // Flip the card
  setTimeout(() => {
    document.getElementById('rv-card').classList.add('flipped');
  }, 3400);

  // Step 3: Cards appear
  setTimeout(() => {
    document.getElementById('rv-flip').classList.remove('show');
    document.getElementById('rv-dests').classList.add('show');
    const cards = document.querySelectorAll('.rv-dest-card');
    cards.forEach((c, i) => setTimeout(() => c.classList.add('pop'), i * 180));
  }, 4800);

  // Step 4: Neon city
  setTimeout(() => {
    document.getElementById('rv-dests').classList.remove('show');
    document.getElementById('rv-neon').classList.add('show');
    setTimeout(() => document.getElementById('rv-neon-title').classList.add('show'), 400);
    setTimeout(() => document.getElementById('rv-neon-sub').classList.add('show'), 600);
    setTimeout(() => document.getElementById('rv-cta').classList.add('show'), 1200);
  }, 7500);
}

function selectRevealDest(card) {
  document.querySelectorAll('.rv-dest-card').forEach(c => c.style.transform = '');
  card.style.transform = 'translateY(-8px) scale(1.04)';
  card.style.boxShadow = '0 16px 40px rgba(155,114,203,0.4)';
  setTimeout(() => {
    document.getElementById('rv-dests').classList.remove('show');
    document.getElementById('rv-neon').classList.add('show');
    setTimeout(() => document.getElementById('rv-neon-title').classList.add('show'), 300);
    setTimeout(() => document.getElementById('rv-neon-sub').classList.add('show'), 500);
    setTimeout(() => document.getElementById('rv-cta').classList.add('show'), 900);
  }, 600);
}

function closeReveal() {
  const el = document.getElementById('reveal-overlay');
  if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }
}


/* -----------------------------------------------------------------
   WIRE "Book Now" button in the detail modal to elevator flow
----------------------------------------------------------------- */
document.addEventListener('click', e => {
  if (e.target.classList.contains('dbs-book') || e.target.closest('.dbs-book')) {
    e.stopPropagation();
    openElevatorFlow();
  }
});


/* -----------------------------------------------------------------
   INIT
----------------------------------------------------------------- */
renderHotels();
window.addEventListener('load', () => { initMap(); });
setTimeout(initMap, 100);
