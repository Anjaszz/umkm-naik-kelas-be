# Migration Notes: AWS S3 → cPanel Local Storage

## Summary

Backend telah diubah dari menggunakan AWS S3 untuk storage menjadi menggunakan local storage cPanel.

## Files Changed

### Modified Files:
1. **api/package.json** - Menghapus dependencies AWS SDK
2. **api/middleware/upload.js** - Ubah dari memoryStorage ke diskStorage
3. **api/utils/uploadToS3.js** - Logika upload ke local storage
4. **api/server.js** - Tambah serve static files
5. **api/.env** - Replace AWS config dengan BASE_URL

### Deleted Files:
1. **api/config/s3.js** - Tidak diperlukan lagi

### New Files:
1. **uploads/.htaccess** - Security untuk folder uploads
2. **uploads/.gitignore** - Ignore uploaded files
3. **CPANEL_UPLOAD_GUIDE.md** - Panduan deployment

## Breaking Changes

### Environment Variables

**Dihapus:**
```env
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET_NAME
```

**Ditambah:**
```env
BASE_URL=https://yourdomain.com
```

### NPM Dependencies

**Dihapus:**
- @aws-sdk/client-s3
- @aws-sdk/lib-storage

Jalankan: `npm install` untuk update dependencies

## API Response Changes

### Before (AWS S3):
```json
{
  "fotoProfilUrl": "https://bucket-name.s3.region.amazonaws.com/profil-toko/1234567890-abc.jpg"
}
```

### After (Local Storage):
```json
{
  "fotoProfilUrl": "https://yourdomain.com/uploads/1234567890-abc.jpg"
}
```

**Note:** Format response tetap sama, hanya URL yang berubah.

## Frontend Impact

**TIDAK ADA PERUBAHAN DIPERLUKAN DI FRONTEND**

Frontend hanya menerima dan menampilkan URL dari backend. Tidak peduli apakah URL dari S3 atau local storage.

## Deployment Checklist

- [ ] Upload semua file ke cPanel
- [ ] Run `npm install` di folder api
- [ ] Update `BASE_URL` di `.env` sesuai domain
- [ ] Setup Node.js App di cPanel
- [ ] Test upload file
- [ ] Test akses file via URL

## Benefits

1. Zero AWS cost
2. Simpler architecture
3. Easier backup management
4. All in one place (cPanel)

## Security

File `.htaccess` di folder uploads mencegah:
- Akses ke file executable (php, sh, dll)
- Directory listing
- Hanya allow file gambar (jpg, jpeg, png, gif, webp)

## Support

Jika ada masalah, lihat troubleshooting di `CPANEL_UPLOAD_GUIDE.md`
