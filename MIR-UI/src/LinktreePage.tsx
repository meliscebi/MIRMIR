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
        minHeight: '87vh',
        backgroundColor: nft.backgroundColor,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 'min(90vw, 800px)' }}>
        <Flex direction="column" gap="1.2vh" align="center">
          {/* Avatar */}
          {nft.avatarUrl && (
            <Avatar
              src={nft.avatarUrl}
              fallback={nft.title.charAt(0)}
              size="7"
              radius="full"
              style={{
                border: '2px solid white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '8vh',
                height: '8vh',
              }}
            />
          )}

          {/* Başlık */}
          <Heading
            size="6"
            style={{
              color: nft.titleColor,
              textAlign: 'center',
              fontWeight: 'bold',
              marginTop: '0.3vh',
              fontSize: 'clamp(1.5rem, 3.5vh, 2.25rem)',
            }}
          >
            {nft.title}
          </Heading>

          {/* Biyografi */}
          {nft.bio && (
            <Text
              size="2"
              style={{
                textAlign: 'center',
                color: '#666',
                maxWidth: '90%',
                lineHeight: '1.4',
                fontSize: 'clamp(1rem, 2.2vh, 1.125rem)',
              }}
            >
              {nft.bio}
            </Text>
          )}

          {/* Linkler */}
          <Flex direction="column" gap="1vh" style={{ width: '100%', marginTop: '0.8vh' }}>
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
                <Flex align="center" justify="center" gap="2" style={{ padding: '1vh 1rem' }}>
                  <Text style={{ fontSize: 'clamp(1.25rem, 2.5vh, 1.5rem)' }}>{link.icon}</Text>
                  <Text 
                    size="3" 
                    weight="bold" 
                    style={{ 
                      flex: 1, 
                      textAlign: 'center',
                      fontSize: 'clamp(1rem, 2.2vh, 1.125rem)',
                    }}
                  >
                    {link.title}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
