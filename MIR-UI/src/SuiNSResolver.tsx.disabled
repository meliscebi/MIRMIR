import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { LinktreePage } from "./LinktreePage";
import { Text, Flex, Spinner, Heading } from "@radix-ui/themes";
import type { LinktreeNFT } from "./types";

/**
 * Flatland Pattern Implementation for Walrus Sites
 * Each SuiNS name resolves to its own unique Linktree page
 * 
 * Example routes:
 * - alice.sui.walrus.site → Alice's Linktree
 * - bob.sui.walrus.site → Bob's Linktree
 * 
 * Based on: https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland
 */

interface SuiNSResolverProps {
  suinsName?: string;
  registryId: string;
  packageId: string;
}

export function SuiNSResolver({ suinsName, registryId, packageId }: SuiNSResolverProps) {
  const suiClient = useSuiClient();
  const [nft, setNft] = useState<LinktreeNFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!suinsName) {
      setIsLoading(false);
      return;
    }

    resolveAndFetchNFT();
  }, [suinsName]);

  /**
   * Resolve SuiNS name to NFT object ID and fetch NFT data
   * This implements the Flatland pattern for dynamic routing
   */
  const resolveAndFetchNFT = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Call the view function to resolve SuiNS name to NFT ID
      const result = await suiClient.devInspectTransactionBlock({
        sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
        transactionBlock: {
          kind: 'moveCall',
          target: `${packageId}::linktree_nft::get_nft_by_suins_name`,
          arguments: [
            { type: 'object', objectId: registryId },
            { type: 'pure', value: suinsName },
          ],
        },
      });

      // Extract the NFT object ID from the result
      const returnValues = result.results?.[0]?.returnValues;
      if (!returnValues || returnValues.length === 0) {
        throw new Error('SuiNS name not found or not bound to any Linktree');
      }

      // Parse the object ID
      const nftId = returnValues[0][0]; // First return value, first element

      // Step 2: Fetch the NFT data using the resolved object ID
      const nftData = await suiClient.getObject({
        id: nftId,
        options: {
          showContent: true,
          showOwner: true,
        },
      });

      if (!nftData || !('content' in nftData.data!)) {
        throw new Error('NFT data not found');
      }

      // Step 3: Parse and set the NFT data
      const content = nftData.data.content as any;
      const fields = content.fields;
      
      setNft({
        id: fields.id.id,
        title: fields.title || '',
        titleColor: fields.title_color || '#000000',
        backgroundColor: fields.background_color || '#ffffff',
        bio: fields.bio || '',
        avatarUrl: fields.avatar_url || '',
        links: fields.links || [],
        owner: fields.owner || '',
      });

    } catch (err) {
      console.error('Error resolving SuiNS name:', err);
      setError(err instanceof Error ? err.message : 'Failed to load Linktree');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center" direction="column" gap="4" style={{ minHeight: 400 }}>
        <Spinner size="3" />
        <Text size="3" color="gray">
          Resolving {suinsName}...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" direction="column" gap="4" style={{ minHeight: 400 }}>
        <Heading size="6">❌ Not Found</Heading>
        <Text size="3" color="red">
          {error}
        </Text>
        <Text size="2" color="gray">
          The SuiNS name "{suinsName}" is not bound to any Linktree NFT.
        </Text>
      </Flex>
    );
  }

  if (!nft) {
    return (
      <Flex align="center" justify="center" direction="column" gap="4" style={{ minHeight: 400 }}>
        <Heading size="6">🔗 Welcome to Web3 Linktree</Heading>
        <Text size="3" color="gray">
          Enter a NFT ID or SuiNS name to view a Linktree page.
        </Text>
      </Flex>
    );
  }

  // Render the Linktree page
  return <LinktreePage nft={nft} />;
}

/**
 * Extract SuiNS name from URL hostname
 * Supports formats like:
 * - alice.sui.walrus.site → alice.sui
 * - linktree.walrus.site/alice.sui → alice.sui
 */
export function extractSuiNSFromURL(): string | undefined {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Check hostname for .sui subdomain
  const hostMatch = hostname.match(/^([^.]+)\.sui\./);
  if (hostMatch) {
    return `${hostMatch[1]}.sui`;
  }

  // Check pathname for .sui name
  const pathMatch = pathname.match(/\/([^/]+\.sui)/);
  if (pathMatch) {
    return pathMatch[1];
  }

  return undefined;
}

/**
 * Hook to automatically resolve SuiNS from URL
 */
export function useSuiNSFromURL() {
  const [suinsName, setSuinsName] = useState<string | undefined>();

  useEffect(() => {
    const name = extractSuiNSFromURL();
    setSuinsName(name);
  }, []);

  return suinsName;
}
