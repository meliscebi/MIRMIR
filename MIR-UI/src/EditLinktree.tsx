import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button, TextField, Flex, Card, Heading, Text, IconButton } from '@radix-ui/themes';
import { TrashIcon, PlusIcon } from '@radix-ui/react-icons';
import type { Link } from './types';
import { LINKTREE_PACKAGE_ID } from './constants';

interface EditLinktreeProps {
  nftId: string;
  currentTitle: string;
  currentTitleColor: string;
  currentBackgroundColor: string;
  currentBio: string;
  currentAvatarUrl: string;
  currentLinks: Link[];
  onUpdate?: () => void;
}

export function EditLinktree({
  nftId,
  currentTitle,
  currentTitleColor,
  currentBackgroundColor,
  currentBio,
  currentAvatarUrl,
  currentLinks,
  onUpdate,
}: EditLinktreeProps) {
  const [title, setTitle] = useState(currentTitle);
  const [titleColor, setTitleColor] = useState(currentTitleColor);
  const [backgroundColor, setBackgroundColor] = useState(currentBackgroundColor);
  const [bio, setBio] = useState(currentBio);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [isUpdating, setIsUpdating] = useState(false);

  // Yeni link ekleme için state'ler
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('🔗');

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleUpdateTitle = async () => {
    if (!title) return;
    setIsUpdating(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_title`,
        arguments: [
          tx.object(nftId),
          tx.pure.string(title),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log('Başlık güncellendi');
            if (onUpdate) onUpdate();
            setIsUpdating(false);
          },
          onError: (error) => {
            console.error('Hata:', error);
            alert('Güncelleme başarısız: ' + error.message);
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      console.error('İşlem hatası:', error);
      setIsUpdating(false);
    }
  };

  const handleUpdateTitleColor = async () => {
    setIsUpdating(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_title_color`,
        arguments: [
          tx.object(nftId),
          tx.pure.string(titleColor),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log('Başlık rengi güncellendi');
            if (onUpdate) onUpdate();
            setIsUpdating(false);
          },
          onError: (error) => {
            console.error('Hata:', error);
            alert('Güncelleme başarısız: ' + error.message);
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      console.error('İşlem hatası:', error);
      setIsUpdating(false);
    }
  };

  const handleUpdateBackgroundColor = async () => {
    setIsUpdating(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_background_color`,
        arguments: [
          tx.object(nftId),
          tx.pure.string(backgroundColor),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log('Arkaplan rengi güncellendi');
            if (onUpdate) onUpdate();
            setIsUpdating(false);
          },
          onError: (error) => {
            console.error('Hata:', error);
            alert('Güncelleme başarısız: ' + error.message);
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      console.error('İşlem hatası:', error);
      setIsUpdating(false);
    }
  };

  const handleUpdateBio = async () => {
    setIsUpdating(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_bio`,
        arguments: [
          tx.object(nftId),
          tx.pure.string(bio),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log('Biyografi güncellendi');
            if (onUpdate) onUpdate();
            setIsUpdating(false);
          },
          onError: (error) => {
            console.error('Hata:', error);
            alert('Güncelleme başarısız: ' + error.message);
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      console.error('İşlem hatası:', error);
      setIsUpdating(false);
    }
  };

  const handleUpdateAvatar = async () => {
    setIsUpdating(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::update_avatar`,
        arguments: [
          tx.object(nftId),
          tx.pure.string(avatarUrl),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log('Avatar güncellendi');
            if (onUpdate) onUpdate();
            setIsUpdating(false);
          },
          onError: (error) => {
            console.error('Hata:', error);
            alert('Güncelleme başarısız: ' + error.message);
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      console.error('İşlem hatası:', error);
      setIsUpdating(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLinkTitle || !newLinkUrl) {
      alert('Lütfen link başlığı ve URL girin');
      return;
    }

    setIsUpdating(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::add_link`,
        arguments: [
          tx.object(nftId),
          tx.pure.string(newLinkTitle),
          tx.pure.string(newLinkUrl),
          tx.pure.string(newLinkIcon),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log('Link eklendi');
            setNewLinkTitle('');
            setNewLinkUrl('');
            setNewLinkIcon('🔗');
            if (onUpdate) onUpdate();
            setIsUpdating(false);
          },
          onError: (error) => {
            console.error('Hata:', error);
            alert('Link eklenemedi: ' + error.message);
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      console.error('İşlem hatası:', error);
      setIsUpdating(false);
    }
  };

  const handleRemoveLink = async (index: number) => {
    setIsUpdating(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::remove_link`,
        arguments: [
          tx.object(nftId),
          tx.pure.u64(index),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            console.log('Link silindi');
            if (onUpdate) onUpdate();
            setIsUpdating(false);
          },
          onError: (error) => {
            console.error('Hata:', error);
            alert('Link silinemedi: ' + error.message);
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      console.error('İşlem hatası:', error);
      setIsUpdating(false);
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Flex direction="column" gap="5">
        <Heading size="6">Linktree Düzenleme Paneli</Heading>
        <Text size="2" color="gray">NFT ID: {nftId}</Text>

        {/* Başlık */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Başlık</Heading>
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık"
            />
            <Button onClick={handleUpdateTitle} disabled={isUpdating}>
              Başlığı Güncelle
            </Button>
          </Flex>
        </Card>

        {/* Başlık Rengi */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Başlık Rengi</Heading>
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
              />
            </Flex>
            <Button onClick={handleUpdateTitleColor} disabled={isUpdating}>
              Başlık Rengini Güncelle
            </Button>
          </Flex>
        </Card>

        {/* Arkaplan Rengi */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Arkaplan Rengi</Heading>
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
              />
            </Flex>
            <Button onClick={handleUpdateBackgroundColor} disabled={isUpdating}>
              Arkaplan Rengini Güncelle
            </Button>
          </Flex>
        </Card>

        {/* Biyografi */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Biyografi</Heading>
            <TextField.Root
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Biyografi"
            />
            <Button onClick={handleUpdateBio} disabled={isUpdating}>
              Biyografiyi Güncelle
            </Button>
          </Flex>
        </Card>

        {/* Avatar */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Avatar URL</Heading>
            <TextField.Root
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <Button onClick={handleUpdateAvatar} disabled={isUpdating}>
              Avatar'ı Güncelle
            </Button>
          </Flex>
        </Card>

        {/* Linkler */}
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="4">Linkler</Heading>
            
            {/* Mevcut Linkler */}
            {currentLinks.length > 0 ? (
              <Flex direction="column" gap="2">
                {currentLinks.map((link, index) => (
                  <Card key={index}>
                    <Flex justify="between" align="center" gap="3">
                      <Flex gap="2" align="center" style={{ flex: 1 }}>
                        <Text size="4">{link.icon}</Text>
                        <Flex direction="column" gap="1">
                          <Text weight="bold">{link.title}</Text>
                          <Text size="2" color="gray">{link.url}</Text>
                        </Flex>
                      </Flex>
                      <IconButton
                        color="red"
                        variant="soft"
                        onClick={() => handleRemoveLink(index)}
                        disabled={isUpdating}
                      >
                        <TrashIcon />
                      </IconButton>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            ) : (
              <Text color="gray">Henüz link eklenmemiş</Text>
            )}

            {/* Yeni Link Ekle */}
            <Card variant="surface">
              <Flex direction="column" gap="3">
                <Heading size="3">Yeni Link Ekle</Heading>
                <TextField.Root
                  placeholder="Link Başlığı (örn: Instagram)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                />
                <TextField.Root
                  placeholder="URL (örn: https://instagram.com/kullanici)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
                <TextField.Root
                  placeholder="Icon/Emoji (örn: 📸)"
                  value={newLinkIcon}
                  onChange={(e) => setNewLinkIcon(e.target.value)}
                />
                <Button onClick={handleAddLink} disabled={isUpdating}>
                  <PlusIcon /> Link Ekle
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
}
