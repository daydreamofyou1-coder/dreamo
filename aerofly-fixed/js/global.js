/* =================================================================
   AeroFly — global.js
   Shared behaviour loaded by ALL pages.
================================================================= */

/* -----------------------------------------------------------------
   NAV — hamburger dropdown
----------------------------------------------------------------- */
const menuToggle  = document.getElementById('menuToggle');
const navDropdown = document.getElementById('navDropdown');

if (menuToggle && navDropdown) {
  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    navDropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    navDropdown.classList.remove('active');
    // Close any open segment popups if they exist on this page
    if (typeof closeDatePicker     === 'function') closeDatePicker();
    if (typeof closeTravelersPicker === 'function') closeTravelersPicker();
  });
}
