import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button, TextField, Flex, Card, Heading, Text } from '@radix-ui/themes';
import { LINKTREE_PACKAGE_ID } from './constants';
import { CloudinaryImageUpload } from './CloudinaryImageUpload';

interface CreateLinktreeProps {
  onSuccess?: (nftId: string) => void;
}

export function CreateLinktree({ onSuccess }: CreateLinktreeProps) {
  const [title, setTitle] = useState('');
  const [titleColor, setTitleColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const handleCreate = async () => {
    if (!title) {
      alert('Please enter a title');
      return;
    }
    
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    setIsCreating(true);

    try {
      const tx = new Transaction();
      
      // Normal wallet transaction
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::create_linktree`,
        arguments: [
          tx.pure.string(title),
          tx.pure.string(titleColor),
          tx.pure.string(textColor),
          tx.pure.string(backgroundColor),
          tx.pure.string(bio),
          tx.pure.string(avatarUrl),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('Linktree created:', result);
            
            // Try to get NFT ID from events or wait for transaction
            if (onSuccess && result.digest) {
              // We'll use a timeout to let the transaction settle
              setTimeout(() => {
                alert('✅ Linktree created successfully! Refreshing...');
                window.location.reload();
              }, 1000);
            }
            
            // Clear form
            setTitle('');
            setBio('');
            setAvatarUrl('');
            setIsCreating(false);
          },
          onError: (error) => {
            console.error('Error creating linktree:', error);
            alert('Failed to create linktree: ' + error.message);
            setIsCreating(false);
          },
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
      alert('An error occurred');
      setIsCreating(false);
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Card>
        <Heading size="6" mb="4">
          ✨ Create Your Linktree
        </Heading>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title *
            </Text>
            <TextField.Root
              placeholder="My Linktree"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Bio
            </Text>
            <TextField.Root
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Avatar URL
            </Text>
            <CloudinaryImageUpload
              currentImageUrl={avatarUrl}
              onImageUploaded={setAvatarUrl}
              buttonText="Upload Avatar"
            />
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Avatar preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginTop: 8,
                }}
              />
            )}
          </label>

          <Flex gap="3">
            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Title Color
              </Text>
              <input
                type="color"
                value={titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                style={{ width: '100%', height: 40, cursor: 'pointer' }}
              />
            </label>

            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Text Color
              </Text>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                style={{ width: '100%', height: 40, cursor: 'pointer' }}
              />
            </label>

            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Background Color
              </Text>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                style={{ width: '100%', height: 40, cursor: 'pointer' }}
              />
            </label>
          </Flex>

          <Button
            size="3"
            onClick={handleCreate}
            disabled={isCreating || !currentAccount}
          >
            {isCreating ? '⏳ Creating...' : '✨ Create Linktree'}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
