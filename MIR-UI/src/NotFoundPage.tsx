import { Button, Flex, Heading, Text } from "@radix-ui/themes";

interface NotFoundPageProps {
  identifier: string;
  onGoHome: () => void;
}

export function NotFoundPage({ identifier, onGoHome }: NotFoundPageProps) {
  return (
    <Flex direction="column" gap="4" align="center" justify="center" style={{ minHeight: 400 }}>
      <Text size="9" style={{ fontSize: 120 }}>404</Text>
      <Heading size="7">Page Not Found</Heading>
      <Text size="4" color="gray" align="center" style={{ maxWidth: 500 }}>
        The linktree <code style={{ 
          background: 'var(--gray-a3)', 
          padding: '4px 8px', 
          borderRadius: 4,
          fontWeight: 'bold'
        }}>/{identifier}</code> doesn't exist.
      </Text>
      <Text size="3" color="gray" align="center">
        Username routing will be available in production.
        <br />
        For now, you need a valid NFT ID.
      </Text>
      <Button size="3" onClick={onGoHome} style={{ marginTop: 20 }}>
        ← Go to Home
      </Button>
    </Flex>
  );
}
