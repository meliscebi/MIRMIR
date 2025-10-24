module linktree::linktree_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{Self, String};
    use std::vector;

    /// Link yapısı - her bir sosyal medya/website linki
    public struct Link has store, drop, copy {
        title: String,
        url: String,
        icon: String, // emoji veya icon ismi
    }

    /// Linktree NFT - Her kullanıcının özelleştirebileceği sayfa
    public struct LinktreeNFT has key, store {
        id: UID,
        title: String,
        title_color: String,
        background_color: String,
        bio: String,
        avatar_url: String,
        links: vector<Link>,
        owner: address,
    }

    /// Yeni bir Linktree NFT oluştur
    public entry fun create_linktree(
        title: vector<u8>,
        title_color: vector<u8>,
        background_color: vector<u8>,
        bio: vector<u8>,
        avatar_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = LinktreeNFT {
            id: object::new(ctx),
            title: string::utf8(title),
            title_color: string::utf8(title_color),
            background_color: string::utf8(background_color),
            bio: string::utf8(bio),
            avatar_url: string::utf8(avatar_url),
            links: vector::empty<Link>(),
            owner: sender,
        };
        transfer::public_transfer(nft, sender);
    }

    /// Title'ı güncelle
    public entry fun update_title(
        nft: &mut LinktreeNFT,
        new_title: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        nft.title = string::utf8(new_title);
    }

    /// Title rengini güncelle
    public entry fun update_title_color(
        nft: &mut LinktreeNFT,
        new_color: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        nft.title_color = string::utf8(new_color);
    }

    /// Background rengini güncelle
    public entry fun update_background_color(
        nft: &mut LinktreeNFT,
        new_color: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        nft.background_color = string::utf8(new_color);
    }

    /// Bio'yu güncelle
    public entry fun update_bio(
        nft: &mut LinktreeNFT,
        new_bio: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        nft.bio = string::utf8(new_bio);
    }

    /// Avatar URL'ini güncelle
    public entry fun update_avatar(
        nft: &mut LinktreeNFT,
        new_avatar_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        nft.avatar_url = string::utf8(new_avatar_url);
    }

    /// Yeni link ekle
    public entry fun add_link(
        nft: &mut LinktreeNFT,
        title: vector<u8>,
        url: vector<u8>,
        icon: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        let new_link = Link {
            title: string::utf8(title),
            url: string::utf8(url),
            icon: string::utf8(icon),
        };
        vector::push_back(&mut nft.links, new_link);
    }

    /// Link'i sil (index ile)
    public entry fun remove_link(
        nft: &mut LinktreeNFT,
        index: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        assert!(index < vector::length(&nft.links), 1);
        vector::remove(&mut nft.links, index);
    }

    /// NFT'yi başka birine transfer et
    public entry fun transfer_nft(
        nft: LinktreeNFT,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, 0);
        transfer::public_transfer(nft, recipient);
    }
}
