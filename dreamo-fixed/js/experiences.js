/* =================================================================
   AeroFly — experiences.js
================================================================= */
console.log("AeroFly Experiences Flow Loaded");

const experiencesData = [
  {
    id: 'e1',
    title: 'Neon Nights Cyberpunk Tour',
    loc: 'Tokyo, Japan',
    cat: 'culture',
    price: 85,
    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80',
    tags: ['Nightlife', 'Guided'],
    desc: 'Explore the vibrant, neon-lit streets of Akihabara and Shinjuku with a local expert. Includes stops at hidden arcades and a cyberpunk-themed Izakaya.'
  },
  {
    id: 'e2',
    title: 'Glacier Heli-Hiking',
    loc: 'Banff, Canada',
    cat: 'adventure',
    price: 350,
    img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80',
    tags: ['Extreme', 'Nature'],
    desc: 'Take a scenic helicopter flight to a remote glacier, followed by a guided 3-hour hike across the ice fields with professional mountaineering gear.'
  },
  {
    id: 'e3',
    title: 'Street Food Safari',
    loc: 'Bangkok, Thailand',
    cat: 'food',
    price: 45,
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    tags: ['Culinary', 'Walking'],
    desc: 'Taste your way through bustling night markets. Try authentic Pad Thai, Mango Sticky Rice, and exotic local delicacies you will not find in restaurants.'
  },
  {
    id: 'e4',
    title: 'Northern Lights Chasing',
    loc: 'Tromsø, Finland',
    cat: 'adventure',
    price: 180,
    img: 'https://images.unsplash.com/photo-1531366936337-7c912a458b97?w=600&q=80',
    tags: ['Photography', 'Winter'],
    desc: 'Venture into the Arctic wilderness away from city lights. Includes professional photography tips, a campfire, and warm reindeer stew.'
  }
];

let currentExp = null;
let bookingStep = 1;

// Render logic
function renderExperiences(data) {
  const grid = document.getElementById('exp-grid');
  document.getElementById('exp-result-count').textContent = `${data.length} Experiences Found`;
  
  grid.innerHTML = data.map(exp => `
    <div class="exp-card" onclick="openExpModal('${exp.id}')">
      <div class="ec-img">
        <img src="${exp.img}" alt="${exp.title}">
        <div class="ec-badge">${exp.cat}</div>
      </div>
      <div class="ec-info">
        <div class="ec-title">${exp.title}</div>
        <div class="ec-loc"><i class="fa-solid fa-location-dot"></i> ${exp.loc}</div>
        <div class="ec-bottom">
          <div class="ec-price">$${exp.price} <span>/ pp</span></div>
          <button class="ec-btn">Book</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterExperiences() {
  const query = document.getElementById('exp-loc').value.toLowerCase();
  const cat = document.getElementById('exp-cat').value;
  
  const filtered = experiencesData.filter(e => {
    const matchLoc = e.loc.toLowerCase().includes(query) || e.title.toLowerCase().includes(query);
    const matchCat = cat === 'all' || e.cat === cat;
    return matchLoc && matchCat;
  });
  
  renderExperiences(filtered);
}

// Modal Logic
function openExpModal(id) {
  currentExp = experiencesData.find(e => e.id === id);
  if (!currentExp) return;

  // Set default date to tomorrow
  const tmrw = new Date(); tmrw.setDate(tmrw.getDate() + 1);
  document.getElementById('book-date').valueAsDate = tmrw;
  document.getElementById('book-ppl').value = 2;

  // Populate data
  document.getElementById('modal-exp-title').textContent = currentExp.title;
  document.getElementById('modal-exp-img').src = currentExp.img;
  document.getElementById('modal-exp-price').textContent = `$${currentExp.price}`;
  document.getElementById('modal-exp-desc').textContent = currentExp.desc;
  document.getElementById('modal-exp-tags').innerHTML = currentExp.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

  // Reset steps
  bookingStep = 1;
  updateExpSteps();

  document.getElementById('exp-modal-overlay').classList.add('active');
}

function closeExpModal() {
  document.getElementById('exp-modal-overlay').classList.remove('active');
}

// Booking Flow
function updateExpSteps() {
  document.getElementById('exp-step-1').classList.remove('active');
  document.getElementById('exp-step-2').classList.remove('active');
  document.getElementById('exp-step-3').classList.remove('active');
  document.getElementById(`exp-step-${bookingStep}`).classList.add('active');
}

function nextExpStep() {
  if (bookingStep === 1) {
    const dateVal = document.getElementById('book-date').value;
    const pplVal = parseInt(document.getElementById('book-ppl').value) || 1;
    
    if (!dateVal) { alert("Please select a date."); return; }
    
    document.getElementById('receipt-date').textContent = dateVal;
    document.getElementById('receipt-ppl').textContent = pplVal;
    document.getElementById('receipt-total').textContent = `$${(currentExp.price * pplVal).toLocaleString()}`;
  }
  bookingStep++;
  updateExpSteps();
}

function prevExpStep() {
  bookingStep--;
  updateExpSteps();
}

function confirmExpBooking() {
  // Simulate network request
  const btn = document.querySelector('#exp-step-2 .modal-primary-btn');
  const ogText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
  
  setTimeout(() => {
    btn.innerHTML = ogText;
    bookingStep = 3;
    updateExpSteps();
  }, 800);
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  renderExperiences(experiencesData);
});
