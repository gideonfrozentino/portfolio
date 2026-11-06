/* ==========================================================================
   content.js — menerapkan isi data/content.json ke halaman.
   --------------------------------------------------------------------------
   - Kalau data/content.json tidak ada / gagal dimuat (mis. dibuka lewat
     file://), halaman TETAP memakai HTML statis sebagai fallback.
   - Kalau ada isinya: teks biodata ditimpa, proyek & sertifikat dirender ulang.
   ========================================================================== */
(function () {
  'use strict';

  var SRC = 'data/content.json';

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function applyText(map) {
    if (!map) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-edit]'), function (el) {
      var key = el.getAttribute('data-edit');
      if (Object.prototype.hasOwnProperty.call(map, key) && map[key]) {
        el.textContent = map[key];
      }
    });
  }

  function renderProjects(list) {
    var grid = document.querySelector('.projects-grid');
    if (!grid || !list || !list.length) return;

    grid.innerHTML = list.map(function (p) {
      var cat = p.category || 'latihan';
      return (
        '<article class="project-item" data-category="' + esc(cat) + '">' +
          '<div class="project-image">' +
            (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async" />' : '') +
            (p.link
              ? '<a class="details-btn" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer" aria-label="Buka ' + esc(p.title) + '">' +
                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg>' +
                '</a>'
              : '') +
          '</div>' +
          '<div class="project-content">' +
            '<span class="project-cat">' + esc(p.categoryLabel || cat) + '</span>' +
            '<h3 class="project-title">' + esc(p.title) + '</h3>' +
            '<p class="project-desc">' + esc(p.desc) + '</p>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderCerts(list) {
    var box = document.querySelector('.certs');
    if (!box || !list || !list.length) return;

    box.innerHTML = list.map(function (c) {
      var file = c.file || '';
      var img = c.image || file;
      return (
        '<article class="cert">' +
          '<a class="cert__open" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer" aria-label="Buka sertifikat ' + esc(c.title) + '">' +
            '<span class="cert__thumb"><img src="' + esc(img) + '" alt="Sertifikat ' + esc(c.title) + '" loading="lazy" decoding="async" /></span>' +
            '<span class="cert__body">' +
              '<span class="cert__title">' + esc(c.title) + '</span>' +
              '<span class="cert__issuer">' + esc(c.issuer) + '</span>' +
            '</span>' +
          '</a>' +
          '<div class="cert__foot">' +
            '<span>' + esc(c.year) + '</span>' +
            '<a class="cert__link" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">Lihat kredensial &nearr;</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function apply(data) {
    if (!data) return;

    if (data.profilePhoto) {
      var img = document.getElementById('profilePhoto');
      if (img) img.src = data.profilePhoto;
    }

    applyText(data.bio);
    renderProjects(data.projects);
    renderCerts(data.certificates);

    document.dispatchEvent(new CustomEvent('portfolio:content'));
  }

  function load() {
    if (!window.fetch) return;

    fetch(SRC + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        window.__portfolioContent = data;
        apply(data);
      })
      .catch(function () { /* offline / file:// — biarkan HTML statis */ });
  }

  /* dipakai panel admin setelah menyimpan */
  window.__portfolioApply = function (data) {
    window.__portfolioContent = data;
    apply(data);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
