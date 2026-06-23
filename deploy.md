# 📖 Panduan Lengkap Hosting Aplikasi Network Monitoring ke Railway

> Panduan ini ditulis untuk pemula. Setiap langkah dijelaskan secara detail.

---

## 📋 Daftar Isi

1. [Persiapan — Apa yang Dibutuhkan](#-langkah-1-persiapan--apa-yang-dibutuhkan)
2. [Install Git di Komputer](#-langkah-2-install-git-di-komputer)
3. [Buat Akun GitHub](#-langkah-3-buat-akun-github)
4. [Buat Repository GitHub](#-langkah-4-buat-repository-github)
5. [Push Kode ke GitHub](#-langkah-5-push-kode-ke-github)
6. [Buat Akun Railway](#-langkah-6-buat-akun-railway)
7. [Deploy Backend ke Railway](#-langkah-7-deploy-backend-ke-railway)
8. [Deploy Frontend ke Railway](#-langkah-8-deploy-frontend-ke-railway)
9. [Hubungkan Backend & Frontend (CORS)](#-langkah-9-hubungkan-backend--frontend-cors)
10. [Update Frontend .env.production](#-langkah-10-update-frontend-envproduction)
11. [Verifikasi & Testing](#-langkah-11-verifikasi--testing)
12. [Troubleshooting](#-troubleshooting)

---

## 🔧 Langkah 1: Persiapan — Apa yang Dibutuhkan

Sebelum mulai, pastikan Anda memiliki:

| No | Kebutuhan | Status |
|----|-----------|--------|
| 1 | Komputer dengan Windows | ✅ Sudah ada |
| 2 | Koneksi internet | ✅ Pastikan stabil |
| 3 | Akun GitHub (gratis) | Akan dibuat di Langkah 3 |
| 4 | Akun Railway (gratis $5/bulan) | Akan dibuat di Langkah 6 |
| 5 | Git terinstall di komputer | Akan diinstall di Langkah 2 |
| 6 | Kartu debit/kredit (untuk verifikasi Railway) | Diperlukan, **TIDAK** akan dicharge |

> [!NOTE]
> **Tentang biaya**: Railway memberikan **$5 free credit** per bulan. Aplikasi kecil seperti ini biasanya hanya menghabiskan **~$1-2/bulan**. Kartu debit hanya untuk verifikasi, tidak akan ditarik saldo. Jika tidak punya kartu, gunakan **Render.com** sebagai alternatif (lihat bagian Troubleshooting).

---

## 💻 Langkah 2: Install Git di Komputer

### Cek Apakah Git Sudah Terinstall

Buka **PowerShell** atau **Command Prompt**, ketik:

```
git --version
```

- Jika muncul `git version 2.x.x` → **sudah terinstall**, lanjut ke Langkah 3
- Jika muncul error → ikuti langkah di bawah

### Install Git

1. Buka browser, kunjungi: **https://git-scm.com/download/win**
2. Download installer (64-bit)
3. Jalankan installer, **klik Next terus** (default setting sudah OK)
4. Setelah selesai, **tutup dan buka ulang PowerShell**
5. Ketik `git --version` untuk memastikan berhasil

### Konfigurasi Git (Wajib, Pertama Kali Saja)

Buka PowerShell, jalankan 2 perintah ini (ganti dengan nama & email Anda):

```powershell
git config --global user.name "Rizky"
git config --global user.email "rizky@email.com"
```

> [!TIP]
> Gunakan email yang sama dengan yang akan Anda daftarkan di GitHub.

---

## 🐙 Langkah 3: Buat Akun GitHub

> Jika sudah punya akun GitHub, langsung lanjut ke Langkah 4.

1. Buka **https://github.com**
2. Klik **"Sign up"**
3. Masukkan:
   - **Email** → email aktif Anda
   - **Password** → buat password yang kuat
   - **Username** → pilih username (misal: `rizky005`)
4. Verifikasi email (cek inbox, klik link konfirmasi)
5. Selesai! Anda sekarang punya akun GitHub ✅

---

## 📁 Langkah 4: Buat Repository GitHub

Repository = tempat menyimpan kode Anda di cloud.

1. Login ke **https://github.com**
2. Klik tombol **"+"** di pojok kanan atas → pilih **"New repository"**
3. Isi form:
   - **Repository name**: `network-monitoring-app` (atau nama lain yang Anda suka)
   - **Description**: `Aplikasi Network Monitoring - Kerja Praktik`
   - **Visibility**: Pilih **Private** (agar kode tidak bisa dilihat publik)
   - ❌ **JANGAN** centang "Add a README file"
   - ❌ **JANGAN** centang "Add .gitignore"
   - ❌ **JANGAN** centang "Choose a license"
4. Klik **"Create repository"**
5. Anda akan melihat halaman instruksi — **biarkan halaman ini terbuka**, kita akan pakai di Langkah 5

> [!WARNING]
> Pastikan repository dibuat **kosong** (tanpa README, .gitignore, atau license). Jika tidak kosong, akan terjadi konflik saat push kode.

---

## 🚀 Langkah 5: Push Kode ke GitHub

Ini adalah langkah untuk mengirim kode dari komputer Anda ke GitHub.

### 5.1 Buka Terminal/PowerShell

Buka PowerShell, lalu masuk ke folder proyek:

```powershell
cd "C:\Users\Rizky005\Documents\Data-Rizky\App-KP-Test"
```

### 5.2 Inisialisasi Git Repository

```powershell
git init
```

Output yang diharapkan:
```
Initialized empty Git repository in C:/Users/Rizky005/Documents/Data-Rizky/App-KP-Test/.git/
```

### 5.3 Tambahkan Semua File

```powershell
git add .
```

> [!IMPORTANT]
> Perintah ini akan menambahkan semua file **kecuali** yang ada di `.gitignore`. File sensitif seperti `.env`, `database.sqlite`, dan `node_modules` **TIDAK** akan ikut ter-upload. Ini sudah aman ✅

### 5.4 Verifikasi — File Apa Saja yang Akan Di-upload?

```powershell
git status
```

Pastikan file-file penting muncul (berwarna hijau):
- ✅ `backend/Dockerfile`
- ✅ `backend/server.ts`
- ✅ `backend/src/` (semua file source code)
- ✅ `frontend/Dockerfile`
- ✅ `frontend/src/` (semua file source code)
- ✅ `frontend/.env.production`
- ✅ `docker-compose.yml`

Pastikan file sensitif **TIDAK** muncul:
- ❌ `backend/.env` (rahasia, JANGAN upload)
- ❌ `backend/database.sqlite` (data lokal)
- ❌ `node_modules/` (dependencies, terlalu besar)

### 5.5 Buat Commit Pertama

```powershell
git commit -m "Initial commit - siap deploy ke Railway"
```

### 5.6 Set Branch Utama

```powershell
git branch -M main
```

### 5.7 Hubungkan ke GitHub Repository

> ⚠️ Ganti `USERNAME` dengan username GitHub Anda, dan `network-monitoring-app` dengan nama repo yang Anda buat di Langkah 4.

```powershell
git remote add origin https://github.com/USERNAME/network-monitoring-app.git
```

### 5.8 Push (Upload) Kode

```powershell
git push -u origin main
```

**Pertama kali**, Git akan meminta login GitHub:
- Akan muncul pop-up browser untuk login
- Atau di terminal, masukkan username & **Personal Access Token** (bukan password!)

> [!NOTE]
> **Jika diminta password di terminal**: GitHub sudah tidak menerima password biasa. Anda perlu buat **Personal Access Token**:
> 1. Buka **https://github.com/settings/tokens**
> 2. Klik **"Generate new token (classic)"**
> 3. Beri nama: `Railway Deploy`
> 4. Centang scope: **repo** (full control of private repositories)
> 5. Klik **"Generate token"**
> 6. **COPY token** (hanya ditampilkan sekali!)
> 7. Paste token ini sebagai pengganti password di terminal

### 5.9 Verifikasi

Buka browser → kunjungi `https://github.com/USERNAME/network-monitoring-app`

Anda seharusnya melihat semua file kode Anda di sana. ✅

---

## 🚂 Langkah 6: Buat Akun Railway

1. Buka **https://railway.app**
2. Klik **"Login"** di pojok kanan atas
3. Pilih **"Login with GitHub"**
4. Authorize Railway untuk mengakses akun GitHub Anda
5. Setelah login, Anda akan diminta **verifikasi akun**:
   - Pilih **"Add Credit Card"** (kartu debit Indonesia bisa digunakan)
   - Masukkan data kartu
   - **TIDAK ada biaya** yang dicharge saat verifikasi
   - Anda mendapat **$5 free credit / bulan**

> [!TIP]
> **Kartu debit yang biasa digunakan**: BCA, Mandiri, BNI, BRI (yang ada logo Visa/Mastercard). Jika kartu ditolak, coba kartu lain atau gunakan kartu virtual dari e-wallet (GoPay, OVO, dll).

> [!NOTE]
> **Tidak punya kartu?** Gunakan **Render.com** sebagai alternatif (gratis tanpa kartu). Lihat bagian Troubleshooting di bawah.

---

## 🖥️ Langkah 7: Deploy Backend ke Railway

### 7.1 Buat Project Baru

1. Di Railway dashboard, klik **"New Project"** (tombol besar di tengah halaman)
2. Pilih **"Deploy from GitHub Repo"**
3. Jika pertama kali, klik **"Configure GitHub App"** untuk memberikan akses ke repo
4. Pilih repository `network-monitoring-app`
5. Railway akan mulai build otomatis — **TUNGGU, kita perlu setting dulu!**

### 7.2 Set Root Directory

Karena repo kita punya 2 folder (backend & frontend), kita perlu bilang Railway bahwa service ini **hanya** untuk backend:

1. Klik service yang baru dibuat (kotak yang muncul di canvas)
2. Klik tab **"Settings"**
3. Scroll ke bagian **"Source"**
4. Di field **"Root Directory"**, ketik: **`backend`**
5. Tekan Enter

### 7.3 Tambahkan Environment Variables

Ini adalah langkah **PALING PENTING**. Environment variables berisi konfigurasi rahasia yang tidak boleh ada di kode.

1. Klik tab **"Variables"**
2. Klik **"+ New Variable"** untuk setiap variable di bawah ini:

| Variable | Nilai | Keterangan |
|----------|-------|------------|
| `PORT` | `3002` | Port backend |
| `NODE_ENV` | `production` | Mode production |
| `JWT_SECRET` | *(lihat cara generate di bawah)* | **WAJIB diisi!** Secret untuk JWT token |
| `CORS_ORIGIN` | *(kosongkan dulu, diisi di Langkah 9)* | Domain frontend |
| `TELEGRAM_BOT_TOKEN` | `8761305510:AAGUxpQXsza1spLmAXMI8dW5l5hq5SHEj7Q` | Token bot Telegram Anda |
| `TELEGRAM_CHAT_ID` | `1368975371` | Chat ID Telegram Anda |
| `DISCORD_WEBHOOK_URL` | `https://discord.com/api/webhooks/1481117360646656123/mrLBnvUk7Y_vWhrsccKq5bjJW4uwFhzKrJyHzdXiOuSsHecAx04nhUe5l6EY3ukWFoqn` | Webhook Discord |
| `SMTP_HOST` | `smtp` | Host email SMTP |
| `SMTP_PORT` | `465` | Port SMTP |
| `SMTP_USER` | *(email pengirim Anda)* | Email untuk kirim notifikasi |
| `SMTP_PASS` | *(app password email Anda)* | Password SMTP |

#### Cara Generate JWT_SECRET:

Buka PowerShell di komputer Anda, jalankan:

```powershell
# Cara 1: Menggunakan PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Copy output-nya (string acak panjang), paste sebagai nilai `JWT_SECRET`.

> [!CAUTION]
> **JWT_SECRET** harus diisi dengan string acak yang kuat! Jika kosong, backend akan **crash** di production karena ada pengecekan di [setup.ts](file:///c:/Users/Rizky005/Documents/Data-Rizky/App-KP-Test/backend/src/setup.ts) yang memaksa JWT_SECRET ada di production.

### 7.4 Generate Domain (URL Publik)

1. Klik tab **"Settings"**
2. Scroll ke bagian **"Networking"**
3. Klik **"Generate Domain"**
4. Railway akan membuat URL seperti: `backend-production-xxxx.up.railway.app`
5. **CATAT URL INI!** Anda akan membutuhkannya di Langkah 8 dan 10

### 7.5 Tunggu Deployment Selesai

1. Klik tab **"Deployments"**
2. Anda akan melihat progress build & deploy
3. Tunggu sampai status berubah menjadi ✅ **"Success"**
4. Biasanya memakan waktu **2-5 menit**

### 7.6 Test Backend

Buka browser, kunjungi:

```
https://backend-production-xxxx.up.railway.app/api/health
```

*(ganti `xxxx` dengan URL Railway Anda)*

**Hasil yang diharapkan:**
```json
{"status":"OK"}
```

Jika muncul response di atas, backend Anda sudah **ONLINE**! 🎉

> [!WARNING]
> Jika muncul error, lihat bagian **Troubleshooting** di bawah.

---

## 🎨 Langkah 8: Deploy Frontend ke Railway

### 8.1 Tambah Service Baru

1. Di halaman project Railway yang sama (jangan buat project baru!)
2. Klik tombol **"+ New"** di pojok kanan atas canvas
3. Pilih **"GitHub Repo"**
4. Pilih repository yang sama: `network-monitoring-app`

### 8.2 Set Root Directory

1. Klik service frontend yang baru dibuat
2. Tab **"Settings"** → **"Source"** → **"Root Directory"**: ketik **`frontend`**

### 8.3 Tambahkan Environment Variable

1. Tab **"Variables"**
2. Tambahkan variable:

| Variable | Nilai |
|----------|-------|
| `VITE_API_URL` | `https://backend-production-xxxx.up.railway.app` |

> [!IMPORTANT]
> Ganti `backend-production-xxxx.up.railway.app` dengan URL backend yang Anda catat di Langkah 7.4. URL ini **HARUS** benar, jika salah frontend tidak bisa menghubungi backend.

### 8.4 Generate Domain

1. Tab **"Settings"** → **"Networking"** → **"Generate Domain"**
2. Railway akan membuat URL seperti: `frontend-production-yyyy.up.railway.app`
3. **CATAT URL INI!**

### 8.5 Tunggu Deployment

- Klik tab **"Deployments"**, tunggu sampai ✅ **"Success"**
- Build frontend biasanya **3-7 menit** (karena ada Vite build)

### 8.6 Test Frontend

Buka browser, kunjungi:
```
https://frontend-production-yyyy.up.railway.app
```

Anda seharusnya melihat halaman login aplikasi Network Monitoring! 🎉

> [!NOTE]
> Jangan login dulu! Kita perlu menghubungkan CORS terlebih dahulu (Langkah 9).

---

## 🔗 Langkah 9: Hubungkan Backend & Frontend (CORS)

Saat ini jika Anda coba login, akan muncul error CORS. Ini karena backend belum tahu domain frontend mana yang diizinkan.

1. Kembali ke Railway dashboard
2. Klik **service backend** (yang pertama)
3. Tab **"Variables"**
4. Cari variable `CORS_ORIGIN`
5. Isi nilainya dengan URL frontend:

```
https://frontend-production-yyyy.up.railway.app
```

6. Railway akan **otomatis re-deploy** backend

7. Tunggu deploy selesai (~1-2 menit)

---

## 📝 Langkah 10: Update Frontend .env.production

> [!IMPORTANT]
> Langkah ini **HANYA** diperlukan jika Anda belum mengisi `VITE_API_URL` dengan benar di Railway variables (Langkah 8.3). Jika sudah, langkah ini bisa dilewati.

Jika frontend masih tidak bisa connect ke backend, update file `.env.production` di komputer Anda:

1. Buka file [.env.production](file:///c:/Users/Rizky005/Documents/Data-Rizky/App-KP-Test/frontend/.env.production)
2. Ganti isinya:

```env
VITE_API_URL=https://backend-production-xxxx.up.railway.app
```

3. Commit & push perubahan:

```powershell
cd "C:\Users\Rizky005\Documents\Data-Rizky\App-KP-Test"
git add .
git commit -m "Update API URL untuk production"
git push
```

4. Railway akan **otomatis re-deploy** frontend (karena terdeteksi ada perubahan di GitHub)

---

## ✅ Langkah 11: Verifikasi & Testing

### Checklist Verifikasi

| No | Test | Cara | Hasil yang Diharapkan |
|----|------|------|----------------------|
| 1 | Backend health | Buka `https://backend-xxx.up.railway.app/api/health` | `{"status":"OK"}` |
| 2 | Frontend loading | Buka `https://frontend-yyy.up.railway.app` | Halaman login muncul |
| 3 | Login | Masukkan email & password | Berhasil masuk ke dashboard |
| 4 | API connection | Buka F12 → tab Network, lihat request ke `/api/` | Status 200 (bukan CORS error) |
| 5 | Tambah target | Tambahkan target monitoring baru | Target muncul di dashboard |
| 6 | Monitoring berjalan | Tunggu beberapa menit | Status target berubah (UP/DOWN) |
| 7 | Notifikasi | Trigger alert (matikan target sementara) | Notifikasi masuk di Telegram/Discord |

### Cara Cek Error di Railway

Jika ada masalah:

1. Buka Railway dashboard
2. Klik service yang bermasalah
3. Klik tab **"Deployments"**
4. Klik deployment terbaru
5. Klik **"View Logs"** → di sini Anda bisa melihat log error

---

## 🔧 Troubleshooting

### ❌ "Error: CORS" saat login

**Penyebab**: `CORS_ORIGIN` di backend belum diset atau salah.

**Solusi**:
1. Buka backend service di Railway
2. Tab Variables → pastikan `CORS_ORIGIN` berisi URL frontend yang **persis** (termasuk `https://`)
3. Jangan tambahkan `/` di akhir URL

---

### ❌ "Error: JWT_SECRET missing" — Backend crash

**Penyebab**: Variable `JWT_SECRET` belum diisi.

**Solusi**:
1. Generate JWT_SECRET (lihat Langkah 7.3)
2. Tambahkan di Variables backend

---

### ❌ Frontend menampilkan halaman kosong

**Penyebab**: Build gagal atau `VITE_API_URL` salah.

**Solusi**:
1. Cek deployment logs di Railway
2. Pastikan `VITE_API_URL` sudah benar di Variables
3. Pastikan Root Directory sudah set ke `frontend`

---

### ❌ "Cannot connect to backend" di frontend

**Penyebab**: `VITE_API_URL` salah atau backend belum running.

**Solusi**:
1. Test backend dulu: buka `https://backend-xxx.up.railway.app/api/health`
2. Pastikan `VITE_API_URL` di frontend Variables sesuai

---

### ❌ Data hilang setelah re-deploy

**Penyebab**: SQLite menyimpan data di filesystem container. Setiap re-deploy membuat container baru.

**Solusi untuk demo KP**: Ini normal dan acceptable untuk demo.

**Solusi permanen** (jika butuh data persistent):
- Tambahkan **Railway Volume** (fitur berbayar) di Settings backend
- Atau migrasi ke database cloud gratis seperti **Turso** (SQLite di cloud)

---

### ❌ Tidak punya kartu debit untuk Railway

**Alternatif: Deploy ke Render.com (gratis tanpa kartu)**

1. Buka **https://render.com** → Sign up dengan GitHub
2. Klik **"New +"** → **"Web Service"** → connect repo
3. Set root directory ke `backend`, build command kosong, start command: `bun run server.ts`
4. Ulangi untuk frontend dengan root `frontend`

> [!WARNING]
> Render.com gratis tapi server akan **sleep** setelah 15 menit tidak ada traffic. Request pertama setelah sleep memakan **30-50 detik**. Untuk demo KP, buka website beberapa menit sebelum presentasi agar server sudah "bangun".

---

## 📊 Ringkasan Arsitektur Production

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Project                       │
│                                                         │
│  ┌─────────────────────┐   ┌──────────────────────────┐ │
│  │   Backend Service    │   │    Frontend Service      │ │
│  │                      │   │                          │ │
│  │  Bun + Elysia        │   │  Static files (Vite     │ │
│  │  + SQLite             │◄──│  build) + serve          │ │
│  │                      │   │                          │ │
│  │  Port: 3002          │   │  Port: 3000              │ │
│  │  URL: backend-xxx    │   │  URL: frontend-yyy       │ │
│  │  .up.railway.app     │   │  .up.railway.app         │ │
│  └─────────┬────────────┘   └──────────────────────────┘ │
│            │                                             │
│            ├── Telegram Bot API                          │
│            ├── Discord Webhook                           │
│            └── SMTP Email                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Tips untuk Presentasi KP

1. **Buka website 5 menit sebelum presentasi** — agar server sudah warm
2. **Siapkan data demo** — tambahkan beberapa target monitoring sebelumnya
3. **Screenshot URL** — tunjukkan bahwa app bisa diakses dari mana saja
4. **Siapkan offline fallback** — jalankan app secara lokal juga sebagai backup jika internet kantor bermasalah
