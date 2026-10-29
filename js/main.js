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
     5b. FILTER PROYEK (Semua / Latihan / Web / Kuliah)
     ================================================================== */
  var filterButtons = document.querySelectorAll('.project-filter [data-filter]');
  var projectItems = document.querySelectorAll('.project-item[data-category]');

  if (filterButtons.length && projectItems.length) {
    Array.prototype.forEach.call(filterButtons, function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        Array.prototype.forEach.call(filterButtons, function (b) {
          b.classList.toggle('current', b === btn);
        });

        Array.prototype.forEach.call(projectItems, function (item) {
          var show = filter === 'all' || item.getAttribute('data-category') === filter;
          item.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ==================================================================
     6. GANTI FOTO PROFIL (disimpan di browser, tidak diunggah ke mana pun)
     ==================================================================
     - Foto dikecilkan dulu (maks 512px) lalu disimpan sebagai data URL
       di localStorage, supaya tidak cepat memenuhi kuota.
     - Kalau kuota penuh / localStorage diblokir, foto tetap tampil untuk
       sesi ini saja dan pengguna diberi tahu.
     - Tombol "Hapus" mengembalikan ke avatar bawaan.
     ================================================================== */
  var PHOTO_KEY = 'portfolio-photo';
  var PHOTO_DEFAULT = 'assets/img/avatar-anon.svg';
  var MAX_PX = 512;

  var photoImg = document.getElementById('profilePhoto');
  var photoPick = document.getElementById('photoPick');
  var photoReset = document.getElementById('photoReset');
  var photoInput = document.getElementById('photoInput');
  var photoNote = document.getElementById('photoNote');

  function note(msg, isError) {
    if (!photoNote) return;
    photoNote.textContent = msg || '';
    photoNote.classList.toggle('is-error', !!isError);
  }

  function showReset(show) {
    if (photoReset) photoReset.hidden = !show;
  }

  function applyPhoto(src, persist) {
    if (!photoImg) return;
    photoImg.src = src;
    var isCustom = src !== PHOTO_DEFAULT;
    showReset(isCustom);
    if (!persist) return;
    if (!isCustom) {
      try { localStorage.removeItem(PHOTO_KEY); } catch (e) {}
      return;
    }
    try {
      localStorage.setItem(PHOTO_KEY, src);
      note('');
    } catch (e) {
      note('Foto tampil sekarang, tapi browser menolak menyimpannya (memori penuh).', true);
    }
  }

  /* Kecilkan & potong persegi di tengah supaya pas di lingkaran */
  function processFile(file, done) {
    var reader = new FileReader();

    reader.onerror = function () {
      done(null, 'File tidak bisa dibaca. Coba gambar lain.');
    };

    reader.onload = function () {
      var img = new Image();

      img.onerror = function () {
        done(null, 'File ini sepertinya bukan gambar.');
      };

      img.onload = function () {
        var side = Math.min(img.width, img.height);
        var sx = (img.width - side) / 2;
        var sy = (img.height - side) / 2;
        var out = Math.min(MAX_PX, side);
        var canvas = document.createElement('canvas');
        canvas.width = out;
        canvas.height = out;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);

        var type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        done(canvas.toDataURL(type, 0.9), null);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  if (photoImg && photoPick && photoInput) {
    /* Muat foto tersimpan (kalau ada) */
    try {
      var saved = localStorage.getItem(PHOTO_KEY);
      if (saved) applyPhoto(saved, false);
    } catch (e) {
      /* localStorage diblokir — pakai avatar bawaan */
    }

    photoPick.addEventListener('click', function () {
      photoInput.click();
    });

    photoInput.addEventListener('change', function () {
      var file = photoInput.files && photoInput.files[0];
      if (!file) return;

      if (!/^image\//.test(file.type)) {
        note('Pilih file gambar (JPG, PNG, atau WebP).', true);
        photoInput.value = '';
        return;
      }

      note('Memproses foto...');
      processFile(file, function (dataUrl, err) {
        photoInput.value = '';
        if (err) {
          note(err, true);
          return;
        }
        applyPhoto(dataUrl, true);
        note('Foto diperbarui. Tersimpan di browser ini saja.');
      });
    });

    if (photoReset) {
      photoReset.addEventListener('click', function () {
        applyPhoto(PHOTO_DEFAULT, true);
        note('Kembali ke avatar bawaan.');
        photoInput.value = '';
      });
    }
  }

  /* ==================================================================
     7. TAHUN OTOMATIS DI FOOTER
     ================================================================== */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
