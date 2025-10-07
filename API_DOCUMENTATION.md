# API Documentation - UMKM Marketplace

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Buyer Endpoints](#buyer-endpoints)
3. [Seller Endpoints](#seller-endpoints)
4. [Product Endpoints](#product-endpoints)
5. [Category Endpoints](#category-endpoints)

---

## Authentication Endpoints

### 1. Register Buyer

Mendaftarkan pengguna baru sebagai buyer. Akun langsung aktif tanpa perlu verifikasi OTP.

**Endpoint:** `POST /auth/register/buyer`

**Request Body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Akun Anda sudah aktif",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67890abcdef12345",
      "nama": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Nama wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Email tidak valid"
}
```
```json
{
  "success": false,
  "message": "Password minimal 6 karakter"
}
```

---

### 2. Register Seller

Mendaftarkan pengguna baru sebagai seller. Akun langsung aktif tanpa perlu verifikasi OTP. Memerlukan upload foto profil toko.

**Endpoint:** `POST /auth/register/seller`

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
namaToko: "Toko Sembako Jaya"
email: "tokosembako@example.com"
password: "password123"
domisili: "Jakarta"
jenisUsaha: "Sembako"
nomorIzinUsaha: "123456789"
alamatUsaha: "Jl. Raya Jakarta No. 123"
whatsapp: "081234567890"
facebook: "tokosembako" (optional)
instagram: "tokosembako" (optional)
fotoProfil: [file upload]
```

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register/seller \
  -F "namaToko=Toko Sembako Jaya" \
  -F "email=tokosembako@example.com" \
  -F "password=password123" \
  -F "domisili=Jakarta" \
  -F "jenisUsaha=Sembako" \
  -F "nomorIzinUsaha=123456789" \
  -F "alamatUsaha=Jl. Raya Jakarta No. 123" \
  -F "whatsapp=081234567890" \
  -F "facebook=tokosembako" \
  -F "instagram=tokosembako" \
  -F "fotoProfil=@/path/to/image.jpg"
```

**Example using JavaScript (Fetch):**
```javascript
const formData = new FormData();
formData.append('namaToko', 'Toko Sembako Jaya');
formData.append('email', 'tokosembako@example.com');
formData.append('password', 'password123');
formData.append('domisili', 'Jakarta');
formData.append('jenisUsaha', 'Sembako');
formData.append('nomorIzinUsaha', '123456789');
formData.append('alamatUsaha', 'Jl. Raya Jakarta No. 123');
formData.append('whatsapp', '081234567890');
formData.append('facebook', 'tokosembako');
formData.append('instagram', 'tokosembako');
formData.append('fotoProfil', fileInput.files[0]);

fetch('http://localhost:5000/api/auth/register/seller', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Akun Anda sudah aktif",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67890abcdef12345",
      "namaToko": "Toko Sembako Jaya",
      "email": "tokosembako@example.com",
      "role": "seller",
      "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```
```json
{
  "success": false,
  "message": "Foto profil wajib diupload"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Nama toko wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Email tidak valid"
}
```
```json
{
  "success": false,
  "message": "Password minimal 6 karakter"
}
```
```json
{
  "success": false,
  "message": "Domisili wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Jenis usaha wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Nomor izin usaha wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Alamat usaha wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Nomor WhatsApp wajib diisi"
}
```

---

### 3. Login

Login untuk buyer dan seller.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200) - Buyer:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67890abcdef12345",
      "email": "john@example.com",
      "role": "buyer",
      "nama": "John Doe"
    }
  }
}
```

**Success Response (200) - Seller:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67890abcdef12345",
      "email": "tokosembako@example.com",
      "role": "seller",
      "namaToko": "Toko Sembako Jaya",
      "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```
```json
{
  "success": false,
  "message": "Akun belum diverifikasi. Silakan cek email Anda"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Email tidak valid"
}
```
```json
{
  "success": false,
  "message": "Password wajib diisi"
}
```

---

### 4. Forgot Password

Mengirim kode OTP ke email untuk reset password.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Kode OTP telah dikirim ke email Anda"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Email tidak terdaftar"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Email tidak valid"
}
```

---

### 5. Reset Password

Reset password menggunakan OTP yang dikirim ke email.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil direset. Silakan login dengan password baru"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "OTP tidak valid atau sudah expired"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Email tidak valid"
}
```
```json
{
  "success": false,
  "message": "OTP harus 6 digit"
}
```
```json
{
  "success": false,
  "message": "Password minimal 6 karakter"
}
```

---

### 6. Get Current User

Mendapatkan informasi user yang sedang login (Protected).

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200) - Buyer:**
```json
{
  "success": true,
  "data": {
    "_id": "67890abcdef12345",
    "role": "buyer",
    "nama": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Success Response (200) - Seller:**
```json
{
  "success": true,
  "data": {
    "_id": "67890abcdef12345",
    "role": "seller",
    "namaToko": "Toko Sembako Jaya",
    "email": "tokosembako@example.com",
    "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
    "domisili": "Jakarta",
    "jenisUsaha": "Sembako",
    "nomorIzinUsaha": "123456789",
    "alamatUsaha": "Jl. Raya Jakarta No. 123",
    "whatsapp": "081234567890",
    "facebook": "tokosembako",
    "instagram": "tokosembako",
    "isVerified": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Token tidak valid"
}
```

---

### 7. Logout

Logout user (Protected).

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Token tidak valid"
}
```

---

## Notes

### Authentication Header
Untuk endpoint yang memerlukan autentikasi (Protected), tambahkan header:
```
Authorization: Bearer <your_jwt_token>
```

### OTP Configuration
- OTP berlaku selama 5 menit (konfigurasi di `.env`: `OTP_EXPIRE_MINUTES=5`)
- OTP terdiri dari 6 digit angka
- OTP hanya digunakan untuk reset password, tidak untuk registrasi

### File Upload
- Format yang didukung: JPG, JPEG, PNG, GIF
- Maksimal ukuran file: 5MB
- File akan diupload ke AWS S3

### Token Expiration
- JWT token berlaku selama 7 hari (konfigurasi di `.env`: `JWT_EXPIRE=7d`)
- Setelah expired, user harus login ulang

---

## Buyer Endpoints

### 1. Get Buyer Profile

Mendapatkan profil buyer yang sedang login.

**Endpoint:** `GET /buyer/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67890abcdef12345",
    "role": "buyer",
    "nama": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Token tidak valid"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Akses ditolak. Hanya buyer yang dapat mengakses endpoint ini"
}
```

---

### 2. Update Buyer Profile

Update profil buyer yang sedang login.

**Endpoint:** `PUT /buyer/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "nama": "John Doe Updated"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "id": "67890abcdef12345",
    "nama": "John Doe Updated",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Nama wajib diisi"
}
```

---

## Seller Endpoints

### 1. Get Seller Profile (Own)

Mendapatkan profil seller yang sedang login.

**Endpoint:** `GET /seller/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67890abcdef12345",
    "role": "seller",
    "namaToko": "Toko Sembako Jaya",
    "email": "tokosembako@example.com",
    "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
    "domisili": "Jakarta",
    "jenisUsaha": "Sembako",
    "nomorIzinUsaha": "123456789",
    "alamatUsaha": "Jl. Raya Jakarta No. 123",
    "whatsapp": "081234567890",
    "facebook": "tokosembako",
    "instagram": "tokosembako",
    "isVerified": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Token tidak valid"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Akses ditolak. Hanya seller yang dapat mengakses endpoint ini"
}
```

---

### 2. Update Seller Profile

Update profil seller yang sedang login. Support upload foto profil baru.

**Endpoint:** `PUT /seller/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
namaToko: "Toko Sembako Jaya Updated" (optional)
domisili: "Jakarta Selatan" (optional)
jenisUsaha: "Sembako & Makanan" (optional)
nomorIzinUsaha: "987654321" (optional)
alamatUsaha: "Jl. Raya Jakarta No. 456" (optional)
whatsapp: "081234567899" (optional)
facebook: "tokosembakojaya" (optional)
instagram: "tokosembakojaya" (optional)
fotoProfil: [file upload] (optional)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profil toko berhasil diupdate",
  "data": {
    "id": "67890abcdef12345",
    "namaToko": "Toko Sembako Jaya Updated",
    "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/new-image.jpg",
    "domisili": "Jakarta Selatan",
    "jenisUsaha": "Sembako & Makanan",
    "nomorIzinUsaha": "987654321",
    "alamatUsaha": "Jl. Raya Jakarta No. 456",
    "whatsapp": "081234567899",
    "facebook": "tokosembakojaya",
    "instagram": "tokosembakojaya"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

---

### 3. Get My Products

Mendapatkan semua produk milik seller yang sedang login.

**Endpoint:** `GET /seller/products`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "product123",
      "sellerId": "67890abcdef12345",
      "nama": "Beras Premium 5kg",
      "deskripsi": "Beras premium kualitas terbaik",
      "harga": 75000,
      "kategori": "Sembako",
      "foto": [
        "https://s3.amazonaws.com/bucket/produk/beras1.jpg",
        "https://s3.amazonaws.com/bucket/produk/beras2.jpg"
      ],
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    {
      "_id": "product456",
      "sellerId": "67890abcdef12345",
      "nama": "Minyak Goreng 2L",
      "deskripsi": "Minyak goreng berkualitas",
      "harga": 35000,
      "kategori": "Sembako",
      "foto": [
        "https://s3.amazonaws.com/bucket/produk/minyak1.jpg"
      ],
      "createdAt": "2025-01-14T10:30:00.000Z",
      "updatedAt": "2025-01-14T10:30:00.000Z"
    }
  ]
}
```

---

### 4. Get Seller by ID (Public)

Semua orang dapat melihat profil seller tertentu tanpa perlu login.

**Endpoint:** `GET /seller/:sellerId/profile`

**Headers:** None (Public endpoint)

**URL Parameters:**
- `sellerId` - ID seller yang ingin dilihat

**Example:** `GET /seller/67890abcdef12345/profile`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67890abcdef12345",
    "role": "seller",
    "namaToko": "Toko Sembako Jaya",
    "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
    "domisili": "Jakarta",
    "jenisUsaha": "Sembako",
    "nomorIzinUsaha": "123456789",
    "alamatUsaha": "Jl. Raya Jakarta No. 123",
    "whatsapp": "081234567890",
    "facebook": "tokosembako",
    "instagram": "tokosembako",
    "isVerified": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Penjual tidak ditemukan"
}
```

---

### 5. Get Seller Products (Public)

Semua orang dapat melihat semua produk dari seller tertentu tanpa perlu login.

**Endpoint:** `GET /seller/:sellerId/products`

**Headers:** None (Public endpoint)

**URL Parameters:**
- `sellerId` - ID seller yang produknya ingin dilihat

**Example:** `GET /seller/67890abcdef12345/products`

**Success Response (200):**
```json
{
  "success": true,
  "seller": {
    "id": "67890abcdef12345",
    "namaToko": "Toko Sembako Jaya",
    "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
    "domisili": "Jakarta"
  },
  "count": 2,
  "data": [
    {
      "_id": "product123",
      "sellerId": {
        "_id": "67890abcdef12345",
        "namaToko": "Toko Sembako Jaya",
        "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
        "domisili": "Jakarta",
        "whatsapp": "081234567890"
      },
      "nama": "Beras Premium 5kg",
      "deskripsi": "Beras premium kualitas terbaik",
      "harga": 75000,
      "kategori": "Sembako",
      "foto": [
        "https://s3.amazonaws.com/bucket/produk/beras1.jpg",
        "https://s3.amazonaws.com/bucket/produk/beras2.jpg"
      ],
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Penjual tidak ditemukan"
}
```

---

## Product Endpoints

### 1. Create Product (Seller)

Seller membuat produk baru. Minimal 1 foto, maksimal 5 foto.

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
nama: "Beras Premium 5kg"
deskripsi: "Beras premium kualitas terbaik dari petani lokal"
harga: 75000
kategori: "Sembako"
foto: [file1, file2, file3] (1-5 files)
```

**Example using JavaScript (Fetch):**
```javascript
const formData = new FormData();
formData.append('nama', 'Beras Premium 5kg');
formData.append('deskripsi', 'Beras premium kualitas terbaik');
formData.append('harga', 75000);
formData.append('kategori', 'Sembako');
formData.append('foto', fileInput1.files[0]);
formData.append('foto', fileInput2.files[0]);

fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Produk berhasil ditambahkan",
  "data": {
    "_id": "product123",
    "sellerId": {
      "_id": "67890abcdef12345",
      "namaToko": "Toko Sembako Jaya",
      "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
      "domisili": "Jakarta"
    },
    "nama": "Beras Premium 5kg",
    "deskripsi": "Beras premium kualitas terbaik dari petani lokal",
    "harga": 75000,
    "kategori": "Sembako",
    "foto": [
      "https://s3.amazonaws.com/bucket/produk/beras1.jpg",
      "https://s3.amazonaws.com/bucket/produk/beras2.jpg"
    ],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Minimal 1 foto produk wajib diupload"
}
```
```json
{
  "success": false,
  "message": "Maksimal 5 foto produk"
}
```
```json
{
  "success": false,
  "message": "Kategori tidak valid"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Nama produk wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Deskripsi produk wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Harga produk wajib diisi"
}
```
```json
{
  "success": false,
  "message": "Kategori produk wajib diisi"
}
```

---

### 2. Update Product (Seller)

Seller update produk miliknya sendiri.

**Endpoint:** `PUT /products/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Content-Type:** `multipart/form-data`

**URL Parameters:**
- `id` - ID produk yang akan diupdate

**Request Body (Form Data - All Optional):**
```
nama: "Beras Premium 10kg" (optional)
deskripsi: "Beras premium kualitas terbaik, ukuran besar" (optional)
harga: 145000 (optional)
kategori: "Sembako" (optional)
foto: [file1, file2] (optional, 1-5 files)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Produk berhasil diupdate",
  "data": {
    "_id": "product123",
    "sellerId": {
      "_id": "67890abcdef12345",
      "namaToko": "Toko Sembako Jaya",
      "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
      "domisili": "Jakarta"
    },
    "nama": "Beras Premium 10kg",
    "deskripsi": "Beras premium kualitas terbaik, ukuran besar",
    "harga": 145000,
    "kategori": "Sembako",
    "foto": [
      "https://s3.amazonaws.com/bucket/produk/beras-new1.jpg",
      "https://s3.amazonaws.com/bucket/produk/beras-new2.jpg"
    ],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk mengupdate produk ini"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Maksimal 5 foto produk"
}
```
```json
{
  "success": false,
  "message": "Kategori tidak valid"
}
```

---

### 3. Delete Product (Seller)

Seller menghapus produk miliknya sendiri.

**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**URL Parameters:**
- `id` - ID produk yang akan dihapus

**Example:** `DELETE /products/product123`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Produk berhasil dihapus"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk menghapus produk ini"
}
```

---

### 4. Get All Products (Public)

Semua orang dapat melihat semua produk dengan fitur search, filter, dan pagination tanpa perlu login.

**Endpoint:** `GET /products`

**Headers:** None (Public endpoint)

**Query Parameters (All Optional):**
- `search` - Cari berdasarkan nama atau deskripsi produk
- `kategori` - Filter berdasarkan kategori
- `sortBy` - Urutkan: `terbaru` (default), `termurah`, `termahal`
- `page` - Halaman (default: 1)
- `limit` - Jumlah data per halaman (default: 10)

**Example Requests:**
```
GET /products
GET /products?search=beras
GET /products?kategori=Sembako
GET /products?kategori=Sembako&sortBy=termurah
GET /products?search=beras&kategori=Sembako&sortBy=termurah&page=1&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "product123",
      "sellerId": {
        "_id": "67890abcdef12345",
        "namaToko": "Toko Sembako Jaya",
        "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
        "domisili": "Jakarta",
        "whatsapp": "081234567890"
      },
      "nama": "Beras Premium 5kg",
      "deskripsi": "Beras premium kualitas terbaik",
      "harga": 75000,
      "kategori": "Sembako",
      "foto": [
        "https://s3.amazonaws.com/bucket/produk/beras1.jpg",
        "https://s3.amazonaws.com/bucket/produk/beras2.jpg"
      ],
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Get Product Detail (Public)

Semua orang dapat melihat detail produk tertentu beserta informasi seller lengkap tanpa perlu login.

**Endpoint:** `GET /products/:id`

**Headers:** None (Public endpoint)

**URL Parameters:**
- `id` - ID produk

**Example:** `GET /products/product123`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "product123",
    "sellerId": {
      "_id": "67890abcdef12345",
      "namaToko": "Toko Sembako Jaya",
      "fotoProfil": "https://s3.amazonaws.com/bucket/profil-toko/image.jpg",
      "domisili": "Jakarta",
      "whatsapp": "081234567890",
      "facebook": "tokosembako",
      "instagram": "tokosembako",
      "alamatUsaha": "Jl. Raya Jakarta No. 123"
    },
    "nama": "Beras Premium 5kg",
    "deskripsi": "Beras premium kualitas terbaik dari petani lokal. Sudah bersertifikat halal dan organik.",
    "harga": 75000,
    "kategori": "Sembako",
    "foto": [
      "https://s3.amazonaws.com/bucket/produk/beras1.jpg",
      "https://s3.amazonaws.com/bucket/produk/beras2.jpg",
      "https://s3.amazonaws.com/bucket/produk/beras3.jpg"
    ],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
```

---

## Category Endpoints

### 1. Get All Categories

Mendapatkan semua kategori produk. Endpoint ini bersifat public (dapat diakses tanpa login).

**Endpoint:** `GET /categories`

**Headers:** None (Public endpoint)

**Success Response (200):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "cat123",
      "nama": "Elektronik",
      "slug": "elektronik",
      "icon": "https://s3.amazonaws.com/bucket/icons/elektronik.png",
      "createdAt": "2025-01-10T10:30:00.000Z",
      "updatedAt": "2025-01-10T10:30:00.000Z"
    },
    {
      "_id": "cat456",
      "nama": "Fashion",
      "slug": "fashion",
      "icon": "https://s3.amazonaws.com/bucket/icons/fashion.png",
      "createdAt": "2025-01-10T10:30:00.000Z",
      "updatedAt": "2025-01-10T10:30:00.000Z"
    },
    {
      "_id": "cat789",
      "nama": "Makanan & Minuman",
      "slug": "makanan-minuman",
      "icon": "https://s3.amazonaws.com/bucket/icons/food.png",
      "createdAt": "2025-01-10T10:30:00.000Z",
      "updatedAt": "2025-01-10T10:30:00.000Z"
    },
    {
      "_id": "cat101",
      "nama": "Sembako",
      "slug": "sembako",
      "icon": "https://s3.amazonaws.com/bucket/icons/sembako.png",
      "createdAt": "2025-01-10T10:30:00.000Z",
      "updatedAt": "2025-01-10T10:30:00.000Z"
    }
  ]
}
```

---

## Additional Notes

### Role-Based Access Control

**Public (tanpa login):**
- Register Buyer (`POST /auth/register/buyer`)
- Register Seller (`POST /auth/register/seller`)
- Login (`POST /auth/login`)
- Forgot Password (`POST /auth/forgot-password`)
- Reset Password (`POST /auth/reset-password`)
- View categories (`GET /categories`)
- View all products (`GET /products`)
- View product detail (`GET /products/:id`)
- **View seller profile (`GET /seller/:sellerId/profile`)** ✨ NEW
- **View seller products (`GET /seller/:sellerId/products`)** ✨ NEW

**Buyer dapat mengakses:**
- Semua endpoint Authentication
- Semua endpoint Buyer (`/buyer/*`)
- Semua endpoint public di atas

**Seller dapat mengakses:**
- Semua endpoint Authentication
- Semua endpoint Seller (`/seller/*`)
- Create, update, delete produk (`POST/PUT/DELETE /products`)
- Semua endpoint public di atas
