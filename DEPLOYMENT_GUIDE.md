# 🚀 Web3 Linktree - Kapsamlı Deployment Rehberi

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Ön Gereksinimler](#ön-gereksinimler)
3. [Move Kontratının Deploy Edilmesi](#move-kontratının-deploy-edilmesi)
4. [SuiNS Entegrasyonu](#suins-entegrasyonu)
5. [zkLogin Kurulumu](#zklogin-kurulumu)
6. [Enoki Sponsored Transactions](#enoki-sponsored-transactions)
7. [Walrus Sites'a Deploy](#walrus-sitesa-deploy)
8. [Frontend Konfigürasyonu](#frontend-konfigürasyonu)
9. [Test ve Doğrulama](#test-ve-doğrulama)

---

## 🎯 Genel Bakış

Bu proje, Sui blockchain üzerinde çalışan, NFT tabanlı bir Web3 Linktree uygulamasıdır. Aşağıdaki özellikler mevcuttur:

### ✨ Temel Özellikler

- **NFT Tabanlı Sayfalar**: Her link sayfası bir Sui NFT'si
- **SuiNS Entegrasyonu**: `.sui` domain'leri ile erişim
- **zkLogin**: Google OAuth ile şifresiz giriş
- **Sponsored Transactions**: Gas-free işlemler (Enoki)
- **Walrus Sites**: On-chain hosting
- **Flatland Pattern**: Her NFT/domain için ayrı sayfa

---

## 🔧 Ön Gereksinimler

### 1. Sui CLI Kurulumu

```bash
# Sui CLI'yi yükleyin
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Kurulumu kontrol edin
sui --version
```

### 2. Walrus CLI Kurulumu

```bash
# Walrus CLI'yi yükleyin
curl -fsSL https://install.walrus.site | sh

# PATH'e ekleyin
export PATH="$HOME/.walrus/bin:$PATH"

# Kurulumu kontrol edin
walrus --version
```

### 3. Node.js ve NPM

```bash
# Node.js 18+ gereklidir
node --version  # v18.0.0 veya üzeri

# Bağımlılıkları yükleyin
cd MIR-UI
npm install
```

### 4. Sui Cüzdan Oluşturma

```bash
# Yeni cüzdan oluştur (eğer yoksa)
sui client new-address ed25519

# Aktif adresi kontrol et
sui client active-address

# Testnet'e geç
sui client switch --env testnet

# Test SUI al
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "YOUR_ADDRESS_HERE"
    }
}'
```

---

## 📦 Move Kontratının Deploy Edilmesi

### 1. Kontratı Build Edin

```bash
cd MIR-UI/move/linktree
sui move build
```

### 2. Kontratı Deploy Edin

```bash
sui client publish --gas-budget 100000000
```

### 3. Önemli Değerleri Kaydedin

Deploy sonrası çıktıda aşağıdaki değerleri bulun ve kaydedin:

```
----- Transaction Effects ----
Status : Success
Created Objects:
  - ID: 0xABCD1234... , Owner: Immutable    # ← PACKAGE_ID
  - ID: 0xEFGH5678... , Owner: Shared       # ← REGISTRY_ID (SuiNSRegistry)
```

**Kaydetmeniz Gerekenler:**
- `PACKAGE_ID`: Kontratınızın adresi
- `REGISTRY_ID`: SuiNS Registry object ID'si

### 4. .env Dosyasını Güncelleyin

```bash
cd ../..
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
VITE_LINKTREE_PACKAGE_ID=0xYOUR_PACKAGE_ID
VITE_SUINS_REGISTRY_ID=0xYOUR_REGISTRY_ID
VITE_SUI_NETWORK=testnet
```

---

## 🌐 SuiNS Entegrasyonu

### 1. SuiNS Domain Satın Alma

1. [https://suins.io](https://suins.io) adresine gidin
2. Sui cüzdanınızı bağlayın
3. İstediğiniz `.sui` domain'ini arayın (örn: `alice.sui`)
4. Domain'i satın alın (1 yıl için ~10 SUI)

### 2. Domain'i Linktree NFT'ye Bağlama

Uygulama üzerinden:

1. Linktree NFT'nizi oluşturun
2. **SuiNS Binding** bölümüne gidin
3. Domain adınızı girin (örn: `alice.sui`)
4. **Bind SuiNS Name** butonuna tıklayın
5. İşlemi cüzdanınızdan onaylayın

### 3. Walrus Sites ile SuiNS Routing

Walrus Sites otomatik olarak SuiNS domain'lerinizi yönlendirir:

```
alice.sui → alice.sui.walrus.site → Alice'in Linktree sayfası
```

---

## 🔐 zkLogin Kurulumu

zkLogin, kullanıcıların Google hesabı ile cüzdan oluşturmadan giriş yapmasını sağlar.

### 1. Google OAuth Credentials Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni proje oluşturun veya mevcut bir projeyi seçin
3. **APIs & Services → Credentials** bölümüne gidin
4. **Create Credentials → OAuth 2.0 Client ID** seçin
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   http://localhost:5173
   https://your-domain.walrus.site
   ```
7. **Create** butonuna tıklayın
8. Client ID'yi kopyalayın

### 2. .env Dosyasına Ekleyin

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. zkLogin Kullanımı

Frontend'de `ZkLogin.tsx` komponenti otomatik olarak:
- Google OAuth akışını başlatır
- JWT token alır
- Kullanıcı bilgilerini kaydeder
- Sui cüzdanı oluşturur (gerekirse)

---

## 💰 Enoki Sponsored Transactions

Enoki, kullanıcıların gas ücreti ödemeden işlem yapmasını sağlar.

### 1. Enoki API Key Alma

1. [https://enoki.mystenlabs.com](https://enoki.mystenlabs.com) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. Yeni proje oluşturun
4. **API Keys** bölümünden yeni key oluşturun
5. Key'i kopyalayın

### 2. .env Dosyasına Ekleyin

```env
VITE_ENOKI_API_KEY=your-enoki-api-key-here
```

### 3. Sponsor Cüzdan Hazırlama

Sponsored transaction'lar için bir sponsor cüzdan gereklidir:

```bash
# Yeni sponsor cüzdan oluştur
sui client new-address ed25519

# Cüzdana SUI yükle (minimum 1 SUI önerilir)
# Faucet veya transfer ile
```

### 4. Kod Tarafında Kullanım

```typescript
import { createSponsoredLinktree } from './EnokiSponsored';

// Sponsored Linktree oluşturma
await createSponsoredLinktree(
  packageId,
  userAddress,
  title,
  titleColor,
  backgroundColor,
  bio,
  avatarUrl,
  sponsorAddress
);
```

**Avantajları:**
- ✅ Yeni kullanıcılar gas ödemeden başlayabilir
- ✅ Daha iyi kullanıcı deneyimi
- ✅ Onboarding sürecini kolaylaştırır

---

## 🦭 Walrus Sites'a Deploy

Walrus Sites, uygulamanızı tamamen on-chain olarak yayınlar.

### 1. Build

```bash
npm run build
```

Bu komut `dist/` klasöründe production build oluşturur.

### 2. Deploy

#### Otomatik Deploy (Önerilen)

```bash
npm run deploy:walrus
```

Script otomatik olarak:
- Build yapar
- Walrus Sites'a yükler
- URL'yi size verir

#### Manuel Deploy

```bash
walrus sites publish --config walrus-site.yaml dist/
```

### 3. Deploy Sonrası

Deploy başarılı olduğunda size bir URL verilir:

```
Your site is live at: https://abc123.walrus.site
```

Bu URL'yi kaydedin!

### 4. SuiNS Domain ile Erişim

SuiNS domain'inizi bağladıysanız, artık sitenize şu şekilde erişilebilir:

```
https://alice.sui.walrus.site
```

---

## ⚙️ Frontend Konfigürasyonu

### 1. constants.ts Güncelleme

`src/constants.ts` dosyasını düzenleyin:

```typescript
export const LINKTREE_PACKAGE_ID = "0xYOUR_PACKAGE_ID";
export const SUINS_REGISTRY_ID = "0xYOUR_REGISTRY_ID";
```

### 2. networkConfig.ts Güncelleme

`src/networkConfig.ts` dosyasını gerekirse güncelleyin:

```typescript
const { networkConfig } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      linktreePackageId: LINKTREE_PACKAGE_ID,
      suinsRegistryId: SUINS_REGISTRY_ID,
    },
  },
});
```

### 3. Komponent Entegrasyonu

Ana `App.tsx` dosyasına yeni komponentleri ekleyin:

```typescript
import { ZkLoginButton } from "./ZkLogin";
import { BindSuiNS } from "./BindSuiNS";
import { SuiNSResolver } from "./SuiNSResolver";

// zkLogin kullanımı
<ZkLoginButton 
  onLoginSuccess={(user) => console.log("User logged in:", user)}
/>

// SuiNS binding kullanımı
<BindSuiNS
  nftId={nftId}
  packageId={PACKAGE_ID}
  registryId={REGISTRY_ID}
/>
```

---

## 🧪 Test ve Doğrulama

### 1. Lokal Test

```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` adresine gidin ve test edin:

- ✅ Cüzdan bağlama
- ✅ NFT oluşturma
- ✅ Link ekleme/silme
- ✅ SuiNS binding
- ✅ zkLogin

### 2. Testnet'te Test

1. Linktree NFT oluşturun
2. Link ekleyin
3. SuiNS domain bağlayın
4. Walrus Sites'ta görüntüleyin

### 3. Sui Explorer'da Kontrol

[Sui Testnet Explorer](https://suiexplorer.com/?network=testnet)

- Package ID'nizi arayın
- Transaction'larınızı kontrol edin
- NFT'lerinizi görüntüleyin

### 4. Performans Testi

```bash
# Build boyutunu kontrol edin
npm run build
du -sh dist/

# Walrus upload test
walrus sites publish --config walrus-site.yaml dist/ --dry-run
```

---

## 📊 Flatland Pattern Detayları

Flatland pattern, her obje ID veya SuiNS domain'inin kendi sayfasına sahip olmasını sağlar.

### Nasıl Çalışır?

1. **URL Parsing**: Gelen URL'den SuiNS domain'i çıkarılır
2. **Registry Lookup**: Domain, SuiNSRegistry'de aranır
3. **NFT Resolution**: Domain'e bağlı NFT object ID bulunur
4. **Content Loading**: NFT verisi yüklenir ve gösterilir

### Örnek Akış

```
1. Kullanıcı → alice.sui.walrus.site
2. Sistem → "alice.sui" domain'ini parse eder
3. SuiNSRegistry → "alice.sui" → NFT ID: 0xABC123
4. NFT verisi → 0xABC123 object'inden yüklenir
5. Sayfa → Alice'in Linktree'si gösterilir
```

### Avantajları

- ✅ Her kullanıcıya özel URL
- ✅ SEO dostu
- ✅ Kolay paylaşım
- ✅ Merkezi olmayan routing
- ✅ Censorship-resistant

---

## 🎨 Özelleştirme

### Tema ve Renkler

`src/App.tsx` dosyasında Radix UI temalarını kullanarak özelleştirin:

```typescript
import { Theme } from "@radix-ui/themes";

<Theme appearance="dark" accentColor="cyan">
  <App />
</Theme>
```

### Yeni Özellikler Ekleme

1. Move kontratına yeni fonksiyon ekleyin
2. Kontratı yeniden deploy edin
3. Frontend'de yeni komponenti oluşturun
4. Transaction builder'ı güncelleyin

---

## 🚨 Yaygın Sorunlar ve Çözümler

### Problem: "Package ID not found"

**Çözüm:** `.env` dosyasındaki Package ID'nin doğru olduğundan emin olun.

### Problem: "Insufficient gas"

**Çözüm:** Cüzdanınızda yeterli SUI olduğundan emin olun:
```bash
sui client gas
```

### Problem: "SuiNS name already bound"

**Çözüm:** Domain zaten başka bir NFT'ye bağlı. Farklı bir domain deneyin.

### Problem: "Walrus CLI not found"

**Çözüm:** Walrus CLI'yi yükleyin ve PATH'e ekleyin:
```bash
export PATH="$HOME/.walrus/bin:$PATH"
```

### Problem: zkLogin redirect çalışmıyor

**Çözüm:** Google OAuth redirect URI'lerini kontrol edin. Tam URL olmalı.

---

## 📚 Ek Kaynaklar

### Dokümantasyon

- [Sui Docs](https://docs.sui.io)
- [Walrus Sites Docs](https://docs.wal.app)
- [SuiNS Docs](https://docs.suins.io)
- [Mysten dApp Kit](https://sdk.mystenlabs.com/dapp-kit)
- [zkLogin Tutorial](https://github.com/MystenLabs/sui-move-community-modules/tree/main/module_5)
- [Enoki Docs](https://docs.enoki.mystenlabs.com)

### Örnekler

- [Flatland Example](https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland)
- [SuiNS Integration](https://docs.wal.app/walrus-sites/tutorial-suins.html)

---

## 🎉 Tebrikler!

Artık tam özellikli bir Web3 Linktree uygulamanız var! 

### Sırada Ne Var?

- 🎨 Tema ve tasarımı özelleştirin
- 📱 Mobil responsive tasarımı iyileştirin
- 🔔 Push notification ekleyin
- 📊 Analytics entegrasyonu yapın
- 🌍 Çoklu dil desteği ekleyin

---

## 💬 Destek

Sorularınız için:
- GitHub Issues
- Sui Discord: [discord.gg/sui](https://discord.gg/sui)
- Mysten Labs Forum

---

**Built with ❤️ on Sui Blockchain**
