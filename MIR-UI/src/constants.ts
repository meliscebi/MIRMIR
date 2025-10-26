// Linktree Package IDs - Read from environment variables
export const LINKTREE_PACKAGE_ID = import.meta.env.VITE_LINKTREE_PACKAGE_ID || "0x008723b077e895a1c9e1a52278e7fb26b0414e4a4cd57165408b47fac760a09d";
export const SUINS_REGISTRY_ID = import.meta.env.VITE_SUINS_REGISTRY_ID || "0x98994430da3806727d2a9e11c8043e26249b8878751624799aab7cb2e4b72cc73";
export const USERNAME_REGISTRY_ID = import.meta.env.VITE_USERNAME_REGISTRY_ID || "0xf9311511009f92e1912cdddae0b217b63dac967a2cd0edd3d12f8dd627c671c7";

// Legacy Package ID (before wallet address feature)
export const LEGACY_LINKTREE_PACKAGE_ID = import.meta.env.VITE_LEGACY_LINKTREE_PACKAGE_ID || "0xe621d208920cb992ff4e04271e06476ddce01bacce9a4787783b84e9976a52d9";

// Legacy Counter Package IDs (for reference)
export const DEVNET_COUNTER_PACKAGE_ID = "0xTODO";
export const TESTNET_COUNTER_PACKAGE_ID = "0xTODO";
export const MAINNET_COUNTER_PACKAGE_ID = "0xTODO";
