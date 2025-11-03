# Panduan Upload Storage cPanel

## Perubahan dari AWS S3 ke Storage Lokal

Backend sudah diubah untuk menggunakan storage lokal cPanel, tidak lagi menggunakan AWS S3.

## Langkah-langkah Deployment di cPanel

### 1. Upload Files ke cPanel

Upload semua file backend ke cPanel melalui File Manager atau FTP, dengan struktur:

```
/home/username/
├── api/                           ← Folder API (di luar public_html, lebih aman)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── public_html/                   ← Web root (public access)
    ├── uploads/                   ← Upload files (accessible via web)
    │   └── .htaccess
    └── .htaccess (jika perlu)
```

**PENTING:** Folder `api` berada di LUAR `public_html` untuk keamanan. Hanya folder `uploads` yang ada di dalam `public_html` agar file bisa diakses via URL.

### 2. Install Dependencies

Login ke cPanel Terminal atau SSH, kemudian:

```bash
cd ~/api
npm install
```

**Note:** Dependencies AWS SDK sudah dihapus dari package.json

### 3. Setup Environment Variables

Edit file `api/.env` dan update konfigurasi berikut:

```env
# Base URL untuk upload files (ganti dengan domain cPanel Anda)
BASE_URL=https://yourdomain.com

# Upload Path - WAJIB diisi dengan absolute path ke public_html/uploads
UPLOAD_PATH=/home/username/public_html/uploads
```

**Cara mendapatkan absolute path:**
```bash
cd ~/public_html/uploads
pwd
# Copy output nya, contoh: /home/cpanelusername/public_html/uploads
```

**Penting:** Ganti `username` dengan username cPanel Anda yang sebenarnya!

### 4. Buat Folder Uploads

Pastikan folder `uploads` sudah ada di `public_html` dengan permission yang benar:

```bash
mkdir -p ~/public_html/uploads
chmod 755 ~/public_html/uploads
```

Upload file `.htaccess` ke folder `~/public_html/uploads/`. File ini akan:
- Mengizinkan akses ke file gambar (jpg, jpeg, png, gif, webp)
- Memblokir akses ke file executable (php, sh, dll)
- Mencegah directory listing
- Enable CORS untuk images

### 5. Setup Node.js di cPanel

1. Login ke cPanel
2. Buka **Setup Node.js App**
3. Klik **Create Application**
4. Isi form:
   - **Node.js version:** Pilih versi terbaru (18.x atau 20.x)
   - **Application mode:** Production
   - **Application root:** `api`
   - **Application URL:** Pilih domain/subdomain Anda
   - **Application startup file:** `server.js`
   - **Environment variables:**
     ```
     PORT=5000
     HOST=127.0.0.1
     ```

5. Klik **Create** dan tunggu setup selesai
6. Copy command untuk restart app (akan digunakan setiap update kode)

### 6. Test Upload

Test endpoint upload dengan Postman atau curl:

**Register/Update Profile (Single Upload):**
```bash
POST https://yourdomain.com/api/auth/register-penjual
Content-Type: multipart/form-data

Field: fotoProfil (file)
```

**Create/Update Product (Multiple Upload):**
```bash
POST https://yourdomain.com/api/products
Content-Type: multipart/form-data

Field: foto (multiple files, max 5)
```

Response akan berisi URL seperti:
```json
{
  "fotoProfilUrl": "https://yourdomain.com/uploads/1234567890-abc123.jpg",
  "fotoUrls": [
    "https://yourdomain.com/uploads/1234567890-abc123.jpg",
    "https://yourdomain.com/uploads/1234567891-def456.jpg"
  ]
}
```

### 7. Akses File Upload

File yang diupload dapat diakses melalui:
```
https://yourdomain.com/uploads/filename.jpg
```

### 8. Backup Uploads (Opsional)

Untuk backup file uploads secara berkala, buat cronjob di cPanel:

```bash
# Backup setiap hari jam 2 pagi
0 2 * * * tar -czf ~/backups/uploads-$(date +\%Y\%m\%d).tar.gz ~/public_html/uploads/
```

## Keuntungan Storage Lokal cPanel

1. **Gratis** - Tidak perlu biaya AWS S3
2. **Sederhana** - Semua di satu tempat
3. **Cepat** - Tidak perlu request ke AWS
4. **Mudah Backup** - Langsung bisa backup via cPanel

## Limitasi Upload

Saat ini limitasi yang diset:
- **Max file size:** 2MB per file
- **File types:** jpeg, jpg, png (bisa ditambah di `api/middleware/upload.js`)
- **Max files:** 5 files untuk multiple upload

## Troubleshooting

### File upload gagal / 500 error

1. Cek permission folder uploads:
   ```bash
   ls -la ~/public_html/uploads
   chmod 755 ~/public_html/uploads
   ```

2. Cek log error Node.js di cPanel

### File tidak bisa diakses / 403 Forbidden

1. Cek file `.htaccess` di folder uploads
2. Pastikan file extension sesuai (jpg, jpeg, png)
3. Cek permission file: `chmod 644 file.jpg`

### BASE_URL salah / URL tidak sesuai

Update `BASE_URL` di file `.env` sesuai domain Anda

## Frontend - Tidak Perlu Diubah!

Frontend **tidak perlu diubah sama sekali** karena hanya menerima URL dari backend. URL berubah dari:

**Sebelum (AWS S3):**
```
https://bucket-name.s3.region.amazonaws.com/uploads/file.jpg
```

**Sesudah (cPanel):**
```
https://yourdomain.com/uploads/file.jpg
```

Frontend tetap hanya perlu display URL yang diterima dari API response.

## Maintenance

- Monitor disk space usage di cPanel
- Backup folder uploads secara berkala
- Hapus file lama yang tidak terpakai jika perlu (bisa buat script cleanup)
