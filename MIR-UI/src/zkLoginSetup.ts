import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/zklogin';
import { jwtToAddress } from '@mysten/zklogin';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ENOKI_API_KEY = import.meta.env.VITE_ENOKI_API_KEY;
const PROVER_URL = 'https://prover-dev.mystenlabs.com/v1';

// Check if zkLogin is configured
export const isZkLoginConfigured = () => {
  return Boolean(GOOGLE_CLIENT_ID && ENOKI_API_KEY);
};

// Generate and store ephemeral keypair
export const setupEphemeralKeypair = () => {
  const keypair = new Ed25519Keypair();
  const maxEpoch = 2; // Reduced from 10 - shorter signature
  const randomness = generateRandomness();
  
  // Store in both sessionStorage and will be moved to localStorage after auth
  sessionStorage.setItem('ephemeral_private_key', keypair.getSecretKey());
  sessionStorage.setItem('max_epoch', maxEpoch.toString());
  sessionStorage.setItem('randomness', randomness);
  
  return { keypair, maxEpoch, randomness };
};

// Get stored ephemeral keypair from localStorage (persisted) or sessionStorage (temp)
export const getEphemeralKeypair = (): Ed25519Keypair | null => {
  // First try localStorage (persisted after login)
  let privateKey = localStorage.getItem('ephemeral_private_key');
  
  // Fallback to sessionStorage (during OAuth flow)
  if (!privateKey) {
    privateKey = sessionStorage.getItem('ephemeral_private_key');
  }
  
  if (!privateKey) return null;
  
  return Ed25519Keypair.fromSecretKey(privateKey);
};

// Google OAuth configuration for zkLogin
export const getGoogleAuthUrl = () => {
  // Setup ephemeral keypair before OAuth
  const { keypair, maxEpoch, randomness } = setupEphemeralKeypair();
  
  const nonce = generateNonce(keypair.getPublicKey(), maxEpoch, randomness);
  
  // Google OAuth implicit flow returns tokens in URL fragment (hash)
  const redirectUri = `${window.location.origin}/`;
    
  const state = Math.random().toString(36).substring(7);
  
  // Store state and nonce in session
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_nonce', nonce);
  
  console.log('🔐 Initiating Google OAuth with redirect URI:', redirectUri);
  console.log('🔑 Ephemeral keypair created');
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: nonce,
    state: state,
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Get salt for the user - using deterministic salt generation
// Since Mysten Labs salt service has CORS issues in localhost, we use a deterministic approach
// In production, you should use a proper salt service or store salts in your backend
export const getSalt = async (jwt: string): Promise<string> => {
  // Decode JWT to get user's sub (Google ID)
  const { jwtDecode } = await import('jwt-decode');
  const decoded: any = jwtDecode(jwt);
  const sub = decoded.sub;
  
  // Check if we have a cached salt for this user
  const cachedSalt = localStorage.getItem(`zklogin_salt_${sub}`);
  if (cachedSalt) {
    console.log('🧂 Using cached salt for user');
    return cachedSalt;
  }
  
  // Generate deterministic salt using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(sub + 'zklogin_salt_v1'); // Add version for future-proofing
  
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    // Take first 16 bytes and convert to BigInt
    const bytes = hashArray.slice(0, 16);
    let saltBigInt = BigInt(0);
    for (let i = 0; i < bytes.length; i++) {
      saltBigInt = (saltBigInt << BigInt(8)) | BigInt(bytes[i]);
    }
    
    const salt = saltBigInt.toString();
    
    // Cache the salt for this user
    localStorage.setItem(`zklogin_salt_${sub}`, salt);
    
    console.log('🧂 Generated deterministic salt for user');
    return salt;
  } catch (error) {
    console.error('Failed to generate salt:', error);
    // Fallback to a simple hash
    let hash = 0;
    for (let i = 0; i < sub.length; i++) {
      const char = sub.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const salt = BigInt(Math.abs(hash)).toString();
    localStorage.setItem(`zklogin_salt_${sub}`, salt);
    return salt;
  }
};

// Get zkProof from prover service
export const getZkProof = async (params: {
  jwt: string;
  extendedEphemeralPublicKey: string;
  maxEpoch: number;
  jwtRandomness: string;
  salt: string;
  keyClaimName: string;
}) => {
  const response = await fetch(PROVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Prover error: ${error}`);
  }
  
  return await response.json();
};

// Calculate Sui address from JWT
export const getZkLoginAddress = (jwt: string, salt: string): string => {
  return jwtToAddress(jwt, salt);
};

export { GOOGLE_CLIENT_ID, ENOKI_API_KEY };

