
// S&F Property Management - Main JS
// Handles: nav toggle, hero slider, FAQ accordion, form handler, footer year

// FOOTER YEAR
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// MOBILE NAV
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// HERO SLIDER
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  if(!slides.length) return;
  let i = 0;
  function show(n){
    slides.forEach((s,idx) => s.classList.toggle('active', idx===n));
    dots.forEach((d,idx) => d.classList.toggle('active', idx===n));
  }
  show(0);
  setInterval(()=>{ i = (i+1)%slides.length; show(i); }, 5000);
})();

// FAQ ACCORDION
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q?.addEventListener('click', () => {
    const open = a.style.maxHeight && a.style.maxHeight !== '0px';
    a.style.maxHeight = open ? '0px' : a.scrollHeight + 'px';
    q.querySelector('.chev').textContent = open ? '▾' : '▴';
  });
});

// CONTACT FORM (simple demo)
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const msg = fd.get('message')?.toString().trim();
    if(!name || !email || !msg){
      alert('Please complete all fields.');
      return;
    }
    // Replace with your real email handling later (e.g., Firebase, 1‑Grid, Brevo, Formspark)
    alert('Thanks, ' + name + '! Your message has been sent.');
    form.reset();
  });
}
