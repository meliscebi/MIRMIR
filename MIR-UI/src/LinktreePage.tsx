import { Flex, Card, Heading, Text, Avatar } from '@radix-ui/themes';
import type { LinktreeNFT } from './types';

interface LinktreePageProps {
  nft: LinktreeNFT;
}

export function LinktreePage({ nft }: LinktreePageProps) {
  const handleLinkClick = (url: string) => {
    // URL'nin geçerli olduğundan emin ol
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: nft.backgroundColor,
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: 680, width: '100%' }}>
        <Flex direction="column" gap="4" align="center">
          {/* Avatar */}
          {nft.avatarUrl && (
            <Avatar
              src={nft.avatarUrl}
              fallback={nft.title.charAt(0)}
              size="9"
              radius="full"
              style={{
                border: '4px solid white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
          )}

          {/* Başlık */}
          <Heading
            size="8"
            style={{
              color: nft.titleColor,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {nft.title}
          </Heading>

          {/* Biyografi */}
          {nft.bio && (
            <Text
              size="4"
              style={{
                textAlign: 'center',
                color: '#666',
                maxWidth: 500,
              }}
            >
              {nft.bio}
            </Text>
          )}

          {/* Linkler */}
          <Flex direction="column" gap="3" style={{ width: '100%', marginTop: '1rem' }}>
            {nft.links.map((link, index) => (
              <Card
                key={index}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => handleLinkClick(link.url)}
              >
                <Flex align="center" justify="center" gap="3" style={{ padding: '0.5rem' }}>
                  <Text size="6">{link.icon}</Text>
                  <Text size="4" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
                    {link.title}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>

          {/* Footer - NFT Bilgisi */}
          <Card style={{ marginTop: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Flex direction="column" gap="2" align="center">
              <Text size="2" color="gray">
                Bu sayfa bir Sui NFT ile oluşturulmuştur
              </Text>
              <Text size="1" color="gray" style={{ fontFamily: 'monospace' }}>
                NFT ID: {nft.id.slice(0, 8)}...{nft.id.slice(-8)}
              </Text>
            </Flex>
          </Card>
        </Flex>
      </div>
    </div>
  );
}
