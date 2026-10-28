# Website Portfolio

Website portfolio pribadi dengan **mode tampilan Terang / Gelap / Ikut Sistem** dan
**tombol ganti bahasa Indonesia / English**.
Dibuat pakai HTML, CSS, dan JavaScript murni — tanpa build tool, tanpa `npm install`.

## Cara membuka

Klik dua kali `index.html`, atau buka lewat Live Server di editor.

> Catatan: kalau bisa, jalankan lewat server lokal (misalnya ekstensi *Live Server* di VS Code)
> supaya semua fitur berjalan paling optimal. Buka langsung sebagai file juga tetap bisa.

## Struktur

```
portfolio/
├── index.html              <- semua konten ada di sini
├── .nojekyll               <- supaya GitHub Pages tidak memproses lewat Jekyll
├── .gitignore
├── css/
│   ├── variables.css       <- warna & token tema (light + dark)
│   └── style.css           <- layout & komponen
├── js/
│   ├── theme.js            <- logika ganti tema + tombol settings
│   ├── i18n.js             <- tombol bahasa ID/EN + semua terjemahan
│   └── main.js             <- navbar, animasi scroll, lightbox sertifikat
└── assets/
    ├── img/avatar.svg      <- foto profil placeholder
    └── certs/              <- gambar/PDF sertifikat
```

## Cara ganti tema

Klik **ikon gear** di pojok kanan atas (posisinya menempel, tetap terlihat saat scroll).
Pilih salah satu:

| Pilihan | Efek |
| --- | --- |
| Terang | Selalu mode terang |
| Gelap | Selalu mode gelap |
| Ikut Sistem | Mengikuti pengaturan tema di OS pengunjung |

Pilihan **tersimpan otomatis** di `localStorage` browser. Saat pengunjung membuka lagi
website ini, tema terakhir langsung dipakai — tanpa kedipan warna.

### Mengubah tema default pengunjung baru

Buka `index.html`, cari blok konfigurasi di `<head>`:

```js
window.__PORTFOLIO_THEME__ = {
  storageKey: 'portfolio-theme',
  defaultPref: 'system'   // ganti ke 'dark' atau 'light'
};
```

`'system'` = ikut OS pengunjung (pengaturan sekarang). Nilai ini dipakai
oleh script anti-flash dan `js/theme.js`, jadi cukup diubah di satu tempat.

## Cara ganti bahasa (ID / EN)

Klik tombol **ID / EN** di navbar (kanan atas). Seluruh teks halaman langsung
berganti bahasa, dan `<html lang>` ikut disesuaikan untuk pembaca layar.
Pilihan **tersimpan otomatis** di `localStorage` (key `portfolio-lang`).

Bahasa Indonesia adalah bahasa sumber — teks di `index.html` tetap Bahasa
Indonesia, lalu `js/i18n.js` yang menerjemahkannya ke Inggris.

| Yang mau diubah | Letak di `js/i18n.js` |
| --- | --- |
| Teks biasa | object `TEXT` (kunci = teks Indonesia persis seperti di HTML) |
| Nilai atribut (`alt`, `aria-label`, `title`, `data-title`, `data-meta`, `content`) | object `ATTR` |
| Judul yang berisi tag HTML | beri `data-i18n-html="kunci"` di `index.html`, lalu isi `HTML_MAP` |
| Bahasa default pengunjung baru | `DEFAULT_LANG` (`'id'` atau `'en'`) |
| Key penyimpanan | `STORAGE_KEY` |

Tips: kalau menambah teks baru di `index.html`, tambahkan pasangan
Indonesia → Inggris di `TEXT` supaya ikut diterjemahkan. Teks yang tidak ada
di dictionary akan dibiarkan apa adanya (aman).

## Cara mengisi data diri

| Yang mau diubah | Letak |
| --- | --- |
| Nama, role, tagline | `index.html` → bagian `HERO` |
| Foto profil | ganti `assets/img/avatar.svg` (pakai gambar rasio 1:1) |
| Biodata | `index.html` → bagian `BIODATA` |
| Proyek | `index.html` → bagian `PROYEK` |
| Pendidikan & pengalaman | `index.html` → bagian `PENDIDIKAN & PENGALAMAN` |
| Sertifikat | `index.html` → bagian `SERTIFIKAT` |
| Kontak & sosmed | `index.html` → bagian `KONTAK` (termasuk link `mailto:` dan `wa.me`) |

Semua bagian punya komentar penanda di HTML, jadi mudah dicari.

Nilai yang masih bertanda **"Contoh:"** atau **"20XX"** adalah placeholder —
ganti semuanya dengan data aslimu sebelum dipublikasikan.

## Cara menambah sertifikat

1. Taruh file sertifikat di `assets/certs/` (nama bebas, misal `aws-2024.pdf`).
2. Di `index.html`, **copy satu blok** berikut dan ubah isinya:

```html
<article class="cert reveal">
  <button type="button" class="cert__open"
          data-lightbox="assets/certs/NAMA-FILE.png"
          data-title="Judul Sertifikat"
          data-meta="Penerbit &middot; 2024">
    <span class="cert__thumb">
      <img src="assets/certs/NAMA-FILE.png" alt="Sertifikat Judul" loading="lazy" />
    </span>
    <span class="cert__body">
      <span class="cert__title">Judul Sertifikat</span>
      <span class="cert__issuer">Penerbit</span>
    </span>
  </button>
  <div class="cert__foot">
    <span>2024</span>
    <a class="cert__link" href="LINK-KREDENSIAL" target="_blank" rel="noopener">Lihat kredensial ↗</a>
  </div>
</article>
```

Tips: untuk thumbnail, pakai gambar (PNG/JPG/WebP). Lightbox saat ini hanya
untuk gambar. Untuk file PDF, isi `href` dengan alamat PDF-nya (terbuka di tab
baru) dan **jangan** isi `data-lightbox` dengan PDF.

## Cara menambah proyek

1. Buka `index.html`, cari bagian **PROYEK**.
2. **Copy satu blok** berikut dan ubah isinya:

```html
<article class="project reveal">
  <h3 class="project__title">Judul Proyek</h3>
  <p class="project__desc">
    Satu-dua kalimat: masalah yang diselesaikan, stack yang dipakai, dan hasilnya.
  </p>
  <div class="project__tags">
    <span class="tag">Python</span>
    <span class="tag">Algoritma</span>
  </div>
  <div class="project__links">
    <a class="project__link" href="LINK-DEMO" target="_blank" rel="noopener">Demo ↗</a>
    <a class="project__link" href="LINK-REPO" target="_blank" rel="noopener">Kode ↗</a>
  </div>
</article>
```

Tips: 3-6 kartu sudah cukup. Kalau sebuah proyek hanya punya repo tanpa demo,
hapus saja link "Demo".

## Mengubah warna tema

Semua warna ada di `css/variables.css`, terpisah per tema:

```css
:root { --accent: #22d3ee; ... }            /* tema gelap  */
[data-theme="light"] { --accent: #0e7490; } /* tema terang */
```

Ganti nilai `--accent`, `--accent-2`, `--accent-3` untuk mengubah nuansa warna
seluruh halaman sekaligus. Tombol settings tidak perlu diubah.

## Checklist konten sebelum publish

Cari dan ganti semua placeholder yang masih ada. Kata kunci pencarian:
`Contoh:`, `(ganti)`, `20XX`, `nama@email.com`, `+62 812-3456-7890`,
`linkedin.com/in/username`.

- [ ] Nama lengkap — samakan ejaan, lalu lengkapi nama di brand & biodata
- [ ] Foto profil rasio 1:1 (ganti `assets/img/avatar.svg`)
- [ ] Judul halaman, meta description, dan OG title (sudah terisi nama — periksa)
- [ ] Biodata: tempat & tanggal lahir, alamat, dan tahun angkatan (`20XX`)
- [ ] Hero: badge "Terbuka untuk magang & kolaborasi" — sesuaikan statusmu
- [ ] Proyek: ganti 3 kartu contoh dengan proyek asli + link demo/repo
- [ ] Pendidikan & pengalaman: isi tahun, ganti/isi item "Contoh:"
- [ ] Sertifikat: ganti gambar contoh, judul, penerbit, tahun, URL kredensial
- [ ] Email, WhatsApp (link `mailto:` dan `wa.me` ikut diganti)
- [ ] LinkedIn — GitHub sudah terisi, cek `index.html` bagian `KONTAK`

## Deploy ke GitHub Pages

1. Pastikan `gh` dan `git` terpasang, lalu login sekali:
   ```bash
   gh auth login
   ```
2. Dari folder ini:
   ```bash
   git add .
   git commit -m "Initial portfolio"
   gh repo create NAMA-REPO --public --source=. --remote=origin --push
   ```
3. Buka repo di GitHub → **Settings → Pages** → **Deploy from a branch**
   → branch `main`, folder `/ (root)`.
4. Situs tersedia di `https://USERNAME.github.io/NAMA-REPO/`.
   Kalau repo bernama `USERNAME.github.io`, alamatnya ada di root.
5. Untuk custom domain: tambahkan file `CNAME`, atur DNS, lalu aktifkan HTTPS.

Saat menambahkan canonical, `og:url`, JSON-LD, dan `sitemap.xml`, gunakan URL
lengkap halaman GitHub Pages di atas (termasuk nama repo).

## Dukungan browser & aksesibilitas

- Target: dua versi terakhir Chrome, Edge, Firefox, dan Safari.
- Kontras teks kecil sudah disesuaikan ke WCAG AA.
- Navigasi keyboard: Tab, Esc, dan tombol panah di panel tema.
- `prefers-reduced-motion` dihormati.
- Tanpa JavaScript: konten tetap tampil, menu mobile tetap bisa dipakai,
  tema mengikuti OS, dan tombol settings + tombol bahasa disembunyikan.

## Catatan teknis

- Tema mengikuti: `localStorage` → `window.__PORTFOLIO_THEME__.defaultPref`
  (default `system` = pengaturan OS).
- Ada script anti-flash di `<head>` supaya tidak kedip terang sebelum jadi gelap.
- Kalau JavaScript mati, `css/variables.css` otomatis mengikuti tema OS.
- Sudah mendukung navigasi keyboard (Tab / Esc / panah) dan `prefers-reduced-motion`.
- Font diambil dari Google Fonts. Kalau ingin 100% offline, hapus 3 baris
  `<link ...fonts.googleapis.com...>` di `<head>` — font sistem otomatis dipakai.
