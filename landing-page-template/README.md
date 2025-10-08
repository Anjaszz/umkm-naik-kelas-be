# UMKM Marketplace - Landing Page Template

Template landing page sederhana untuk deep linking app Android.

## Files

- `product.html` - Landing page untuk product detail
- `vercel.json` - Konfigurasi untuk deploy ke Vercel
- `netlify.toml` - Alternatif config untuk Netlify (jika ingin pakai Netlify)

## Setup

### 1. Update API URL

Edit `product.html` line 182:
```javascript
const API_BASE_URL = 'http://192.168.1.111:5000/api';
```

Ganti dengan URL backend API Anda (production).

**Untuk development/testing lokal:**
```javascript
const API_BASE_URL = 'http://192.168.1.111:5000/api'; // Local network
```

**Untuk production (setelah deploy backend):**
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api'; // Production
```

### 2. Update Play Store Package Name

Edit `product.html` line 157:
```html
<a href="https://play.google.com/store/apps/details?id=com.umkm.marketplace"
```

Ganti `com.umkm.marketplace` dengan package name app Anda.

## Deploy ke Vercel (Recommended) 🚀

### Option 1: Vercel CLI (Tercepat)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd landing-page-template
vercel

# Follow prompts:
# - Login/Signup
# - Project name: umkm-marketplace
# - Deploy!

# Production deploy
vercel --prod
```

Domain gratis: `your-project.vercel.app`

### Option 2: GitHub + Auto Deploy

1. Push folder ini ke GitHub repo
2. Login ke https://vercel.com
3. Klik "Add New Project"
4. Import dari GitHub
5. Deploy! Auto deploy setiap push ke main branch

### Option 3: Drag & Drop

1. Buka https://vercel.com/new
2. Drag folder `landing-page-template` ke browser
3. Deploy!

## Keuntungan Vercel

✅ **Deploy super cepat** (< 1 menit)
✅ **CDN global** otomatis
✅ **SSL gratis** otomatis
✅ **Auto deploy** dari Git
✅ **Zero config** - langsung jalan
✅ **Free tier generous** - unlimited projects
✅ **Custom domain** gratis

## Custom Domain

Setelah deploy, setup custom domain:

1. Dashboard → Project Settings → Domains
2. Add Domain → Input domain Anda (contoh: `umkm-marketplace.com`)
3. Update DNS sesuai instruksi:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. SSL otomatis aktif dalam beberapa menit

## Test Local

```bash
# Simple HTTP server
npx serve .

# Atau Python
python -m http.server 8000

# Atau Vercel dev
vercel dev
```

Buka: http://localhost:8000/product.html?id=PRODUCT_ID

## URL Format

Setelah deploy, URL format:
```
https://your-project.vercel.app/product/PRODUCT_ID
https://your-project.vercel.app/product?id=PRODUCT_ID
```

Keduanya akan work karena rewrite di `vercel.json`

## Update Backend .env

Setelah deploy, update `.env` di backend:
```env
WEB_DOMAIN=https://your-project.vercel.app
# atau
WEB_DOMAIN=https://umkm-marketplace.com
```

## Alternatif Hosting Gratis

1. ✅ **Vercel** - https://vercel.com (Recommended)
2. **Netlify** - https://netlify.com
3. **GitHub Pages** - https://pages.github.com
4. **Cloudflare Pages** - https://pages.cloudflare.com

Vercel recommended karena:
- Paling cepat deploy
- Zero configuration
- CDN global terbaik
- Free tier paling generous

## Troubleshooting

### API CORS Error
Pastikan backend sudah enable CORS untuk domain Vercel:
```javascript
// server.js
app.use(cors({
  origin: '*', // atau specific domain
}));
```

### Deep Link Tidak Work
1. Pastikan AndroidManifest.xml sudah benar
2. Test dengan ADB command
3. Deep link hanya work di device fisik, tidak di emulator

### Landing Page Blank
1. Buka browser console (F12) untuk cek error
2. Pastikan `API_BASE_URL` bisa diakses
3. Test API endpoint langsung di browser
