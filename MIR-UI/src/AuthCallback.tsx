import { useEffect, useState } from 'react';
import { Flex, Heading, Text, Spinner } from '@radix-ui/themes';
import { jwtDecode } from 'jwt-decode';

interface GoogleJWT {
  iss: string;
  sub: string;
  email: string;
  name: string;
  picture?: string;
  aud: string;
  iat: number;
  exp: number;
}

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get ID token from URL fragment
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const idToken = params.get('id_token');
        const state = params.get('state');

        if (!idToken) {
          throw new Error('No ID token received from Google');
        }

        // Verify state
        const savedState = sessionStorage.getItem('oauth_state');
        if (state !== savedState) {
          throw new Error('Invalid state parameter');
        }

        // Decode JWT to get user info
        const decoded = jwtDecode<GoogleJWT>(idToken);
        
        // Store user info and token
        localStorage.setItem('zklogin_token', idToken);
        localStorage.setItem('zklogin_user', JSON.stringify({
          sub: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        }));

        // Clean up
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_nonce');

        // Redirect to app
        window.location.hash = '';
        window.location.reload();
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{ minHeight: '100vh', padding: '2rem' }}
        gap="4"
      >
        <Heading size="6" color="red">Authentication Error</Heading>
        <Text>{error}</Text>
        <Text>
          <a href="/" style={{ color: 'var(--accent-9)' }}>Return to Home</a>
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: '100vh' }}
      gap="4"
    >
      <Spinner size="3" />
      <Text size="3">Completing sign in...</Text>
    </Flex>
  );
}
