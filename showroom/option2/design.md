---
title: Patra Logistik Design System
description: Dokumentasi Design System asli proyek Patra Logistik (Antigravity)
---

# Patra Logistik Design System (Antigravity)

Dokumen ini merupakan pedoman *single source of truth* (SSOT) yang memuat seluruh token desain, warna, tipografi, jarak (spacing), dan animasi yang diekstrak dari `styles.css` orisinal.

## 1. Color Tokens

### Primary Brand Colors
- **Primary Blue**: `#0056A6` (Digunakan pada tombol utama, teks *heading*, dan *hover state* dasar)
- **Primary Red**: `#ED1C24` (Digunakan untuk aksen, tombol notifikasi, dan *progress bar*)
- **Primary Green**: `#ACC32A` (Digunakan sebagai warna hijau Pertamina, aksen alternatif)
- **Dark Navy**: `#151B26` (Digunakan pada *footer* dan area latar belakang pekat)

### Neutral & Text Colors
- **Text Main**: `#333333` (Warna teks paragraf utama)
- **Text Muted**: `#666666` (Warna teks deskripsi, keterangan tambahan)
- **Background Light**: `#F9F9F9` (Latar belakang *section* atau area terang)
- **White**: `#FFFFFF`

### Functional & State Colors
- **Hover Blue (Darker)**: `#004488` (Untuk *hover* tombol *primary*)
- **Card Background (RTC)**: `#E1EAF0` (Latar belakang kartu khusus seperti RTC, Fin-card, Benefit-card)
- **Card Hover (RTC)**: `#006CB7` (Latar belakang kartu saat di-*hover*)

## 2. Typography

- **Font Family Utama**: `Helvetica` (Wajib untuk semua *heading*, paragraf, tombol, dan elemen UI lainnya. Tidak menggunakan *sans-serif* generik atau Arial).
- **Line Height Global**: `1.6` (Untuk paragraf dan teks secara umum)
- **Font Weights**:
  - Paragraf: `400` (Regular)
  - Tombol/Menu: `500` (Medium)
  - Judul/Sub-judul (*Headings*): `600` (Semi-Bold), `700` (Bold), `800` (Extra Bold), `900` (Black)

## 3. Spacing & Layout

- **Container Max-Width**: `1280px`
- **Container Padding**: `0 24px`
- **Border Radius**: 
  - Secara default menggunakan **ujung tajam/kotak** (`border-radius: 0;`) untuk kartu, tombol utama, dan gambar.
  - Pengecualian hanya untuk elemen *pill* (misalnya 50px) atau lingkaran murni (50%).
- **Button Padding**: `12px 24px`

### Box Shadows
- **Shadow Default (Kartu Ringan)**: `0 4px 6px rgba(0, 0, 0, 0.05)`
- **Shadow Kartu Standar**: `0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)`
- **Shadow Primary Button (Hover)**: `0 6px 16px rgba(0, 90, 156, 0.3)`
- **Shadow Card RTC (Hover)**: `0px 4px 12px rgba(0, 108, 183, 0.2)`

## 4. Interactive States & Animations

### Transisi Dasar
- **Global Transition**: `all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)`
- Saat elemen tombol atau kartu di-*hover*, elemen tersebut umumnya naik/mengambang sebesar `translateY(-3px)` atau `translateY(-2px)`.

### Animasi Kustom
- **Fade Up**:
  - Start: `opacity: 0`, `transform: translateY(60px)`
  - End: `opacity: 1`, `transform: translateY(0)`
  - Durasi: `1.5s`
  - Timing: `cubic-bezier(0.16, 1, 0.3, 1)`
- **Map Dot Pulse**: Menggunakan bayangan melingkar transparan `box-shadow: 0 0 0 4px rgba(237, 28, 36, 0.2)` yang dapat membesar (pulse) saat di-*hover* ke skala `1.5`.

---
*Catatan: Dokumen ini sekarang bertindak sebagai Single Source of Truth untuk migrasi React (Tailwind).*
