/* ============================================================
   Plasma AI — js/main.js
   Shared across all pages.

   What this file does:
   1.  initReveal()       — Scroll-triggered fade-in for .reveal elements
   2.  initNavbar()       — Adds shadow to navbar on scroll
   3.  initActiveLink()   — Highlights the current page in the nav
   4.  initSmoothScroll() — Smooth-scrolls anchor (#) links
   5.  initFAQ()          — Accordion open/close for .faq-item elements
   6.  initCounters()     — Animates [data-count] stat numbers on scroll
   7.  initContactForm()  — Demo submit handler (swap for real backend)
   8.  initMobileNav()    — Hamburger menu toggle for mobile
   9.  initTabs()         — Tab switcher for Services/Process panel
   10. DOMContentLoaded   — Calls all inits
   ============================================================ */


/* ============================================================
   1. SCROLL REVEAL
   Watches .reveal elements with IntersectionObserver.
   Adds .visible class when they enter the viewport.
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target); // only animate once
        }
      });
    },
    { threshold: 0.1 }
  );

  els.forEach(el => obs.observe(el));
}


/* ============================================================
   2. NAVBAR SCROLL SHADOW
   Adds a subtle box-shadow when the user scrolls down.
   ============================================================ */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  window.addEventListener(
    'scroll',
    () => {
      nav.style.boxShadow =
        window.scrollY > 20 ? '0 2px 18px rgba(109,40,217,0.08)' : 'none';
    },
    { passive: true }
  );
}


/* ============================================================
   3. ACTIVE NAV LINK
   Compares the current filename to each nav link's href
   and adds .active to the matching link.

   NOTE: Because sub-pages are in folders (services/services.html),
   we match against the full pathname segment, not just the filename.
   ============================================================ */
function initActiveLink() {
  const links   = document.querySelectorAll('.nav-links a');
  // Get the last two path segments, e.g. "services/services.html"
  const parts   = window.location.pathname.split('/').filter(Boolean);
  const current = parts.slice(-2).join('/'); // "services/services.html"
  const file    = parts[parts.length - 1];   // "services.html" or "index.html"

  links.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;

    // Normalise href for comparison (strip leading ./ or ../)
    const hrefClean = href.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');

    if (
      hrefClean === current ||
      hrefClean === file    ||
      (file === 'index.html' && (hrefClean === 'index.html' || hrefClean === ''))
    ) {
      a.classList.add('active');
    }
  });
}


/* ============================================================
   4. SMOOTH SCROLL
   Intercepts clicks on anchor links (#section) and
   smoothly scrolls to the target element.
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


/* ============================================================
   5. FAQ ACCORDION
   Clicking a .faq-q opens its sibling .faq-a and closes others.
   ============================================================ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items first
      items.forEach(i => {
        i.classList.remove('open');
        const ia = i.querySelector('.faq-a');
        if (ia) ia.classList.remove('open');
      });

      // If it wasn't open, open it now
      if (!isOpen) {
        item.classList.add('open');
        a.classList.add('open');
      }
    });
  });
}


/* ============================================================
   6. ANIMATED STAT COUNTERS
   Elements with data-count="87" data-suffix="%" will count
   up from 0 to 87 when they scroll into view.
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;

        const el  = e.target;
        const end = parseFloat(el.dataset.count);
        const sfx = el.dataset.suffix || '';       // e.g. "%", "hrs", "x"
        const pfx = el.dataset.prefix || '';       // e.g. "$"
        const dur = 1600;                           // animation duration ms
        const fps = 60;
        const steps = (dur / 1000) * fps;
        const inc   = end / steps;
        let cur = 0;

        const timer = setInterval(() => {
          cur += inc;
          if (cur >= end) {
            cur = end;
            clearInterval(timer);
          }
          // Display integer or 1 decimal depending on whether end is whole
          el.textContent =
            pfx +
            (Number.isInteger(end) ? Math.floor(cur) : cur.toFixed(1)) +
            sfx;
        }, 1000 / fps);

        obs.unobserve(el); // only animate once
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => obs.observe(c));
}


/* ============================================================
   7. CONTACT FORM (DEMO SUBMIT)
   Replace the body of this function with a real fetch()
   to your backend or form service (e.g. Formspree).
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault(); // ← Remove this line when wiring up real backend

    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    // Visual feedback
    btn.textContent = 'Message Sent!';
    btn.disabled    = true;
    btn.style.background = 'var(--teal)';
    btn.style.boxShadow  = '0 4px 18px var(--teal-glow)';

    // Reset after 3 seconds (remove in production — redirect instead)
    setTimeout(() => {
      btn.innerHTML        = orig;
      btn.disabled         = false;
      btn.style.background = '';
      btn.style.boxShadow  = '';
      form.reset();
    }, 3000);

    /*
      ── TO WIRE UP A REAL BACKEND ──
      Replace the above with something like:

      fetch('https://formspree.io/f/YOUR_ID', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(Object.fromEntries(new FormData(form)))
      })
      .then(r => r.ok ? window.location.href = '/contact/thank-you.html' : alert('Error'))
      .catch(() => alert('Network error — please email us directly.'));
    */
  });
}


/* ============================================================
   8. MOBILE NAV TOGGLE
   Shows/hides .nav-links when the hamburger #navToggle is clicked.
   Inline styles are used here so that desktop display:flex
   from CSS is not permanently overridden.
   ============================================================ */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.querySelector('.nav-links');
  if (!toggle || !menu) return;

  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;

    if (open) {
      // Show menu as vertical list
      Object.assign(menu.style, {
        display:       'flex',
        flexDirection: 'column',
        position:      'absolute',
        top:           '66px',
        left:          '0',
        right:         '0',
        background:    'rgba(248,247,255,0.97)',
        padding:       '22px 28px',
        gap:           '18px',
        borderBottom:  '1px solid var(--border)',
        boxShadow:     '0 8px 20px rgba(109,40,217,0.07)',
        zIndex:        '199',
      });
      toggle.textContent = '✕';
    } else {
      // Hide menu by removing all inline styles
      menu.removeAttribute('style');
      toggle.textContent = '☰';
    }
  });

  // Close menu if a link is clicked
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (open) {
        open = false;
        menu.removeAttribute('style');
        toggle.textContent = '☰';
      }
    });
  });
}


/* ============================================================
   9. TAB SWITCHER (Services page)
   Switches between "Services" and "Process" tabs.
   Looks for .tab-btn elements and .tab-panel[data-tab] elements.
   ============================================================ */
function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.tab-panel');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update button states
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show matching panel, hide others
      panels.forEach(p => {
        if (p.dataset.tab === target) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    });
  });
}


/* ============================================================
   10. INIT ON DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNavbar();
  initActiveLink();
  initSmoothScroll();
  initFAQ();
  initCounters();
  initContactForm();
  initMobileNav();
  initTabs();
});