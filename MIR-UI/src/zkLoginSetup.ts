const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ENOKI_API_KEY = import.meta.env.VITE_ENOKI_API_KEY;

// Check if zkLogin is configured
export const isZkLoginConfigured = () => {
  return Boolean(GOOGLE_CLIENT_ID && ENOKI_API_KEY);
};

// Google OAuth configuration for zkLogin
export const getGoogleAuthUrl = () => {
  const redirectUri = `${window.location.origin}/auth/callback`;
  const state = Math.random().toString(36).substring(7);
  const nonce = Math.random().toString(36).substring(7);
  
  // Store state and nonce in session
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_nonce', nonce);
  
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

export { GOOGLE_CLIENT_ID, ENOKI_API_KEY };
