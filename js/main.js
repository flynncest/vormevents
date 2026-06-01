/* VORM EVENTS — Main JS */

// ── Dropdown — hover with delay so gap doesn't close it ──
document.querySelectorAll('.nav-item').forEach(item => {
  const dropdown = item.querySelector('.nav-dropdown');
  if (!dropdown) return;
  let hideTimer = null;

  function showDropdown() {
    clearTimeout(hideTimer);
    dropdown.classList.add('open');
  }
  function hideDropdown() {
    hideTimer = setTimeout(() => dropdown.classList.remove('open'), 180);
  }

  item.addEventListener('mouseenter', showDropdown);
  item.addEventListener('mouseleave', hideDropdown);
  dropdown.addEventListener('mouseenter', showDropdown);
  dropdown.addEventListener('mouseleave', hideDropdown);
});

// ── Navigation scroll state ──────────────────────────────
const nav = document.querySelector('.nav');

function updateNav() {
  if (!nav) return;
  const onHero = window.scrollY < (window.innerHeight * 0.7);
  if (nav.classList.contains('nav--hero-page')) {
    nav.classList.toggle('transparent', onHero);
    nav.classList.toggle('solid', !onHero);
  } else {
    nav.classList.remove('transparent');
    nav.classList.add('solid');
  }
}

if (nav) {
  if (nav.classList.contains('nav--hero-page')) {
    nav.classList.add('transparent');
  } else {
    nav.classList.add('solid');
  }
  window.addEventListener('scroll', updateNav, { passive: true });
}

// ── Mobile menu ──────────────────────────────────────────
const mobMenu  = document.getElementById('mob-menu');
const mobOpen  = document.getElementById('nav-hamburger');
const mobClose = document.getElementById('mob-close');

function openMob()  { mobMenu?.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeMob() { mobMenu?.classList.remove('open'); document.body.style.overflow = ''; }

mobOpen?.addEventListener('click', openMob);
mobClose?.addEventListener('click', closeMob);
mobMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

// ── Gallery marquee pause on hover ──────────────────────
const galleryTrack = document.querySelector('.gallery-track');
if (galleryTrack) {
  galleryTrack.addEventListener('mouseenter', () => galleryTrack.classList.add('paused'));
  galleryTrack.addEventListener('mouseleave', () => galleryTrack.classList.remove('paused'));
}

// ── FAQ accordion ────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Catalog filter buttons ───────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.removeAttribute('hidden');
      } else {
        card.setAttribute('hidden', '');
      }
    });

    // Update section labels visibility
    document.querySelectorAll('.catalog-section-label').forEach(label => {
      const cat = label.dataset.category;
      label.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
    });
  });
});

// ── Smooth scroll for anchor links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
