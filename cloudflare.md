# Panduan Deployment ke Cloudflare (Pages & Workers - 100% Gratis)

Panduan ini menjelaskan langkah-langkah untuk melakukan deploy seluruh aplikasi (Frontend ke **Cloudflare Pages** dan Backend ke **Cloudflare Workers** dengan database **Cloudflare D1**) secara gratis.

---

## 📋 Persyaratan Awal
1. Anda harus memiliki akun Cloudflare. Jika belum, daftar di [cloudflare.com](https://dash.cloudflare.com/sign-up).
2. Install NodeJS atau Bun di komputer lokal Anda (pemasangan sudah berjalan dengan Bun).

---

## 🛠️ LANGKAH 1: Inisialisasi Database D1 (SQLite Serverless)
Cloudflare D1 adalah database SQLite serverless gratis yang akan menyimpan semua data aplikasi (User, Target, Histori Ping, dsb).

1. Buka terminal Anda, masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Jalankan login Wrangler ke akun Cloudflare Anda:
   ```bash
   bunx wrangler login
   ```
   *Terminal akan membuka browser untuk melakukan otorisasi login.*

3. Buat database D1 baru bernama `victie-monitor-db`:
   ```bash
   bunx wrangler d1 create victie-monitor-db
   ```
4. Setelah berhasil, terminal akan menampilkan output berisi `database_name` dan `database_id`. Contoh:
   ```text
   [[d1_databases]]
   binding = "DB"
   database_name = "victie-monitor-db"
   database_id = "xxxx-xxxx-xxxx-xxxx"
   ```
5. Buka berkas [wrangler.toml](file:///d:/File-Rizky/Documents/Data-Rizky/App-KP-Test/backend/wrangler.toml) di editor, kemudian ganti nilai `database_id` dengan ID database yang Anda peroleh:
   ```toml
   database_id = "xxxx-xxxx-xxxx-xxxx" # Tempel ID database Anda di sini
   ```
6. Kirim dan eksekusi file skema awal ke database Cloudflare D1 agar semua tabel terbuat:
   ```bash
   bunx wrangler d1 execute victie-monitor-db --remote --file=schema.sql
   ```
   *Pilih `Y` saat diminta konfirmasi untuk mengeksekusi script.*

---

## 🚀 LANGKAH 2: Deploy Backend ke Cloudflare Workers
Backend menggunakan Elysia.js dan dideploy sebagai Serverless Workers.

1. Jalankan perintah deployment dari direktori `backend`:
   ```bash
   bunx wrangler deploy
   ```
2. Setelah sukses, Anda akan mendapatkan URL Backend Worker Anda. Contoh:
   ```text
   https://victie-monitor-backend.username.workers.dev
   ```
   *Catat URL ini, karena akan digunakan sebagai endpoint API untuk Frontend.*

3. **Rahasia (Secrets) Sudah Terpasang:** JWT Secret, Token Telegram, dan Discord Webhook sudah otomatis disetel di dalam file `wrangler.toml` bagian `[vars]`. Anda tidak perlu mengaturnya secara manual lagi!
---

## 💻 LANGKAH 3: Deploy Frontend ke Cloudflare Pages
Frontend menggunakan Vite dan akan dideploy secara gratis dengan build otomatis dari GitHub.

1. Pastikan seluruh perubahan kode terbaru Anda sudah di-push ke repository Git Anda (GitHub/GitLab).
2. Masuk ke **Dashboard Cloudflare** -> klik menu **Workers & Pages** di sidebar -> klik tombol **Create Application** -> pilih tab **Pages**.
3. Klik tombol **Connect to Git** dan pilih repository project Anda.
4. Pada konfigurasi build, atur sebagai berikut:
   * **Project name:** `victie-monitor-frontend` (atau nama pilihan Anda)
   * **Production branch:** `main` (atau branch utama Anda)
   * **Framework preset:** `Vite`
   * **Build command:** `bun run build` atau `npm run build`
   * **Build output directory:** `dist`
   * **Root directory (path):** `frontend`
5. Sebelum mengklik deploy, buka bagian **Environment Variables** (Advanced) dan tambahkan variabel berikut:
   * **Variable Name:** `VITE_API_URL`
   * **Value:** URL Backend Worker yang Anda dapatkan di Langkah 2 (Contoh: `https://victie-monitor-backend.username.workers.dev`)
6. Klik **Save and Deploy**.
7. Cloudflare Pages akan mem-build frontend dan memberikan subdomain gratis seperti `https://victie-monitor-frontend.pages.dev`.

---

## 🕒 LANGKAH 4: Konfigurasi Cron Triggers (Auto-Check Target)
Jadwal pengecekan otomatis (Cron Trigger) untuk memonitor website target sudah didefinisikan di `wrangler.toml` dengan interval **setiap 1 menit** (`* * * * *`).

Secara default, saat Anda melakukan `wrangler deploy` di Langkah 2, trigger cron ini sudah langsung terdaftar dan aktif secara otomatis di Cloudflare Workers. Anda tidak perlu menyetel apa pun lagi!

Untuk memverifikasinya di dashboard Cloudflare:
1. Masuk ke dashboard Cloudflare -> klik **Workers & Pages** -> pilih worker `victie-monitor-backend`.
2. Buka tab **Triggers**.
3. Di sana Anda akan melihat cron trigger `* * * * *` (setiap menit) berstatus aktif.
