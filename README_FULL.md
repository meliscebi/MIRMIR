# 🔗 Web3 Linktree - Tam Özellikli Blockchain Tabanlı Link Sayfası

<div align="center">

![Sui Blockchain](https://img.shields.io/badge/Sui-Blockchain-4DA2FF?style=for-the-badge)
![Walrus Sites](https://img.shields.io/badge/Walrus-Sites-00C853?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

**Sui blockchain üzerinde NFT tabanlı, merkezi olmayan link paylaşım platformu**

[Demo](https://linktree.walrus.site) • [Dokümantasyon](./DEPLOYMENT_GUIDE.md) • [Linktree Rehberi](./MIR-UI/LINKTREE_README.md)

</div>

---

## ✨ Özellikler

### 🎯 Temel Özellikler

- **🎨 NFT Tabanlı Sayfalar**: Her link sayfası bir Sui NFT'si olarak blockchain'de saklanır
- **🌐 SuiNS Entegrasyonu**: `.sui` domain'leri ile kolay erişim (örn: `alice.sui.walrus.site`)
- **🔐 zkLogin**: Google OAuth ile şifresiz, cüzdansız giriş
- **💰 Sponsored Transactions**: Enoki ile gas-free işlemler
- **🦭 Walrus Sites**: Tamamen on-chain hosting
- **📱 Flatland Pattern**: Her NFT/domain için ayrı, SEO-dostu sayfa

### 🛠️ Teknik Özellikler

- **Smart Contract**: Move dili ile yazılmış, güvenli ve verimli
- **Event System**: Tüm önemli işlemler için event emission
- **Shared Object Pattern**: SuiNS Registry ile merkezi olmayan domain yönetimi
- **Modüler Yapı**: Kolay genişletilebilir ve özelleştirilebilir
- **Type-Safe**: TypeScript ile tam tip güvenliği

---

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler

- Node.js 18+
- Sui CLI
- Walrus CLI
- Git

### Kurulum

```bash
# 1. Repoyu klonlayın
git clone https://github.com/meliscebi/MIR.git
cd MIR/MIR-UI

# 2. Bağımlılıkları yükleyin
npm install

# 3. Environment değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

### Move Kontratını Deploy Etme

```bash
# 1. Kontrat dizinine gidin
cd move/linktree

# 2. Build edin
sui move build

# 3. Deploy edin
sui client publish --gas-budget 100000000

# 4. Package ID ve Registry ID'yi .env dosyasına ekleyin
```

Detaylı adımlar için [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) dosyasına bakın.

---

## 📖 Kullanım

### 1️⃣ Linktree NFT Oluşturma

```typescript
// Normal oluşturma (gas ödeyerek)
await createLinktree(title, titleColor, backgroundColor, bio, avatarUrl);

// Sponsored oluşturma (gas-free)
await createSponsoredLinktree(recipient, title, ...params, sponsorAddress);
```

### 2️⃣ SuiNS Domain Bağlama

```typescript
// SuiNS domain'ini NFT'ye bağla
await bindSuiNSName(nft, registry, "alice.sui");

// Artık alice.sui.walrus.site üzerinden erişilebilir!
```

### 3️⃣ zkLogin ile Giriş

```typescript
// Google OAuth ile giriş
<ZkLoginButton 
  onLoginSuccess={(user) => console.log(user)}
/>
```

### 4️⃣ Link Ekleme/Silme

```typescript
// Link ekle
await addLink(nft, "Instagram", "https://instagram.com/...", "📸");

// Link sil
await removeLink(nft, linkIndex);
```

---

## 🏗️ Proje Yapısı

```
MIR/
├── MIR-UI/                         # Frontend uygulaması
│   ├── src/
│   │   ├── App.tsx                 # Ana uygulama komponenti
│   │   ├── ZkLogin.tsx             # zkLogin entegrasyonu
│   │   ├── BindSuiNS.tsx           # SuiNS binding komponenti
│   │   ├── SuiNSResolver.tsx       # Flatland pattern implementasyonu
│   │   ├── EnokiSponsored.ts       # Sponsored transaction helper
│   │   ├── CreateLinktree.tsx      # NFT oluşturma
│   │   ├── EditLinktree.tsx        # NFT düzenleme
│   │   └── LinktreePage.tsx        # Linktree görüntüleme
│   ├── move/
│   │   └── linktree/
│   │       └── sources/
│   │           └── linktree.move   # Move smart contract
│   ├── scripts/
│   │   └── deploy-walrus.js        # Walrus deployment script
│   ├── walrus-site.yaml            # Walrus Sites konfigürasyonu
│   ├── .env.example                # Environment template
│   └── package.json
├── DEPLOYMENT_GUIDE.md             # Kapsamlı deployment rehberi
└── README.md                       # Bu dosya
```

---

## 🎓 Mimari Detayları

### Move Smart Contract

```move
module linktree::linktree_nft {
    // Structures
    struct LinktreeNFT has key, store { ... }
    struct SuiNSRegistry has key { ... }
    struct Link has store, drop, copy { ... }
    
    // Core Functions
    public entry fun create_linktree(...)
    public entry fun create_linktree_sponsored(...)
    
    // Update Functions
    public entry fun update_title(...)
    public entry fun update_title_color(...)
    // ... diğer update fonksiyonları
    
    // Link Management
    public entry fun add_link(...)
    public entry fun remove_link(...)
    
    // SuiNS Integration
    public entry fun bind_suins_name(...)
    public entry fun unbind_suins_name(...)
    public fun get_nft_by_suins_name(...) -> address
}
```

### Flatland Pattern

```
URL: alice.sui.walrus.site
  ↓
Parse: "alice.sui"
  ↓
Registry Lookup: SuiNSRegistry["alice.sui"]
  ↓
NFT Object ID: 0xABC123...
  ↓
Load NFT Data: LinktreeNFT @ 0xABC123
  ↓
Render: Alice's Linktree Page
```

### Event System

```move
public struct LinktreeCreated has copy, drop { ... }
public struct LinktreeUpdated has copy, drop { ... }
public struct SuiNSBound has copy, drop { ... }
public struct LinkAdded has copy, drop { ... }
```

---

## 🔐 Güvenlik

### Smart Contract Güvenliği

- ✅ **Ownership Checks**: Tüm değişiklik fonksiyonlarında owner kontrolü
- ✅ **Error Codes**: Anlamlı hata kodları ve mesajları
- ✅ **Index Validation**: Array erişimlerinde bounds checking
- ✅ **Immutable Package**: Deploy sonrası değiştirilemez
- ✅ **Shared Object Pattern**: SuiNS Registry güvenli paylaşım

### Frontend Güvenliği

- ✅ **Type Safety**: TypeScript ile tam tip güvenliği
- ✅ **Input Validation**: Tüm kullanıcı girdileri doğrulanır
- ✅ **CSP Headers**: Content Security Policy
- ✅ **XSS Protection**: React'ın built-in koruması
- ✅ **JWT Validation**: zkLogin token doğrulama

---

## 📊 Performans

### On-Chain Metrikleri

- **NFT Oluşturma**: ~0.1 SUI gas
- **Link Ekleme**: ~0.01 SUI gas
- **SuiNS Binding**: ~0.05 SUI gas
- **Transaction Süresi**: ~2-3 saniye

### Frontend Metrikleri

- **Build Boyutu**: ~500 KB (gzipped)
- **Initial Load**: <2 saniye
- **Time to Interactive**: <3 saniye
- **Lighthouse Score**: 90+

---

## 🌟 Kullanım Senaryoları

### 1. İçerik Üreticileri

- Tüm sosyal medya linklerini tek bir yerde topla
- NFT olarak sahiplik ve kontrol
- Özel `.sui` domain ile marka kimliği

### 2. İşletmeler

- Merkezi olmayan iletişim sayfası
- Sponsorlu işlemlerle kullanıcı onboarding
- Analytics ve tracking entegrasyonu

### 3. DAO'lar

- Topluluk linklerinin merkezi olmayan yönetimi
- Multi-sig ile paylaşımlı kontrol
- On-chain şeffaflık

### 4. NFT Projeleri

- Her NFT için özel link sayfası (Flatland)
- Dynamic metadata
- Token-gated içerik

---

## 🛣️ Roadmap

### Mevcut Versiyon (v1.0)

- ✅ NFT tabanlı Linktree
- ✅ SuiNS entegrasyonu
- ✅ zkLogin authentication
- ✅ Sponsored transactions
- ✅ Walrus Sites hosting
- ✅ Flatland pattern

### Gelecek Versiyonlar

#### v1.1 (Q1 2026)
- 📱 PWA desteği
- 🌍 Çoklu dil desteği
- 📊 Built-in analytics
- 🎨 Tema marketplace

#### v1.2 (Q2 2026)
- 🔔 Push notifications
- 💬 On-chain mesajlaşma
- 🖼️ NFT galeri entegrasyonu
- 📈 Advanced analytics dashboard

#### v2.0 (Q3 2026)
- 🤝 Multi-sig support
- 🎯 Token-gated content
- 🌐 Custom domains (non-SuiNS)
- 🔗 Cross-chain bridges

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Convention

- `feat:` Yeni özellik
- `fix:` Bug düzeltme
- `docs:` Dokümantasyon değişikliği
- `style:` Kod formatı değişikliği
- `refactor:` Kod refactoring
- `test:` Test ekleme/güncelleme
- `chore:` Build process, dependencies

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

---

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak projelerden ve teknolojilerden yararlanmıştır:

- [Sui Blockchain](https://sui.io)
- [Walrus Protocol](https://walrus.site)
- [Mysten Labs](https://mystenlabs.com)
- [SuiNS](https://suins.io)
- [Radix UI](https://radix-ui.com)
- [React](https://react.dev)

---

## 📞 İletişim

- **GitHub**: [@meliscebi](https://github.com/meliscebi)
- **Project Link**: [https://github.com/meliscebi/MIR](https://github.com/meliscebi/MIR)
- **Demo**: [https://linktree.walrus.site](https://linktree.walrus.site)

---

## 📚 Ek Kaynaklar

### Dokümantasyon
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Detaylı deployment rehberi
- [Linktree README](./MIR-UI/LINKTREE_README.md) - Kullanıcı rehberi
- [Sui Docs](https://docs.sui.io) - Sui blockchain dokümantasyonu
- [Walrus Docs](https://docs.wal.app) - Walrus Sites dokümantasyonu

### Örnekler
- [Flatland Example](https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland)
- [zkLogin Tutorial](https://github.com/MystenLabs/sui-move-community-modules/tree/main/module_5)
- [Sponsored Transactions](https://docs.enoki.mystenlabs.com/ts-sdk/examples)

### Video Eğitimleri
- Sui Move Development
- Walrus Sites Deployment
- zkLogin Implementation

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ on Sui Blockchain

</div>
