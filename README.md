# ViraLink - Platform Kampanye Kreator Konten

[![Dibangun dengan Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Diterapkan di Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Didukung oleh Prisma](https://img.shields.io/badge/Powered%20by-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)

ViraLink adalah platform yang dirancang untuk menghubungkan kreator konten dengan promotor. Kreator dapat meluncurkan dan mengelola kampanye promosi, sementara promotor dapat menemukan dan berpartisipasi dalam kampanye yang sesuai dengan minat mereka.

## Fitur Utama

-   **Otentikasi Pengguna:** Sistem masuk dan pendaftaran yang aman menggunakan Better Auth.
-   **Manajemen Kampanye:** Buat, perbarui, dan kelola kampanye promosi dengan mudah.
-   **Dasbor Promotor:** Lihat kampanye yang diikuti dan kelola partisipasi Anda.
-   **Penemuan Kampanye:** Jelajahi dan temukan kampanye baru untuk diikuti.
-   **Profil Pengguna:** Kelola informasi profil Anda.

## Tumpukan Teknologi

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
-   **Gaya:** [Tailwind CSS](https://tailwindcss.com/)
-   **Komponen UI:** [Shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Otentikasi:** [Better Auth](https://better-auth.dev/)
-   **Manajemen Form:** [React Hook Form](https://react-hook-form.com/)
-   **Validasi Skema:** [Zod](https://zod.dev/)

## Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah di bawah ini.

### Prasyarat

-   Node.js (v18 atau lebih baru)
-   pnpm

### Instalasi

1.  **Kloning repositori:**
    ```bash
    git clone https://github.com/rendoarsandi/ViraLink.git
    cd ViraLink
    ```

2.  **Instal dependensi:**
    ```bash
    pnpm install
    ```

3.  **Siapkan variabel lingkungan:**
    Buat file `.env` di root proyek dengan menyalin dari `.env.example` dan isi nilainya.
    ```bash
    cp .env.example .env
    ```

4.  **Jalankan migrasi basis data:**
    Pastikan Anda memiliki basis data yang berjalan dan URL koneksi sudah benar di `.env`.
    ```bash
    pnpm prisma migrate dev
    ```

5.  **Jalankan server pengembangan:**
    ```bash
    pnpm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Variabel Lingkungan

Untuk menjalankan aplikasi ini, Anda perlu menambahkan variabel berikut ke file `.env` Anda:

-   `NEXT_PUBLIC_BETTERAUTH_CLIENT_KEY`: Kunci klien BetterAuth Anda.
-   `BETTERAUTH_SECRET_KEY`: Kunci rahasia BetterAuth Anda.
-   `CLOUDFLARE_DB_ID`: ID basis data Cloudflare D1 Anda (jika digunakan).
-   `DATABASE_URL`: URL koneksi untuk basis data Prisma Anda.

## Penerapan

Branch `cloudflare-deployment` telah disiapkan untuk penerapan ke platform seperti Cloudflare Pages atau Vercel. Pastikan untuk mengonfigurasi variabel lingkungan di penyedia hosting Anda.
