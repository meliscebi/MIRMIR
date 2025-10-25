import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
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
          },
          onError: (error) => {
            console.error('Username binding error:', error);
            const errorMsg = error?.message || String(error);
            if (errorMsg.includes('EUsernameAlreadyTaken') || errorMsg.includes('already')) {
              alert(`Username "${username}" is already taken. Try a different username.`);
            } else {
              alert('Could not bind username: ' + errorMsg);
            }
          },
        }
      );
    } catch (error) {
      console.error('Error binding username:', error);
      alert('An error occurred');
    } finally {
      setIsBinding(false);
    }
  };

  const handleUnbind = async () => {
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
            alert('Username binding removed');
            setUsername('');
            onSuccess?.();
          },
          onError: (error) => {
            console.error('Username removal error:', error);
            alert('Could not remove username');
          },
        }
      );
    } catch (error) {
      console.error('Error unbinding username:', error);
      alert('An error occurred');
    } finally {
      setIsBinding(false);
    }
  };

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Heading size="4">🔗 Short Link (Username)</Heading>
        <Text size="2" color="gray">
          Use a short and memorable username instead of NFT ID
        </Text>
        
        {currentUsername && (
          <Text size="3" weight="bold" style={{ color: 'green' }}>
            ✅ Current username: <code>{currentUsername}</code>
            <br />
            <a href={`/${currentUsername}`} target="_blank" rel="noopener noreferrer">
              {window.location.origin}/{currentUsername}
            </a>
          </Text>
        )}

        <TextField.Root
          placeholder="e.g.: alice"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          disabled={isBinding}
        />

        <Flex gap="2">
          <Button
            onClick={handleBind}
            disabled={!username || isBinding}
            style={{ flex: 1 }}
          >
            {isBinding ? 'Binding...' : currentUsername ? 'Update' : 'Bind'}
          </Button>
          
          {currentUsername && (
            <Button
              onClick={handleUnbind}
              disabled={isBinding}
              color="red"
              variant="soft"
            >
              Remove
            </Button>
          )}
        </Flex>

        <Text size="1" color="gray">
          💡 Tip: Username must be unique and can only contain letters, numbers and underscore (_)
        </Text>
      </Flex>
    </Card>
  );
}
