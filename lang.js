// Site-wide language support, shared by every page.
// Translatable text is written in English in the HTML and marked with data-i18n
// (placeholders with data-i18n-placeholder). Translations live in i18n/<code>.json,
// keyed by that English text, and are fetched only when a language is chosen.
// Pages re-render dynamic content on the "langchange" event and use T() for strings built in JS.
(function () {
  // Same languages as the extensions' own language picker
  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'es', label: 'Español' },
    { code: 'pt-BR', label: 'Português' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ru', label: 'Русский' },
    { code: 'id', label: 'Indonesia' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'zh-CN', label: '简体中文' }
  ];
  const CODES = LANGS.map(l => l.code);
  const cache = {};
  let current = 'en';
  let dict = {};

  const norm = s => s.replace(/\s+/g, ' ').trim();

  // Saved choice first, then the browser's preferred languages ("pt-PT" -> pt-BR, "zh-TW" -> zh-CN)
  function detect() {
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) { }
    if (CODES.includes(saved)) return saved;
    for (const raw of navigator.languages || [navigator.language || 'en']) {
      const code = raw.replace('_', '-').toLowerCase();
      const exact = CODES.find(c => c.toLowerCase() === code);
      if (exact) return exact;
      const base = CODES.find(c => c.split('-')[0] === code.split('-')[0]);
      if (base) return base;
    }
    return 'en';
  }

  async function load(code) {
    if (!cache[code]) {
      try {
        const res = await fetch(`i18n/${code}.json`);
        cache[code] = res.ok ? await res.json() : {};
      } catch (e) {
        cache[code] = {};
      }
    }
    return cache[code];
  }

  function translateDom(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = norm(el.textContent);
      el.textContent = dict[el.dataset.en] || el.dataset.en;
    });
    (root || document).querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      if (el.dataset.enPlaceholder === undefined) el.dataset.enPlaceholder = el.placeholder;
      el.placeholder = dict[el.dataset.enPlaceholder] || el.dataset.enPlaceholder;
    });
  }

  window.T = en => dict[en] || en;
  window.getLanguage = () => current;

  window.setLanguage = async function (code, remember) {
    if (!CODES.includes(code)) code = 'en';
    dict = code === 'en' ? {} : await load(code);
    current = code;
    if (remember !== false) {
      try { localStorage.setItem('lang', code); } catch (e) { }
    }
    document.documentElement.lang = code;
    document.querySelectorAll('.lang-select').forEach(sel => { sel.value = code; });
    translateDom();
    document.dispatchEvent(new CustomEvent('langchange', { detail: code }));
  };

  document.querySelectorAll('.lang-select').forEach(sel => {
    sel.innerHTML = LANGS.map(l => `<option value="${l.code}">${l.label}</option>`).join('');
    sel.value = 'en';
    sel.addEventListener('change', () => setLanguage(sel.value));
  });

  const start = detect();
  if (start !== 'en') setLanguage(start, false);
})();
