/* ==========================================================================
   i18n.js — Tombol ganti bahasa (Indonesia / English)
   --------------------------------------------------------------------------
   Cara kerja
   ----------
   - Halaman ini ditulis dalam Bahasa Indonesia = bahasa sumber / default.
   - Dictionary di bawah memetakan teks Indonesia ke Bahasa Inggris.
   - Saat tombol ID / EN diklik, seluruh teks di halaman ikut berganti.
   - Pilihan bahasa disimpan di localStorage, jadi tetap terpakai saat
     pengunjung membuka website ini lagi.

   Konfigurasi (opsional, bisa ditulis di <head> index.html)
   ---------------------------------------------------------
     window.__PORTFOLIO_I18N__ = {
       storageKey: 'portfolio-lang',
       defaultLang: 'id'          // 'id' atau 'en'
     };

   Cara menambah terjemahan
   ------------------------
   - Teks biasa ......... tambahkan pasangan di TEXT  (kunci = teks Indonesia)
   - Atribut ............ tambahkan pasangan di ATTR  (alt, aria-label, title,
                          data-title, data-meta, content/placeholder)
   - Judul yang berisi tag HTML (mis. ada <span class="gradient-text">):
     tambahkan atribut data-i18n-html="kunci" di index.html lalu isi HTML_MAP.
   ========================================================================== */

(function () {
  'use strict';

  var CONFIG = window.__PORTFOLIO_I18N__ || {};
  var STORAGE_KEY = CONFIG.storageKey || 'portfolio-lang';
  var DEFAULT_LANG = CONFIG.defaultLang === 'en' ? 'en' : 'id';
  var LANGS = ['id', 'en'];

  /* ======================================================================
     1. DICTIONARY — TEKS BIASA  (Indonesia -> English)
     ====================================================================== */
  var TEXT = {
    /* --- Umum --- */
    'Lewati ke konten': 'Skip to content',

    /* --- Panel pengaturan --- */
    'Mode Tampilan': 'Display Mode',
    Terang: 'Light',
    Gelap: 'Dark',
    'Ikut Sistem': 'Follow System',

    /* --- Brand & navigasi --- */
    Biodata: 'Bio',
    Proyek: 'Projects',
    Pendidikan: 'Education',
    Sertifikat: 'Certificates',
    Kontak: 'Contact',

    /* --- Hero --- */
    'Terbuka untuk magang & kolaborasi': 'Open to internships & collaboration',
    'Halo, saya': "Hi, I'm",
    'Mahasiswa Informatika': 'Informatics Student',
    'Saya mahasiswa Informatika di Universitas Pelita Harapan dengan fokus Cyber Security. Halaman ini berisi biodata, perjalanan belajar, proyek, dan sertifikat saya.':
      "I'm an Informatics student at Universitas Pelita Harapan focusing on Cyber Security. This page holds my bio, learning journey, projects, and certificates.",
    'Lihat Proyek': 'View Projects',
    'Hubungi Saya': 'Contact Me',
    Kampus: 'University',
    Informatika: 'Informatics',
    'Program Studi': 'Study Program',
    Peminatan: 'Specialization',

    /* --- Biodata --- */
    'Ringkasan informasi pribadi dan latar belakang pendidikan.':
      'A summary of my personal details and educational background.',
    'Nama Lengkap': 'Full Name',
    'Contoh: Jakarta, 1 Januari 2000': 'Example: Jakarta, 1 January 2000',
    'Tempat, Tanggal Lahir': 'Place, Date of Birth',
    Alamat: 'Address',
    'Contoh: Kota, Provinsi': 'Example: City, Province',
    Pendidikan: 'Education',
    'S1 Informatika (Cyber Security)': 'B.Sc. Informatics (Cyber Security)',
    'Mahasiswa aktif · terbuka untuk magang': 'Active student · open to internships',
    Bahasa: 'Languages',
    'Indonesia · Inggris': 'Indonesian · English',

    /* --- Proyek --- */
    'Beberapa proyek kuliah dan latihan mandiri yang saya kerjakan.':
      'A few coursework projects and independent practice pieces I have worked on.',
    'Contoh: Program Python Pertama': 'Example: First Python Program',
    'Ganti dengan proyekmu: aplikasi kecil atau program CLI, lalu ceritakan masalah yang diselesaikan dan hasilnya.':
      'Replace with your own project: a small app or CLI program — describe the problem it solves and the result.',
    Algoritma: 'Algorithms',
    'Kode ↗': 'Code ↗',
    'Contoh: Proyek Web': 'Example: Web Project',
    'Portofolio, landing page, atau aplikasi web sederhana — tulis stack yang dipakai dan tautkan demo atau kodenya.':
      'A portfolio, landing page, or small web app — list the stack used and link the demo or code.',
    'Contoh: Tugas Besar Mata Kuliah': 'Example: Course Capstone Assignment',
    'Proyek kelompok atau individu dari mata kuliah — jelaskan peranmu dan apa yang kamu pelajari.':
      'A group or individual course project — describe your role and what you learned.',
    'Struktur Data': 'Data Structures',

    /* --- Pendidikan & pengalaman --- */
    'Pendidikan & Pengalaman': 'Education & Experience',
    'Perjalanan pendidikan dan pengalaman saya sejauh ini.':
      'My education journey and experience so far.',
    'Mahasiswa S1 Informatika (Cyber Security)': 'Informatics Undergraduate (Cyber Security)',
    '20XX — sekarang': '20XX — Present',
    'Menempuh mata kuliah seperti Dasar Pemrograman (Python), Matematika Diskrit, dan Aljabar Linier, sekaligus mendalami topik keamanan siber.':
      'Taking courses such as Basic Programming (Python), Discrete Mathematics, and Linear Algebra, while exploring cybersecurity topics.',
    'Matematika Diskrit': 'Discrete Mathematics',
    'Contoh: Magang / Asisten Praktikum': 'Example: Internship / Teaching Assistant',
    'Nama instansi (ganti)': 'Institution name (replace)',
    'Ganti dengan pengalaman nyata: magang, kepanitiaan, atau asisten praktikum.':
      'Replace with a real experience: internship, committee work, or teaching assistant.',
    Contoh: 'Example',
    'Contoh: Organisasi / Komunitas Kampus': 'Example: Campus Organization / Community',
    'Nama organisasi (ganti)': 'Organization name (replace)',
    'Ceritakan peranmu di organisasi atau komunitas, dan apa yang kamu capai.':
      'Describe your role in the organization or community and what you achieved.',

    /* --- Sertifikat --- */
    'Klik salah satu kartu untuk melihat sertifikat ukuran penuh.':
      'Click any card to view the certificate at full size.',
    'Contoh: Kursus Online': 'Example: Online Course',
    'Penerbit (ganti)': 'Issuer (replace)',
    'Contoh: Pelatihan Teknis': 'Example: Technical Training',
    'Penyelenggara (ganti)': 'Organizer (replace)',
    'Contoh: Kegiatan Kampus': 'Example: Campus Activity',
    'Lihat kredensial ↗': 'View credential ↗',

    /* --- Kontak --- */
    'Punya proyek, lowongan, atau sekadar ingin berdiskusi? Silakan hubungi saya.':
      'Have a project, a job opening, or just want to chat? Feel free to reach out.',
    'Sedang mencari kolaborator?': 'Looking for a collaborator?',
    'Saya terbuka untuk magang, proyek kolaborasi, maupun diskusi seputar kuliah dan teknologi. Biasanya saya membalas dalam 1×24 jam.':
      "I'm open to internships, collaborative projects, or chats about coursework and technology. I usually reply within 24 hours.",
    'Kirim Email': 'Send Email',

    /* --- Footer --- */
    'Gideon. Dibuat dengan HTML, CSS & JavaScript.':
      'Gideon. Built with HTML, CSS & JavaScript.',
    'Kembali ke atas': 'Back to top',

    /* --- <title> --- */
    'Gideon — Mahasiswa Informatika (Cyber Security)': 'Gideon — Informatics Student (Cyber Security)',
  };

  /* ======================================================================
     2. DICTIONARY — NILAI ATRIBUT  (Indonesia -> English)
     ====================================================================== */
  var ATTR = {
    /* Panel pengaturan */
    'Pengaturan tampilan': 'Display settings',
    'Ubah tampilan: terang / gelap / ikut sistem': 'Change appearance: light / dark / follow system',
    'Pilih mode tampilan': 'Choose display mode',

    /* Navigasi */
    'Navigasi utama': 'Main navigation',
    'Buka menu': 'Open menu',
    'Tutup menu': 'Close menu',

    /* Hero */
    'Foto profil Gideon': 'Profile photo of Gideon',

    /* Proyek */
    'Demo proyek contoh 1': 'Demo for sample project 1',
    'Kode proyek contoh 1': 'Code for sample project 1',
    'Demo proyek contoh 2': 'Demo for sample project 2',
    'Kode proyek contoh 2': 'Code for sample project 2',
    'Demo proyek contoh 3': 'Demo for sample project 3',
    'Kode proyek contoh 3': 'Code for sample project 3',

    /* Sertifikat */
    'Contoh: Kursus Online': 'Example: Online Course',
    'Contoh: Pelatihan Teknis': 'Example: Technical Training',
    'Contoh: Kegiatan Kampus': 'Example: Campus Activity',
    'Penerbit (ganti) · 20XX': 'Issuer (replace) · 20XX',
    'Penyelenggara (ganti) · 20XX': 'Organizer (replace) · 20XX',
    'Perbesar sertifikat Contoh: Kursus Online': 'Enlarge certificate Example: Online Course',
    'Perbesar sertifikat Contoh: Pelatihan Teknis': 'Enlarge certificate Example: Technical Training',
    'Perbesar sertifikat Contoh: Kegiatan Kampus': 'Enlarge certificate Example: Campus Activity',
    'Sertifikat Contoh: Kursus Online': 'Certificate Example: Online Course',
    'Sertifikat Contoh: Pelatihan Teknis': 'Certificate Example: Technical Training',
    'Sertifikat Contoh: Kegiatan Kampus': 'Certificate Example: Campus Activity',

    /* Lightbox */
    'Pratinjau sertifikat': 'Certificate preview',
    'Tutup pratinjau': 'Close preview',

    /* Meta / SEO */
    'Portofolio Gideon, mahasiswa Informatika di Universitas Pelita Harapan dengan fokus Cyber Security. Biodata, proyek, pendidikan, dan sertifikat.':
      "Gideon's portfolio, an Informatics student at Universitas Pelita Harapan focusing on Cyber Security. Bio, projects, education, and certificates.",
    'Portofolio: biodata, proyek, pendidikan, dan sertifikat.':
      'Portfolio: bio, projects, education, and certificates.',
    'Gideon — Mahasiswa Informatika (Cyber Security)': 'Gideon — Informatics Student (Cyber Security)',
  };

  /* ======================================================================
     3. DICTIONARY — JUDUL BERISI TAG HTML  (dipakai via data-i18n-html)
     ====================================================================== */
  var HTML_MAP = {
    'title.biodata': 'Personal <span class="gradient-text">Data</span>',
    'title.proyek': 'Selected <span class="gradient-text">Projects</span>',
    'title.pendidikan': 'Learning <span class="gradient-text">Journey</span>',
    'title.sertifikat': 'Certifications &amp; <span class="gradient-text">Achievements</span>',
    'title.kontak': 'Let\'s <span class="gradient-text">Connect</span>',
  };

  /* Atribut yang ikut diterjemahkan */
  var ATTR_NAMES = [
    'aria-label',
    'title',
    'alt',
    'data-title',
    'data-meta',
    'placeholder',
    'content',
  ];

  /* ======================================================================
     4. MESIN PENERJEMAH
     ====================================================================== */
  var root = document.documentElement;

  /* Rapikan spasi (baris baru & indentasi) supaya teks multi-baris tetap cocok */
  function norm(str) {
    return String(str).replace(/\s+/g, ' ').trim();
  }

  function readLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === 'id' || v === 'en') return v;
    } catch (e) {
      /* localStorage bisa diblokir — abaikan */
    }
    return DEFAULT_LANG;
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* abaikan */
    }
  }

  var currentLang = readLang();

  /* Simpan teks/atribut asli (Bahasa Indonesia) sekali saja */
  var textRecords = [];
  var htmlRecords = [];
  var attrRecords = [];
  var collected = false;

  function collect() {
    if (collected) return;
    collected = true;

    /* --- 4a. Teks biasa --- */
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;

        var tag = parent.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (TEXT[norm(node.nodeValue)] === undefined) return NodeFilter.FILTER_REJECT;

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    while (walker.nextNode()) {
      textRecords.push({ node: walker.currentNode, original: walker.currentNode.nodeValue });
    }

    /* --- 4b. Judul berisi tag HTML --- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (!key || HTML_MAP[key] === undefined) return;
      htmlRecords.push({ el: el, key: key, original: el.innerHTML });
    });

    /* --- 4c. Nilai atribut --- */
    Array.prototype.forEach.call(document.querySelectorAll('*'), function (el) {
      ATTR_NAMES.forEach(function (name) {
        if (!el.hasAttribute(name)) return;
        var value = el.getAttribute(name);
        if (ATTR[value] === undefined) return;
        attrRecords.push({ el: el, name: name, original: value });
      });
    });
  }

  /* Terapkan bahasa terpilih ke seluruh halaman */
  function apply(lang) {
    currentLang = lang;
    collect();

    root.setAttribute('lang', lang);

    var toEnglish = lang === 'en';

    textRecords.forEach(function (rec) {
      var core = norm(rec.original);
      var translated = TEXT[core];

      if (!toEnglish || translated === undefined) {
        rec.node.nodeValue = rec.original;
        return;
      }

      /* pertahankan spasi di awal & akhir */
      var lead = rec.original.match(/^\s*/)[0];
      var trail = rec.original.match(/\s*$/)[0];
      rec.node.nodeValue = lead + translated + trail;
    });

    htmlRecords.forEach(function (rec) {
      rec.el.innerHTML = toEnglish ? HTML_MAP[rec.key] : rec.original;
    });

    attrRecords.forEach(function (rec) {
      var translated = toEnglish ? ATTR[rec.original] : undefined;
      rec.el.setAttribute(rec.name, translated === undefined ? rec.original : translated);
    });

    syncButtons();
  }

  /* Terjemahkan satu teks Indonesia (dipakai skrip lain, mis. main.js) */
  function t(source) {
    var core = norm(source);
    if (currentLang === 'en') {
      if (TEXT[core] !== undefined) return TEXT[core];
      if (ATTR[core] !== undefined) return ATTR[core];
    }
    return source;
  }

  /* ======================================================================
     5. TOMBOL ID / EN DI NAVBAR
     ====================================================================== */
  var buttons = document.querySelectorAll('[data-lang-value]');

  function syncButtons() {
    Array.prototype.forEach.call(buttons, function (btn) {
      var isActive = btn.getAttribute('data-lang-value') === currentLang;
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    saveLang(lang);
    apply(lang);
  }

  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang-value'));
    });

    /* navigasi keyboard (kiri / kanan) */
    btn.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;

      var list = Array.prototype.slice.call(buttons);
      var next = list[(list.indexOf(btn) + dir + list.length) % list.length];
      e.preventDefault();
      next.focus();
      setLang(next.getAttribute('data-lang-value'));
    });
  });

  /* ======================================================================
     6. JALANKAN
     ====================================================================== */
  apply(currentLang);

  /* Dipakai oleh js/main.js supaya label yang diubah saat runtime
     (mis. "Buka menu" / "Tutup menu") ikut mengikuti bahasa. */
  window.__portfolioI18n = {
    t: t,
    set: setLang,
    get: function () {
      return currentLang;
    },
  };
})();
