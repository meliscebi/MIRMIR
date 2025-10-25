import { useState, useEffect } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button, TextField, Flex, Card, Heading, Text, IconButton, Box } from '@radix-ui/themes';
import { TrashIcon, PlusIcon } from '@radix-ui/react-icons';
import type { Link } from './types';
import { LINKTREE_PACKAGE_ID } from './constants';
import { CloudinaryImageUpload } from './CloudinaryImageUpload';

interface EditLinktreeFormProps {
  nftId: string;
  currentTitle: string;
  currentTitleColor: string;
  currentBackgroundColor: string;
  currentBio: string;
  currentAvatarUrl: string;
  currentLinks: Link[];
  onUpdate?: () => void;
  onLivePreview?: (data: {
    title: string;
    titleColor: string;
    backgroundColor: string;
    bio: string;
    avatarUrl: string;
    links: Link[];
  }) => void;
}

export function EditLinktreeForm({
  nftId,
  currentTitle,
  currentTitleColor,
  currentBackgroundColor,
  currentBio,
  currentAvatarUrl,
  currentLinks,
  onUpdate,
  onLivePreview,
}: EditLinktreeFormProps) {
  const [title, setTitle] = useState(currentTitle);
  const [titleColor, setTitleColor] = useState(currentTitleColor);
  const [backgroundColor, setBackgroundColor] = useState(currentBackgroundColor);
  const [bio, setBio] = useState(currentBio);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [links, setLinks] = useState<Link[]>(currentLinks);
  const [isSaving, setIsSaving] = useState(false);

  // New link input states
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('🔗');

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Live preview - send data to parent whenever it changes
  useEffect(() => {
    if (onLivePreview) {
      onLivePreview({
        title,
        titleColor,
        backgroundColor,
        bio,
        avatarUrl,
        links,
      });
    }
  }, [title, titleColor, backgroundColor, bio, avatarUrl, links, onLivePreview]);

  const handleAddLink = () => {
    if (!newLinkTitle || !newLinkUrl) {
      alert('Please enter both title and URL');
      return;
    }

    const newLink: Link = {
      title: newLinkTitle,
      url: newLinkUrl,
      icon: newLinkIcon,
    };

    setLinks([...links, newLink]);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkIcon('🔗');
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }

    setIsSaving(true);

    try {
      const tx = new Transaction();

      // Update title
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_title`,
        arguments: [tx.object(nftId), tx.pure.string(title)],
      });

      // Update title color
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_title_color`,
        arguments: [tx.object(nftId), tx.pure.string(titleColor)],
      });

      // Update background color
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_background_color`,
        arguments: [tx.object(nftId), tx.pure.string(backgroundColor)],
      });

      // Update bio
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_bio`,
        arguments: [tx.object(nftId), tx.pure.string(bio)],
      });

      // Update avatar
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_avatar`,
        arguments: [tx.object(nftId), tx.pure.string(avatarUrl)],
      });

      // Clear all links first
      for (let i = 0; i < currentLinks.length; i++) {
        tx.moveCall({
          target: `${LINKTREE_PACKAGE_ID}::linktree_nft::remove_link`,
          arguments: [tx.object(nftId), tx.pure.u64(0)], // Always remove first
        });
      }

      // Add new links
      links.forEach((link) => {
        tx.moveCall({
          target: `${LINKTREE_PACKAGE_ID}::linktree_nft::add_link`,
          arguments: [
            tx.object(nftId),
            tx.pure.string(link.title),
            tx.pure.string(link.url),
            tx.pure.string(link.icon),
          ],
        });
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            alert('✅ All changes saved successfully!');
            if (onUpdate) onUpdate();
            setIsSaving(false);
          },
          onError: (error) => {
            console.error('Save error:', error);
            alert('Failed to save: ' + error.message);
            setIsSaving(false);
          },
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
      alert('An error occurred');
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Heading size="5">Edit Linktree</Heading>

        {/* Title */}
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Title *</Text>
          <TextField.Root
            placeholder="Your name or brand"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Flex>

        {/* Title Color */}
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Title Color</Text>
          <Flex gap="2" align="center">
            <input
              type="color"
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              style={{ width: 50, height: 40, cursor: 'pointer', border: 'none' }}
            />
            <TextField.Root
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              placeholder="#000000"
            />
          </Flex>
        </Flex>

        {/* Background Color */}
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Background Color</Text>
          <Flex gap="2" align="center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{ width: 50, height: 40, cursor: 'pointer', border: 'none' }}
            />
            <TextField.Root
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              placeholder="#ffffff"
            />
          </Flex>
        </Flex>

        {/* Bio */}
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Bio</Text>
          <TextField.Root
            placeholder="Write a short description"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Flex>

        {/* Avatar Upload */}
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">Avatar Image</Text>
          <CloudinaryImageUpload
            currentImageUrl={avatarUrl}
            onImageUploaded={(url) => setAvatarUrl(url)}
            buttonText="Choose Avatar"
            showPreview={true}
          />
        </Flex>

        {/* Links */}
        <Flex direction="column" gap="3">
          <Heading size="4">Links</Heading>
          
          {links.map((link, index) => (
            <Card key={index} style={{ background: 'var(--gray-a2)' }}>
              <Flex gap="2" align="center">
                <Text size="6">{link.icon}</Text>
                <Box style={{ flex: 1 }}>
                  <Text size="2" weight="bold">{link.title}</Text>
                  <Text size="1" color="gray" style={{ display: 'block', wordBreak: 'break-all' }}>
                    {link.url}
                  </Text>
                </Box>
                <IconButton
                  size="2"
                  color="red"
                  variant="soft"
                  onClick={() => handleRemoveLink(index)}
                >
                  <TrashIcon />
                </IconButton>
              </Flex>
            </Card>
          ))}

          {/* Add New Link */}
          <Card style={{ background: 'var(--gray-a3)' }}>
            <Flex direction="column" gap="2">
              <Text size="3" weight="bold">Add New Link</Text>
              
              <Flex gap="2" align="center">
                <input
                  type="text"
                  value={newLinkIcon}
                  onChange={(e) => setNewLinkIcon(e.target.value)}
                  placeholder="🔗"
                  maxLength={2}
                  style={{
                    width: 50,
                    height: 40,
                    textAlign: 'center',
                    fontSize: '24px',
                    border: '1px solid var(--gray-a6)',
                    borderRadius: 4,
                    background: 'var(--color-background)',
                  }}
                />
                <TextField.Root
                  placeholder="Link title"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  style={{ flex: 1 }}
                />
              </Flex>

              <TextField.Root
                placeholder="https://example.com"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
              />

              <Button
                variant="soft"
                onClick={handleAddLink}
                disabled={!newLinkTitle || !newLinkUrl}
              >
                <PlusIcon /> Add Link
              </Button>
            </Flex>
          </Card>
        </Flex>

        {/* Save Button */}
        <Button
          size="3"
          onClick={handleSaveAll}
          disabled={isSaving || !title}
          style={{
            marginTop: 20,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          {isSaving ? 'Saving...' : '💾 Save All Changes'}
        </Button>
      </Flex>
    </Card>
  );
}
