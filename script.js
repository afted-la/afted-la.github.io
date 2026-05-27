/* =============================================
   afted.MY — script.js
   ============================================= */

/* ---------- CUSTOM CURSOR ---------- */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  trail.style.transform = `translate(${trailX - 18}px, ${trailY - 18}px)`;
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .product-card, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    trail.style.width  = '60px';
    trail.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    trail.style.width  = '36px';
    trail.style.height = '36px';
  });
});

/* ---------- NAVBAR SCROLL ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---------- MOBILE MENU ---------- */
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('mobileMenu');
let menuOpen = false;

toggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menu.classList.toggle('open', menuOpen);
  const spans = toggle.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(6px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    menu.classList.remove('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

/* ==============================
   HERO SLIDESHOW
   ==============================
   Works for BOTH desktop and mobile.
   - Desktop: CSS shows background-image, hides .slide-img
   - Mobile:  CSS hides background-image, shows .slide-img
   The JS logic is exactly the same for both — just controls
   which .slide has the .active class (opacity fade).
*/
(function () {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.slide-dot');

  if (!slides.length) return;

  const SLIDE_DURATION = 2800; // milliseconds between auto-advance
  let current   = 0;
  let autoTimer = null;

  function goTo(index) {
    if (index < 0)              index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), SLIDE_DURATION);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  /* Dots */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  /* Touch swipe — works on mobile */
  let touchStartX = 0;
  let touchStartY = 0;
  const hero = document.getElementById('home');

  if (hero) {
    hero.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      /* Only trigger if horizontal swipe is bigger than vertical (not a scroll) */
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        diffX > 0 ? goTo(current + 1) : goTo(current - 1);
        startAuto();
      }
    }, { passive: true });
  }

  /* Pause on hover (desktop) */
  if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
  }

  /* Keyboard arrows (desktop) */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  startAuto();
})();

/* ---------- SCROLL REVEAL ---------- */
const revealTargets = [
  '.section-header',
  '.product-card',
  '.contact-left',
  '.contact-right',
  '.footer-col',
];

revealTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

document.querySelectorAll('.product-card').forEach((el, i) => { el.dataset.revealDelay = i; });
document.querySelectorAll('.footer-col').forEach((el, i)   => { el.dataset.revealDelay = i; });

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * (entry.target.dataset.revealDelay || 0));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---------- SMOOTH ANCHOR NAV ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
const sections    = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ---------- PRODUCT CARD TILT (desktop only) ---------- */
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---------- LIGHTBOX ---------- */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.product-img-wrap').forEach(wrap => {
  wrap.addEventListener('click', () => {
    const img = wrap.querySelector('img');
    if (img) {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ---------- CONSOLE BRAND ---------- */
console.log('%cafted.my', 'font-size:3rem;font-weight:bold;color:#e60000;background:#0d0d0d;padding:1rem 2rem;');
console.log('%cBorn on the Concrete.', 'font-size:1rem;color:#888;');