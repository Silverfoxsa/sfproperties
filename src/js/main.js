// S&F Property Management - Main JS
// Handles: nav toggle, hero slider, FAQ accordion, form handler, footer year, header/footer load, cookie popup

// FOOTER YEAR
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// LOAD HEADER & FOOTER (clean injection)
async function loadComponent(targetId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    let html = await response.text();

    // ✅ Strip out everything before the first "<" and any BOMs
    html = html.replace(/^[\s\S]*?(?=<)/, '').trim();

    // Optional: ensure only valid <header> or <footer> content remains
    if (!html.startsWith('<header') && !html.startsWith('<footer')) {
      console.warn(`${filePath} doesn't start with <header> or <footer>`);
    }

    const target = document.getElementById(targetId);
    if (target) target.innerHTML = html;
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err);
  }
}

// Load reusable components (use relative paths for Firebase)
loadComponent("header-placeholder", "./components/header.html");
loadComponent("footer-placeholder", "./components/footer.html");

// HERO SLIDER (Unified version supporting both .hero-carousel and .hero-slide)
(function(){
  const slides = document.querySelectorAll('.hero-carousel img, .hero-slide');
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
document.querySelectorAll('.faq-accordion .faq-q, .faq-item .faq-q').forEach(q => {
  q.addEventListener('click', () => {
    q.parentElement.classList.toggle('active');
  });
});

// CONTACT FORM
const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 🔒 stops redirect

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        // replace the form with a thank-you message
        form.innerHTML = `
          <div class="thank-you-message fade-in">
            <h3>✅ Thank you!</h3>
            <p>Your message has been received. We’ll be in touch soon.</p>
          </div>
        `;
      } else {
        alert('Oops! Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    }
  });
}

// COOKIE CONSENT POPUP (Reusable across all pages)
document.addEventListener("DOMContentLoaded", () => {
  const existingConsent = localStorage.getItem("cookieConsent");
  if (existingConsent) return;

  const popup = document.createElement("div");
  popup.className = "cookie-consent";
  popup.innerHTML = `
    <div class="cookie-content">
      <p>
        We use cookies to enhance your experience and analyze site usage.
        By clicking “Accept All”, you consent to the use of cookies.
      </p>
      <div class="cookie-buttons">
        <button id="accept-all">Accept All</button>
        <button id="decline">Decline</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  popup.style.display = "flex";

  popup.querySelector("#accept-all").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    popup.remove();
  });
  popup.querySelector("#decline").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    popup.remove();
  });
});