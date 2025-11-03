# Panduan Deployment ke cPanel Shared Hosting

Panduan ini menjelaskan cara deploy Backend Express.js dan Landing Page dalam satu cPanel dengan struktur:
- **Landing Page**: `https://yourdomain.com` (root domain)
- **Backend API**: `https://yourdomain.com/api` (subdirektori /api)

## Prasyarat

1. ✅ cPanel shared hosting dengan support Node.js
2. ✅ SSH access (optional, tapi sangat membantu)
3. ✅ File Manager di cPanel
4. ✅ Node.js Application manager di cPanel (biasanya di Software section)

---

## Struktur Folder di cPanel

```
public_html/                          # Root domain (yourdomain.com)
├── index.html                        # Landing page utama (dari folder frontend/)
├── product.html                      # Halaman produk (dari folder frontend/)
├── .htaccess                         # Config untuk frontend
│
└── api/                              # Subdirektori untuk backend (yourdomain.com/api)
    ├── server.js                     # atau server.production.js
    ├── package.json
    ├── package-lock.json
    ├── .env                          # Environment variables
    ├── .htaccess                     # Config untuk routing API
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── seeds/
    ├── utils/
    └── validators/
```

---

## Langkah-langkah Deployment

### 1. Upload Files ke cPanel

#### A. Upload Frontend (Landing Page)
1. Masuk ke cPanel → File Manager
2. Buka folder `public_html/`
3. Upload file-file dari folder `frontend/`:
   - `index.html`
   - `product.html`
   - File CSS/JS lainnya (jika ada)

#### B. Upload Backend (API)
1. Di dalam `public_html/`, buat folder baru bernama `api/`
2. Upload semua file backend ke folder `public_html/api/`:
   ```
   - server.js (atau rename server.production.js menjadi server.js)
   - package.json
   - package-lock.json
   - .env (PENTING: isi dengan environment variables)
   - config/
   - controllers/
   - middleware/
   - models/
   - routes/
   - seeds/
   - utils/
   - validators/
   ```

3. **JANGAN upload folder:**
   - `node_modules/` (akan di-install di server)
   - `frontend/` (sudah diupload di root)
   - `.git/`

---

### 2. Setup .htaccess Files

#### A. .htaccess di `public_html/` (Root - untuk Frontend)

File: `public_html/.htaccess`

```apache
# .htaccess untuk ROOT (public_html/)
# File ini untuk landing page (frontend)

# Enable RewriteEngine
RewriteEngine On

# Redirect all API requests to the /api subdirectory
# This will pass requests like /api/auth/login to the Node.js app in /api folder
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ /api/$1 [L,P]

# If request is for a file or directory that exists, serve it
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Otherwise, serve index.html (for SPA routing if needed)
# Comment this out if you don't need SPA routing
# RewriteRule ^(.*)$ /index.html [L]

# Set default document
DirectoryIndex index.html

# Enable CORS for frontend (if needed)
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Prevent directory listing
Options -Indexes
```

**Gunakan file:** `.htaccess.root` yang sudah dibuat (copy ke `public_html/.htaccess`)

#### B. .htaccess di `public_html/api/` (Backend)

File: `public_html/api/.htaccess`

```apache
# .htaccess untuk /api subdirectory (public_html/api/)
# File ini untuk Backend Express.js Node.js application

# Disable directory browsing
Options -Indexes

# Enable RewriteEngine
RewriteEngine On

# Proxy all requests to Node.js application
# Pastikan port sesuai dengan yang digunakan di server.js (default: 5000)

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:5000/api/$1 [P,L]

# Handle preflight OPTIONS requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ http://localhost:5000/api/$1 [P,L]

# Enable Proxy
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass / http://localhost:5000/api/
    ProxyPassReverse / http://localhost:5000/api/
</IfModule>

# CORS Headers
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Expose-Headers "Content-Range, X-Content-Range"
</IfModule>
```

**Gunakan file:** `.htaccess.api` yang sudah dibuat (copy ke `public_html/api/.htaccess`)

---

### 3. Setup Environment Variables (.env)

Buat file `.env` di `public_html/api/.env`:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=127.0.0.1

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# AWS S3 Configuration (jika menggunakan S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=your-bucket-name

# Email Configuration (jika menggunakan Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL (untuk CORS dan deep linking)
FRONTEND_URL=https://yourdomain.com
```

**PENTING:**
- Ganti semua nilai dengan credentials yang sebenarnya
- Jangan commit file `.env` ke Git
- Pastikan MongoDB URI menggunakan MongoDB Atlas (cloud) karena shared hosting biasanya tidak support MongoDB local

---

### 4. Setup Node.js Application di cPanel

1. **Masuk ke cPanel → Setup Node.js App** (di section Software)

2. **Create Application** dengan settings:
   ```
   Node.js Version: Pilih versi terbaru (minimal v16)
   Application Mode: Production
   Application Root: api
   Application URL: yourdomain.com/api
   Application Startup File: server.js (atau server.production.js)
   ```

3. **Set Environment Variables** (jika ada opsi di UI):
   - Atau pastikan file `.env` sudah ada di folder `api/`

4. **Klik "Create"**

---

### 5. Install Dependencies

Ada 2 cara:

#### Cara 1: Via cPanel Terminal (Recommended)
1. Buka **Terminal** di cPanel
2. Navigate ke folder api:
   ```bash
   cd public_html/api
   ```
3. Install dependencies:
   ```bash
   npm install --production
   ```

#### Cara 2: Via Node.js App Manager
1. Di Node.js App setup page, ada tombol "Run NPM Install"
2. Klik tombol tersebut

---

### 6. Start Application

1. Di **Node.js App Manager**, klik tombol **"Start"** atau **"Restart"**
2. Tunggu beberapa saat hingga status menjadi "Running"

---

### 7. Verifikasi Deployment

#### A. Test Landing Page
Buka browser, akses:
```
https://yourdomain.com
```
Seharusnya menampilkan `index.html` dari frontend

#### B. Test Backend API
Buka browser, akses:
```
https://yourdomain.com/api/health
```

Response yang diharapkan:
```json
{
  "status": "OK",
  "message": "UMKM Marketplace API is running",
  "timestamp": "2024-10-18T10:30:00.000Z",
  "environment": "production"
}
```

#### C. Test API Endpoints
```
# Auth endpoints
https://yourdomain.com/api/auth/register
https://yourdomain.com/api/auth/login

# Product endpoints
https://yourdomain.com/api/products

# Categories
https://yourdomain.com/api/categories
```

---

### 8. Troubleshooting

#### Problem: API tidak bisa diakses (404 Error)

**Solusi:**
1. Cek apakah Node.js app sudah running di cPanel
2. Verifikasi file `.htaccess` di `public_html/api/`
3. Cek log error di cPanel → Node.js App → View Logs
4. Pastikan port di `.htaccess` sama dengan PORT di `.env` (default: 5000)

#### Problem: CORS Error

**Solusi:**
1. Pastikan CORS sudah enabled di `server.js` (sudah ada di kode)
2. Verifikasi `.htaccess` di `public_html/api/` memiliki CORS headers
3. Cek `FRONTEND_URL` di `.env`

#### Problem: MongoDB Connection Failed

**Solusi:**
1. Pastikan menggunakan MongoDB Atlas (cloud)
2. Whitelist IP address dari cPanel hosting di MongoDB Atlas
   - Atau gunakan "Allow access from anywhere" (0.0.0.0/0)
3. Verifikasi `MONGODB_URI` di `.env`

#### Problem: 502 Bad Gateway atau 503 Service Unavailable

**Solusi:**
1. Node.js app mungkin crash atau tidak running
2. Cek logs di cPanel → Node.js App → View Logs
3. Restart aplikasi
4. Pastikan `package.json` memiliki semua dependencies yang dibutuhkan

#### Problem: Module Not Found Error

**Solusi:**
```bash
cd public_html/api
npm install
```
Atau restart dan run npm install di Node.js App Manager

---

### 9. Update/Redeploy

Ketika ada perubahan kode:

1. Upload file yang diubah via File Manager atau FTP
2. Restart Node.js application di cPanel:
   - Masuk ke Node.js App Manager
   - Klik "Restart"

3. Clear cache jika perlu:
   ```bash
   cd public_html/api
   rm -rf node_modules
   npm install --production
   ```

---

### 10. Monitoring & Maintenance

#### A. View Logs
- cPanel → Node.js App → klik aplikasi → "View Logs"
- Check error logs jika ada masalah

#### B. Restart App
- Jika API tidak merespon, coba restart via Node.js App Manager

#### C. Database Backup
- Backup MongoDB database secara berkala via MongoDB Atlas

#### D. SSL Certificate
- Pastikan SSL certificate aktif untuk HTTPS:
  - cPanel → SSL/TLS → Install Let's Encrypt (gratis)

---

## Port Configuration (PENTING!)

### Port yang Perlu Disesuaikan

1. **Di `.env`:**
   ```env
   PORT=5000  # Bisa diganti sesuai kebutuhan
   ```

2. **Di `.htaccess.api`:**
   ```apache
   RewriteRule ^(.*)$ http://localhost:5000/api/$1 [P,L]
   ProxyPass / http://localhost:5000/api/
   ProxyPassReverse / http://localhost:5000/api/
   ```
   Ganti `5000` dengan port yang sama di semua tempat

3. **Di cPanel Node.js App Setup:**
   - Biasanya port di-assign otomatis
   - Gunakan port yang sama dengan `.env`

**Rekomendasi Port untuk cPanel:**
- 5000, 5001, 5002, 3000, 3001, 8000, 8080, 8081
- Hindari port < 1024 (memerlukan root access)
- Tanyakan ke hosting provider port mana yang diperbolehkan

---

## Checklist Deployment

Gunakan checklist ini untuk memastikan semua sudah benar:

- [ ] Frontend files (index.html, product.html) di `public_html/`
- [ ] Backend files di `public_html/api/`
- [ ] `.htaccess` di `public_html/` (untuk frontend)
- [ ] `.htaccess` di `public_html/api/` (untuk backend)
- [ ] `.env` file di `public_html/api/.env` dengan semua credentials
- [ ] MongoDB Atlas database sudah dibuat dan accessible
- [ ] MongoDB IP whitelist sudah di-set
- [ ] Node.js app sudah dibuat di cPanel
- [ ] Dependencies sudah di-install (`npm install`)
- [ ] Node.js app dalam status "Running"
- [ ] SSL certificate aktif (HTTPS)
- [ ] Test `https://yourdomain.com` → landing page muncul
- [ ] Test `https://yourdomain.com/api/health` → JSON response OK
- [ ] Test API endpoints (auth, products, dll) berfungsi

---

## File Reference

File-file yang sudah dibuat untuk deployment:

1. **`.htaccess.root`** → Copy ke `public_html/.htaccess`
2. **`.htaccess.api`** → Copy ke `public_html/api/.htaccess`
3. **`server.production.js`** → Rename menjadi `server.js` di production (atau gunakan langsung)

---

## Support & Resources

- **cPanel Documentation**: https://docs.cpanel.net/
- **Node.js di cPanel**: https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Let's Encrypt SSL**: https://letsencrypt.org/

---

## Kesimpulan

Dengan setup ini:
- ✅ Landing page accessible di `https://yourdomain.com`
- ✅ Backend API accessible di `https://yourdomain.com/api/*`
- ✅ Semua dalam 1 cPanel account
- ✅ Menggunakan 1 domain
- ✅ SSL/HTTPS compatible
- ✅ Easy to maintain dan update

**Selamat Deploy! 🚀**
