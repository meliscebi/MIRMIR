import { Box, Container, Flex, Heading, Text, Grid, Card, Button, Badge, Separator } from "@radix-ui/themes";

interface LandingPageProps {
  onConnectClick?: () => void;
}

export function LandingPage({ onConnectClick }: LandingPageProps) {
  return (
    <Box>
      {/* Hero Section - Full Width */}
      <Box style={{ 
        background: 'linear-gradient(180deg, var(--gray-1) 0%, var(--gray-2) 50%, var(--gray-1) 100%)',
        padding: '120px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <Box style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--violet-a5) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <Box style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--purple-a5) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <Box style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--pink-a4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        
        <Container size="4" style={{ position: 'relative', zIndex: 1 }}>
          <Badge size="3" variant="soft" style={{ 
            background: 'var(--violet-a5)', 
            color: 'var(--violet-11)',
            marginBottom: '24px',
            border: '1px solid var(--violet-a6)',
            fontWeight: '600'
          }}>
            ✨ The Future of Link Sharing
          </Badge>
          
          <Heading size="9" mb="5" style={{ 
            background: 'linear-gradient(135deg, var(--violet-11) 0%, var(--purple-11) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '900',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            The easiest way to share:<br />one link.
          </Heading>
          
          <Text size="6" mb="8" style={{ 
            color: 'var(--gray-11)',
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: '0 auto 48px',
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)'
          }}>
            Your personal link page as an <strong style={{ color: 'var(--violet-11)' }}>NFT</strong> on Sui Blockchain.<br />
            Own it forever, customize it completely, share it everywhere.
          </Text>
          
          <Flex direction="column" gap="4" align="center">
            <Button 
              size="4"
              variant="solid"
              style={{
                background: 'linear-gradient(135deg, var(--violet-9) 0%, var(--purple-9) 100%)',
                color: 'white',
                fontSize: '18px',
                padding: '20px 40px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 40px var(--violet-a7)',
                minWidth: '260px'
              }}
              onClick={() => {
                // Try to find and click the ConnectButton
                const connectBtns = Array.from(document.querySelectorAll('button')).filter(btn => 
                  btn.textContent?.includes('Connect') || btn.textContent?.includes('connect')
                );
                if (connectBtns.length > 0) {
                  connectBtns[0].click();
                } else if (onConnectClick) {
                  onConnectClick();
                }
              }}
            >
              Connect Wallet to Start
            </Button>
            <Text size="2" style={{ color: '#64748b' }}>
              Connect your wallet to get started
            </Text>
          </Flex>
          
          <Text size="2" mt="4" style={{ color: '#64748b' }}>
            ✨ No credit card required • Get started in 5 minutes
          </Text>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box style={{ 
        background: 'var(--gray-2)',
        padding: '80px 20px',
      }}>
        <Container size="4">
          <Flex direction="column" gap="9">
            {/* Stats Section */}
            <Grid columns={{ initial: '1', sm: '3' }} gap="4" mt="6">
            <Card style={{ padding: '32px', textAlign: 'center', background: 'var(--violet-a3)', border: '1px solid var(--violet-a5)' }}>
              <Heading size="8" mb="2" style={{ 
                color: 'var(--violet-11)',
              }}>
                Forever
              </Heading>
              <Text size="3" style={{ color: 'var(--gray-11)' }}>Permanent Ownership</Text>
            </Card>
            <Card style={{ padding: '32px', textAlign: 'center', background: 'var(--purple-a3)', border: '1px solid var(--purple-a5)' }}>
              <Heading size="8" mb="2" style={{ 
                color: 'var(--purple-11)',
              }}>
                $0/mo
              </Heading>
              <Text size="3" style={{ color: 'var(--gray-11)' }}>No Subscription Fees</Text>
            </Card>
            <Card style={{ padding: '32px', textAlign: 'center', background: 'var(--pink-a3)', border: '1px solid var(--pink-a5)' }}>
              <Heading size="8" mb="2" style={{ 
                color: 'var(--pink-11)',
              }}>
                Web3
              </Heading>
              <Text size="3" style={{ color: 'var(--gray-11)' }}>Decentralized & Secure</Text>
            </Card>
          </Grid>
          </Flex>
        </Container>
      </Box>

      {/* Why Choose Us & Comparison */}
      <Box style={{ 
        background: 'var(--gray-1)',
        padding: '80px 20px',
      }}>
        <Container size="4">
          <Flex direction="column" gap="9">
            {/* Why Choose Us */}
            <Box style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
            <Badge size="2" variant="soft" style={{ background: 'var(--violet-a4)', color: 'var(--violet-11)', border: '1px solid var(--violet-a6)' }} mb="4">Why Choose Us?</Badge>
            <Heading size="8" mb="4" style={{ color: 'var(--gray-12)' }}>
              Traditional vs MIRMIR
            </Heading>
            <Text size="4" mb="6" style={{ lineHeight: 1.8, color: 'var(--gray-11)' }}>
              Stop renting your online presence. With MIRMIR, you're not just a user—you're an owner.
              Every link page is minted as an NFT on the Sui blockchain, giving you true ownership and control.
            </Text>
          </Box>

          {/* Comparison Cards */}
          <Grid columns={{ initial: '1', md: '2' }} gap="6" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Card style={{ 
              padding: '48px', 
              background: 'var(--gray-3)', 
              border: '1px solid var(--gray-6)',
              borderRadius: '24px',
              boxShadow: '0 10px 40px var(--black-a3)',
              transition: 'all 0.3s ease',
              height: '100%'
            }}>
              <Flex direction="column" gap="5">
                <Flex align="center" gap="3">
                  <Box style={{ 
                    background: 'var(--gray-5)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'var(--gray-9)'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 15l-3-3 3-3M14 9l3 3-3 3M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3"/>
                    </svg>
                  </Box>
                  <Heading size="7" style={{ color: 'var(--gray-12)' }}>Traditional Services</Heading>
                </Flex>
                <Separator size="4" style={{ background: 'var(--gray-6)' }} />
                <Flex direction="column" gap="4">
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--red-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-9)" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}>Monthly subscription fees</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--red-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-9)" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}>Platform owns your content</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--red-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-9)" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}>Can delete your page anytime</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--red-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-9)" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}>Limited customization</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--red-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-9)" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}>Centralized control</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            <Card style={{ 
              padding: '48px', 
              background: 'var(--violet-a3)',
              border: '2px solid var(--violet-a6)',
              borderRadius: '24px',
              boxShadow: '0 10px 40px var(--violet-a5)',
              transition: 'all 0.3s ease',
              height: '100%'
            }}>
              <Flex direction="column" gap="5">
                <Flex align="center" gap="3">
                  <Box style={{ 
                    background: 'linear-gradient(135deg, var(--violet-9) 0%, var(--purple-9) 100%)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </Box>
                  <Heading size="7" style={{ color: 'var(--gray-12)' }}>MIRMIR</Heading>
                </Flex>
                <Separator size="4" style={{ background: 'var(--violet-6)' }} />
                <Flex direction="column" gap="4">
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--green-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}><strong style={{ color: 'var(--violet-11)' }}>One-time creation</strong> - No recurring fees</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--green-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}><strong style={{ color: 'var(--violet-11)' }}>You own the NFT</strong> - True ownership</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--green-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}><strong style={{ color: 'var(--violet-11)' }}>Permanent & immutable</strong> on blockchain</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--green-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}><strong style={{ color: 'var(--violet-11)' }}>Unlimited customization</strong> - Your style</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Box style={{ 
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--green-a4)',
                      borderRadius: '8px'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </Box>
                    <Text size="4" style={{ color: 'var(--gray-11)', lineHeight: 1.5 }}><strong style={{ color: 'var(--violet-11)' }}>Decentralized</strong> - No one can take it down</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Grid>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box style={{ 
        background: 'var(--gray-2)',
        padding: '80px 20px',
      }}>
        <Container size="4">
          {/* Features Grid */}
          <Box mt="6">
            <Box style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 48px' }}>
              <Badge size="2" variant="soft" style={{ background: 'var(--violet-a4)', color: 'var(--violet-11)', border: '1px solid var(--violet-a6)' }} mb="4">Features</Badge>
              <Heading size="8" mb="4" style={{ color: 'var(--gray-12)' }}>Everything You Need, Nothing You Don't</Heading>
              <Text size="4" style={{ lineHeight: 1.8, color: 'var(--gray-11)' }}>
                Built for creators, influencers, businesses, and anyone who wants to consolidate their online presence.
              </Text>
            </Box>

            <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="5" width="100%">
              <Card style={{ 
                padding: '32px',
                background: 'var(--gray-3)',
                border: '1px solid var(--gray-6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" gap="3" align="center">
                  <Box style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--violet-9) 0%, var(--purple-9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    🎨
                  </Box>
                  <Heading size="5" style={{ color: 'var(--gray-12)' }}>Fully Customizable</Heading>
                  <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                    Choose your colors, upload your avatar, write your bio, and add unlimited links. 
                    Make it uniquely yours with full creative control.
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px',
                background: 'var(--gray-3)',
                border: '1px solid var(--gray-6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" gap="3" align="center">
                  <Box style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--purple-9) 0%, var(--pink-9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    🔐
                  </Box>
                  <Heading size="5" style={{ color: 'var(--gray-12)' }}>NFT Ownership</Heading>
                  <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                    Each link page is a unique NFT on Sui blockchain. Truly yours to keep and, 
                    transfer. No platform can take it away.
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px',
                background: 'var(--gray-3)',
                border: '1px solid var(--gray-6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" gap="3" align="center">
                  <Box style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--pink-9) 0%, var(--red-9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    ⚡
                  </Box>
                  <Heading size="5" style={{ color: 'var(--gray-12)' }}>Lightning Fast</Heading>
                  <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                    Built on Sui blockchain with sub-second finality. Experience instant updates 
                    and blazing-fast load times for your visitors.
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px',
                background: 'var(--gray-3)',
                border: '1px solid var(--gray-6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" gap="3" align="center">
                  <Box style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--violet-9) 0%, var(--pink-9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    🔗
                  </Box>
                  <Heading size="5" style={{ color: 'var(--gray-12)' }}>Custom Username</Heading>
                  <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                    Claim your unique username for short, memorable links. 
                    Share yourname.linktree instead of long complicated URLs.
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px',
                background: 'var(--gray-3)',
                border: '1px solid var(--gray-6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" gap="3" align="center">
                  <Box style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--purple-9) 0%, var(--violet-9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    💎
                  </Box>
                  <Heading size="5" style={{ color: 'var(--gray-12)' }}>No Subscription</Heading>
                  <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                    Pay once to create, own forever. Zero monthly fees, no hidden charges. 
                    The way digital ownership should be.
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px',
                background: 'var(--gray-3)',
                border: '1px solid var(--gray-6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Flex direction="column" gap="3" align="center">
                  <Box style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--purple-9) 0%, var(--pink-9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    📱
                  </Box>
                  <Heading size="5" style={{ color: 'var(--gray-12)' }}>QR Code Sharing</Heading>
                  <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                    Generate and share QR codes instantly. Perfect for business cards, 
                    social media, or anywhere you want to share your links.
                  </Text>
                </Flex>
              </Card>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* How It Works - Soft Orange Background */}
      <Box style={{ 
        background: 'var(--gray-1)',
        padding: '80px 20px',
      }}>
        <Container size="4">
          {/* How It Works */}
          <Box mt="9">
            <Box style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 48px' }}>
              <Badge size="2" variant="soft" style={{ background: 'var(--violet-a4)', color: 'var(--violet-11)', border: '1px solid var(--violet-a6)' }} mb="4">Simple Process</Badge>
              <Heading size="8" mb="4" style={{ color: 'var(--gray-12)' }}>Get Started in 3 Easy Steps</Heading>
              <Text size="4" style={{ lineHeight: 1.8, color: 'var(--gray-11)' }}>
                Creating your Web3 link page takes less than 5 minutes. No technical knowledge required.
              </Text>
            </Box>

            <Grid columns={{ initial: '1', md: '3' }} gap="6">
              <Flex direction="column" gap="4" align="center">
                <Box style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, var(--violet-9) 0%, var(--purple-9) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 24px var(--violet-a7)'
                }}>
                  1
                </Box>
                <Heading size="5" style={{ color: 'var(--gray-12)' }}>Connect Your Wallet</Heading>
                <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                  Use any Sui wallet to get started. 
                  No crypto experience needed.
                </Text>
              </Flex>

              <Flex direction="column" gap="4" align="center">
                <Box style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, var(--purple-9) 0%, var(--pink-9) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 24px var(--pink-a7)'
                }}>
                  2
                </Box>
                <Heading size="5" style={{ color: 'var(--gray-12)' }}>Customize & Create</Heading>
                <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                  Design your page with custom colors, avatar, bio, and links. 
                  See live preview as you build. Mint it as an NFT when ready.
                </Text>
              </Flex>

              <Flex direction="column" gap="4" align="center">
                <Box style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, var(--pink-9) 0%, var(--red-9) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 24px var(--red-a7)'
                }}>
                  3
                </Box>
                <Heading size="5" style={{ color: 'var(--gray-12)' }}>Share Everywhere</Heading>
                <Text size="3" align="center" style={{ lineHeight: 1.6, color: 'var(--gray-11)' }}>
                  Share your unique link on Instagram, Twitter, TikTok, or anywhere. 
                  Use QR codes for offline sharing. Update anytime you want.
                </Text>
              </Flex>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Use Cases */}
      <Box style={{ 
        background: 'var(--gray-2)',
        padding: '80px 20px',
      }}>
        <Container size="4">
          {/* Use Cases */}
          <Box mt="9">
            <Box style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 48px' }}>
              <Badge size="2" variant="soft" style={{ background: 'var(--violet-a4)', color: 'var(--violet-11)', border: '1px solid var(--violet-a6)' }} mb="4">Perfect For</Badge>
              <Heading size="8" mb="4" style={{ color: 'var(--gray-12)' }}>Who Uses MIRMIR?</Heading>
            </Box>

            <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4">
              <Card style={{ padding: '24px', textAlign: 'center', background: 'var(--gray-3)', border: '1px solid var(--gray-6)' }}>
                <Text size="8" mb="3">🎤</Text>
                <Heading size="4" mb="2" style={{ color: 'var(--gray-12)' }}>Creators</Heading>
                <Text size="2" style={{ color: 'var(--gray-11)' }}>
                  Consolidate your YouTube, Twitch, Patreon, and social links
                </Text>
              </Card>

              <Card style={{ padding: '24px', textAlign: 'center', background: 'var(--gray-3)', border: '1px solid var(--gray-6)' }}>
                <Text size="8" mb="3">💼</Text>
                <Heading size="4" mb="2" style={{ color: 'var(--gray-12)' }}>Businesses</Heading>
                <Text size="2" style={{ color: 'var(--gray-11)' }}>
                  Centralize your website, products, booking, and contact info
                </Text>
              </Card>

              <Card style={{ padding: '24px', textAlign: 'center', background: 'var(--gray-3)', border: '1px solid var(--gray-6)' }}>
                <Text size="8" mb="3">🎨</Text>
                <Heading size="4" mb="2" style={{ color: 'var(--gray-12)' }}>Artists</Heading>
                <Text size="2" style={{ color: 'var(--gray-11)' }}>
                  Showcase your portfolio, shop, exhibitions, and NFTs
                </Text>
              </Card>

              <Card style={{ padding: '24px', textAlign: 'center', background: 'var(--gray-3)', border: '1px solid var(--gray-6)' }}>
                <Text size="8" mb="3">🌟</Text>
                <Heading size="4" mb="2" style={{ color: 'var(--gray-12)' }}>Influencers</Heading>
                <Text size="2" style={{ color: 'var(--gray-11)' }}>
                  Share brand deals, affiliate links, and all social platforms
                </Text>
              </Card>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box style={{ 
        background: 'var(--gray-1)',
        padding: '80px 20px',
      }}>
        <Container size="4">
          {/* Final CTA */}
          <Box mt="9" style={{ 
            textAlign: 'center',
            padding: '80px 40px',
            background: 'var(--gray-3)',
            borderRadius: '24px',
            border: '2px solid var(--violet-a6)'
          }}>
            <Heading size="8" mb="4" style={{ color: 'var(--gray-12)' }}>
              Ready to Own Your Links?
            </Heading>
            <Text size="5" mb="6" style={{ lineHeight: 1.8, maxWidth: 600, margin: '0 auto 32px', color: 'var(--gray-11)' }}>
              Join the future of link sharing. Create your permanent, decentralized link page 
              as an NFT on Sui blockchain. No subscriptions, no limitations.
            </Text>
            
            <Flex direction="column" gap="3" align="center">
              <Button 
                size="4"
                variant="solid"
                style={{
                  background: 'linear-gradient(135deg, var(--violet-9) 0%, var(--purple-9) 100%)',
                  color: 'white',
                  fontSize: '18px',
                  padding: '24px 48px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px var(--violet-a7)'
                }}
                onClick={() => {
                  // Try to find and click the ConnectButton
                  const connectBtns = Array.from(document.querySelectorAll('button')).filter(btn => 
                    btn.textContent?.includes('Connect') || btn.textContent?.includes('connect')
                  );
                  if (connectBtns.length > 0) {
                    connectBtns[0].click();
                  } else if (onConnectClick) {
                    onConnectClick();
                  }
                }}
              >
                👛 Get Started
              </Button>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>
                Takes less than a minute
              </Text>
            </Flex>
          </Box>

          {/* Footer Info */}
          <Flex justify="center" gap="8" mt="8" wrap="wrap" style={{ opacity: 0.8 }}>
            <Flex align="center" gap="2">
              <Text style={{ fontSize: '20px' }}>🔒</Text>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>Secure on Sui</Text>
            </Flex>
            <Flex align="center" gap="2">
              <Text style={{ fontSize: '20px' }}>⚡</Text>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>Lightning Fast</Text>
            </Flex>
            <Flex align="center" gap="2">
              <Text style={{ fontSize: '20px' }}>💎</Text>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>Own Forever</Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
