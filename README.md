# Study with Mbah — Full Backend Upgrade

Versi ini mengubah website static menjadi app dengan:

- Supabase Auth (email/password + anonymous guest)
- PostgreSQL untuk profile, tryout, dan histori quiz
- Row Level Security (RLS)
- Validasi database untuk score, nama, tanggal, dan ownership
- Dashboard akun
- Grafik progres tryout
- Histori quiz
- Theme persistence
- Safe DOM rendering untuk data pengguna
- Escape key untuk modal
- `prefers-reduced-motion`
- UI tetap bisa di-host di GitHub Pages

## Setup

1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Aktifkan Anonymous Sign-Ins bila ingin tombol “Lanjut sebagai Tamu”.
4. Isi `js/config.js`:

```js
window.SMB_CONFIG = Object.freeze({
  SUPABASE_URL: 'https://PROJECT_ID.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'YOUR_PUBLISHABLE_KEY'
});
```

5. Upload seluruh folder ke GitHub Pages.
6. Jangan pernah memasukkan service-role / secret key ke frontend.

## Arsitektur

```text
Browser
  ↓
Supabase Auth
  ↓
supabase-js
  ↓
PostgreSQL + RLS
```

## Database

`profiles`
- display name
- target PTN
- target jurusan
- target skor

`tryout_attempts`
- nama tryout
- skor
- tanggal
- user_id

`quiz_attempts`
- quiz key
- skor
- total
- accuracy
- timestamp

## Catatan

Anonymous account berguna untuk frictionless onboarding, tetapi data guest tetap terkait ke identitas anonymous user tersebut. Untuk pengalaman lintas perangkat yang dapat dipulihkan, gunakan email/password.
