# Database Seeding & Reset Scripts

Script untuk mengelola database MongoDB pada project UMKM Marketplace.

## Available Scripts

### 1. Reset Database (Hapus Semua Data)

**File:** `resetDatabase.js`

Script ini akan:
- ❌ Menghapus SEMUA users (buyer & seller)
- ❌ Menghapus SEMUA products
- ❌ Menghapus SEMUA categories
- ✅ Seeding ulang kategori default

**Cara menjalankan:**

```bash
# Dari folder api/
npm run db:reset

# Atau langsung
node seeds/resetDatabase.js
```

### 2. Seed Categories Only

**File:** `categorySeeder.js`

Script ini akan:
- ❌ Menghapus kategori lama
- ✅ Seeding kategori baru

**Cara menjalankan:**

```bash
# Dari folder api/
npm run seed:categories

# Atau langsung
node seeds/categorySeeder.js
```

## ⚠️ PERINGATAN

- Script `resetDatabase.js` akan **MENGHAPUS SEMUA DATA** dari database
- Pastikan Anda benar-benar ingin menghapus semua data sebelum menjalankannya
- Gunakan dengan hati-hati, terutama di production!

## Kategori Default

Kategori yang di-seed secara default:
1. Makanan
2. Minuman
3. Fashion & Pakaian
4. Kerajian Tangan
5. Produk Kecantikan & Perawatan Diri

## Persyaratan

Pastikan file `.env` sudah dikonfigurasi dengan benar:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Troubleshooting

Jika muncul error saat menjalankan script:

1. **Connection Error**: Periksa `MONGODB_URI` di file `.env`
2. **Module Not Found**: Jalankan `npm install` terlebih dahulu
3. **Permission Error**: Pastikan database user memiliki akses write
