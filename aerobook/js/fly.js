/* =================================================================
   AeroFly — fly.js
   All interactivity for the main flight booking page (index.html)
================================================================= */


/* -----------------------------------------------------------------
   NAV — hamburger dropdown
----------------------------------------------------------------- */
const menuToggle  = document.getElementById('menuToggle');
const navDropdown = document.getElementById('navDropdown');

menuToggle.addEventListener('click', e => {
  e.stopPropagation();
  navDropdown.classList.toggle('active');
});

document.addEventListener('click', () => {
  navDropdown.classList.remove('active');
  closeDatePicker();
  closeTravelersPicker();
});


/* -----------------------------------------------------------------
   DATE PICKER
----------------------------------------------------------------- */
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const today = new Date();
today.setHours(0, 0, 0, 0);

let dpYear      = today.getFullYear();
let dpMonth     = today.getMonth();
let dpStart     = null;
let dpEnd       = null;
let dpSelecting = 0; // 0 = picking start, 1 = picking end

function toggleDatePicker(e) {
  e.stopPropagation();
  const datePop     = document.getElementById('date-popup');
  const travelerPop = document.getElementById('travelers-popup');
  travelerPop.classList.remove('active');
  if (datePop.classList.contains('active')) {
    datePop.classList.remove('active');
    return;
  }
  renderCalendar();
  datePop.classList.add('active');
}

function closeDatePicker() {
  document.getElementById('date-popup').classList.remove('active');
}

function dpNav(dir) {
  dpMonth += dir;
  if (dpMonth > 11) { dpMonth = 0;  dpYear++; }
  if (dpMonth < 0)  { dpMonth = 11; dpYear--; }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById('dp-month-label').textContent = MONTHS[dpMonth] + ' ' + dpYear;

  const firstDay    = new Date(dpYear, dpMonth, 1).getDay();
  const offset      = (firstDay === 0 ? 6 : firstDay - 1); // Monday = 0
  const daysInMonth = new Date(dpYear, dpMonth + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < offset; i++) {
    html += `<button class="dp-day empty" disabled></button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(dpYear, dpMonth, d);
    let cls = 'dp-day';
    if (date < today) {
      cls += ' past';
    } else {
      if (dpStart && dpEnd && date > dpStart && date < dpEnd) cls += ' in-range';
      if (dpStart && date.getTime() === dpStart.getTime()) cls += ' range-start';
      if (dpEnd   && date.getTime() === dpEnd.getTime())   cls += ' range-end';
    }
    if (date.getTime() === today.getTime()) cls += ' today';

    html += `<button class="${cls}" onclick="dpPickDay(${dpYear},${dpMonth},${d})">${d}</button>`;
  }
  document.getElementById('dp-grid').innerHTML = html;
  updateDpFooter();
}

function dpPickDay(y, m, d) {
  const date = new Date(y, m, d);
  if (date < today) return;

  if (dpSelecting === 0 || dpEnd) {
    dpStart     = date;
    dpEnd       = null;
    dpSelecting = 1;
  } else {
    if (date < dpStart) { dpEnd = dpStart; dpStart = date; }
    else                { dpEnd = date; }
    dpSelecting = 0;
  }
  renderCalendar();
}

function updateDpFooter() {
  const hint = document.getElementById('dp-hint');
  const sel  = document.getElementById('dp-selection-text');
  if (!dpStart) {
    hint.textContent = 'Select departure date';
    sel.textContent  = 'No dates selected';
  } else if (!dpEnd) {
    hint.textContent = 'Now select return date';
    sel.textContent  = fmtDate(dpStart) + ' → ?';
  } else {
    hint.textContent = '';
    sel.textContent  = fmtDate(dpStart) + ' – ' + fmtDate(dpEnd);
  }
}

function fmtDate(d) {
  return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3);
}

function confirmDates() {
  if (dpStart) {
    const txt = dpEnd
      ? fmtDate(dpStart) + ' – ' + fmtDate(dpEnd)
      : fmtDate(dpStart);
    document.getElementById('dates-display').textContent = txt;
  }
  closeDatePicker();
}


/* -----------------------------------------------------------------
   TRAVELERS PICKER
----------------------------------------------------------------- */
let travelers = { adult: 1, kid: 0, baby: 0 };
let tClass    = 'Economy';

function toggleTravelersPicker(e) {
  e.stopPropagation();
  const pop = document.getElementById('travelers-popup');
  closeDatePicker();
  if (pop.classList.contains('active')) {
    pop.classList.remove('active');
    return;
  }
  pop.classList.add('active');
  updateCounterBtns();
}

function closeTravelersPicker() {
  document.getElementById('travelers-popup').classList.remove('active');
}

function adjustTraveler(type, delta) {
  travelers[type] = Math.max(0, travelers[type] + delta);
  if (type === 'adult') travelers.adult = Math.max(1, travelers.adult);
  document.getElementById(type + '-count').textContent = travelers[type];
  updateCounterBtns();
}

function updateCounterBtns() {
  document.getElementById('adult-minus').disabled = travelers.adult <= 1;
  document.getElementById('kid-minus').disabled   = travelers.kid   <= 0;
  document.getElementById('baby-minus').disabled  = travelers.baby  <= 0;
}

function setTClass(el, cls) {
  document.querySelectorAll('.tclass-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  tClass = cls;
}

function confirmTravelers() {
  const parts = [];
  if (travelers.adult) parts.push(travelers.adult + ' Adult'  + (travelers.adult > 1 ? 's' : ''));
  if (travelers.kid)   parts.push(travelers.kid   + ' Child'  + (travelers.kid   > 1 ? 'ren' : ''));
  if (travelers.baby)  parts.push(travelers.baby  + ' Infant' + (travelers.baby  > 1 ? 's' : ''));

  document.getElementById('travelers-display').textContent = parts.join(', ') + ' · ' + tClass;
  document.getElementById('results-traveler-summary').textContent = parts.join(', ');
  closeTravelersPicker();
}


/* -----------------------------------------------------------------
   FILTER PANEL
----------------------------------------------------------------- */
let filterOpen = false;
let activeConn = 'any';
let maxPrice   = 1200;

function toggleFilter() {
  filterOpen = !filterOpen;
  document.getElementById('filter-panel').classList.toggle('open', filterOpen);
  document.getElementById('filter-toggle-btn').classList.toggle('active', filterOpen);
}

function toggleConnPill(el, val) {
  document.querySelectorAll('.conn-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  activeConn = val;
  applyFilters();
}

function updatePriceRange(v) {
  maxPrice = parseInt(v);
  document.getElementById('price-val').textContent = '$' + maxPrice.toLocaleString();
  applyFilters();
}

function resetFilters() {
  activeConn = 'any';
  maxPrice   = 1200;
  document.getElementById('price-range').value    = 1200;
  document.getElementById('price-val').textContent = '$1,200';
  document.querySelectorAll('.conn-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
  applyFilters();
}

function applyFilters() {
  document.querySelectorAll('.flight-card').forEach(card => {
    const price = parseInt(card.dataset.price || 0);
    const stops = card.dataset.stops || 'direct';
    let show = price <= maxPrice;
    if (activeConn === 'direct' && stops !== 'direct') show = false;
    if (activeConn === '1stop'  && stops === '2stop')  show = false;
    card.style.display = show ? '' : 'none';
  });
}


/* -----------------------------------------------------------------
   FLIGHT DATA & RENDERING
----------------------------------------------------------------- */
const flights = [
  {
    id: 0,
    airline: 'NovaFly',
    code: 'NV905',
    icon: 'fa-plane-departure',
    iconColor: '#4285F4',
    dep: '09:30 AM',
    arr: '06:15 AM',
    day: '+1',
    duration: '13h 45m',
    stops: 'Direct',
    stopsKey: 'direct',
    price: 845,
    plan: {
      events: [
        {
          type: 'dep',
          icon: 'fa-plane-departure',
          label: 'Depart Brussels Airport (BRU)',
          sub: 'Terminal 1 · Gate B22 · Aircraft: Boeing 787-9',
          time: '09:30',
          chips: ['Check-in closes 08:30', 'WiFi on board', 'Meal served']
        },
        {
          type: 'mid',
          icon: 'fa-cloud',
          label: 'Cruising at 37,000 ft',
          sub: 'Estimated route: BRU → Suez → Indian Ocean → SIN',
          time: '~11h over water',
          chips: []
        },
        {
          type: 'arr',
          icon: 'fa-plane-arrival',
          label: 'Arrive Singapore Changi (SIN)',
          sub: 'Terminal 3 · Gate C41 · Baggage belt 7',
          time: '06:15 (+1)',
          chips: ['On-time', 'Free SkyConnect WiFi zone', 'Transit hotel available']
        }
      ]
    }
  },
  {
    id: 1,
    airline: 'Galaxy Express',
    code: 'GS112',
    icon: 'fa-satellite',
    iconColor: '#9B72CB',
    dep: '11:00 AM',
    arr: '10:15 AM',
    day: '+1',
    duration: '16h 15m',
    stops: '1 Stop (DXB)',
    stopsKey: '1stop',
    price: 920,
    plan: {
      events: [
        {
          type: 'dep',
          icon: 'fa-plane-departure',
          label: 'Depart Brussels Airport (BRU)',
          sub: 'Terminal 2 · Gate A14 · Aircraft: Airbus A380',
          time: '11:00',
          chips: ['Check-in closes 09:45', 'Lounge access']
        },
        {
          type: 'layover',
          icon: 'fa-mug-hot',
          label: 'Layover — Dubai International (DXB)',
          sub: 'Terminal 3 · Gate D9 · 2h 30m connection time',
          time: '2h 30m layover',
          chips: ['Duty-free shopping', 'Connexions Lounge available', 'Re-boarding 17:45']
        },
        {
          type: 'arr',
          icon: 'fa-plane-arrival',
          label: 'Arrive Singapore Changi (SIN)',
          sub: 'Terminal 1 · Gate B18 · Baggage belt 12',
          time: '10:15 (+1)',
          chips: ['On-time expected', 'Taxi rank Level 1']
        }
      ]
    }
  }
];

function renderFlights() {
  document.getElementById('flights-list').innerHTML = flights.map((f, i) => `
    <div class="flight-card${i === 0 ? ' featured' : ''}" data-price="${f.price}" data-stops="${f.stopsKey}">
      <div class="card-top">
        <div class="airline-info">
          <div class="airline-logo">
            <i class="fa-solid ${f.icon}" style="color:${f.iconColor}"></i>
          </div>
          <div>
            <div class="airline-name">${f.airline}</div>
            <div class="flight-number">${f.code}</div>
          </div>
        </div>
        <div class="flight-route">
          <div><div class="time">${f.dep}</div></div>
          <div class="route-line">
            <div class="stops-badge">${f.stops}</div>
            <i class="fa-solid fa-arrow-right" style="margin:4px 0;"></i>
            <div class="duration">${f.duration}</div>
          </div>
          <div>
            <div class="time">${f.arr}<span style="display:block;">(${f.day})</span></div>
          </div>
        </div>
        <div class="price-section">
          <div class="price-label">Best Price</div>
          <div class="price">$${f.price}</div>
        </div>
      </div>

      <div class="flight-plan-section">
        <div class="plan-toggle" onclick="togglePlan(this, ${f.id})">
          <span><i class="fa-solid fa-map-location-dot" style="margin-right:5px;"></i> View Flight Plan</span>
          <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="plan-content" id="plan-${f.id}">
          <div class="plan-inner">
            ${buildTimeline(f.plan.events)}
          </div>
        </div>
      </div>

      <div class="card-bottom">
        <div class="amenities">
          <span><i class="fa-solid fa-wifi"></i> WiFi included</span>
          <span><i class="fa-solid fa-couch"></i> Extra Legroom</span>
        </div>
        <button class="card-book-btn" id="card-btn-${f.id}"
                onclick="openBookingModal(this, ${f.price})">Select Flight</button>
      </div>
    </div>
  `).join('');
}

function buildTimeline(events) {
  let html = '<div class="tl-wrap"><div class="tl-line"></div>';
  events.forEach(ev => {
    html += `
      <div class="tl-event">
        <div class="tl-dot ${ev.type}"><i class="fa-solid ${ev.icon}"></i></div>
        <div class="tl-body">
          <div class="tl-label">${ev.label}</div>
          <div class="tl-sub">${ev.sub}</div>
          <div class="tl-time-badge">${ev.time}</div>
          ${ev.chips.length
            ? `<div class="tl-chips">${ev.chips.map((c, ci) =>
                `<span class="tl-chip${ci === 0 ? ' highlight' : ''}">${c}</span>`
              ).join('')}</div>`
            : ''}
        </div>
      </div>`;
    if (ev.type === 'layover') {
      html += `<div class="layover-bar" style="margin-left:54px;">
        <i class="fa-solid fa-clock"></i>
        ${ev.time} · Gate change may apply — check airport screens
      </div>`;
    }
  });
  html += '</div>';
  return html;
}

function togglePlan(el, id) {
  el.classList.toggle('open');
  document.getElementById('plan-' + id).classList.toggle('active');
}


/* -----------------------------------------------------------------
   BOOKING MODAL — state
----------------------------------------------------------------- */
let currentStep       = 1;
const TOTAL_STEPS     = 5;
let activeFlightBtn   = null;
let activeFlightPrice = 845;
let selectedClass     = 'fc';
let selectedSeat      = null;
let passengerCount    = 1;
let insuranceOn       = true;

const STEP_TITLES = [
  'Passenger Details',
  'Choose Your Seat',
  'Meal Preference',
  'Baggage',
  'Review & Confirm'
];
const STEP_PCTS = [0, 25, 50, 75, 100];

function openBookingModal(btn, price) {
  activeFlightBtn   = btn;
  activeFlightPrice = price;
  currentStep       = 1;
  selectedSeat      = null;
  passengerCount    = 1;
  insuranceOn       = true;

  document.getElementById('passengers-container').innerHTML = buildPassengerBlock(1, true);
  renderStep();
  document.getElementById('modal-overlay').classList.add('active');
  setTimeout(() => selectClass('fc', true), 0);
}

function closeBookingModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function renderStep() {
  // Show/hide panels
  document.querySelectorAll('.step-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === currentStep);
  });

  // Header text
  document.getElementById('modal-step-title').textContent   = STEP_TITLES[currentStep - 1];
  document.getElementById('modal-step-counter').textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;

  // Progress bar + plane icon
  const pct = STEP_PCTS[currentStep - 1];
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPlane').style.left = Math.max(pct, 2) + '%';

  // Step pills
  document.querySelectorAll('.step-pill').forEach((p, i) => {
    p.classList.remove('active', 'done');
    if (i + 1 < currentStep)       p.classList.add('done');
    else if (i + 1 === currentStep) p.classList.add('active');
  });

  // Footer buttons
  document.getElementById('btn-back').style.display =
    currentStep > 1 ? 'block' : 'none';
  document.getElementById('btn-next').textContent =
    currentStep === TOTAL_STEPS ? '✈ Confirm & Pay' : 'Continue →';

  if (currentStep === TOTAL_STEPS) updateReview();
}

function nextStep() {
  if (currentStep === TOTAL_STEPS) {
    closeBookingModal();
    confirmAndAnimate();
    return;
  }
  currentStep++;
  renderStep();
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    renderStep();
  }
}


/* -----------------------------------------------------------------
   STEP 1 — Passenger form building & autofill
----------------------------------------------------------------- */
const PROFILE_DATA = {
  fname:       'Sarah',
  lname:       'Mitchell',
  dob:         '12 / 04 / 1989',
  nationality: 'Belgian',
  passport:    'BE••••••482'
};

function buildPassengerBlock(num, primary) {
  const tag   = primary ? '<span class="tag">Primary</span>' : '';
  const afBtn = primary
    ? `<button class="autofill-btn" onclick="autofill(${num})">
         <i class="fa-solid fa-bolt"></i> Autofill
       </button>`
    : '';

  return `
    <div class="passenger-block" id="p${num}-block">
      <div class="passenger-header">
        <div class="passenger-label">
          <i class="fa-solid fa-user"></i> Passenger ${num} ${tag}
        </div>
        ${afBtn}
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" id="p${num}-fname" placeholder="First name">
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" id="p${num}-lname" placeholder="Last name">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Date of Birth</label>
          <input type="text" id="p${num}-dob" placeholder="DD / MM / YYYY">
        </div>
        <div class="form-group">
          <label>Nationality</label>
          <input type="text" id="p${num}-nationality" placeholder="Nationality">
        </div>
      </div>
      <div class="form-row single">
        <div class="form-group">
          <label>Passport Number</label>
          <input type="text" id="p${num}-passport" placeholder="Passport number">
        </div>
      </div>
    </div>`;
}

function autofill(num) {
  const block = document.getElementById(`p${num}-block`);
  block.classList.remove('filling');
  void block.offsetWidth; // trigger reflow so animation restarts
  block.classList.add('filling');

  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (el) { el.value = val; el.classList.add('filled'); }
  };

  const fields = [
    [`p${num}-fname`,       PROFILE_DATA.fname],
    [`p${num}-lname`,       PROFILE_DATA.lname],
    [`p${num}-dob`,         PROFILE_DATA.dob],
    [`p${num}-nationality`, PROFILE_DATA.nationality],
    [`p${num}-passport`,    PROFILE_DATA.passport]
  ];

  fields.forEach(([id, val], i) => setTimeout(() => setField(id, val), i * 80));

  // Auto-advance to seat selection after fill completes
  setTimeout(() => {
    currentStep++;
    renderStep();
  }, fields.length * 80 + 400);
}

function addPassenger() {
  passengerCount++;
  const container = document.getElementById('passengers-container');
  const div = document.createElement('div');
  div.innerHTML = buildPassengerBlock(passengerCount, false);
  container.appendChild(div.firstElementChild);
}


/* -----------------------------------------------------------------
   STEP 2 — Class selector & seat grid
----------------------------------------------------------------- */
const CLASS_CONFIG = {
  fc: {
    label:       'First Class — Select your seat',
    rows:        4,
    cols:        ['A', 'B', '', 'C', 'D'],
    occupied:    ['1A', '2C', '3D'],
    benefitClass: 'fc-benefit',
    benefits: [
      { icon: 'fa-bed',            text: 'Lie-flat bed' },
      { icon: 'fa-champagne-glasses', text: 'Fine dining' },
      { icon: 'fa-suitcase',       text: '40kg luggage' },
      { icon: 'fa-star',           text: 'Lounge access' },
      { icon: 'fa-users-line',     text: 'Priority boarding' },
      { icon: 'fa-shield-halved',  text: 'Privacy partition' }
    ]
  },
  prem: {
    label:       'Premium — Select your seat',
    rows:        6,
    cols:        ['A', 'B', '', 'C', 'D', 'E', '', 'F', 'G'],
    occupied:    ['1A', '2E', '3F', '5B', '6G'],
    benefitClass: 'prem-benefit',
    benefits: [
      { icon: 'fa-recycle',    text: 'Extra recline' },
      { icon: 'fa-suitcase',   text: '30kg luggage' },
      { icon: 'fa-utensils',   text: 'Premium meals' },
      { icon: 'fa-users-line', text: 'Priority boarding' }
    ]
  },
  eco: {
    label:       'Economy — Select your seat',
    rows:        8,
    cols:        ['A', 'B', 'C', '', 'D', 'E', 'F'],
    occupied:    ['1A', '2B', '3E', '4F', '5A', '6C', '7D'],
    benefitClass: 'eco-benefit',
    benefits: [
      { icon: 'fa-suitcase', text: '23kg luggage' },
      { icon: 'fa-utensils', text: 'Standard meal' },
      { icon: 'fa-wifi',     text: 'WiFi included' }
    ]
  }
};

function selectClass(cls, silent) {
  selectedClass = cls;
  selectedSeat  = null;

  // Highlight active class card
  document.querySelectorAll('.class-card').forEach(c => {
    c.classList.toggle('active', c.classList.contains(cls));
  });

  renderSeatGrid(cls);
  renderBenefits(cls);
}

function renderSeatGrid(cls) {
  const cfg   = CLASS_CONFIG[cls];
  const isFC  = cls === 'fc';
  const seatW = isFC ? 34 : 30;

  document.getElementById('seat-grid-label').textContent = cfg.label;

  // Column label row
  let html = '<div class="seat-col-labels">';
  cfg.cols.forEach(c => {
    html += c === ''
      ? `<div style="width:12px;"></div>`
      : `<div class="seat-col-label" style="width:${seatW}px;">${c}</div>`;
  });
  html += '</div>';

  // Seat rows
  html += '<div class="seat-grid">';
  for (let r = 1; r <= cfg.rows; r++) {
    html += `<div class="seat-row"><div class="seat-row-num">${r}</div>`;
    cfg.cols.forEach(c => {
      if (c === '') {
        html += `<div class="seat-aisle"></div>`;
      } else {
        const id     = `${r}${c}`;
        const isOcc  = cfg.occupied.includes(id);
        const fcCls  = isFC ? ' fc-style' : '';
        html += `<div
          class="seat${fcCls}${isOcc ? ' occupied' : ''}"
          data-seat="${id}"
          onclick="${isOcc ? '' : 'seatClick(this)'}"
          title="${isOcc ? 'Occupied' : id}"
        >${isOcc ? '✕' : ''}</div>`;
      }
    });
    html += '</div>';
  }
  html += '</div>';

  document.getElementById('seat-grid-container').innerHTML = html;
}

function seatClick(el) {
  document.querySelectorAll('#seat-grid-container .seat').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedSeat = el.dataset.seat;
}

function renderBenefits(cls) {
  const cfg = CLASS_CONFIG[cls];
  document.getElementById('benefits-container').innerHTML = cfg.benefits
    .map(b => `<div class="benefit-box ${cfg.benefitClass}">
      <i class="fa-solid ${b.icon}"></i> ${b.text}
    </div>`)
    .join('');
}


/* -----------------------------------------------------------------
   STEP 3 — Meal selection
----------------------------------------------------------------- */
function selectFood(card) {
  document.querySelectorAll('.food-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
}


/* -----------------------------------------------------------------
   STEP 4 — Baggage selection
----------------------------------------------------------------- */
function selectBag(row) {
  document.querySelectorAll('.bag-option-row').forEach(r => r.classList.remove('active'));
  row.classList.add('active');
}


/* -----------------------------------------------------------------
   STEP 5 — Insurance, delivery & booking summary
----------------------------------------------------------------- */
function toggleInsurance() {
  insuranceOn = !insuranceOn;
  document.getElementById('insurance-card').classList.toggle('active', insuranceOn);
  updateReview();
}

function selectDelivery(opt) {
  document.querySelectorAll('.delivery-opt').forEach(o => o.classList.remove('active'));
  opt.classList.add('active');
}

function updateReview() {
  const fname = document.getElementById('p1-fname')?.value || '—';
  const lname = document.getElementById('p1-lname')?.value || '—';

  const clsNames     = { fc: 'First Class', prem: 'Premium', eco: 'Economy' };
  const activeBagRow = document.querySelector('.bag-option-row.active');
  const bagName      = activeBagRow ? activeBagRow.querySelector('.bag-name').textContent    : 'Carry-on Only';
  const bagPriceText = activeBagRow ? activeBagRow.querySelector('.bag-price-tag').textContent : 'Included';
  const bagAdd       = bagPriceText === 'Included' ? 0 : (parseInt(bagPriceText.replace(/[^0-9]/g, '')) || 0);
  const insAdd       = insuranceOn ? 28 : 0;

  const classPriceMap = {
    fc:   activeFlightPrice + 1555,
    prem: activeFlightPrice + 255,
    eco:  activeFlightPrice
  };
  const total = classPriceMap[selectedClass] + bagAdd + insAdd;

  document.getElementById('rev-passenger').textContent = (fname + ' ' + lname).trim() || '—';
  document.getElementById('rev-seat').textContent      = `${clsNames[selectedClass]} · Seat ${selectedSeat || '—'}`;

  const activeFood = document.querySelector('.food-card.active .food-name');
  document.getElementById('rev-food').textContent      = activeFood ? activeFood.textContent : '—';
  document.getElementById('rev-bags').textContent      = bagName;
  document.getElementById('rev-insurance').textContent = insuranceOn ? 'Included (+$28)' : 'Not added';
  document.getElementById('rev-total').textContent     = '$' + total.toLocaleString();
}


/* -----------------------------------------------------------------
   CINEMATIC BOOKING ANIMATION
----------------------------------------------------------------- */
let t1, t2, t3;

function confirmAndAnimate() {
  const dimmer       = document.getElementById('page-dimmer');
  const cineContainer = document.getElementById('cinematic-container');
  const cineBtn      = document.getElementById('cinematicBtn');

  dimmer.classList.add('active');
  cineContainer.classList.add('active');
  cineBtn.classList.remove('is-animating', 'is-success');

  document.getElementById('skipAnimBtn').onclick = resolveBooking;

  t1 = setTimeout(() => {
    cineBtn.classList.add('is-animating');
    t2 = setTimeout(() => {
      cineBtn.classList.remove('is-animating');
      cineBtn.classList.add('is-success');
      t3 = setTimeout(resolveBooking, 2000);
    }, 6000);
  }, 200);
}

function resolveBooking() {
  clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);

  document.getElementById('page-dimmer').classList.remove('active');
  document.getElementById('cinematic-container').classList.remove('active');
  document.getElementById('cinematicBtn').classList.remove('is-animating', 'is-success');

  if (activeFlightBtn) {
    activeFlightBtn.innerHTML = '<i class="fa-solid fa-check"></i> Booked';
    activeFlightBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    activeFlightBtn.style.color  = '#fff';
    activeFlightBtn.style.border = 'none';
    activeFlightBtn.disabled     = true;

    // Collapse the flight plan if open
    const planToggle = activeFlightBtn.closest('.flight-card').querySelector('.plan-toggle');
    if (planToggle.classList.contains('open')) togglePlan(planToggle, 0);
  }
}


/* -----------------------------------------------------------------
   ANIMATED GLOBE (canvas)
----------------------------------------------------------------- */
function initAnimatedGlobe() {
  const canvas = document.getElementById('globe');
  const ctx    = canvas.getContext('2d');
  const cx     = canvas.width  / 2;
  const cy     = canvas.height / 2;
  const radius = cx - 10;
  let time     = 0;

  /**
   * Project a lat/lon onto the canvas given a rotation offset.
   * Returns {x, y, z} — z > 0 means facing the viewer.
   */
  function project(lat, lon, rot) {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lon + rot) * (Math.PI / 180);
    return {
      x: cx + radius * Math.sin(phi) * Math.cos(theta),
      y: cy - radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time -= 0.5; // rotate eastward

    // Globe background gradient
    const g = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, radius);
    g.addColorStop(0,   '#1A73E8');
    g.addColorStop(0.8, '#0F172A');
    g.addColorStop(1,   '#020617');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    // Latitude grid lines
    ctx.strokeStyle = 'rgba(66,133,244,0.15)';
    ctx.lineWidth   = 1;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 5) {
        const p = project(lat, lon, time);
        if (p.z > 0) {
          if (lon === 0) ctx.moveTo(p.x, p.y);
          else           ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    // Longitude grid lines
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      for (let lat = -80; lat <= 80; lat += 5) {
        const p = project(lat, lon, time);
        if (p.z > 0) {
          if (lat === -80) ctx.moveTo(p.x, p.y);
          else             ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    // Flight arc: BRU → SIN
    const pBru = project(50, 20, time);
    const pSin = project(10, 140, time);
    if (pBru.z > -20 && pSin.z > -20) {
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(pBru.x, pBru.y);
      ctx.quadraticCurveTo(cx, cy - radius - 20, pSin.x, pSin.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth   = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Plane emoji along the arc midpoint
      const tx = pBru.x + (pSin.x - pBru.x) * 0.5;
      const ty = (pBru.y + (pSin.y - pBru.y) * 0.5) - 30;
      ctx.font      = '16px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('✈', tx - 8, ty + 8);
    }

    // City dots
    [
      { p: pBru, name: 'BRU' },
      { p: pSin, name: 'SIN' }
    ].forEach(city => {
      if (city.p.z > 0) {
        ctx.beginPath();
        ctx.arc(city.p.x, city.p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle   = '#D96570';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth   = 2;
        ctx.stroke();

        ctx.fillStyle  = '#fff';
        ctx.font       = 'bold 12px Outfit, sans-serif';
        ctx.shadowColor = '#000';
        ctx.shadowBlur  = 4;
        ctx.fillText(city.name, city.p.x + 10, city.p.y - 5);
        ctx.shadowBlur  = 0;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}


/* -----------------------------------------------------------------
   INIT — run on page load
----------------------------------------------------------------- */
renderFlights();
initAnimatedGlobe();
