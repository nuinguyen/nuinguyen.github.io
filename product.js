// Shared behaviour for the product pages (alarm, reminders, youtube, calendar).
// Each page defines window.PAGE = { title, images: [...], vi: { key: text } }.
(function () {
  const PAGE = window.PAGE;
  const en = {};
  let lang = 'en';
  let mainIndex = 0;
  let lightboxIndex = 0;

  // LANGUAGE
  function applyLanguage(next) {
    lang = next;
    document.documentElement.lang = lang;
    document.getElementById('langText').innerText = lang === 'vi' ? 'EN' : 'VI';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = lang === 'vi' ? PAGE.vi[key] : en[key];
      if (text) el.innerText = text;
    });
  }

  window.toggleLanguage = function () {
    const next = lang === 'vi' ? 'en' : 'vi';
    try { localStorage.setItem('lang', next); } catch (e) { }
    applyLanguage(next);
  };

  // THEME
  window.toggleTheme = function () {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { }
  };

  // HERO IMAGE + THUMBNAILS
  function renderThumbs() {
    document.getElementById('heroThumbs').innerHTML = PAGE.images.slice(0, 5).map((src, i) => `
      <button onclick="setMain(${i})" aria-label="Show screenshot ${i + 1}"
        class="rounded-lg overflow-hidden ring-2 transition-all ${i === mainIndex ? 'ring-slate-900 dark:ring-white opacity-100' : 'ring-transparent opacity-60 hover:opacity-100'}">
        <img src="${src.replace('images/', 'images/thumbs/')}" width="640" height="400" alt="" class="w-full aspect-[16/10] object-cover">
      </button>`).join('');
  }

  window.setMain = function (i) {
    mainIndex = i;
    document.getElementById('heroImg').src = PAGE.images[i];
    renderThumbs();
  };

  // LIGHTBOX
  function showLightbox() {
    const n = PAGE.images.length;
    const img = document.getElementById('lightboxImg');
    img.src = PAGE.images[lightboxIndex];
    img.alt = `${PAGE.title} screenshot ${lightboxIndex + 1}`;
    document.getElementById('lightboxCaption').innerText = `${PAGE.title} · ${lightboxIndex + 1} / ${n}`;
  }

  window.openLightbox = function (i) {
    lightboxIndex = i === undefined ? mainIndex : i;
    showLightbox();
    const box = document.getElementById('lightbox');
    box.classList.remove('hidden');
    box.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  window.stepLightbox = function (delta) {
    const n = PAGE.images.length;
    lightboxIndex = (lightboxIndex + delta + n) % n;
    showLightbox();
  };

  window.closeLightbox = function () {
    const box = document.getElementById('lightbox');
    box.classList.add('hidden');
    box.classList.remove('flex');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox').classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  // INIT
  document.querySelectorAll('[data-i18n]').forEach(el => { en[el.getAttribute('data-i18n')] = el.innerText; });
  renderThumbs();
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { }
  const initial = saved || ((navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en');
  if (initial === 'vi') applyLanguage('vi');
})();
