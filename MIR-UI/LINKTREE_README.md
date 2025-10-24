# 🔗 Web3 Linktree - Sui NFT

Sui blockchain üzerinde NFT tabanlı kişisel link sayfası oluşturma platformu. Her sayfa bir NFT'dir ve tamamen size aittir!

## 🌟 Özellikler

- **NFT Tabanlı Sayfalar**: Her link sayfası bir Sui NFT'si olarak blockchain'de saklanır
- **Tam Özelleştirme**: Başlık, renk, arkaplan, bio ve avatar özellikleri
- **Dinamik Linkler**: İstediğiniz kadar link ekleyip çıkarabilirsiniz
- **Sahiplik**: NFT'niz tamamen size aittir, istediğiniz zaman transfer edebilirsiniz
- **Güvenli**: Sui blockchain'in güvenliği ile korunur

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd MIR-UI
npm install
```

### 2. Sui Move Kontratını Deploy Edin

```bash
cd move/linktree
sui move build
sui client publish --gas-budget 100000000
```

Deploy sonrası çıkan **Package ID**'yi not edin.

### 3. Package ID'yi Güncelleyin

Aşağıdaki dosyalarda `YOUR_PACKAGE_ID_HERE` yerine deploy ettiğiniz Package ID'yi yazın:

- `src/CreateLinktree.tsx`
- `src/EditLinktree.tsx`

### 4. Uygulamayı Çalıştırın

```bash
npm run dev
```

## 📖 Kullanım

### 1. Cüzdanınızı Bağlayın

Uygulamayı açın ve sağ üstteki "Connect Wallet" butonuna tıklayın.

### 2. Yeni Linktree NFT Oluşturun

- Başlık, renkler ve biyografi bilgilerinizi girin
- "Linktree NFT Oluştur" butonuna tıklayın
- İşlemi cüzdanınızdan onaylayın

### 3. Sayfanızı Düzenleyin

- **Düzenle** sekmesine geçin
- Başlık, renk, bio gibi özellikleri güncelleyin
- Yeni linkler ekleyin (sosyal medya, website, vb.)
- İstediğiniz linkleri silin

### 4. Sayfanızı Görüntüleyin

- **Görüntüle** sekmesine geçerek sayfanızın nasıl göründüğünü görün
- NFT ID'nizi paylaşarak başkalarının sayfanızı görmesini sağlayın

## 🎨 Özelleştirme Seçenekleri

### Sayfa Özellikleri
- **Başlık**: Adınız veya marka isminiz
- **Başlık Rengi**: Hex renk kodu (#000000)
- **Arkaplan Rengi**: Hex renk kodu (#ffffff)
- **Biyografi**: Kısa bir açıklama
- **Avatar URL**: Profil resmi URL'i

### Link Özellikleri
- **Başlık**: Link açıklaması (örn: "Instagram")
- **URL**: Hedef URL
- **Icon**: Emoji veya icon (örn: 📸, 🐦, 💼)

## 🔧 Teknik Detaylar

### Akıllı Kontrat Fonksiyonları

```move
// Yeni Linktree NFT oluştur
create_linktree(title, title_color, background_color, bio, avatar_url)

// Özellikleri güncelle
update_title(nft, new_title)
update_title_color(nft, new_color)
update_background_color(nft, new_color)
update_bio(nft, new_bio)
update_avatar(nft, new_avatar_url)

// Link yönetimi
add_link(nft, title, url, icon)
remove_link(nft, index)

// NFT transferi
transfer_nft(nft, recipient)
```

### Teknoloji Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Radix UI Themes
- **Blockchain**: Sui
- **Smart Contract**: Move
- **Wallet Integration**: @mysten/dapp-kit
- **State Management**: @tanstack/react-query

## 🌐 Network Yapılandırması

Uygulama varsayılan olarak Sui Testnet'te çalışır. `src/networkConfig.ts` dosyasından ağ ayarlarını değiştirebilirsiniz.

## 🔐 Güvenlik

- Tüm işlemler cüzdanınız üzerinden onaylanır
- Sadece NFT sahibi düzenleme yapabilir
- Blockchain üzerinde değişmez kayıt
- Merkeziyetsiz yapı

## 📝 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır! Büyük değişiklikler için lütfen önce bir issue açın.

## 💡 İpuçları

- Avatar için public olarak erişilebilir bir URL kullanın
- Linklarinize https:// eklemeyi unutmayın
- Emoji kullanarak linklerinizi daha çekici hale getirin
- Renk kombinasyonlarında kontrast oranına dikkat edin

## 📞 Destek

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**Not**: Bu proje Sui blockchain üzerinde çalışır. Test etmek için Sui testnet token'larına ihtiyacınız var. [Sui Faucet](https://discord.com/channels/916379725201563759/971488439931392130) üzerinden ücretsiz test token'ı alabilirsiniz.
