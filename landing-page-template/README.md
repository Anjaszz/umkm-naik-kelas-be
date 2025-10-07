# UMKM Marketplace - Landing Page Template

Template landing page sederhana untuk deep linking app Android.

## Files

- `product.html` - Landing page untuk product detail
- `netlify.toml` - Konfigurasi untuk deploy ke Netlify

## Setup

### 1. Update API URL

Edit `product.html` line 182:
```javascript
const API_BASE_URL = 'http://192.168.1.111:5000/api';
```

Ganti dengan URL backend API Anda.

### 2. Update Play Store Package Name

Edit `product.html` line 157:
```html
<a href="https://play.google.com/store/apps/details?id=com.umkm.marketplace"
```

Ganti `com.umkm.marketplace` dengan package name app Anda.

## Deploy ke Netlify

### Option 1: Drag & Drop (Paling Mudah)

1. Buka https://app.netlify.com/drop
2. Drag folder `landing-page-template` ke browser
3. Selesai! Domain gratis: `random-name.netlify.app`

### Option 2: GitHub + Auto Deploy

1. Push folder ini ke GitHub repo
2. Login ke https://netlify.com
3. Klik "New site from Git"
4. Pilih repo Anda
5. Deploy! Auto deploy setiap push

### Option 3: Netlify CLI

```bash
npm install -g netlify-cli
cd landing-page-template
netlify deploy --prod
```

## Custom Domain

Setelah deploy, bisa setup custom domain di Netlify:
1. Dashboard → Domain settings → Add custom domain
2. Input domain Anda (contoh: umkm-marketplace.com)
3. Update DNS sesuai instruksi Netlify
4. SSL otomatis aktif

## Test Local

Bisa test di local dengan:
```bash
npx serve .
# atau
python -m http.server 8000
```

Buka: http://localhost:8000/product.html?id=PRODUCT_ID

## URL Format

Setelah deploy, URL format:
```
https://your-site.netlify.app/product/PRODUCT_ID
https://your-site.netlify.app/product?id=PRODUCT_ID
```

Keduanya akan work karena redirect di `netlify.toml`

## Update Backend .env

Setelah deploy, update `.env` di backend:
```env
WEB_DOMAIN=https://your-site.netlify.app
```

## Alternatif Hosting Gratis

1. **Vercel** - https://vercel.com
2. **GitHub Pages** - https://pages.github.com
3. **Cloudflare Pages** - https://pages.cloudflare.com
4. **Surge** - https://surge.sh

Semua support static HTML dan gratis dengan SSL.
