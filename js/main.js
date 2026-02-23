// Plasma AI — Site Interactions
document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(8, 8, 24, 0.97)';
      navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
    } else {
      navbar.style.background = 'rgba(8, 8, 24, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  });

  // ─── Active nav link on scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--text)';
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ─── Smooth scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Scroll reveal ───
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ─── Auto-add reveal class to key elements ───
  const autoRevealSelectors = [
    '.who-card',
    '.service-card',
    '.process-step',
    '.faq-item',
    '.founder-card',
  ];
  autoRevealSelectors.forEach((sel, sIdx) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 4) el.classList.add(`reveal-delay-${i + 1}`);
    });
    revealObserver.observe && document.querySelectorAll(sel).forEach(el => revealObserver.observe(el));
  });

  // ─── Service card 3D tilt ───
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = (y - cy) / 18;
      const ry = (cx - x) / 18;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── Who card subtle tilt ───
  document.querySelectorAll('.who-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = (y - cy) / 30;
      const ry = (cx - x) / 30;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── Stat counter animation ───
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.textContent;
        const numMatch = rawText.match(/[\d.]+/);
        if (!numMatch) return;
        const num = parseFloat(numMatch[0]);
        const prefix = rawText.slice(0, rawText.indexOf(numMatch[0]));
        // Get inner span content if any
        const spanEl = el.querySelector('span');
        const suffix = spanEl ? spanEl.textContent : '';

        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = num * ease;
          const display = Number.isInteger(num) ? Math.floor(current) : current.toFixed(1);
          el.innerHTML = `${prefix}${display}${suffix ? `<span>${suffix}</span>` : ''}`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

});