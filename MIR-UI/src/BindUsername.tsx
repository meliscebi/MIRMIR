import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button, TextField, Flex, Card, Heading, Text } from '@radix-ui/themes';
import { LINKTREE_PACKAGE_ID, USERNAME_REGISTRY_ID } from './constants';

interface BindUsernameProps {
  nftId: string;
  currentUsername?: string;
  onSuccess?: () => void;
}

export function BindUsername({ nftId, currentUsername, onSuccess }: BindUsernameProps) {
  const [username, setUsername] = useState(currentUsername || '');
  const [isBinding, setIsBinding] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const handleBind = async () => {
    if (!username || username.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    // Username validation: only alphanumeric and underscore
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert('Username can only contain letters, numbers and underscore');
      return;
    }

    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    setIsBinding(true);

    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::bind_username`,
        arguments: [
          tx.object(nftId),
          tx.object(USERNAME_REGISTRY_ID),
          tx.pure.string(username),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            alert(`Username "${username}" successfully bound! 🎉\n\nNote: In production you can access via /${username}.\nFor now, use NFT ID.`);
            onSuccess?.();
            setIsBinding(false);
          },
          onError: (error) => {
            console.error('Username binding error:', error);
            const errorMsg = error?.message || String(error);
            if (errorMsg.includes('EUsernameAlreadyTaken') || errorMsg.includes('already')) {
              alert(`Username "${username}" is already taken. Try a different username.`);
            } else {
              alert('Could not bind username: ' + errorMsg);
            }
            setIsBinding(false);
          },
        }
      );
    } catch (error) {
      console.error('Error binding username:', error);
      alert('An error occurred');
      setIsBinding(false);
    }
  };

  const handleUnbind = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    setIsBinding(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::unbind_username`,
        arguments: [
          tx.object(nftId),
          tx.object(USERNAME_REGISTRY_ID),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            setUsername('');
            onSuccess?.();
            setIsBinding(false);
          },
          onError: (error: any) => {
            console.error('Unbind error:', error);
            alert('Failed to unbind: ' + error.message);
            setIsBinding(false);
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setIsBinding(false);
    }
  };

  return (
    <Card>
      <Heading size="5" mb="3">
        🏷️ Username
      </Heading>

      <Text size="2" mb="3" color="gray">
        Bind a custom username to your Linktree for easy sharing (e.g., /yourname)
      </Text>

      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Username
          </Text>
          <TextField.Root
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            disabled={!!currentUsername || isBinding}
          />
          <Text size="1" color="gray" mt="1">
            Only letters, numbers and underscore allowed. Minimum 3 characters.
          </Text>
        </label>

        <Flex gap="2">
          {!currentUsername ? (
            <Button
              onClick={handleBind}
              disabled={isBinding || !username || !currentAccount}
              style={{ flex: 1 }}
            >
              {isBinding ? '⏳ Binding...' : '🏷️ Bind Username'}
            </Button>
          ) : (
            <Button
              color="red"
              variant="soft"
              onClick={handleUnbind}
              disabled={isBinding || !currentAccount}
              style={{ flex: 1 }}
            >
              {isBinding ? '⏳ Unbinding...' : '🗑️ Unbind Username'}
            </Button>
          )}
        </Flex>

        {currentUsername && (
          <Text size="2" color="green">
            ✅ Currently bound to: <strong>/{currentUsername}</strong>
          </Text>
        )}
      </Flex>
    </Card>
  );
}
