import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Box, Card, Flex, Heading, Text, Button, Grid, Dialog } from "@radix-ui/themes";
import { memo, useMemo, useState } from "react";
import { LINKTREE_PACKAGE_ID, LEGACY_LINKTREE_PACKAGE_ID } from "./constants";
import { MobileLinktreeView } from "./MobileLinktreeView";
import { CreateLinktree } from "./CreateLinktree";
import { PhoneMockup } from "./PhoneMockup";
import type { LinktreeNFT } from "./types";

interface MyLinktreesProps {
  onSelectLinktree: (id: string) => void;
  onCreateClick?: () => void;
}

const MyLinktreesComponent = ({ onSelectLinktree, onCreateClick }: MyLinktreesProps) => {
  const currentAccount = useCurrentAccount();
  const ownerAddress = currentAccount?.address;
  
  // State for preview
  const [previewNFT, setPreviewNFT] = useState<LinktreeNFT | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Yeni contract'tan NFT'leri getir
  const { data: newNFTs, isLoading: isLoadingNew } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: ownerAddress || '',
      filter: {
        StructType: `${LINKTREE_PACKAGE_ID}::linktree_nft::LinktreeNFT`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!ownerAddress,
    }
  );

  // Eski contract'tan NFT'leri getir
  const { data: legacyNFTs, isLoading: isLoadingLegacy } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: ownerAddress || '',
      filter: {
        StructType: `${LEGACY_LINKTREE_PACKAGE_ID}::linktree_nft::LinktreeNFT`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!ownerAddress,
    }
  );

  // Tüm NFT'leri birleştir
  const allLinktrees = useMemo(() => {
    const newItems = newNFTs?.data || [];
    const legacyItems = legacyNFTs?.data || [];
    return [...newItems, ...legacyItems];
  }, [newNFTs, legacyNFTs]);

  const isLoading = isLoadingNew || isLoadingLegacy;

  if (isLoading) {
    return (
      <Flex direction="column" gap="4" align="center" justify="center" style={{ minHeight: 400 }}>
        <Text size="4">Loading your Linktrees...</Text>
      </Flex>
    );
  }

  if (allLinktrees.length === 0) {
    return (
      <>
        <Flex direction="column" gap="4" align="center" justify="center" style={{ minHeight: 400 }}>
          <Heading size="6">Welcome to MIRMIR</Heading>
          <Text size="4" align="center" style={{ maxWidth: 600 }}>
            Create your personalized link page as an NFT on Sui blockchain.
            Each page is a unique NFT that belongs entirely to you!
          </Text>
          <Button size="3" onClick={() => {
            if (onCreateClick) {
              onCreateClick();
            } else {
              setShowCreateModal(true);
            }
          }}>
            Create Your First Linktree
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Heading size="6">Your Linktrees</Heading>
        <Button variant="soft" onClick={() => {
          if (onCreateClick) {
            onCreateClick();
          } else {
            setShowCreateModal(true);
          }
        }}>
          Create New
        </Button>
      </Flex>

      {/* Split View: List + Preview */}
      <Flex gap="4" style={{ minHeight: '500px' }}>
        {/* Left Side: List (40% width) */}
        <Box style={{ flex: '2', minWidth: 0 }}>
          <Grid columns={{ initial: '1', md: '2' }} gap="4">
            {allLinktrees.map((obj) => {
              const content = obj.data?.content as any;
              const fields = content?.fields;
              
              if (!fields) return null;

              const title = fields.title || 'Untitled';
              const bio = fields.bio || '';
              const avatarUrl = fields.avatarUrl || fields.avatar_url || '';
              const backgroundColor = fields.backgroundColor || fields.background_color || '#ffffff';
              const linksCount = fields.links?.length || 0;
              const walletsCount = fields.wallet_addresses?.length || 0;

              // Parse username
              let username: string | undefined;
              if (typeof fields.username === 'string') {
                username = fields.username;
              } else if (fields.username && typeof fields.username === 'object' && 'vec' in fields.username) {
                username = fields.username.vec[0];
              }

              // Convert to LinktreeNFT type
              const nft: LinktreeNFT = {
                id: fields.id.id,
                title,
                titleColor: fields.title_color || '#000000',
                textColor: fields.text_color || '#2D2A26',
                backgroundColor,
                bio,
                avatarUrl,
                links: fields.links || [],
                walletAddresses: fields.wallet_addresses || [],
                owner: ownerAddress || '',
                username,
              };

              return (
                <Card
                  key={fields.id.id}
                  style={{
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: previewNFT?.id === nft.id ? '2px solid #E63946' : undefined,
                    background: 'var(--gray-2)',
                  }}
                  onClick={() => setPreviewNFT(nft)}
                >
                  <Flex direction="column" gap="3" style={{ height: '100%' }}>
                    {/* Avatar at top */}
                    <Flex justify="center" align="center" style={{ paddingTop: '12px' }}>
                      <Box
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: `3px solid ${backgroundColor}`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                        }}
                      >
                        {!avatarUrl && '👤'}
                      </Box>
                    </Flex>
                    
                    {/* Info section - flex 1 to push buttons to bottom */}
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Heading size="4" style={{ color: 'var(--gray-12)' }}>{title}</Heading>
                      {username && (
                        <Text size="2" style={{ color: 'var(--blue-11)' }}>
                          @{username}
                        </Text>
                      )}
                      {bio && (
                        <Text size="2" style={{ 
                          color: 'var(--gray-11)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {bio}
                        </Text>
                      )}
                      <Flex gap="3" align="center" style={{ marginTop: '8px' }}>
                        <Text size="1" style={{ color: 'var(--gray-11)' }}>
                          🔗 {linksCount} link{linksCount !== 1 ? 's' : ''}
                        </Text>
                        {walletsCount > 0 && (
                          <Text size="1" style={{ color: 'var(--gray-11)' }}>
                            💰 {walletsCount} wallet{walletsCount !== 1 ? 's' : ''}
                          </Text>
                        )}
                      </Flex>
                    </Flex>

                    {/* Action Buttons at bottom */}
                    <Flex gap="2">
                      <Button 
                        size="2" 
                        variant="soft"
                        style={{ flex: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLinktree(fields.id.id);
                        }}
                      >
                        👁️ View
                      </Button>
                      <Button 
                        size="2" 
                        style={{ flex: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLinktree(fields.id.id);
                        }}
                      >
                        ✏️ Edit
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Grid>
        </Box>

        {/* Right Side: Preview (60% width) - Phone Mockup */}
        {previewNFT && (
          <Box 
            style={{ 
              flex: '3',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 20,
              height: 'fit-content',
            }}
          >
            <Box style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              {/* Close button */}
              <Button 
                size="1" 
                variant="solid"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 100,
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  fontSize: '16px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => setPreviewNFT(null)}
              >
                ✕
              </Button>
              
              <PhoneMockup>
                <MobileLinktreeView nft={previewNFT} />
              </PhoneMockup>
            </Box>
          </Box>
        )}
      </Flex>

      {/* Create Modal */}
      <Dialog.Root open={showCreateModal} onOpenChange={setShowCreateModal}>
        <Dialog.Content 
          style={{ 
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Dialog.Title>Create New Linktree</Dialog.Title>
          <Box mt="4">
            <CreateLinktree 
              onSuccess={(id: string) => {
                setShowCreateModal(false);
                // Optionally navigate to the new NFT
                setTimeout(() => onSelectLinktree(id), 300);
              }}
            />
          </Box>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export const MyLinktrees = memo(MyLinktreesComponent);
