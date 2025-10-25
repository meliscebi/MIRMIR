import { ConnectButton, useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading, Tabs, Button, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { CreateLinktree } from "./CreateLinktree";
import { EditLinktree } from "./EditLinktree";
import { LinktreePage } from "./LinktreePage";
import { BindUsername } from "./BindUsername";
import type { LinktreeNFT } from "./types";

function App() {
  const currentAccount = useCurrentAccount();
  const [linktreeId, setLinktreeId] = useState<string | null>(() => {
    // Check both pathname and hash for identifier
    const pathname = window.location.pathname.slice(1); // Remove leading /
    const hash = window.location.hash.slice(1);
    const identifier = pathname || hash;
    
    // If it's a valid object ID, use it
    if (isValidSuiObjectId(identifier)) {
      return identifier;
    }
    
    // Otherwise we'll need to resolve username (not yet implemented for dev)
    return null;
  });
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>(() => {
    const pathname = window.location.pathname.slice(1);
    const hash = window.location.hash.slice(1);
    const identifier = pathname || hash;
    return isValidSuiObjectId(identifier) ? 'view' : 'create';
  });

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const pathname = window.location.pathname.slice(1);
      const hash = window.location.hash.slice(1);
      const identifier = pathname || hash;
      
      if (isValidSuiObjectId(identifier)) {
        setLinktreeId(identifier);
        setViewMode('view');
      } else if (identifier) {
        // Username entered - show message for now
        alert(`Username routing (/${identifier}) henüz development modda desteklenmiyor.\n\nÜretim (production) ortamında çalışacak!\n\nŞimdilik NFT ID ile erişin: #${linktreeId || '0x...'}`);
        setLinktreeId(null);
        setViewMode('create');
      } else {
        setLinktreeId(null);
        setViewMode('create');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [linktreeId]);

  // NFT verisini çek
  const { data: nftData, refetch, isLoading, error } = useSuiClientQuery(
    'getObject',
    {
      id: linktreeId!,
      options: {
        showContent: true,
        showOwner: true,
      },
    },
    {
      enabled: !!linktreeId,
    }
  );

  console.log('Query state:', { linktreeId, isLoading, hasData: !!nftData, error });
  console.log('Raw NFT data:', nftData);
  if (nftData?.error) {
    console.error('NFT Data Error:', nftData.error);
  }

  // NFT verisini parse et
  const parseNFTData = (): LinktreeNFT | null => {
    // Check if data exists and is valid
    if (!nftData) return null;
    if (!nftData.data) return null;
    if (!('content' in nftData.data)) return null;
    
    const content = nftData.data.content as any;
    if (!content || content.dataType !== 'moveObject') return null;

    const fields = content.fields;
    if (!fields) return null;

    console.log('NFT fields:', fields);
    console.log('Username field:', fields.username);
    console.log('Username type:', typeof fields.username);
    console.log('Username vec:', fields.username?.vec);

    // Parse username - handle both string and Option<String> formats
    let username: string | undefined;
    if (typeof fields.username === 'string') {
      username = fields.username;
    } else if (fields.username && typeof fields.username === 'object' && 'vec' in fields.username) {
      username = fields.username.vec[0];
    }

    console.log('Parsed username:', username);

    return {
      id: fields.id.id,
      title: fields.title || '',
      titleColor: fields.title_color || '#000000',
      backgroundColor: fields.background_color || '#ffffff',
      bio: fields.bio || '',
      avatarUrl: fields.avatar_url || '',
      links: fields.links || [],
      owner: fields.owner || '',
      username: username,
    };
  };

  const nft = parseNFTData();
  console.log('Parsed NFT:', nft);

  const handleNFTCreated = (id: string) => {
    window.location.hash = id;
    setLinktreeId(id);
    setViewMode('edit');
  };

  const handleUpdate = () => {
    refetch();
  };

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>🔗 Web3 Linktree - Sui NFT</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {currentAccount ? (
            <>
              {linktreeId && nft ? (
                <Flex direction="column" gap="4">
                  {/* Tab navigasyonu */}
                  <Tabs.Root value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                    <Tabs.List>
                      <Tabs.Trigger value="view">Görüntüle</Tabs.Trigger>
                      <Tabs.Trigger value="edit">Düzenle</Tabs.Trigger>
                    </Tabs.List>

                    <Box pt="4">
                      <Tabs.Content value="view">
                        <LinktreePage nft={nft} />
                      </Tabs.Content>

                      <Tabs.Content value="edit">
                        {currentAccount.address === nft.owner ? (
                          <Flex direction="column" gap="4">
                            <BindUsername
                              nftId={linktreeId}
                              currentUsername={nft.username}
                              onSuccess={handleUpdate}
                            />
                            <EditLinktree
                              nftId={linktreeId}
                              currentTitle={nft.title}
                              currentTitleColor={nft.titleColor}
                              currentBackgroundColor={nft.backgroundColor}
                              currentBio={nft.bio}
                              currentAvatarUrl={nft.avatarUrl}
                              currentLinks={nft.links}
                              onUpdate={handleUpdate}
                            />
                          </Flex>
                        ) : (
                          <Text>Bu NFT'nin sahibi değilsiniz, düzenleyemezsiniz.</Text>
                        )}
                      </Tabs.Content>
                    </Box>
                  </Tabs.Root>

                  <Button
                    variant="soft"
                    onClick={() => {
                      window.location.hash = '';
                      setLinktreeId(null);
                      setViewMode('create');
                    }}
                  >
                    Yeni Linktree Oluştur
                  </Button>
                </Flex>
              ) : (
                <CreateLinktree onSuccess={handleNFTCreated} />
              )}
            </>
          ) : (
            <Flex direction="column" gap="4" align="center" justify="center" style={{ minHeight: 400 }}>
              <Heading>🔗 Web3 Linktree'ye Hoş Geldiniz</Heading>
              <Text size="4" align="center" style={{ maxWidth: 600 }}>
                Sui blockchain üzerinde NFT tabanlı kişisel link sayfanızı oluşturun.
                Her sayfa bir NFT'dir ve tamamen size aittir!
              </Text>
              <Text size="3" color="gray" align="center">
                Başlamak için lütfen cüzdanınızı bağlayın
              </Text>
            </Flex>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;
