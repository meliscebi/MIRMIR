# 🚀 Deployment Rehberi

## ✅ Tamamlanan Deployment

### Smart Contract (Testnet)
- **Package ID:** `0xb1e96667befa89796a7c4e95068c2f5cc5a941d968d0602622887f11a4e214cc`
- **SuiNS Registry:** `0x82483b1b69f04c46999e0053958d6db6087f610cb06a53183dd9f0c277661846`
- **Username Registry:** `0xd2710aa8ec70bdc0eb202d733991325197cb405815bccd2f7194cac89b1b1cf1`
- **Network:** Sui Testnet
- **Gas Kullanılan:** ~32 SUI

## 🌐 Frontend Deployment Seçenekleri

### 1. Vercel (Önerilen - Hızlı ve Kolay)

```bash
# Vercel CLI kur
npm i -g vercel

# Deploy et
vercel
```

**Avantajlar:**
- ✅ Otomatik SSL
- ✅ CDN
- ✅ Anında deploy
- ✅ Ücretsiz plan
- ✅ GitHub entegrasyonu

### 2. Netlify

```bash
# Netlify CLI kur
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 3. GitHub Pages

```bash
# package.json'a ekle:
"homepage": "https://kullaniciadi.github.io/MIR-UI",

# gh-pages kur
npm install --save-dev gh-pages

# Deploy script ekle:
"deploy:github": "npm run build && gh-pages -d dist"

# Deploy et
npm run deploy:github
```

### 4. Walrus Sites (Gelecekte)

**Not:** Walrus Sites henüz production'da değil. CLI versiyonunuzda `sites` komutu bulunmuyor.

Walrus Sites aktif olduğunda:
```bash
npm run deploy:walrus
```

## 🔧 Production Build

```bash
# Build oluştur
npm run build

# Local preview
npm run preview
```

Build çıktısı `dist/` klasöründe olacak.

## 📝 Deployment Sonrası

1. `.env` dosyasındaki URL'leri güncelle
2. Wallet'ları production network'e bağla
3. Contract'ları mainnet'e deploy et (gerekirse)
4. Domain ayarlarını yap

## 🎯 Quick Start - Vercel Deployment

```bash
# 1. Build test et
npm run build

# 2. Vercel'e deploy et
npx vercel

# 3. Production'a al
npx vercel --prod
```

## 🔐 Environment Variables (Production)

Production'da şu environment variable'ları ayarlayın:

```
VITE_SUI_NETWORK=testnet
VITE_LINKTREE_PACKAGE_ID=0xb1e96667befa89796a7c4e95068c2f5cc5a941d968d0602622887f11a4e214cc
VITE_SUINS_REGISTRY_ID=0x82483b1b69f04c46999e0053958d6db6087f610cb06a53183dd9f0c277661846
VITE_USERNAME_REGISTRY_ID=0xd2710aa8ec70bdc0eb202d733991325197cb405815bccd2f7194cac89b1b1cf1
```

## 📊 Performance

- **Bundle Size:** ~557 KB (minified)
- **CSS:** ~701 KB
- **Load Time:** < 2s (with CDN)

## ⚡ Optimizasyon İpuçları

1. Dynamic imports kullan
2. Code splitting aktif et
3. Image optimization
4. Lazy loading
5. Service Worker ekle

## 🆘 Deployment Sorunları

### "Sites" komutu bulunamadı
- Walrus Sites henüz aktif değil
- Alternatif: Vercel/Netlify kullan

### Build hataları
- `npm run build` komutu çalışmalı
- TypeScript hataları düzelt
- Unused imports temizle

### Environment variables çalışmıyor
- `VITE_` prefix kullan
- `.env` dosyası olmalı
- Build sonrası güncelle

## 🎉 Başarılı Deployment

Deployment başarılıysa:
1. URL'i test edin
2. Wallet bağlantısını test edin
3. NFT oluşturmayı test edin
4. Username bağlamayı test edin

**Deployment URL'inizi `README.md`'ye ekleyin!**
