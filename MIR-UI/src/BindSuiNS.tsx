import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Box, Button, TextField, Text, Flex, Heading } from "@radix-ui/themes";

interface BindSuiNSProps {
  nftId: string;
  packageId: string;
  registryId: string;
  currentSuiNSName?: string;
  onSuccess?: () => void;
}

/**
 * Component for binding and unbinding SuiNS names to Linktree NFTs
 * This enables users to access their linktree via their .sui domain
 * Example: alice.sui can point to alice's linktree page on Walrus Sites
 */
export function BindSuiNS({
  nftId,
  packageId,
  registryId,
  currentSuiNSName,
  onSuccess,
}: BindSuiNSProps) {
  const [suinsName, setSuinsName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  /**
   * Bind a SuiNS name to this Linktree NFT
   * After binding, the linktree can be accessed via the .sui domain
   */
  const handleBindSuiNS = () => {
    if (!suinsName.trim()) return;

    setIsLoading(true);

    const tx = new Transaction();

    // Call the bind_suins_name function
    tx.moveCall({
      target: `${packageId}::linktree_nft::bind_suins_name`,
      arguments: [
        tx.object(nftId), // The NFT to bind
        tx.object(registryId), // The shared SuiNS registry
        tx.pure.string(suinsName), // The .sui name to bind
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("SuiNS name bound successfully!");
          setSuinsName("");
          setIsLoading(false);
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          console.error("Error binding SuiNS name:", error);
          setIsLoading(false);
        },
      }
    );
  };

  /**
   * Unbind the current SuiNS name from this NFT
   * This removes the association and makes the name available again
   */
  const handleUnbindSuiNS = () => {
    setIsLoading(true);

    const tx = new Transaction();

    // Call the unbind_suins_name function
    tx.moveCall({
      target: `${packageId}::linktree_nft::unbind_suins_name`,
      arguments: [
        tx.object(nftId), // The NFT to unbind
        tx.object(registryId), // The shared SuiNS registry
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("SuiNS name unbound successfully!");
          setIsLoading(false);
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          console.error("Error unbinding SuiNS name:", error);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Box>
      <Heading size="4" mb="3">
        🌐 SuiNS Domain Binding
      </Heading>

      {currentSuiNSName ? (
        <Flex direction="column" gap="3">
          <Text>
            Current SuiNS name: <strong>{currentSuiNSName}</strong>
          </Text>
          <Text size="2" color="gray">
            Your Linktree is accessible at: {currentSuiNSName}.walrus.site
          </Text>
          <Button
            onClick={handleUnbindSuiNS}
            disabled={isLoading}
            variant="soft"
            color="red"
          >
            {isLoading ? "Unbinding..." : "Unbind SuiNS Name"}
          </Button>
        </Flex>
      ) : (
        <Flex direction="column" gap="3">
          <Text size="2" color="gray">
            Bind a .sui domain to your Linktree for easy access via Walrus Sites.
            For example: alice.sui → alice.sui.walrus.site
          </Text>

          <TextField.Root
            placeholder="your-name.sui"
            value={suinsName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSuinsName(e.target.value)}
            disabled={isLoading}
          />

          <Button
            onClick={handleBindSuiNS}
            disabled={isLoading || !suinsName.trim()}
          >
            {isLoading ? "Binding..." : "Bind SuiNS Name"}
          </Button>

          <Text size="1" color="gray">
            Note: You must own this SuiNS domain to bind it.
          </Text>
        </Flex>
      )}
    </Box>
  );
}
