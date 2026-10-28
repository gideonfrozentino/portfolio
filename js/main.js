/* ==========================================================================
   main.js — Navbar, animasi scroll, highlight menu, dan lightbox sertifikat
   ========================================================================== */

(function () {
  'use strict';

  /* Kelas no-js dilepas di sini, bukan di <head>, supaya kalau file ini
     gagal dimuat halaman tetap tampil dan menu mobile tetap bisa dipakai. */
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  /* Helper bahasa — label yang dibuat saat runtime (mis. "Buka menu")
     ikut mengikuti tombol ID/EN di js/i18n.js. Kalau i18n tidak jalan,
     teks Indonesia tetap dipakai. */
  function t(key) {
    var i18n = window.__portfolioI18n;
    return i18n && typeof i18n.t === 'function' ? i18n.t(key) : key;
  }

  /* ==================================================================
     1. NAVBAR — efek saat di-scroll
     ================================================================== */
  var nav = document.getElementById('nav');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }

  onScroll();

  var ticking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );

  /* ==================================================================
     2. MENU MOBILE
     ================================================================== */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function closeMenu() {
    if (!toggle || !links) return;
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', t('Buka menu'));
  }

  if (toggle && links) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? t('Tutup menu') : t('Buka menu'));
    });

    /* klik salah satu menu -> tutup */
    Array.prototype.forEach.call(links.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });

    /* klik di luar -> tutup */
    document.addEventListener('click', function (e) {
      if (!links.classList.contains('is-open')) return;
      if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    /* layar diperbesar -> kembalikan ke tampilan desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  /* ==================================================================
     3. ANIMASI MUNCUL SAAT SCROLL
     ================================================================== */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    Array.prototype.forEach.call(revealItems, function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* browser lama: tampilkan semua */
    Array.prototype.forEach.call(revealItems, function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ==================================================================
     4. HIGHLIGHT MENU SESUAI SECTION YANG SEDANG DILIHAT
     ================================================================== */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = links ? links.querySelectorAll('a[href^="#"]') : [];

  function markActive(id) {
    Array.prototype.forEach.call(navAnchors, function (a) {
      var match = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        var best = null;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        });
        if (best) markActive(best.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    Array.prototype.forEach.call(sections, function (s) {
      sectionObserver.observe(s);
    });

    /* di paling atas halaman belum ada section yang terlihat -> kosongkan highlight */
    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY < 120) markActive('');
      },
      { passive: true }
    );
  }

  /* ==================================================================
     5. LIGHTBOX SERTIFIKAT
     ================================================================== */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxMeta = document.getElementById('lightboxMeta');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;

  function openLightbox(src, title, meta, alt) {
    if (!lightbox) return;

    lastFocused = document.activeElement;

    lightboxImg.setAttribute('src', src);
    lightboxImg.setAttribute('alt', alt || title || t('Pratinjau sertifikat'));
    lightboxTitle.textContent = title || '';
    lightboxMeta.textContent = meta || '';

    lightbox.hidden = false;
    document.body.classList.add('is-locked');

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;

    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    document.body.classList.remove('is-locked');

    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  var triggers = document.querySelectorAll('[data-lightbox]');

  Array.prototype.forEach.call(triggers, function (trigger) {
    trigger.addEventListener('click', function () {
      var img = trigger.querySelector('img');
      openLightbox(
        trigger.getAttribute('data-lightbox'),
        trigger.getAttribute('data-title'),
        trigger.getAttribute('data-meta'),
        img ? img.getAttribute('alt') : ''
      );
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    /* klik area gelap di luar gambar -> tutup */
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ==================================================================
     6. TAHUN OTOMATIS DI FOOTER
     ================================================================== */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
