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
   HOW IT WORKS:
   - Finds all  .slide  elements inside  #slideshow
   - Every 5 seconds, removes  .active  from current slide
     and adds  .active  to the next one
   - CSS handles the  opacity  fade (transition: opacity 1.2s)
   - Arrows and dots let the user switch manually
   - Touch swipe works on mobile
*/
(function () {
  const slides  = document.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.slide-dot');
  const btnPrev = document.getElementById('slidePrev');
  const btnNext = document.getElementById('slideNext');

  if (!slides.length) return;   // safety check — do nothing if no slides

  const SLIDE_DURATION = 2000;  // ← change this number to adjust speed (milliseconds)
                                 //   5000 = 5 seconds,  3000 = 3 seconds
  let current   = 0;
  let autoTimer = null;

  /* Go to slide by index */
  function goTo(index) {
    // Wrap around: after last slide → go to first, before first → go to last
    if (index < 0)              index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Remove active from current slide and dot
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    // Update current and activate new slide and dot
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  /* Auto-advance timer */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), SLIDE_DURATION);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  /* Arrow button clicks */
  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  /* Dot clicks */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  /* Touch swipe support (mobile) */
  let touchStartX = 0;
  const hero = document.getElementById('home');
  if (hero) {
    hero.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {        // minimum swipe distance = 50px
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        startAuto();
      }
    }, { passive: true });
  }

  /* Pause auto when hovering hero */
  if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
  }

  /* Keyboard arrow keys */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  /* Start */
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
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

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

/* ---------- PRODUCT CARD TILT ---------- */
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

/* ---------- CONSOLE BRAND ---------- */
console.log('%cafted.MY', 'font-size:3rem;font-weight:bold;color:#e60000;background:#0d0d0d;padding:1rem 2rem;');
console.log('%cBorn on the Concrete.', 'font-size:1rem;color:#888;');