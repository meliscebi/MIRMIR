import { useEffect, useState } from 'react';
import { Flex, Heading, Text, Spinner } from '@radix-ui/themes';
import { jwtDecode } from 'jwt-decode';
import { getSalt, getZkLoginAddress, getEphemeralKeypair } from './zkLoginSetup';
import { getExtendedEphemeralPublicKey } from '@mysten/zklogin';

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
        // Get ID token from URL fragment (hash) - Google returns in hash with implicit flow
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const idToken = hashParams.get('id_token');
        const state = hashParams.get('state');

        if (!idToken) {
          // If no token but user is already logged in, redirect to home
          const existingUser = localStorage.getItem('zklogin_user');
          if (existingUser) {
            console.log('✅ User already authenticated, redirecting...');
            window.location.href = window.location.origin;
            return;
          }
          throw new Error('No ID token received from Google. Please try again.');
        }

        // Verify state
        const savedState = sessionStorage.getItem('oauth_state');
        if (!savedState) {
          // State was already consumed, check if user is logged in
          const existingUser = localStorage.getItem('zklogin_user');
          if (existingUser) {
            console.log('✅ Authentication already completed, redirecting...');
            window.location.href = window.location.origin;
            return;
          }
          throw new Error('Session expired. Please try logging in again.');
        }
        
        if (state !== savedState) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }

        // Decode JWT to get user info
        const decoded = jwtDecode<GoogleJWT>(idToken);
        
        console.log('✅ Google authentication successful:', {
          email: decoded.email,
          name: decoded.name,
        });
        
        // Get salt and calculate zkLogin address
        console.log('🔐 Getting salt for zkLogin address...');
        const salt = await getSalt(idToken);
        const zkLoginAddress = getZkLoginAddress(idToken, salt);
        
        console.log('✅ zkLogin address calculated:', zkLoginAddress);
        
        // Get ephemeral keypair info
        const maxEpoch = sessionStorage.getItem('max_epoch');
        const randomness = sessionStorage.getItem('randomness');
        const ephemeralPrivateKey = sessionStorage.getItem('ephemeral_private_key');
        const ephemeralKeypair = getEphemeralKeypair();
        
        if (!ephemeralKeypair || !maxEpoch || !randomness || !ephemeralPrivateKey) {
          throw new Error('Ephemeral keypair data missing. Please try again.');
        }
        
        const ephemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralKeypair.getPublicKey());
        
        // NOTE: We cannot calculate addressSeed here because genAddressSeed has 115 char limit
        // and Google JWT is 1200+ chars. The addressSeed will be requested from zkProof prover
        // during transaction signing instead.
        console.log('ℹ️ AddressSeed will be obtained from prover during transaction');
        
        // Store user info and zkLogin data
        const userInfo = {
          sub: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          loginTime: Date.now(),
          zkLoginAddress: zkLoginAddress,
          salt: salt,
        };
        
        // Store zkLogin session data (for transaction signing)
        const zkLoginSession = {
          jwt: idToken,
          salt: salt,
          maxEpoch: maxEpoch,
          randomness: randomness,
          ephemeralPublicKey: ephemeralPublicKey,
          address: zkLoginAddress,
          // addressSeed: cannot be pre-calculated due to 115 char limit in genAddressSeed
        };
        
        // Save to localStorage
        localStorage.setItem('zklogin_token', idToken);
        localStorage.setItem('zklogin_user', JSON.stringify(userInfo));
        localStorage.setItem('zklogin_session', JSON.stringify(zkLoginSession));
        
        // IMPORTANT: Save ephemeral private key to localStorage for transaction signing
        localStorage.setItem('ephemeral_private_key', ephemeralPrivateKey);
        localStorage.setItem('max_epoch', maxEpoch);
        localStorage.setItem('randomness', randomness);

        console.log('✅ User info and zkLogin session saved to localStorage');

        // Clean up session storage
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_nonce');
        // Keep ephemeral data in sessionStorage as backup
        // sessionStorage.removeItem('ephemeral_private_key');
        // sessionStorage.removeItem('max_epoch');
        // sessionStorage.removeItem('randomness');

        console.log('✅ Redirecting to app...');

        // Redirect to app - replace history to prevent back button issues
        window.location.replace(window.location.origin);
      } catch (err) {
        console.error('❌ Auth callback error:', err);
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
          <button 
            onClick={() => { window.location.href = window.location.origin; }}
            style={{ color: 'var(--accent-9)', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none' }}
          >
            Return to Home
          </button>
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
