import { Flex, Heading, Text, Avatar, Box } from '@radix-ui/themes';
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
        minHeight: '100%',
        background: nft.backgroundColor,
        padding: '2rem 1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ width: '100%', maxWidth: '100%' }}>
        <Flex direction="column" gap="4" align="center">
          {/* Avatar with gradient ring */}
          {nft.avatarUrl && (
            <Box
              style={{
                padding: '4px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Avatar
                src={nft.avatarUrl}
                fallback={nft.title.charAt(0)}
                size="8"
                radius="full"
                style={{
                  border: '3px solid white',
                  width: '96px',
                  height: '96px',
                }}
              />
            </Box>
          )}

          {/* Title with shadow */}
          <Heading
            size="7"
            style={{
              color: nft.titleColor,
              textAlign: 'center',
              fontWeight: '800',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              letterSpacing: '-0.02em',
            }}
          >
            {nft.title}
          </Heading>

          {/* Bio */}
          {nft.bio && (
            <Text
              size="3"
              style={{
                textAlign: 'center',
                color: nft.textColor || '#555',
                maxWidth: '90%',
                lineHeight: '1.6',
                opacity: 0.9,
              }}
            >
              {nft.bio}
            </Text>
          )}

          {/* Links with glassmorphism */}
          <Flex direction="column" gap="3" style={{ width: '100%', marginTop: '0.5rem' }}>
            {nft.links.map((link, index) => (
              <Box
                key={index}
                onClick={() => handleLinkClick(link.fields.url)}
                style={{
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <Flex align="center" justify="center" gap="3">
                  <Text style={{ fontSize: '24px' }}>{link.fields.icon}</Text>
                  <Text 
                    size="4" 
                    weight="bold" 
                    style={{ 
                      flex: 1, 
                      textAlign: 'center',
                      color: '#1a1a1a',
                    }}
                  >
                    {link.fields.title}
                  </Text>
                  <Text style={{ fontSize: '20px', opacity: 0.3 }}>→</Text>
                </Flex>
              </Box>
            ))}
          </Flex>

          {/* Wallet Addresses */}
          {nft.walletAddresses && nft.walletAddresses.length > 0 && (
            <>
              <Heading 
                size="5" 
                style={{ 
                  marginTop: '2rem',
                  color: nft.titleColor,
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              >
                💰 My Wallet Addresses
              </Heading>
              <Flex direction="column" gap="3" style={{ width: '100%' }}>
                {nft.walletAddresses.map((wallet, index) => (
                  <Box
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      border: '2px solid rgba(255, 122, 0, 0.3)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <Flex direction="column" gap="2">
                      <Flex align="center" justify="between">
                        <Text 
                          size="3" 
                          weight="bold" 
                          style={{ color: '#1a1a1a' }}
                        >
                          {wallet.label}
                        </Text>
                        <Text 
                          size="2" 
                          style={{ 
                            backgroundColor: '#FFB703',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontWeight: '600'
                          }}
                        >
                          {wallet.network}
                        </Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Text 
                          size="2" 
                          style={{ 
                            fontFamily: 'monospace',
                            color: '#666',
                            wordBreak: 'break-all',
                            flex: 1
                          }}
                        >
                          {wallet.address}
                        </Text>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(wallet.address);
                            alert('Address copied to clipboard!');
                          }}
                          style={{
                            background: '#FF7A00',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#E66D00';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FF7A00';
                          }}
                        >
                          Copy
                        </button>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </>
          )}
        </Flex>
      </div>
    </div>
  );
}
