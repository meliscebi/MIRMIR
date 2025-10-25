import { useState } from 'react';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
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
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const handleCreate = async () => {
    if (!title) {
      alert('Please enter a title');
      return;
    }

    setIsCreating(true);

    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::create_linktree`,
        arguments: [
          tx.pure.string(title),
          tx.pure.string(titleColor),
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
          onSuccess: async (result) => {
            console.log('Linktree NFT created:', result);
            
            // Wait for transaction to get full details
            try {
              const txResult = await suiClient.waitForTransaction({
                digest: result.digest,
                options: {
                  showEffects: true,
                  showObjectChanges: true,
                },
              });
              
              console.log('Full transaction result:', txResult);
              
              // Find created LinktreeNFT object
              const nftObject = txResult.objectChanges?.find(
                (change: any) => 
                  change.type === 'created' && 
                  change.objectType?.includes('LinktreeNFT')
              );
              
              if (nftObject && 'objectId' in nftObject && onSuccess) {
                const nftId = nftObject.objectId;
                console.log('Created NFT ID:', nftId);
                onSuccess(nftId);
              }
            } catch (error) {
              console.error('Error fetching transaction:', error);
            }
            
            // Clear form
            setTitle('');
            setBio('');
            setAvatarUrl('');
            setIsCreating(false);
          },
          onError: (error) => {
            console.error('Error:', error);
            alert('Could not create Linktree: ' + error.message);
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
    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
      <Flex direction="column" gap="4">
        <Heading size="6">Create New Linktree NFT</Heading>
        
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Title *</Text>
          <TextField.Root
            placeholder="Your name or brand"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Title Color</Text>
          <Flex gap="2" align="center">
            <input
              type="color"
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              style={{ width: 50, height: 40, cursor: 'pointer' }}
            />
            <TextField.Root
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              placeholder="#000000"
            />
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Background Color</Text>
          <Flex gap="2" align="center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{ width: 50, height: 40, cursor: 'pointer' }}
            />
            <TextField.Root
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              placeholder="#ffffff"
            />
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Bio</Text>
          <TextField.Root
            placeholder="Write a short description"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Avatar Image</Text>
          <CloudinaryImageUpload
            currentImageUrl={avatarUrl}
            onImageUploaded={(url) => setAvatarUrl(url)}
            buttonText="Choose Avatar"
            showPreview={true}
          />
        </Flex>

        <Button
          size="3"
          onClick={handleCreate}
          disabled={isCreating || !title}
        >
          {isCreating ? 'Creating...' : 'Create Linktree NFT'}
        </Button>
      </Flex>
    </Card>
  );
}
