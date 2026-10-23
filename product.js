// Shared behaviour for the product pages (alarm, reminders, youtube, calendar).
// Each page defines window.PAGE = { title, ring, images: [...] }. Translation is handled by lang.js.
(function () {
  const PAGE = window.PAGE;
  let mainIndex = 0;
  let lightboxIndex = 0;

  // THEME
  window.toggleTheme = function () {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { }
  };

  // MOBILE MENU (below the lg breakpoint)
  window.toggleMenu = function (open) {
    const menu = document.getElementById('mobileMenu');
    const show = open === undefined ? menu.classList.contains('hidden') : open;
    menu.classList.toggle('hidden', !show);
    menu.classList.toggle('flex', show);
    document.getElementById('menuBtn').setAttribute('aria-expanded', show);
  };
  document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // HERO IMAGE + THUMBNAILS
  function renderThumbs() {
    document.getElementById('heroThumbs').innerHTML = PAGE.images.slice(0, 5).map((src, i) => `
      <button onclick="setMain(${i})" aria-label="Show screenshot ${i + 1}"
        class="rounded-lg overflow-hidden ring-2 transition-all ${i === mainIndex ? PAGE.ring + ' opacity-100' : 'ring-transparent opacity-60 hover:opacity-100'}">
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
  renderThumbs();
})();
