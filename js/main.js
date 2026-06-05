/* MONOSPACE EVENTS — Main JS */

// ── i18n ─────────────────────────────────────────────────
function t(key) {
  const lang = document.documentElement.lang || 'en';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS.en[key]) || key;
}

function applyTranslations(lang) {
  document.documentElement.lang = lang;

  // text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = (TRANSLATIONS[lang] || TRANSLATIONS.en)[el.dataset.i18n];
    if (val !== undefined) el.textContent = val;
  });
  // innerHTML (for elements containing HTML tags)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = (TRANSLATIONS[lang] || TRANSLATIONS.en)[el.dataset.i18nHtml];
    if (val !== undefined) el.innerHTML = val;
  });
  // placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = (TRANSLATIONS[lang] || TRANSLATIONS.en)[el.dataset.i18nPlaceholder];
    if (val !== undefined) el.placeholder = val;
  });
  // aria-label
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const val = (TRANSLATIONS[lang] || TRANSLATIONS.en)[el.dataset.i18nAria];
    if (val !== undefined) el.setAttribute('aria-label', val);
  });

  // page title
  const pageId = document.body.dataset.page;
  if (pageId && PAGE_TITLES && PAGE_TITLES[lang] && PAGE_TITLES[lang][pageId]) {
    document.title = PAGE_TITLES[lang][pageId];
  }

  // lang buttons active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('lang-active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
}

function initLang() {
  const stored = localStorage.getItem('lang');
  const browser = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const lang = stored || (browser.startsWith('nl') ? 'nl' : 'en');
  applyTranslations(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  initLang();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
});



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

// ── Product popup ────────────────────────────────────────
const popupOverlay  = document.getElementById('popup-overlay');
const popupClose    = document.getElementById('popup-close');

const FOIL_COLORS = [
  { title: 'Gold',     bg: '#C9A84C' },
  { title: 'Silver',   bg: '#AFAFAF' },
  { title: 'Black',    bg: '#111111' },
  { title: 'White',    bg: '#F5F5F5' },
  { title: 'Rose Gold',bg: '#C4899A' },
  { title: 'Copper',   bg: '#B87333' },
  { title: 'Blind',    bg: 'transparent' },
];

function openPopup(card) {
  let data;
  try { data = JSON.parse(card.dataset.product); } catch { return; }

  const lang = document.documentElement.lang || 'en';
  const isNl = lang === 'nl';

  document.getElementById('popup-img').src      = data.img;
  document.getElementById('popup-img').alt      = data.name;

  // service label
  const svcKey = data.service === 'Live Printing' ? 'nav.live_printing' : 'nav.hot_foil';
  document.getElementById('popup-service').textContent  = t(svcKey);
  document.getElementById('popup-name').textContent     = data.name;
  document.getElementById('popup-desc').textContent     = (isNl && data.desc_nl) ? data.desc_nl : data.desc;
  document.getElementById('popup-suitable').textContent = (isNl && data.suitable_nl) ? data.suitable_nl : data.suitable;

  // finish label
  const isForPrint = data.finish !== 'foil';
  document.getElementById('popup-finish-label').textContent = isForPrint ? t('popup.print_label') : t('popup.foil_label');

  // time label
  document.getElementById('popup-time-label').textContent = isForPrint ? t('popup.print_time') : t('popup.stamping_time');

  // time value
  const timeStr = isNl ? data.time.replace('minutes', 'minuten').replace('minute', 'minuut') : data.time;
  document.getElementById('popup-time').textContent = timeStr;

  // CTA
  document.getElementById('popup-cta-btn').textContent = t('popup.get_quote');

  const finishEl = document.getElementById('popup-finish-value');
  finishEl.innerHTML = '';
  if (data.finish === 'foil') {
    const wrap = document.createElement('div');
    wrap.className = 'popup-foil-swatches';
    FOIL_COLORS.forEach(c => {
      const s = document.createElement('span');
      s.className = 'popup-foil-swatch';
      s.title = c.title;
      s.style.background = c.bg;
      wrap.appendChild(s);
    });
    finishEl.appendChild(wrap);
  } else {
    finishEl.className = 'popup-meta-value';
    finishEl.textContent = data.finish;
  }

  popupOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popupOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.product-card[data-product]').forEach(card => {
  card.addEventListener('click', () => openPopup(card));
});

popupClose?.addEventListener('click', closePopup);
popupOverlay?.addEventListener('click', e => {
  if (e.target === popupOverlay) closePopup();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});
