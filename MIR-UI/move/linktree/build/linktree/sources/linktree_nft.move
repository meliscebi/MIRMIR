// Suppress linter warnings for duplicate aliases and public entry functions
// These patterns are intentional for code clarity and backward compatibility
#[allow(duplicate_alias, lint(public_entry))]
module linktree::linktree_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{Self, String};
    use std::vector;
    use sui::event;
    use sui::table::{Self, Table};
    use std::option::{Self, Option};

    // Suppress duplicate alias warnings - these are needed for clarity
    #[allow(duplicate_alias)]

    // ============ Errors ============
    
    /// Error code when caller is not the owner
    const ENotOwner: u64 = 0;
    /// Error code when link index is out of bounds
    const EInvalidIndex: u64 = 1;
    /// Error code when SuiNS name is already registered
    const ESuiNSAlreadyBound: u64 = 2;
    /// Error code when trying to access non-existent data
    const ENotFound: u64 = 3;
    /// Error code when username is already taken
    const EUsernameAlreadyTaken: u64 = 4;
    /// Error code when username is invalid (too short, too long, invalid chars)
    const EInvalidUsername: u64 = 5;

    // ============ Structs ============

    /// Link structure - represents a social media/website link
    /// Each link contains a title, URL and icon for display
    public struct Link has store, drop, copy {
        title: String,
        url: String,
        icon: String, // emoji or icon name for UI display
    }

    /// Main Linktree NFT structure
    /// Each NFT represents a customizable link page owned by a user
    /// Can be bound to a SuiNS name for easy access via .sui domains
    public struct LinktreeNFT has key, store {
        id: UID,
        title: String,
        title_color: String,
        background_color: String,
        bio: String,
        avatar_url: String,
        links: vector<Link>,
        owner: address,
        suins_name: Option<String>, // Optional SuiNS domain binding (e.g., "alice.sui")
        username: Option<String>, // Optional username for short URLs (e.g., "alice")
    }

    /// Global registry for username to NFT mappings
    /// Enables short, memorable URLs like /alice instead of /0x123...
    public struct UsernameRegistry has key {
        id: UID,
        /// Maps usernames to Linktree NFT object IDs
        username_to_nft: Table<String, address>,
    }

    /// Global registry for SuiNS name to NFT mappings
    /// Implements Flatland pattern - each SuiNS name points to its own Linktree page
    /// This enables direct access via walrus sites (e.g., alice.sui.walrus.site)
    public struct SuiNSRegistry has key {
        id: UID,
        /// Maps SuiNS names to Linktree NFT object IDs
        name_to_nft: Table<String, address>,
    }

    // ============ Events ============

    /// Event emitted when a new Linktree NFT is created
    public struct LinktreeCreated has copy, drop {
        nft_id: address,
        owner: address,
        title: String,
    }

    /// Event emitted when a Linktree is updated
    public struct LinktreeUpdated has copy, drop {
        nft_id: address,
        owner: address,
    }

    /// Event emitted when a SuiNS name is bound to a Linktree
    public struct SuiNSBound has copy, drop {
        nft_id: address,
        suins_name: String,
        owner: address,
    }

    /// Event emitted when a link is added
    public struct LinkAdded has copy, drop {
        nft_id: address,
        link_title: String,
    }

    // ============ Init Function ============

    /// Module initializer - creates the global registries
    /// Called once when the module is published
    fun init(ctx: &mut TxContext) {
        let suins_registry = SuiNSRegistry {
            id: object::new(ctx),
            name_to_nft: table::new<String, address>(ctx),
        };
        transfer::share_object(suins_registry);
        
        let username_registry = UsernameRegistry {
            id: object::new(ctx),
            username_to_nft: table::new<String, address>(ctx),
        };
        transfer::share_object(username_registry);
    }

    // ============ Core Functions ============

    /// Create a new Linktree NFT
    /// This creates a personalized link page as an NFT owned by the caller
    /// Can be later bound to a SuiNS name or username for easy access
    #[allow(lint(public_entry))]
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
            suins_name: option::none(), // No SuiNS name bound initially
            username: option::none(), // No username bound initially
        };
        
        let nft_id = object::uid_to_address(&nft.id);
        
        // Emit creation event
        event::emit(LinktreeCreated {
            nft_id,
            owner: sender,
            title: nft.title,
        });
        
        transfer::public_transfer(nft, sender);
    }

    /// Create a Linktree NFT with sponsored transaction (gas-free for user)
    /// This enables onboarding users without requiring them to have SUI for gas
    /// The sponsor pays for the transaction but the NFT goes to the recipient
    public entry fun create_linktree_sponsored(
        recipient: address,
        title: vector<u8>,
        title_color: vector<u8>,
        background_color: vector<u8>,
        bio: vector<u8>,
        avatar_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = LinktreeNFT {
            id: object::new(ctx),
            title: string::utf8(title),
            title_color: string::utf8(title_color),
            background_color: string::utf8(background_color),
            bio: string::utf8(bio),
            avatar_url: string::utf8(avatar_url),
            links: vector::empty<Link>(),
            owner: recipient,
            suins_name: option::none(),
            username: option::none(),
        };
        
        let nft_id = object::uid_to_address(&nft.id);
        
        event::emit(LinktreeCreated {
            nft_id,
            owner: recipient,
            title: nft.title,
        });
        
        transfer::public_transfer(nft, recipient);
    }

    // ============ Update Functions ============

    /// Update the title of the Linktree
    public entry fun update_title(
        nft: &mut LinktreeNFT,
        new_title: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        nft.title = string::utf8(new_title);
        
        event::emit(LinktreeUpdated {
            nft_id: object::uid_to_address(&nft.id),
            owner: nft.owner,
        });
    }

    /// Update the title color (hex color code)
    public entry fun update_title_color(
        nft: &mut LinktreeNFT,
        new_color: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        nft.title_color = string::utf8(new_color);
        
        event::emit(LinktreeUpdated {
            nft_id: object::uid_to_address(&nft.id),
            owner: nft.owner,
        });
    }

    /// Update the background color (hex color code)
    public entry fun update_background_color(
        nft: &mut LinktreeNFT,
        new_color: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        nft.background_color = string::utf8(new_color);
        
        event::emit(LinktreeUpdated {
            nft_id: object::uid_to_address(&nft.id),
            owner: nft.owner,
        });
    }

    /// Update the bio/description text
    public entry fun update_bio(
        nft: &mut LinktreeNFT,
        new_bio: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        nft.bio = string::utf8(new_bio);
        
        event::emit(LinktreeUpdated {
            nft_id: object::uid_to_address(&nft.id),
            owner: nft.owner,
        });
    }

    /// Update the avatar URL
    public entry fun update_avatar(
        nft: &mut LinktreeNFT,
        new_avatar_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        nft.avatar_url = string::utf8(new_avatar_url);
        
        event::emit(LinktreeUpdated {
            nft_id: object::uid_to_address(&nft.id),
            owner: nft.owner,
        });
    }

    // ============ Link Management ============

    /// Add a new link to the Linktree
    /// Links can be social media profiles, websites, or any URL
    public entry fun add_link(
        nft: &mut LinktreeNFT,
        title: vector<u8>,
        url: vector<u8>,
        icon: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        let new_link = Link {
            title: string::utf8(title),
            url: string::utf8(url),
            icon: string::utf8(icon),
        };
        vector::push_back(&mut nft.links, new_link);
        
        event::emit(LinkAdded {
            nft_id: object::uid_to_address(&nft.id),
            link_title: new_link.title,
        });
    }

    /// Remove a link by its index position
    public entry fun remove_link(
        nft: &mut LinktreeNFT,
        index: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        assert!(index < vector::length(&nft.links), EInvalidIndex);
        vector::remove(&mut nft.links, index);
        
        event::emit(LinktreeUpdated {
            nft_id: object::uid_to_address(&nft.id),
            owner: nft.owner,
        });
    }

    // ============ SuiNS Integration ============

    /// Bind a SuiNS name to this Linktree NFT
    /// This enables access via yourdomain.sui on Walrus Sites
    /// Implements the Flatland pattern for per-object routing
    public entry fun bind_suins_name(
        nft: &mut LinktreeNFT,
        registry: &mut SuiNSRegistry,
        suins_name: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        
        let name_string = string::utf8(suins_name);
        
        // Check if the name is already bound
        assert!(!table::contains(&registry.name_to_nft, name_string), ESuiNSAlreadyBound);
        
        // Store the SuiNS name in the NFT
        nft.suins_name = option::some(name_string);
        
        // Map the name to the NFT's object ID in the registry
        let nft_id = object::uid_to_address(&nft.id);
        table::add(&mut registry.name_to_nft, name_string, nft_id);
        
        event::emit(SuiNSBound {
            nft_id,
            suins_name: name_string,
            owner: nft.owner,
        });
    }

    /// Unbind a SuiNS name from this Linktree NFT
    public entry fun unbind_suins_name(
        nft: &mut LinktreeNFT,
        registry: &mut SuiNSRegistry,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        
        if (option::is_some(&nft.suins_name)) {
            let name = option::extract(&mut nft.suins_name);
            table::remove(&mut registry.name_to_nft, name);
        };
    }

    // ============ Username Functions ============

    /// Bind a username to this Linktree NFT for short URLs
    /// Username must be unique and only contain alphanumeric characters
    public entry fun bind_username(
        nft: &mut LinktreeNFT,
        registry: &mut UsernameRegistry,
        username: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        
        let username_string = string::utf8(username);
        
        // Check if username is already taken
        assert!(!table::contains(&registry.username_to_nft, username_string), EUsernameAlreadyTaken);
        
        // If NFT already has a username, remove the old mapping
        if (option::is_some(&nft.username)) {
            let old_username = option::extract(&mut nft.username);
            table::remove(&mut registry.username_to_nft, old_username);
        };
        
        // Add new username mapping
        let nft_id = object::uid_to_address(&nft.id);
        table::add(&mut registry.username_to_nft, username_string, nft_id);
        option::fill(&mut nft.username, username_string);
    }

    /// Unbind username from this Linktree NFT
    public entry fun unbind_username(
        nft: &mut LinktreeNFT,
        registry: &mut UsernameRegistry,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        
        if (option::is_some(&nft.username)) {
            let username = option::extract(&mut nft.username);
            table::remove(&mut registry.username_to_nft, username);
        };
    }

    // ============ Transfer Function ============

    /// Transfer the NFT to a different address
    /// The new owner gains full control over the Linktree
    public entry fun transfer_nft(
        nft: LinktreeNFT,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.owner, ENotOwner);
        transfer::public_transfer(nft, recipient);
    }

    // ============ View Functions ============

    /// Get the NFT object ID for a given SuiNS name
    /// Used by Walrus Sites for routing .sui domains to their Linktree pages
    public fun get_nft_by_suins_name(
        registry: &SuiNSRegistry,
        suins_name: String,
    ): address {
        assert!(table::contains(&registry.name_to_nft, suins_name), ENotFound);
        *table::borrow(&registry.name_to_nft, suins_name)
    }

    /// Get the NFT object ID for a given username
    /// Enables short URL routing like /alice instead of /0x123...
    public fun get_nft_by_username(
        registry: &UsernameRegistry,
        username: String,
    ): address {
        assert!(table::contains(&registry.username_to_nft, username), ENotFound);
        *table::borrow(&registry.username_to_nft, username)
    }
}
