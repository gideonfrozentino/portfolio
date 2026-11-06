/* ==========================================================================
   admin.js — panel kelola konten (HANYA untuk admin).
   --------------------------------------------------------------------------
   Perubahan ditulis langsung ke repo GitHub lewat Contents API, jadi tampil
   untuk semua pengunjung setelah Pages selesai build (~1 menit).

   Butuh GitHub token (fine-grained, izin "Contents: Read and write" pada repo
   ini saja). Token disimpan di localStorage browser ini — tidak pernah masuk
   ke dalam repo.
   ========================================================================== */
(function () {
  'use strict';

  var OWNER = 'gideonfrozentino';
  var REPO = 'portfolio';
  var BRANCH = 'main';
  var TOKEN_KEY = 'gh-token';
  var CONTENT = 'data/content.json';

  var panel = document.getElementById('adminPanel');
  if (!panel) return;

  var statusEl = document.getElementById('adminStatus');
  var tokenInput = document.getElementById('adminToken');
  var tokenBtn = document.getElementById('adminSaveToken');

  var bioFields = document.getElementById('bioFields');
  var bioForm = document.getElementById('bioForm');

  var photoInput = document.getElementById('adminPhotoInput');

  var certForm = document.getElementById('certForm');
  var projForm = document.getElementById('projForm');

  var BIO_KEYS = [
    ['bio_name', 'Nama lengkap'],
    ['bio_birth', 'Tempat, tanggal lahir'],
    ['bio_focus', 'Peminatan'],
    ['bio_address', 'Alamat'],
    ['bio_education', 'Pendidikan'],
    ['bio_campus', 'Kampus'],
    ['bio_status', 'Status'],
    ['bio_lang', 'Bahasa']
  ];

  function status(msg, isErr) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('is-error', !!isErr);
  }

  function token() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }

  function saveToken(t) {
    try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}
  }

  /* ---------- GitHub Contents API ---------- */

  function url(path) {
    return 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + path;
  }

  function gh(path, opts) {
    opts = opts || {};

    return fetch(url(path), {
      method: opts.method || 'GET',
      headers: {
        Authorization: 'Bearer ' + token(),
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      return r.text().then(function (txt) {
        var data = null;
        try { data = txt ? JSON.parse(txt) : null; } catch (e) {}

        if (!r.ok) {
          var msg = (data && data.message) || ('HTTP ' + r.status);
          if (r.status === 401) msg = 'Token tidak valid atau kadaluarsa.';
          if (r.status === 403) msg = 'Token tidak punya izin menulis (Contents: Read and write).';
          if (r.status === 409) msg = 'Bentrok versi file — muat ulang halaman lalu coba lagi.';
          throw new Error(msg);
        }

        return data;
      });
    });
  }

  function readContent() {
    return gh(CONTENT).then(function (j) {
      var text = atob(String(j.content || '').replace(/\s/g, ''));
      text = decodeURIComponent(escape(text));
      return { sha: j.sha, data: JSON.parse(text) };
    });
  }

  function writeContent(sha, data) {
    var text = JSON.stringify(data, null, 2) + '\n';

    return gh(CONTENT, {
      method: 'PUT',
      body: {
        message: 'Panel admin: perbarui konten',
        content: btoa(unescape(encodeURIComponent(text))),
        branch: BRANCH,
        sha: sha
      }
    });
  }

  /* simpan file biner (gambar / pdf). Kalau sudah ada, ambil sha dulu. */
  function putFile(path, base64, message) {
    var body = { message: message, content: base64, branch: BRANCH };

    return gh(path, { method: 'PUT', body: body }).catch(function (e) {
      if (!/sha|already exists/i.test(e.message)) throw e;
      return gh(path).then(function (j) {
        body.sha = j.sha;
        return gh(path, { method: 'PUT', body: body });
      });
    });
  }

  /* ---------- file helpers ---------- */

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(String(fr.result).split(',')[1]); };
      fr.onerror = function () { reject(new Error('File tidak bisa dibaca.')); };
      fr.readAsDataURL(file);
    });
  }

  /* gambar -> base64 jpeg/png, dipotong persegi (kalau cropSquare) & dikecilkan */
  function imageFile(file, maxPx, cropSquare, quality) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();

      fr.onerror = function () { reject(new Error('File tidak bisa dibaca.')); };

      fr.onload = function () {
        var img = new Image();

        img.onerror = function () { reject(new Error('File ini sepertinya bukan gambar.')); };

        img.onload = function () {
          var sx = 0, sy = 0, sw = img.width, sh = img.height;

          if (cropSquare) {
            var side = Math.min(sw, sh);
            sx = (sw - side) / 2;
            sy = (sh - side) / 2;
            sw = side;
            sh = side;
          }

          var scale = Math.min(1, maxPx / Math.max(sw, sh));
          var cw = Math.round(sw * scale);
          var ch = Math.round(sh * scale);

          var canvas = document.createElement('canvas');
          canvas.width = cw;
          canvas.height = ch;

          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);

          var out = canvas.toDataURL('image/jpeg', quality || 0.9);
          resolve(String(out).split(',')[1]);
        };

        img.src = fr.result;
      };

      fr.readAsDataURL(file);
    });
  }

  function slug(s) {
    return String(s || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'file';
  }

  /* ---------- token ---------- */

  function verifyToken() {
    if (!token()) { status('Isi token GitHub dulu.', true); return Promise.resolve(false); }

    status('Memeriksa token...');

    return fetch('https://api.github.com/user', {
      headers: { Authorization: 'Bearer ' + token(), Accept: 'application/vnd.github+json' }
    }).then(function (r) {
      if (!r.ok) throw new Error('Token tidak valid (HTTP ' + r.status + ').');
      return r.json();
    }).then(function (u) {
      status('Token aktif sebagai ' + u.login + '.');
      return true;
    }).catch(function (e) {
      status(e.message, true);
      return false;
    });
  }

  if (tokenBtn) {
    tokenBtn.addEventListener('click', function () {
      var t = (tokenInput && tokenInput.value || '').trim();
      if (!t) { status('Token masih kosong.', true); return; }
      saveToken(t);
      if (tokenInput) tokenInput.value = '';
      verifyToken();
    });
  }

  if (token() && tokenInput) {
    tokenInput.placeholder = 'token tersimpan — isi untuk mengganti';
  }

  /* ---------- tabs ---------- */

  Array.prototype.forEach.call(panel.querySelectorAll('[data-tab]'), function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.getAttribute('data-tab');

      Array.prototype.forEach.call(panel.querySelectorAll('[data-tab]'), function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      Array.prototype.forEach.call(panel.querySelectorAll('[data-panel]'), function (p) {
        p.hidden = p.getAttribute('data-panel') !== name;
      });

      if (name === 'teks') loadBioForm();
    });
  });

  /* ---------- teks biodata ---------- */

  function loadBioForm() {
    if (!bioFields) return;

    status('Memuat data...');

    readContent().then(function (res) {
      var bio = (res.data && res.data.bio) || {};

      bioFields.innerHTML = BIO_KEYS.map(function (pair) {
        var key = pair[0];
        var label = pair[1];
        var val = bio[key] || '';
        return (
          '<label class="admin__field">' +
            '<span>' + label + '</span>' +
            '<input type="text" data-bio="' + key + '" value="' + String(val).replace(/"/g, '&quot;') + '" />' +
          '</label>'
        );
      }).join('');

      status('Data dimuat.');
    }).catch(function (e) {
      status(e.message, true);
    });
  }

  if (bioForm) {
    bioForm.addEventListener('submit', function (e) {
      e.preventDefault();

      status('Menyimpan teks...');

      readContent().then(function (res) {
        var data = res.data || {};
        data.bio = data.bio || {};

        Array.prototype.forEach.call(bioFields.querySelectorAll('[data-bio]'), function (input) {
          data.bio[input.getAttribute('data-bio')] = input.value.trim();
        });

        return writeContent(res.sha, data).then(function () {
          if (window.__portfolioApply) window.__portfolioApply(data);
          status('Tersimpan. Situs live diperbarui ~1 menit.');
        });
      }).catch(function (e) {
        status(e.message, true);
      });
    });
  }

  /* ---------- foto profil ---------- */

  if (photoInput) {
    photoInput.addEventListener('change', function () {
      var file = photoInput.files && photoInput.files[0];
      if (!file) return;

      if (!/^image\//.test(file.type)) { status('Pilih file gambar.', true); return; }

      status('Mengunggah foto...');

      imageFile(file, 512, true, 0.88).then(function (b64) {
        return putFile('assets/img/profile.jpg', b64, 'Panel admin: ganti foto profil');
      }).then(function () {
        photoInput.value = '';
        var img = document.getElementById('profilePhoto');
        if (img) img.src = 'assets/img/profile.jpg?t=' + Date.now();
        status('Foto terunggah. Situs live diperbarui ~1 menit.');
      }).catch(function (e) {
        status(e.message, true);
      });
    });
  }

  /* ---------- sertifikat / ijazah ---------- */

  if (certForm) {
    certForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var file = certForm.querySelector('[name="certFile"]').files[0];
      var title = certForm.querySelector('[name="certTitle"]').value.trim();
      var issuer = certForm.querySelector('[name="certIssuer"]').value.trim();
      var year = certForm.querySelector('[name="certYear"]').value.trim();

      if (!file) { status('Pilih file ijazah/sertifikat.', true); return; }
      if (!title) { status('Judul sertifikat masih kosong.', true); return; }

      status('Mengunggah sertifikat...');

      var isImage = /^image\//.test(file.type);
      var ext = isImage ? 'jpg' : (file.name.split('.').pop() || 'pdf').toLowerCase();
      var path = 'assets/certs/' + slug(title) + '-' + Date.now() + '.' + ext;

      var upload = isImage
        ? imageFile(file, 1600, false, 0.88)
        : readFile(file);

      upload.then(function (b64) {
        return putFile(path, b64, 'Panel admin: unggah sertifikat ' + title);
      }).then(function () {
        return readContent();
      }).then(function (res) {
        var data = res.data || {};
        data.certificates = data.certificates || [];
        data.certificates.unshift({
          title: title,
          issuer: issuer,
          year: year,
          file: path,
          image: path
        });
        return writeContent(res.sha, data).then(function () {
          if (window.__portfolioApply) window.__portfolioApply(data);
          certForm.reset();
          status('Sertifikat tersimpan. Situs live diperbarui ~1 menit.');
        });
      }).catch(function (e) {
        status(e.message, true);
      });
    });
  }

  /* ---------- proyek ---------- */

  if (projForm) {
    projForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var title = projForm.querySelector('[name="projTitle"]').value.trim();
      var desc = projForm.querySelector('[name="projDesc"]').value.trim();
      var cat = projForm.querySelector('[name="projCat"]').value;
      var link = projForm.querySelector('[name="projLink"]').value.trim();
      var file = projForm.querySelector('[name="projImage"]').files[0];

      if (!title) { status('Judul proyek masih kosong.', true); return; }

      status('Menyimpan proyek...');

      var imageStep = file
        ? imageFile(file, 1200, false, 0.88).then(function (b64) {
            var ext = 'jpg';
            var path = 'assets/img/proj-' + slug(title) + '-' + Date.now() + '.' + ext;
            return putFile(path, b64, 'Panel admin: gambar proyek ' + title).then(function () { return path; });
          })
        : Promise.resolve('');

      imageStep.then(function (imagePath) {
        return readContent().then(function (res) {
          var data = res.data || {};
          data.projects = data.projects || [];
          data.projects.unshift({
            title: title,
            desc: desc,
            category: cat,
            categoryLabel: cat.charAt(0).toUpperCase() + cat.slice(1),
            link: link,
            image: imagePath
          });
          return writeContent(res.sha, data).then(function () {
            if (window.__portfolioApply) window.__portfolioApply(data);
            projForm.reset();
            status('Proyek tersimpan. Situs live diperbarui ~1 menit.');
          });
        });
      }).catch(function (e) {
        status(e.message, true);
      });
    });
  }

  /* ---------- buka / tutup panel ---------- */

  function openPanel() {
    panel.hidden = false;
    document.body.classList.add('is-auth-locked');
    status(token() ? 'Token tersimpan. Siap menyimpan perubahan.' : 'Masukkan token GitHub dulu.');
  }

  function closePanel() {
    panel.hidden = true;
    if (!document.body.classList.contains('is-auth-locked-pending')) {
      /* biarkan scroll kembali normal */
    }
    document.body.classList.remove('is-auth-locked');
  }

  var openBtn = document.getElementById('adminOpen');
  var closeBtn = document.getElementById('adminClose');

  if (openBtn) openBtn.addEventListener('click', openPanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (panel) panel.addEventListener('click', function (e) { if (e.target === panel) closePanel(); });

  window.__adminVerify = verifyToken;
})();
