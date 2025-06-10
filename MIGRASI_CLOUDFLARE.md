# Product Requirements Document (PRD): Migrasi ke Cloudflare dengan BetterAuth

**1. Latar Belakang**

Proyek ini saat ini berjalan di Vercel untuk hosting dan Supabase untuk layanan backend (database, otentikasi). Untuk mengkonsolidasikan infrastruktur, mengurangi kompleksitas, dan memanfaatkan ekosistem Cloudflare yang terintegrasi, kami akan memigrasikan seluruh tumpukan ke Cloudflare. Otentikasi akan ditingkatkan dengan mengintegrasikan layanan pihak ketiga, BetterAuth, untuk manajemen pengguna yang lebih kuat.

**2. Tujuan**

*   **Migrasi Penuh:** Memindahkan seluruh infrastruktur dari Vercel dan Supabase ke platform Cloudflare.
*   **Otentikasi yang Ditingkatkan:** Mengganti Supabase Auth dengan BetterAuth untuk fitur keamanan dan manajemen pengguna yang lebih canggih.
*   **Konsolidasi:** Menggunakan satu penyedia utama (Cloudflare) untuk hosting, backend, dan database.
*   **Kinerja & Keamanan:** Memanfaatkan jaringan edge Cloudflare untuk meningkatkan kinerja dan keamanan global.

**3. Ringkasan Tumpukan Teknologi Cloudflare**

Untuk mencapai tujuan di atas, kita akan menggunakan layanan-layanan berikut dari ekosistem Cloudflare:

*   **Cloudflare Pages:** Untuk hosting dan deployment frontend Next.js.
*   **Cloudflare D1:** Sebagai database SQL-lite di edge, menggantikan database PostgreSQL Supabase.
*   **Cloudflare Workers:** Untuk menjalankan logika API backend, menggantikan Vercel Functions / Next.js API Routes.
*   **Cloudflare Web Analytics:** Untuk mendapatkan wawasan analitik yang berfokus pada privasi.

**4. Lingkup Migrasi**

Migrasi ini mencakup komponen-komponen berikut:

*   **Hosting:** Dari Vercel ke **Cloudflare Pages**.
*   **Database:** Dari Supabase (PostgreSQL) ke **Cloudflare D1**.
*   **Backend API:** Dari Next.js API Routes di Vercel ke **Cloudflare Workers**.
*   **Otentikasi:** Dari Supabase Auth ke **BetterAuth (Penyedia Pihak Ketiga)**.
*   **Analitik:** Dari Vercel Analytics ke **Cloudflare Web Analytics**.

**5. Persyaratan Fungsional**

**5.1. Migrasi Database (Supabase -> D1)**

*   **[P1] Ekspor Skema:** Skema database dari Supabase harus diekspor.
*   **[P1] Konversi Skema:** Skema PostgreSQL harus dikonversi agar kompatibel dengan SQLite (untuk D1).
*   **[P1] Ekspor Data:** Semua data dari tabel `profiles`, `campaigns`, dan `promoter_campaigns` harus diekspor. Data pengguna (dari `auth.users` Supabase) juga harus diekspor untuk diimpor ke BetterAuth.
*   **[P1] Impor Data:** Data yang diekspor harus diimpor ke dalam tabel Cloudflare D1 dan sistem BetterAuth yang sesuai.

**5.2. Migrasi Backend (API Routes -> Workers)**

*   **[P1] Titik Akhir API:** Semua titik akhir API yang ada di `app/api/` harus dibuat ulang sebagai Cloudflare Workers.
    *   `POST /api/creator-campaigns`: Membuat kampanye baru.
    *   `GET /api/discover-campaigns`: Menemukan kampanye yang tersedia.
    *   `POST /api/join-campaign`: Bergabung dengan kampanye.
*   **[P1] Logika Bisnis:** Logika bisnis di dalam setiap titik akhir harus di-porting untuk berinteraksi dengan Cloudflare D1.
*   **[P1] Otentikasi Worker:** Titik akhir yang memerlukan otentikasi harus divalidasi menggunakan token (misalnya, JWT) yang dikeluarkan oleh BetterAuth.

**5.3. Migrasi Otentikasi (Supabase Auth -> BetterAuth)**

*   **[P1] Integrasi SDK:** SDK BetterAuth harus diintegrasikan ke dalam frontend Next.js.
*   **[P1] Alur Login/Pendaftaran:** Komponen UI dan logika untuk pendaftaran dan login harus diperbarui untuk menggunakan alur otentikasi BetterAuth.
*   **[P1] Migrasi Pengguna:** Pengguna yang ada dari Supabase Auth harus dimigrasikan ke BetterAuth.
*   **[P2] Perlindungan Rute:** Rute yang memerlukan otentikasi (misalnya, `/dashboard`, `/profile`) harus dilindungi menggunakan status otentikasi dari BetterAuth.

**5.4. Migrasi Frontend & Hosting (Vercel -> Pages)**

*   **[P1] Deployment:** Proyek Next.js harus dapat di-deploy ke Cloudflare Pages.
*   **[P1] Variabel Lingkungan:** Semua variabel lingkungan yang diperlukan (untuk D1, BetterAuth, dll.) harus dikonfigurasi di dasbor Cloudflare Pages.
*   **[P1] Penghapusan Dependensi:** Dependensi `@vercel/analytics`, `@vercel/speed-insights`, `@supabase/ssr`, dan `@supabase/supabase-js` harus dihapus dari `package.json`.

**5.5. Migrasi Analitik (Vercel -> Cloudflare)**

*   **[P1] Pengaturan Analitik:** Cloudflare Web Analytics harus diaktifkan untuk domain proyek.

**6. Persyaratan Non-Fungsional**

*   **[P1] Kinerja:** Waktu muat halaman dan respons API harus sama atau lebih baik dari implementasi saat ini.
*   **[P2] Keamanan:** Selain HTTPS, integrasi dengan BetterAuth harus mengikuti semua praktik keamanan yang direkomendasikan.
*   **[P3] Skalabilitas:** Infrastruktur baru harus dapat menangani pertumbuhan pengguna dan lalu lintas di masa depan.

**7. Rencana Implementasi (Tingkat Tinggi)**

1.  **Fase 1: Penyiapan & Migrasi Database**
    *   Siapkan proyek Cloudflare Pages dan database D1.
    *   Lakukan migrasi skema dan data dari Supabase ke D1.
    *   Siapkan akun BetterAuth.

2.  **Fase 2: Otentikasi & Migrasi Pengguna**
    *   Integrasikan SDK BetterAuth ke dalam aplikasi frontend.
    *   Terapkan alur login dan pendaftaran baru.
    *   Migrasikan data pengguna dari Supabase ke BetterAuth.

3.  **Fase 3: Backend & Integrasi**
    *   Kembangkan Cloudflare Workers untuk menangani logika API.
    *   Amankan titik akhir Worker menggunakan validasi token BetterAuth.
    *   Hubungkan logika frontend ke titik akhir Worker yang baru.

4.  **Fase 4: Deployment & Pengujian**
    *   Deploy aplikasi ke Cloudflare Pages.
    *   Lakukan pengujian end-to-end, dengan fokus pada alur otentikasi dan interaksi API.
    *   Aktifkan Cloudflare Web Analytics.

5.  **Fase 5: Go-Live**
    *   Arahkan DNS ke Cloudflare.
    *   Pantau aplikasi untuk setiap masalah.