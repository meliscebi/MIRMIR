import { ConnectButton, useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Container, Flex, Heading, Button } from "@radix-ui/themes";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CreateLinktree } from "./CreateLinktree";
import { MyLinktrees } from "./MyLinktrees";
import { LandingPage } from "./LandingPage";
import { NotFoundPage } from "./NotFoundPage";
import { LinktreeEditor } from "./LinktreeEditor";
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
    
    return null;
  });
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create' | 'list'>(() => {
    const pathname = window.location.pathname.slice(1);
    const hash = window.location.hash.slice(1);
    const identifier = pathname || hash;
    return isValidSuiObjectId(identifier) ? 'view' : 'list';
  });
  const [routeError, setRouteError] = useState<string | null>(null);

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const pathname = window.location.pathname.slice(1);
      const hash = window.location.hash.slice(1);
      const identifier = pathname || hash;
      
      if (isValidSuiObjectId(identifier)) {
        setLinktreeId(identifier);
        setViewMode('view');
        setRouteError(null);
      } else if (identifier) {
        // Invalid route - show 404
        setRouteError(identifier);
        setLinktreeId(null);
        setViewMode('list');
      } else {
        setLinktreeId(null);
        setViewMode('list');
        setRouteError(null);
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

  // NFT verisini parse et - useMemo ile optimize edildi
  const nft = useMemo((): LinktreeNFT | null => {
    if (!nftData?.data || !('content' in nftData.data)) return null;
    
    const content = nftData.data.content as any;
    if (!content || content.dataType !== 'moveObject') return null;

    const fields = content.fields;
    if (!fields) return null;

    // Parse username - handle both string and Option<String> formats
    let username: string | undefined;
    if (typeof fields.username === 'string') {
      username = fields.username;
    } else if (fields.username && typeof fields.username === 'object' && 'vec' in fields.username) {
      username = fields.username.vec[0];
    }

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
  }, [nftData]);

  const handleNFTCreated = useCallback((id: string) => {
    window.location.hash = id;
    setLinktreeId(id);
    setViewMode('edit');
  }, []);

  const handleUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        align="center"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          background: "var(--color-background)"
        }}
      >
        <Heading style={{ cursor: 'pointer' }} onClick={() => {
          window.location.hash = '';
          setLinktreeId(null);
          setViewMode('list');
          setRouteError(null);
        }}>
          🔗 Web3 Linktree
        </Heading>

        <ConnectButton />
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ minHeight: 500 }}
        >
          {/* Show 404 if invalid route */}
          {routeError ? (
            <NotFoundPage 
              identifier={routeError}
              onGoHome={() => {
                window.location.hash = '';
                setLinktreeId(null);
                setViewMode('list');
                setRouteError(null);
              }}
            />
          ) : linktreeId && nft ? (
            // Show NFT - accessible by anyone (logged in or not)
            <Flex direction="column" gap="4">
              <LinktreeEditor
                nft={nft}
                nftId={linktreeId}
                isOwner={currentAccount?.address === nft.owner}
                onUpdate={handleUpdate}
              />

              {currentAccount && (
                <Button
                  variant="soft"
                  onClick={() => {
                    window.location.hash = '';
                    setLinktreeId(null);
                    setViewMode('list');
                    setRouteError(null);
                  }}
                >
                  ← Back to My Linktrees
                </Button>
              )}
            </Flex>
          ) : currentAccount ? (
            // Logged in - show user's linktrees or create
            <>
              {viewMode === 'create' ? (
                <CreateLinktree onSuccess={handleNFTCreated} />
              ) : (
                <MyLinktrees 
                  onSelectLinktree={(id) => {
                    window.location.hash = id;
                    setLinktreeId(id);
                    setViewMode('view');
                  }}
                  onCreateNew={() => setViewMode('create')}
                />
              )}
            </>
          ) : (
            // Not logged in - show landing page
            <LandingPage />
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;