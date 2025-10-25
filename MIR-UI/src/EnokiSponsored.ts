import { EnokiClient, EnokiNetwork } from "@mysten/enoki";
import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";

/**
 * Enoki Sponsored Transaction Helper
 * Enables gas-free transactions for users by having a sponsor pay for gas fees
 * Based on: https://docs.enoki.mystenlabs.com/ts-sdk/examples
 */

// Initialize Enoki client with your API key
const ENOKI_API_KEY = import.meta.env.VITE_ENOKI_API_KEY || "YOUR_ENOKI_API_KEY";

const enokiClient = new EnokiClient({
  apiKey: ENOKI_API_KEY,
  network: EnokiNetwork.TESTNET, // Change to MAINNET for production
});

interface SponsoredTransactionOptions {
  transaction: Transaction;
  sponsorAddress: string;
  userAddress: string;
}

/**
 * Execute a sponsored transaction
 * The sponsor pays for gas while the user initiates the transaction
 * 
 * @param options Transaction configuration
 * @returns Transaction digest on success
 */
export async function executeSponsoredTransaction({
  transaction,
  sponsorAddress,
  userAddress,
}: SponsoredTransactionOptions): Promise<string> {
  try {
    // Set the sender of the transaction
    transaction.setSender(userAddress);

    // Get the sponsored transaction bytes
    const sponsoredTx = await enokiClient.createSponsoredTransaction({
      network: "testnet",
      transaction: await transaction.build(),
      sponsor: sponsorAddress,
    });

    // Execute the sponsored transaction
    const result = await enokiClient.executeSponsoredTransaction({
      digest: sponsoredTx.digest,
    });

    console.log("Sponsored transaction executed:", result);
    return result.digest;
  } catch (error) {
    console.error("Error executing sponsored transaction:", error);
    throw error;
  }
}

/**
 * Create a sponsored Linktree NFT
 * Allows users to create their first Linktree without needing SUI for gas
 * 
 * @param packageId The deployed package ID
 * @param recipientAddress The address to receive the NFT
 * @param title Page title
 * @param titleColor Title color hex code
 * @param backgroundColor Background color hex code
 * @param bio Bio/description text
 * @param avatarUrl Avatar image URL
 * @param sponsorAddress Address paying for gas
 * @returns Transaction digest
 */
export async function createSponsoredLinktree(
  packageId: string,
  recipientAddress: string,
  title: string,
  titleColor: string,
  backgroundColor: string,
  bio: string,
  avatarUrl: string,
  sponsorAddress: string
): Promise<string> {
  const tx = new Transaction();

  // Call the sponsored creation function
  tx.moveCall({
    target: `${packageId}::linktree_nft::create_linktree_sponsored`,
    arguments: [
      tx.pure.address(recipientAddress),
      tx.pure.string(title),
      tx.pure.string(titleColor),
      tx.pure.string(backgroundColor),
      tx.pure.string(bio),
      tx.pure.string(avatarUrl),
    ],
  });

  return executeSponsoredTransaction({
    transaction: tx,
    sponsorAddress,
    userAddress: recipientAddress,
  });
}

/**
 * Check if Enoki is properly configured
 */
export function isEnokiConfigured(): boolean {
  return ENOKI_API_KEY !== "YOUR_ENOKI_API_KEY" && ENOKI_API_KEY.length > 0;
}

/**
 * Get sponsor balance to check if they can pay for gas
 */
export async function getSponsorBalance(
  suiClient: SuiClient,
  sponsorAddress: string
): Promise<bigint> {
  try {
    const balance = await suiClient.getBalance({
      owner: sponsorAddress,
    });
    return BigInt(balance.totalBalance);
  } catch (error) {
    console.error("Error getting sponsor balance:", error);
    return BigInt(0);
  }
}

/**
 * Estimate gas cost for a transaction
 */
export async function estimateGasCost(
  suiClient: SuiClient,
  transaction: Transaction,
  sender: string
): Promise<bigint> {
  try {
    transaction.setSender(sender);
    const txBytes = await transaction.build({ client: suiClient });
    
    const dryRun = await suiClient.dryRunTransactionBlock({
      transactionBlock: txBytes,
    });

    return BigInt(dryRun.effects.gasUsed.computationCost);
  } catch (error) {
    console.error("Error estimating gas:", error);
    return BigInt(1000000); // Default estimate: ~0.001 SUI
  }
}

/**
 * React hook for sponsored transactions
 */
export function useSponsoredTransaction() {
  const executeSponsored = async (
    transaction: Transaction,
    userAddress: string,
    sponsorAddress: string
  ) => {
    if (!isEnokiConfigured()) {
      throw new Error("Enoki is not configured. Please set VITE_ENOKI_API_KEY");
    }

    return executeSponsoredTransaction({
      transaction,
      userAddress,
      sponsorAddress,
    });
  };

  return {
    executeSponsored,
    isConfigured: isEnokiConfigured(),
  };
}
