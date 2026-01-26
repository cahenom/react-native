# Frontend React Native - Merchant Payment System

## Overview
Frontend React Native untuk sistem pembayaran merchant yang terintegrasi dengan backend Laravel. Sistem ini memungkinkan merchant mengirim permintaan pembayaran ke pengguna, dan pengguna dapat menyetujui atau menolak pembayaran tersebut.

## Komponen Utama

### 1. PaymentPage
Komponen halaman pembayaran yang menampilkan detail pembayaran dari merchant dan menyediakan tombol "Batal" dan "Lanjut".

**Fitur:**
- Menampilkan detail pembayaran (nama, id, tujuan, harga, email)
- Tombol "Batal" untuk menolak pembayaran
- Tombol "Lanjut" untuk menyetujui pembayaran
- Loading state saat proses approve/reject
- Integrasi dengan PaymentRequestService

**Props:**
- `paymentRequest` (from route params): Detail permintaan pembayaran

### 2. PaymentSuccessPage
Komponen halaman success yang ditampilkan setelah pembayaran berhasil disetujui.

**Fitur:**
- Tampilan ikon centang dan pesan sukses
- Ringkasan detail pembayaran
- Tombol "Selesai" untuk kembali ke halaman utama

**Props:**
- `paymentDetails` (from route params): Detail pembayaran yang berhasil

### 3. PaymentRequestsList
Komponen daftar permintaan pembayaran yang tertunda.

**Fitur:**
- Menampilkan daftar semua permintaan pembayaran yang tertunda
- Pull to refresh
- Loading state
- Tap pada item untuk melihat detail pembayaran
- Tampilan kosong jika tidak ada permintaan pembayaran

### 4. PaymentRequestService
Layanan untuk mengelola permintaan pembayaran.

**Metode:**
- `registerFCMToken()` - Mendaftarkan FCM token ke backend
- `getPendingPaymentRequests()` - Mendapatkan daftar permintaan pembayaran yang tertunda
- `approvePaymentRequest(requestId)` - Menyetujui permintaan pembayaran
- `rejectPaymentRequest(requestId)` - Menolak permintaan pembayaran
- `initializeNotificationListener(navigation)` - Menginisialisasi listener notifikasi

## Integrasi dengan Backend

### Endpoint API
- `POST /api/merchant` - Dikirim oleh merchant untuk membuat permintaan pembayaran
- `GET /api/payment-requests/pending` - Mendapatkan permintaan pembayaran yang tertunda
- `POST /api/payment-requests/{id}/approve` - Menyetujui permintaan pembayaran
- `POST /api/payment-requests/{id}/reject` - Menolak permintaan pembayaran
- `POST /api/fcm/token` - Mendaftarkan FCM token

### Notifikasi FCM
- Sistem menggunakan Firebase Cloud Messaging untuk mengirim notifikasi ke pengguna
- Ketika merchant mengirim permintaan pembayaran, pengguna menerima notifikasi
- Notifikasi membuka halaman PaymentPage saat diklik

## Struktur Navigasi

### Rute Baru Ditambahkan
- `PaymentPage` - Halaman detail pembayaran
- `PaymentSuccessPage` - Halaman konfirmasi pembayaran berhasil
- `PaymentRequestsList` - Daftar permintaan pembayaran yang tertunda

### Integrasi ke Halaman Profil
- Tombol "Permintaan Pembayaran" ditambahkan ke halaman profil
- Mengarahkan ke daftar permintaan pembayaran yang tertunda

## Cara Kerja

1. **Merchant mengirim permintaan pembayaran** ke endpoint `/api/merchant`
2. **Backend menyimpan permintaan** dan mengirim notifikasi FCM ke pengguna
3. **Pengguna menerima notifikasi** dan dapat membuka halaman pembayaran
4. **Pengguna melihat detail pembayaran** di halaman PaymentPage
5. **Pengguna memilih** untuk menyetujui (Lanjut) atau menolak (Batal)
6. **Setelah menyetujui**, pengguna diarahkan ke halaman PaymentSuccessPage
7. **Pengguna juga dapat** melihat semua permintaan pembayaran dari halaman profil

## Konfigurasi

Pastikan untuk mengkonfigurasi:
- Alamat backend di `PaymentRequestService.js` (ganti `http://192.168.1.10:8000` dengan alamat backend Anda)
- Firebase Messaging diatur dengan benar untuk menerima notifikasi
- AsyncStorage digunakan untuk menyimpan token otentikasi

## Dependencies
- `@react-native-firebase/messaging` - untuk notifikasi FCM
- `@react-native-async-storage/async-storage` - untuk menyimpan data lokal
- `axios` - untuk permintaan HTTP ke backend
- `@react-navigation/native` - untuk navigasi antar halaman