import { ConnectButton, useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading, Tabs, Button, Text } from "@radix-ui/themes";
import { useState } from "react";
import { CreateLinktree } from "./CreateLinktree";
import { EditLinktree } from "./EditLinktree";
import { LinktreePage } from "./LinktreePage";
import type { LinktreeNFT } from "./types";

function App() {
  const currentAccount = useCurrentAccount();
  const [linktreeId, setLinktreeId] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>('create');

  // NFT verisini çek
  const { data: nftData, refetch } = useSuiClientQuery(
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

  // NFT verisini parse et
  const parseNFTData = (): LinktreeNFT | null => {
    if (!nftData || !('content' in nftData.data!)) return null;
    
    const content = nftData.data.content as any;
    if (content.dataType !== 'moveObject') return null;

    const fields = content.fields;
    return {
      id: fields.id.id,
      title: fields.title || '',
      titleColor: fields.title_color || '#000000',
      backgroundColor: fields.background_color || '#ffffff',
      bio: fields.bio || '',
      avatarUrl: fields.avatar_url || '',
      links: fields.links || [],
      owner: fields.owner || '',
    };
  };

  const nft = parseNFTData();

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
