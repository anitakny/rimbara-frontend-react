# RIMBAHARI — Frontend React

Platform digital kolaboratif untuk mendokumentasikan dan menyebarluaskan pengetahuan biokultural masyarakat adat Indonesia.

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Setup & Instalasi](#setup--instalasi)
- [Design System](#design-system)
- [Halaman & Komponen](#halaman--komponen)
- [Koneksi ke Backend](#koneksi-ke-backend)

---

## Tentang Proyek

**RIMBAHARI** (*Research Initiative on Management of Biocultural Heritage and Resilience Innovation*) adalah *living knowledge hub* yang mengarsipkan output program RIMBAHARI — e-zine kehati, story maps, etnografi vignette, hingga portofolio kontributor — dan membuatnya dapat diakses oleh masyarakat adat, akademisi, aktivis, dan publik umum.

Repository ini berisi **frontend React** yang mencakup:
- Landing page publik dengan penjelasan fitur
- Halaman login dan registrasi
- Routing dasar untuk integrasi ke dashboard kontributor

---

## Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Framework UI | React | 18.3 |
| Build Tool | Vite | 5.4 |
| Routing | React Router DOM | 6.28 |
| Styling | Tailwind CSS | 3.4 |
| Icons | Lucide React | 0.454 |
| Font | Fraunces, Inter, Instrument Serif | via Google Fonts |
| PostCSS | Autoprefixer | 10.4 |
| Package Manager | npm | — |

### Mengapa pilihan ini?

- **Vite** — build tool tercepat untuk development React, HMR instan
- **Tailwind CSS** — utility-first dengan custom design tokens untuk design system RIMBAHARI
- **React Router v6** — client-side routing deklaratif, siap untuk nested routes dashboard
- **Lucide React** — ikon SVG ringan, tree-shakeable, konsisten dengan estetika editorial

---

## Struktur Proyek

```
rimbara-frontend-react/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Komponen UI yang dapat digunakan ulang
│   │   ├── Navbar.jsx           # Navigasi utama (sticky, transparan → solid saat scroll)
│   │   ├── Hero.jsx             # Hero section dengan background hutan + batik overlay
│   │   ├── AboutSection.jsx     # Tentang RIMBAHARI + 3 pilar program
│   │   ├── FeaturesSection.jsx  # 6 feature cards sesuai PRD functional requirements
│   │   ├── EtalasePreview.jsx   # Preview publikasi dengan cover berwarna
│   │   ├── MapPreview.jsx       # Visualisasi peta Nusantara + 8 wilayah adat
│   │   ├── ContributorShowcase.jsx  # Cards kontributor dengan role badges
│   │   ├── LoginCTA.jsx         # Call-to-action bergabung / masuk
│   │   └── Footer.jsx           # Footer dengan navigasi & copyright
│   ├── pages/               # Halaman utama (dipetakan ke routes)
│   │   ├── LandingPage.jsx      # Komposisi semua section landing
│   │   ├── LoginPage.jsx        # Form login (split layout)
│   │   └── RegisterPage.jsx     # Form registrasi dengan role selector
│   ├── App.jsx              # Router setup & route definitions
│   ├── main.jsx             # Entry point React
│   └── index.css            # Tailwind directives + custom component classes
├── .claude/
│   └── launch.json          # Preview server config untuk Claude Code
├── index.html               # HTML template + Google Fonts import
├── tailwind.config.js       # Design tokens RIMBAHARI (warna, font, shadow, dll.)
├── vite.config.js           # Konfigurasi Vite
├── postcss.config.js        # PostCSS + Autoprefixer
└── package.json
```

---

## Setup & Instalasi

### Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru

Cek versi yang terinstal:

```bash
node -v
npm -v
```

### Langkah Instalasi

**1. Clone atau masuk ke direktori proyek**

```bash
cd rimbara-frontend-react
```

**2. Install dependencies**

```bash
npm install
```

**3. Jalankan development server**

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### Perintah Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan dev server dengan HMR |
| `npm run build` | Build produksi ke folder `dist/` |
| `npm run preview` | Preview hasil build produksi secara lokal |
| `npm run lint` | Jalankan ESLint untuk cek kode |

---

## Design System

Design system RIMBAHARI terinspirasi dari estetika museum digital, editorial magazine, dan warisan biokultural Nusantara. Semua token didefinisikan di [`tailwind.config.js`](tailwind.config.js).

### Palet Warna

| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `forest` | `#1F3B2D` | Primary dark — button utama, navbar, footer |
| `moss` | `#5C7A4A` | Secondary — badge Mahasiswa, hover state |
| `clay` | `#B85C3E` | Accent hangat — CTA sekunder, badge Pemuda Adat |
| `sienna` | `#8B4A2B` | Accent tua — badge Dosen, gradien panel |
| `bone` | `#F5EFE3` | Background utama — kertas alami, bukan putih murni |
| `sand` | `#E8DCC4` | Surface sekunder — card border, tag background |
| `ink` | `#1A1814` | Teks utama — lebih hangat dari hitam murni |
| `ash` | `#6B665E` | Teks sekunder — body copy, label |

### Tipografi

| Peran | Font | Penggunaan |
|---|---|---|
| Heading | **Fraunces** (serif) | Semua `h1–h6`, judul section |
| Body | **Inter** (sans-serif) | Paragraf, label, navigasi |
| Accent | **Instrument Serif** (italic) | Pull-quote, caption, emphasis |

Skala ukuran: `display` (3.5rem) → `h1` (2.5rem) → `h2` (1.875rem) → `h3` (1.375rem) → `body-lg` (1.125rem) → `body` (1rem) → `caption` (0.875rem)

### Kelas Komponen Global (`index.css`)

| Kelas | Deskripsi |
|---|---|
| `.btn-primary` | Tombol solid Forest → hover Moss |
| `.btn-secondary` | Tombol outline Forest → hover fill Bone |
| `.btn-ghost` | Tombol teks saja dengan underline offset |
| `.card` | Container Bone + shadow subtle + hover lift |
| `.tag` | Chip/label uppercase kecil dengan Sand background |
| `.corner-accent` | Pseudo-element garis siku kiri-atas pada card |
| `.section-divider` | Garis pembagi horizontal dengan ornamen tengah |

### Shadow

```css
subtle:   0 2px 8px rgba(31, 59, 45, 0.08)
elevated: 0 8px 24px rgba(31, 59, 45, 0.14)
warm:     0 4px 16px rgba(31, 59, 45, 0.10)
```

### Transisi

```css
default: 240ms cubic-bezier(0.4, 0, 0.2, 1)
page:    320ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Halaman & Komponen

### `/` — Landing Page

Komposisi linear dari section berikut:

| Section | Komponen | Fitur PRD |
|---|---|---|
| Navigasi | `Navbar` | Transparan saat di atas hero, solid setelah scroll, mobile hamburger |
| Hero | `Hero` | Background hutan + batik overlay, stats, dual CTA |
| Tentang | `AboutSection` | Pull-quote, 3 pilar: Dokumentasi, Partisipasi, Jejaring |
| Fitur | `FeaturesSection` | 6 cards: Flipbook, Peta, Profil, Artikel, Media, Admin (FR-02 s/d FR-08) |
| Etalase | `EtalasePreview` | 4 publikasi preview, filter pills, stats bar |
| Peta | `MapPreview` | Visualisasi 8 wilayah adat, pin interaktif, daftar komunitas |
| Kontributor | `ContributorShowcase` | Cards dengan role badge berwarna per peran |
| CTA | `LoginCTA` | Role cards, tombol daftar & masuk |
| Footer | `Footer` | 3 kolom navigasi, wordmark, copyright |

### `/login` — Halaman Masuk

- Layout split: panel dekoratif kiri (Deep Forest + batik) + form kanan
- Input: Surel, Kata Sandi (dengan toggle visibilitas)
- Link "Lupa kata sandi?" dan navigasi ke registrasi
- **TODO:** Hubungkan ke `POST /api/auth/login/` dan simpan JWT token

### `/register` — Halaman Daftar

- Layout split: panel dekoratif kiri (Clay–Sienna gradient) + form kanan
- Input: Nama, Surel, Role (4 pilihan card), Institusi/Komunitas, Kata Sandi
- **TODO:** Hubungkan ke `POST /api/auth/register/`

---

## Koneksi ke Backend

Backend menggunakan Django REST Framework. Endpoint yang perlu diintegrasikan:

```
POST /api/auth/register/   → Registrasi pengguna baru
POST /api/auth/login/      → Login, return JWT access & refresh token
GET  /api/auth/me/         → Data profil pengguna yang sedang login

GET  /api/articles/        → List artikel published
GET  /api/publications/    → List publikasi etalase
GET  /api/communities/     → List komunitas untuk peta
GET  /api/biodiversity/    → List data keanekaragaman hayati
```

Langkah integrasi yang disarankan:
1. Buat `src/lib/api.js` sebagai HTTP client (misalnya menggunakan `axios` atau `fetch`)
2. Simpan JWT token ke `localStorage` atau `sessionStorage`
3. Buat `src/context/AuthContext.jsx` untuk state autentikasi global
4. Proteksi route dashboard dengan komponen `<PrivateRoute>`

---

*Dokumen ini adalah bagian dari Platform Digital RIMBAHARI — BRWA Indonesia.*
*Versi frontend: 0.0.1 | Terakhir diperbarui: April 2026*
