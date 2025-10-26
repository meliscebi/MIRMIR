import { ConnectButton, useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Container, Flex, Heading } from "@radix-ui/themes";
import { useState, useEffect, useMemo, useCallback } from "react";
import { MyLinktrees } from "./MyLinktrees";
import { LandingPage } from "./LandingPage";
import { NotFoundPage } from "./NotFoundPage";
import { LinktreeEditor } from "./LinktreeEditor";
import { MobileLinktreeView } from "./MobileLinktreeView";
import type { LinktreeNFT } from "./types";

function App() {
  const currentAccount = useCurrentAccount();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
  const [routeError, setRouteError] = useState<string | null>(null);

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const pathname = window.location.pathname.slice(1);
      const hash = window.location.hash.slice(1);
      const identifier = pathname || hash;
      
      if (isValidSuiObjectId(identifier)) {
        setLinktreeId(identifier);
        setRouteError(null);
      } else if (identifier) {
        // Invalid route - show 404
        setRouteError(identifier);
        setLinktreeId(null);
      } else {
        setLinktreeId(null);
        setRouteError(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [linktreeId]);

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
      textColor: fields.text_color || '#2D2A26',
      backgroundColor: fields.background_color || '#ffffff',
      bio: fields.bio || '',
      avatarUrl: fields.avatar_url || '',
      links: fields.links || [],
      walletAddresses: fields.wallet_addresses || [],
      owner: fields.owner || '',
      username: username,
    };
  }, [nftData]);

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
          setRouteError(null);
        }}>
          🔗 MIRMIR
        </Heading>

        <Flex gap="2" align="center">
          {/* Standard wallet connect button */}
          <ConnectButton />
        </Flex>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ minHeight: 500 }}
        >
          {/* Check if this is an auth callback */}
          {/* Show 404 if invalid route */
          routeError ? (
            <NotFoundPage 
              identifier={routeError}
              onGoHome={() => {
                window.location.hash = '';
                setLinktreeId(null);
                setRouteError(null);
              }}
            />
          ) : linktreeId && nft ? (
            // Show NFT - accessible by anyone (logged in or not)
            // Use mobile view on mobile devices when viewing (not editing)
            isMobile && !currentAccount ? (
              <MobileLinktreeView nft={nft} />
            ) : (
              <LinktreeEditor
                nft={nft}
                nftId={linktreeId}
                isOwner={currentAccount?.address === nft.owner}
                onUpdate={handleUpdate}
              />
            )
          ) : currentAccount ? (
            // Logged in with wallet - show user's linktrees
            <MyLinktrees 
              onSelectLinktree={(id) => {
                window.location.hash = id;
                setLinktreeId(id);
              }}
            />
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