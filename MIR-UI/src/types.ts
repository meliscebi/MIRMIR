// Link from blockchain (with fields wrapper)
export interface Link {
  fields: {
    title: string;
    url: string;
    icon: string;
  };
}

// Link for forms (without fields wrapper)
export interface LinkInput {
  title: string;
  url: string;
  icon: string;
}

export interface WalletAddress {
  label: string;  // e.g., "Main Wallet", "Trading Wallet"
  address: string;  // Wallet address
  network: string;  // e.g., "Sui", "Ethereum", "Solana"
}

export interface LinktreeNFT {
  id: string;
  title: string;
  titleColor: string;
  textColor: string;  // Text color for bio and other text
  backgroundColor: string;
  bio: string;
  avatarUrl: string;
  links: Link[];
  walletAddresses: WalletAddress[];
  owner: string;
  username?: string;
}
