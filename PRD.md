Product Requirements Document (PRD)
NetByte WiFi Billing System
1. Overview
NetByte WiFi Billing System adalah sebuah aplikasi web full-stack (Frontend & Backend) yang bertujuan untuk mengelola sistem tagihan (billing), manajemen paket internet, manajemen pelanggan (users), dan pencatatan transaksi untuk layanan penyedia WiFi RT/RW atau ISP skala kecil. Aplikasi ini juga terintegrasi dengan Payment Gateway (Midtrans) untuk memudahkan pembayaran tagihan pelanggan secara instan.

2. Tech Stack
Frontend: React.js (menggunakan Vite), Tailwind CSS, React Router DOM, Recharts (untuk grafik dashboard), jsPDF (untuk export dan cetak invoice), Axios.
Backend: Node.js, Express.js.
Database: Firebase Firestore.
Authentication: Firebase Authentication / JWT Custom Auth.
Payment Gateway: Midtrans (Snap API).
Deployment: Vercel (untuk Frontend & Backend).
3. Core Features (Fitur Utama)
A. Role: Admin
Dashboard: Menampilkan metrik seperti Total Pendapatan, Jumlah Pengguna Aktif, Transaksi Pending, dan grafik pendapatan per bulan.
User Management: Mendaftarkan, mengedit, dan menghapus data pelanggan WiFi.
Package Management: Mengatur katalog paket WiFi (Nama Paket, Harga, Kecepatan, dan Deskripsi).
Subscription Management: Mengelola langganan aktif dari setiap pelanggan (Assign paket ke user, atur tanggal jatuh tempo/due date).
Reports & Invoices: Melihat semua riwayat transaksi, filter status (sukses/pending), download PDF invoice, dan tracking pembayaran masuk.
B. Role: User / Pelanggan
Dashboard: Melihat status langganan saat ini, paket yang sedang digunakan, dan informasi tagihan bulan ini.
Payment System: Melakukan pembayaran tagihan menggunakan Midtrans Popup/Snap (mendukung E-Wallet, Virtual Account bank, Kartu Kredit, minimarket).
Profile: Mengubah informasi profil akun.