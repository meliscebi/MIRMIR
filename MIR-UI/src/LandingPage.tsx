import { Box, Container, Flex, Heading, Text, Grid, Card, Button } from "@radix-ui/themes";
import { getGoogleAuthUrl, isZkLoginConfigured } from "./zkLoginSetup";

export function LandingPage() {
  return (
    <Container size="4">
      <Flex direction="column" gap="6" align="center" py="9">
        {/* Hero Section */}
        <Box style={{ textAlign: 'center', maxWidth: 800 }}>
          <Heading size="9" mb="4" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🔗 Web3 Linktree
          </Heading>
          <Text size="6" color="gray" mb="6" style={{ lineHeight: 1.6 }}>
            Your personal link page as an <strong>NFT</strong> on Sui Blockchain
          </Text>
          <Text size="4" color="gray" mb="8" style={{ lineHeight: 1.8 }}>
            Create, customize, and own your link-in-bio page forever.
            Each page is a unique NFT that you truly own - no middleman, no fees.
          </Text>
          
          {isZkLoginConfigured() ? (
            <Flex direction="column" gap="3" align="center">
              <Text size="3" color="gray">
                👆 Connect your wallet above, or
              </Text>
              <Button 
                size="3"
                variant="solid"
                onClick={() => {
                  window.location.href = getGoogleAuthUrl();
                }}
              >
                🔐 Sign in with Google (No Wallet Needed)
              </Button>
            </Flex>
          ) : (
            <Text size="3" color="gray" mb="4">
              👆 Connect your wallet above to get started
            </Text>
          )}
        </Box>

        {/* Features Grid */}
        <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4" width="100%" mt="9">
          <Card style={{ padding: '32px' }}>
            <Flex direction="column" gap="3" align="center">
              <Text size="8">🎨</Text>
              <Heading size="5">Fully Customizable</Heading>
              <Text size="2" color="gray" align="center">
                Personalize colors, avatar, bio, and unlimited links
              </Text>
            </Flex>
          </Card>

          <Card style={{ padding: '32px' }}>
            <Flex direction="column" gap="3" align="center">
              <Text size="8">🔐</Text>
              <Heading size="5">You Own It</Heading>
              <Text size="2" color="gray" align="center">
                Each page is an NFT - truly yours, transferable, permanent
              </Text>
            </Flex>
          </Card>

          <Card style={{ padding: '32px' }}>
            <Flex direction="column" gap="3" align="center">
              <Text size="8">⚡</Text>
              <Heading size="5">Powered by Sui</Heading>
              <Text size="2" color="gray" align="center">
                Fast, cheap transactions on Sui blockchain
              </Text>
            </Flex>
          </Card>

          <Card style={{ padding: '32px' }}>
            <Flex direction="column" gap="3" align="center">
              <Text size="8">🔗</Text>
              <Heading size="5">Custom Username</Heading>
              <Text size="2" color="gray" align="center">
                Claim your unique username for short, memorable links
              </Text>
            </Flex>
          </Card>

          <Card style={{ padding: '32px' }}>
            <Flex direction="column" gap="3" align="center">
              <Text size="8">💎</Text>
              <Heading size="5">No Subscription</Heading>
              <Text size="2" color="gray" align="center">
                Pay once to create, own forever. No recurring fees
              </Text>
            </Flex>
          </Card>

          <Card style={{ padding: '32px' }}>
            <Flex direction="column" gap="3" align="center">
              <Text size="8">🌐</Text>
              <Heading size="5">Decentralized</Heading>
              <Text size="2" color="gray" align="center">
                Hosted on blockchain - no central authority can take it down
              </Text>
            </Flex>
          </Card>
        </Grid>

        {/* How It Works */}
        <Box mt="9" style={{ textAlign: 'center', maxWidth: 800 }}>
          <Heading size="7" mb="6">How It Works</Heading>
          <Grid columns={{ initial: '1', sm: '3' }} gap="6">
            <Flex direction="column" gap="2" align="center">
              <Box style={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                1
              </Box>
              <Heading size="4">Connect</Heading>
              <Text size="2" color="gray">
                Connect your Sui wallet
              </Text>
            </Flex>

            <Flex direction="column" gap="2" align="center">
              <Box style={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                2
              </Box>
              <Heading size="4">Create</Heading>
              <Text size="2" color="gray">
                Customize your page and mint as NFT
              </Text>
            </Flex>

            <Flex direction="column" gap="2" align="center">
              <Box style={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                3
              </Box>
              <Heading size="4">Share</Heading>
              <Text size="2" color="gray">
                Share your link anywhere
              </Text>
            </Flex>
          </Grid>
        </Box>

        {/* CTA */}
        <Box mt="9" style={{ textAlign: 'center' }}>
          <Text size="5" color="gray" mb="4">
            Ready to create your Web3 presence?
          </Text>
          <Text size="3" color="gray">
            👆 Connect your wallet above to start
          </Text>
        </Box>
      </Flex>
    </Container>
  );
}
