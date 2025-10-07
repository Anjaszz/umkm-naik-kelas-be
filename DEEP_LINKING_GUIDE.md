# Deep Linking Guide - UMKM Marketplace

## Konsep

Untuk share link produk ke sosmed dan bisa membuka app Android, kita gunakan **Deep Linking** dengan kombinasi custom scheme dan App Links.

## Flow

```
User share produk → Link di sosmed/WhatsApp → User klik link
  ↓
  ├─ App terinstall? → Buka app langsung ke product detail
  └─ App tidak terinstall? → Buka browser ke landing page → Download app dari Play Store
```

## Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│  Backend API (192.168.1.111:5000)                      │
│  - Generate share link data                             │
│  - Provide product info                                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Landing Page (umkm-marketplace.com)                    │
│  - Simple HTML/Static site                              │
│  - Handle users without app installed                   │
│  - Show product preview                                 │
│  - Redirect to Play Store                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Android App (Ionic/Capacitor)                          │
│  - Handle deep links                                    │
│  - Navigate to product detail                           │
└─────────────────────────────────────────────────────────┘
```

## Backend API - Generate Share Link

### Endpoint
```
GET /api/share/product/:id
```

### Response
```json
{
  "success": true,
  "data": {
    "deepLink": "umkmapp://product/PRODUCT_ID",
    "webLink": "https://umkm-marketplace.com/product/PRODUCT_ID",
    "universalLink": "https://umkm-marketplace.com/product/PRODUCT_ID",
    "product": {
      "id": "PRODUCT_ID",
      "nama": "Beras Premium 5kg",
      "deskripsi": "...",
      "harga": 75000,
      "foto": "https://...",
      "seller": {
        "nama": "Toko Sembako Jaya",
        "foto": "https://..."
      }
    },
    "shareText": "Lihat produk Beras Premium 5kg di UMKM Marketplace!\nHarga: Rp 75.000\nDari: Toko Sembako Jaya\n\nKlik link untuk melihat detail: https://umkm-marketplace.com/product/PRODUCT_ID",
    "social": {
      "whatsapp": "https://wa.me/?text=...",
      "facebook": "https://www.facebook.com/sharer/sharer.php?u=...",
      "twitter": "https://twitter.com/intent/tweet?text=..."
    }
  }
}
```

## Frontend (Ionic Angular) Setup

### 1. Install Capacitor App Plugin

```bash
npm install @capacitor/app
```

### 2. Configure Deep Links

**capacitor.config.ts:**
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.umkm.marketplace',
  appName: 'UMKM Marketplace',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: 'umkm-marketplace.com'
  },
  plugins: {
    App: {
      deepLinkingEnabled: true,
      deepLinks: [
        {
          scheme: 'umkmapp',
          host: 'product'
        }
      ]
    }
  }
};

export default config;
```

### 3. Handle Deep Links in App

**app.component.ts:**
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    // Listen for deep link
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.handleDeepLink(event.url);
    });
  }

  handleDeepLink(url: string) {
    console.log('Deep link received:', url);

    // Parse URL: umkmapp://product/PRODUCT_ID
    // or: https://umkm-marketplace.com/product/PRODUCT_ID

    if (url.includes('product/')) {
      const productId = url.split('product/')[1].split('?')[0];

      // Navigate to product detail
      this.router.navigateByUrl(`/product/${productId}`);
    }
  }
}
```

### 4. Share Product Function

**product-detail.page.ts:**
```typescript
import { Share } from '@capacitor/share';
import { HttpClient } from '@angular/common/http';

export class ProductDetailPage {
  constructor(
    private http: HttpClient,
    private share: Share
  ) {}

  async shareProduct(productId: string) {
    try {
      // Get share data from backend
      const response = await this.http.get(
        `http://localhost:5000/api/share/product/${productId}`
      ).toPromise();

      const shareData = response.data;

      // Share using Capacitor Share API
      await Share.share({
        title: shareData.product.nama,
        text: shareData.shareText,
        url: shareData.universalLink,
        dialogTitle: 'Bagikan Produk'
      });

    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  // Or share to specific platform
  shareToWhatsApp(productId: string) {
    this.http.get(`http://localhost:5000/api/share/product/${productId}`)
      .subscribe((response: any) => {
        window.open(response.data.social.whatsapp, '_system');
      });
  }
}
```

## Android Configuration

### AndroidManifest.xml

Tambahkan intent-filter untuk deep linking:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">

    <!-- Existing launcher intent -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

    <!-- Custom scheme deep link -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="umkmapp" android:host="product" />
    </intent-filter>

    <!-- App Links (HTTPS) -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="umkm-marketplace.com"
            android:pathPrefix="/product" />
    </intent-filter>
</activity>
```

## Landing Page Setup

Landing page adalah halaman web sederhana yang:
1. Menampilkan preview produk
2. Mencoba membuka app jika terinstall
3. Redirect ke Play Store jika app tidak terinstall

### Pilihan Hosting (Gratis)

1. **GitHub Pages** - Gratis, mudah deploy
2. **Netlify** - Gratis, auto deploy dari Git
3. **Vercel** - Gratis, cepat
4. **Cloudflare Pages** - Gratis, CDN global

### Template Landing Page

Buat folder `landing-page` dengan struktur:
```
landing-page/
├── index.html
├── product.html
└── style.css
```

**product.html:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">UMKM Marketplace - Product</title>

    <!-- Open Graph for social media preview -->
    <meta property="og:title" content="Produk UMKM Marketplace">
    <meta property="og:description" content="Lihat produk menarik dari UMKM lokal">
    <meta property="og:image" content="">
    <meta property="og:url" content="">
    <meta property="og:type" content="product">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Produk UMKM Marketplace">
    <meta name="twitter:description" content="Lihat produk menarik dari UMKM lokal">
    <meta name="twitter:image" content="">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }

        .logo {
            font-size: 48px;
            margin-bottom: 20px;
        }

        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
        }

        .product-info {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .product-image {
            width: 100%;
            max-width: 300px;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .product-name {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .product-price {
            font-size: 24px;
            color: #667eea;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .product-seller {
            font-size: 14px;
            color: #666;
        }

        .loader {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px 0;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .message {
            color: #666;
            margin: 20px 0;
            font-size: 16px;
        }

        .btn-download {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            transition: transform 0.3s;
        }

        .btn-download:hover {
            transform: translateY(-2px);
        }

        .play-store-badge {
            height: 60px;
            margin: 20px 0;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🛒</div>
        <h1>UMKM Marketplace</h1>

        <div id="loading-state">
            <div class="loader"></div>
            <p class="message">Membuka di aplikasi...</p>
        </div>

        <div id="product-info" class="product-info" style="display: none;">
            <img id="product-image" class="product-image" src="" alt="Product">
            <div id="product-name" class="product-name"></div>
            <div id="product-price" class="product-price"></div>
            <div id="product-seller" class="product-seller"></div>
        </div>

        <div id="fallback-state" style="display: none;">
            <p class="message">Aplikasi belum terinstall?</p>
            <a href="https://play.google.com/store/apps/details?id=com.umkm.marketplace" class="btn-download">
                Download Aplikasi
            </a>
            <br>
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                 alt="Get it on Google Play"
                 class="play-store-badge">
        </div>

        <div class="footer">
            <p>&copy; 2025 UMKM Marketplace</p>
        </div>
    </div>

    <script>
        const API_BASE_URL = 'http://192.168.1.111:5000/api';

        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || window.location.pathname.split('/').pop();

        // Fetch product data from backend
        async function loadProductData() {
            try {
                const response = await fetch(`${API_BASE_URL}/share/product/${productId}`);
                const result = await response.json();

                if (result.success) {
                    const product = result.data.product;

                    // Update meta tags
                    document.getElementById('page-title').textContent = product.nama;
                    document.querySelector('meta[property="og:title"]').content = product.nama;
                    document.querySelector('meta[property="og:description"]').content = product.deskripsi;
                    document.querySelector('meta[property="og:image"]').content = product.foto;

                    // Update product info
                    document.getElementById('product-image').src = product.foto;
                    document.getElementById('product-name').textContent = product.nama;
                    document.getElementById('product-price').textContent =
                        `Rp ${product.harga.toLocaleString('id-ID')}`;
                    document.getElementById('product-seller').textContent =
                        `Dari: ${product.seller.nama}`;

                    // Show product info
                    document.getElementById('product-info').style.display = 'block';

                    // Try to open app
                    tryOpenApp(result.data.deepLink);
                }
            } catch (error) {
                console.error('Error loading product:', error);
                // Show fallback even if API fails
                showFallback();
            }
        }

        function tryOpenApp(deepLink) {
            // Try custom scheme first
            window.location.href = deepLink;

            // Show fallback after 2.5 seconds if still on page
            setTimeout(() => {
                document.getElementById('loading-state').style.display = 'none';
                document.getElementById('fallback-state').style.display = 'block';
            }, 2500);
        }

        function showFallback() {
            document.getElementById('loading-state').style.display = 'none';
            document.getElementById('fallback-state').style.display = 'block';
        }

        // Start loading
        if (productId) {
            loadProductData();
        } else {
            document.querySelector('.message').textContent = 'Produk tidak ditemukan';
            showFallback();
        }

        // Handle visibility change (user switched apps)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // User left the page (app opened successfully)
                console.log('App opened successfully');
            }
        });
    </script>
</body>
</html>
```

### Deploy ke Netlify (Gratis)

1. **Buat folder landing page:**
   ```bash
   mkdir umkm-landing-page
   cd umkm-landing-page
   ```

2. **Buat file `product.html`** (copy template di atas)

3. **Buat file `netlify.toml`:**
   ```toml
   [[redirects]]
     from = "/product/*"
     to = "/product.html"
     status = 200
   ```

4. **Deploy:**
   - Daftar di netlify.com
   - Drag & drop folder `umkm-landing-page`
   - Atau connect ke GitHub repo
   - Domain gratis: `your-site.netlify.app`
   - Bisa custom domain: `umkm-marketplace.com`

### Update Backend .env

Setelah deploy landing page, update `.env`:

```env
WEB_DOMAIN=https://your-site.netlify.app
# atau
WEB_DOMAIN=https://umkm-marketplace.com
```

## Testing

### Test Deep Link di Android:

```bash
# Test custom scheme
adb shell am start -W -a android.intent.action.VIEW -d "umkmapp://product/PRODUCT_ID" com.umkm.marketplace

# Test HTTPS App Link
adb shell am start -W -a android.intent.action.VIEW -d "https://umkm-marketplace.com/product/PRODUCT_ID" com.umkm.marketplace
```

## Summary

### ✅ Yang Sudah Dibuat (Backend)

1. **API Endpoint:** `GET /api/share/product/:id`
   - Generate share link data
   - Provide deep link, web link, social links
   - Product info untuk preview

2. **Controller:** `shareController.js`
3. **Routes:** `shareRoutes.js`
4. **Environment variables:** `APP_SCHEME`, `WEB_DOMAIN`

### 📋 Yang Perlu Dilakukan (Frontend & Landing Page)

1. **Ionic/Capacitor App:**
   - Install `@capacitor/app` dan `@capacitor/share`
   - Configure `capacitor.config.ts`
   - Handle deep link di `app.component.ts`
   - Implement share function

2. **Landing Page:**
   - Buat `product.html` (template sudah disediakan)
   - Deploy ke Netlify/Vercel/GitHub Pages (gratis)
   - Update `API_BASE_URL` ke backend API Anda
   - Update `WEB_DOMAIN` di `.env` backend

3. **Android Configuration:**
   - Update `AndroidManifest.xml` dengan intent-filter
   - Test deep link dengan ADB

### 🎯 Flow Lengkap

```
1. User klik tombol share di app
   ↓
2. App call API: GET /api/share/product/123
   ↓
3. Backend return share data (deep link + web link)
   ↓
4. User pilih share ke WhatsApp/FB/Twitter
   ↓
5. Link dishare: https://umkm-marketplace.com/product/123
   ↓
6. Teman user klik link:
   ├─ App installed? → umkmapp://product/123 (buka app)
   └─ Not installed? → Landing page → Download from Play Store
```

### 🚀 Domain Structure

```
Backend API:       http://192.168.1.111:5000/api
Landing Page:      https://your-site.netlify.app
                   atau https://umkm-marketplace.com
Deep Link Scheme:  umkmapp://product/PRODUCT_ID
Universal Link:    https://umkm-marketplace.com/product/PRODUCT_ID
```

### 💡 Tips

- **Tanpa Firebase:** Landing page static HTML sederhana sudah cukup
- **Hosting Gratis:** Netlify, Vercel, GitHub Pages, Cloudflare Pages
- **Update Meta Tags:** Untuk preview bagus di WhatsApp/Facebook
- **Test Lokal:** Ganti `API_BASE_URL` ke `http://192.168.1.111:5000/api` saat development

### ⚠️ Important Notes

1. **Backend API BUKAN untuk deep linking**
   - Backend hanya provide data
   - Landing page yang handle redirect ke app

2. **Landing page perlu domain/hosting terpisah**
   - Tidak bisa pakai backend domain
   - Gunakan hosting static (gratis & cepat)

3. **Deep link hanya work di device fisik**
   - Tidak work di emulator untuk testing
   - Use ADB commands untuk test

4. **Update Play Store URL**
   - Ganti `com.umkm.marketplace` dengan package name Anda yang sebenarnya
   - Update setelah publish app ke Play Store
