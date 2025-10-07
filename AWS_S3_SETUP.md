# AWS S3 Setup Guide - UMKM Marketplace

## Problem
Gambar yang diupload ke S3 tidak bisa diakses (Error: Access Denied)

## Solution: Setup Bucket Policy untuk Public Read Access

### Step 1: Buka AWS S3 Console
1. Login ke AWS Console: https://aws.amazon.com/console/
2. Buka S3 Service: https://s3.console.aws.amazon.com/
3. Pilih bucket: **my-blog-api**

### Step 2: Unblock Public Access
1. Go to **Permissions** tab
2. Klik **Edit** di bagian **Block public access (bucket settings)**
3. **UNCHECK** opsi:
   - ❌ Block public access to buckets and objects granted through new public bucket or access point policies
   - ❌ Block public and cross-account access to buckets and objects through any public bucket or access point policies
4. Klik **Save changes**
5. Ketik `confirm` untuk konfirmasi

### Step 3: Add Bucket Policy
1. Masih di **Permissions** tab
2. Scroll ke bagian **Bucket policy**
3. Klik **Edit**
4. Copy paste policy berikut:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-blog-api/*"
        }
    ]
}
```

5. Klik **Save changes**

### Step 4: Verify Configuration
Jalankan test script:
```bash
node utils/testS3.js
```

Buka URL yang muncul di browser. Jika berhasil, Anda akan melihat text "This is a test file from UMKM Backend"

## Security Note
⚠️ **WARNING**: Setting ini membuat SEMUA file di bucket bisa diakses public.

Untuk production, pertimbangkan:
1. Gunakan CloudFront CDN dengan origin access identity
2. Gunakan pre-signed URLs dengan expiration time
3. Buat bucket terpisah untuk file public vs private

## Bucket Policy Explanation

- **Principal: "*"** → Anyone can access
- **Action: "s3:GetObject"** → Only read (download) access
- **Resource: "arn:aws:s3:::my-blog-api/*"** → All files in bucket

Pengguna TIDAK bisa:
- Upload file (butuh credentials)
- Delete file (butuh credentials)
- List files (butuh credentials)

Hanya bisa **download/view** file yang sudah diupload.

## Alternative: Enable ACLs (Easier but deprecated by AWS)

Jika Anda prefer menggunakan ACL (lebih simple tapi AWS tidak recommend):

1. Go to **Permissions** → **Object Ownership**
2. Klik **Edit**
3. Pilih **ACLs enabled**
4. Pilih **Bucket owner preferred**
5. Save changes

Lalu uncomment `ACL: 'public-read'` di file `utils/uploadToS3.js`

## Troubleshooting

### Error: Access Denied (tetap muncul setelah setting)
- Clear browser cache atau coba incognito mode
- Tunggu 1-2 menit untuk propagation
- Pastikan policy sudah saved dengan benar
- Cek region bucket sama dengan di .env (ap-southeast-2)

### Error: Invalid Bucket Policy
- Pastikan nama bucket di policy sama persis: `my-blog-api`
- Pastikan JSON format benar (no trailing comma)
- Pastikan ARN format: `arn:aws:s3:::bucket-name/*` (3 colons)

### Upload Berhasil Tapi Gambar Tidak Muncul
- Cek URL format: `https://bucket-name.s3.region.amazonaws.com/path/file.jpg`
- Pastikan tidak ada typo di region name
- Cek Content-Type sudah benar (image/jpeg, image/png, dll)

## Testing

Setelah setup, upload gambar baru via API dan coba akses URL-nya di browser.
Gambar yang diupload sebelumnya tetap tidak bisa diakses karena policy tidak retroaktif.
