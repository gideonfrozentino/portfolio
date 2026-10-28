/* ==========================================================================
   theme.js — Pengatur mode tampilan (Terang / Gelap / Ikut Sistem)
   --------------------------------------------------------------------------
   - Tema diubah lewat atribut data-theme pada <html>
   - Pilihan disimpan di localStorage, jadi tetap dipakai saat dibuka lagi
   - Kalau memilih "Ikut Sistem", tema otomatis berubah mengikuti OS
   ========================================================================== */

(function () {
  'use strict';

  /* Konfigurasi tunggal ada di <head> index.html:
     window.__PORTFOLIO_THEME__ = { storageKey, defaultPref } */
  var CONFIG = window.__PORTFOLIO_THEME__ || {};
  var STORAGE_KEY = CONFIG.storageKey || 'portfolio-theme';
  var DEFAULT_PREF = CONFIG.defaultPref || 'system';

  if (DEFAULT_PREF !== 'light' && DEFAULT_PREF !== 'dark' && DEFAULT_PREF !== 'gray' && DEFAULT_PREF !== 'system') {
    DEFAULT_PREF = 'system';
  }

  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  var panel = document.getElementById('settingsPanel');
  var btn = document.getElementById('settingsBtn');
  var wrap = document.getElementById('settings');
  var options = panel ? panel.querySelectorAll('[data-theme-value]') : [];
  var themeColor = document.querySelector('meta[name="theme-color"]');

  var currentPref = DEFAULT_PREF;

  /* ------------------------------------------------------------------
     Simpan & baca preferensi
     ------------------------------------------------------------------ */
  function readPref() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark' || v === 'gray' || v === 'system') return v;
    } catch (e) {
      /* localStorage bisa diblokir (mode privat) — abaikan saja */
    }
    return DEFAULT_PREF;
  }

  function savePref(pref) {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch (e) {
      /* abaikan */
    }
  }

  /* ------------------------------------------------------------------
     Tentukan tema akhir dari preferensi
     ------------------------------------------------------------------ */
  function resolve(pref) {
    if (pref === 'system') return mq.matches ? 'dark' : 'light';
    return pref;
  }

  /* ------------------------------------------------------------------
     Terapkan tema ke <html>
     ------------------------------------------------------------------ */
  function apply(pref) {
    currentPref = pref;

    var effective = resolve(pref);
    root.setAttribute('data-theme', effective);
    root.style.colorScheme = effective;

    if (themeColor) {
      themeColor.setAttribute('content', effective === 'dark' ? '#000000' : effective === 'gray' ? '#17171a' : '#f2f2f4');
    }

    syncOptions(pref);
  }

  /* ------------------------------------------------------------------
     Tandai pilihan yang sedang aktif di panel
     ------------------------------------------------------------------ */
  function syncOptions(pref) {
    Array.prototype.forEach.call(options, function (opt) {
      var isActive = opt.getAttribute('data-theme-value') === pref;
      opt.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------------------------
     Buka / tutup panel settings
     ------------------------------------------------------------------ */
  function openPanel() {
    if (!panel) return;
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    if (!panel) return;
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  if (btn && panel) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (panel.hidden) {
        openPanel();
      } else {
        closePanel();
      }
    });

    /* klik di luar panel -> tutup */
    document.addEventListener('click', function (e) {
      if (!panel.hidden && wrap && !wrap.contains(e.target)) closePanel();
    });

    /* tombol Esc -> tutup dan kembalikan fokus ke gear */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        closePanel();
        btn.focus();
      }
    });

    /* pilih tema */
    Array.prototype.forEach.call(options, function (opt) {
      opt.addEventListener('click', function () {
        var pref = opt.getAttribute('data-theme-value');
        savePref(pref);
        apply(pref);
        closePanel();
        btn.focus();
      });

      /* navigasi keyboard di dalam radiogroup */
      opt.addEventListener('keydown', function (e) {
        var list = Array.prototype.slice.call(options);
        var i = list.indexOf(opt);
        var next = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = list[(i + 1) % list.length];
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = list[(i - 1 + list.length) % list.length];

        if (next) {
          e.preventDefault();
          next.focus();
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Ikut berubah saat pengguna mengganti tema OS (kalau pref = system)
     ------------------------------------------------------------------ */
  function onSystemChange() {
    if (currentPref === 'system') apply('system');
  }

  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', onSystemChange);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(onSystemChange); /* browser lama */
  }

  /* ------------------------------------------------------------------
     Jalankan
     ------------------------------------------------------------------ */
  apply(readPref());
})();
