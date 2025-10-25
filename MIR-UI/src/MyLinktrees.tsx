import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Box, Card, Flex, Heading, Text, Button, Grid } from "@radix-ui/themes";
import { memo } from "react";
import { LINKTREE_PACKAGE_ID } from "./constants";

interface MyLinktreesProps {
  onSelectLinktree: (id: string) => void;
  onCreateNew: () => void;
}

const MyLinktreesComponent = ({ onSelectLinktree, onCreateNew }: MyLinktreesProps) => {
  const currentAccount = useCurrentAccount();

  // Kullanıcının sahip olduğu tüm NFT'leri getir
  const { data: ownedObjects, isLoading, error } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address || '',
      filter: {
        StructType: `${LINKTREE_PACKAGE_ID}::linktree_nft::LinktreeNFT`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!currentAccount,
    }
  );

  if (isLoading) {
    return (
      <Flex direction="column" gap="4" align="center" justify="center" style={{ minHeight: 400 }}>
        <Text size="4">Loading your Linktrees...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" gap="4" align="center" justify="center" style={{ minHeight: 400 }}>
        <Heading size="6">Error Loading Linktrees</Heading>
        <Text size="3" color="red" align="center" style={{ maxWidth: 600 }}>
          {String(error)}
        </Text>
        <Button size="3" onClick={onCreateNew}>
          Create New Linktree
        </Button>
      </Flex>
    );
  }

  const linktrees = ownedObjects?.data || [];

  if (linktrees.length === 0) {
    return (
      <Flex direction="column" gap="4" align="center" justify="center" style={{ minHeight: 400 }}>
        <Heading size="6">Welcome to Web3 Linktree</Heading>
        <Text size="4" align="center" style={{ maxWidth: 600 }}>
          Create your personalized link page as an NFT on Sui blockchain.
          Each page is a unique NFT that belongs entirely to you!
        </Text>
        <Button size="3" onClick={onCreateNew}>
          Create Your First Linktree
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Heading size="6">Your Linktrees</Heading>
        <Button variant="soft" onClick={onCreateNew}>
          Create New
        </Button>
      </Flex>

      <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
        {linktrees.map((obj) => {
          const content = obj.data?.content as any;
          const fields = content?.fields;
          
          if (!fields) return null;

          const title = fields.title || 'Untitled';
          const bio = fields.bio || '';
          const avatarUrl = fields.avatarUrl || fields.avatar_url || '';
          const backgroundColor = fields.backgroundColor || fields.background_color || '#ffffff';
          const linksCount = fields.links?.length || 0;

          // Parse username
          let username: string | undefined;
          if (typeof fields.username === 'string') {
            username = fields.username;
          } else if (fields.username && typeof fields.username === 'object' && 'vec' in fields.username) {
            username = fields.username.vec[0];
          }

          return (
            <Card
              key={fields.id.id}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => onSelectLinktree(fields.id.id)}
            >
              <Flex direction="column" gap="3">
                {avatarUrl && (
                  <Box
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 8,
                      backgroundColor,
                      backgroundImage: `url(${avatarUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                
                <Flex direction="column" gap="1">
                  <Heading size="4">{title}</Heading>
                  {username && (
                    <Text size="2" color="blue">
                      @{username}
                    </Text>
                  )}
                  {bio && (
                    <Text size="2" color="gray" style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {bio}
                    </Text>
                  )}
                  <Text size="1" color="gray">
                    {linksCount} link{linksCount !== 1 ? 's' : ''}
                  </Text>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Grid>
    </Flex>
  );
};

export const MyLinktrees = memo(MyLinktreesComponent);
