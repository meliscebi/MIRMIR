import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Box, Button, Text, Flex, Heading } from "@radix-ui/themes";

// zkLogin configuration constants
const REDIRECT_URI = window.location.origin;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

// Google OAuth endpoints
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

interface ZkLoginUser {
  email: string;
  name: string;
  picture: string;
  sub: string; // User's unique Google ID
}

interface ZkLoginButtonProps {
  onLoginSuccess?: (user: ZkLoginUser) => void;
  onLogout?: () => void;
}

/**
 * zkLogin Authentication Component
 * Provides passwordless authentication using Google OAuth and zkLogin
 * Users can login with their Google account without needing a wallet initially
 * 
 * Based on: https://github.com/MystenLabs/sui-move-community-modules/tree/main/module_5
 */
export function ZkLoginButton({ onLoginSuccess, onLogout }: ZkLoginButtonProps) {
  const [user, setUser] = useState<ZkLoginUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initialize zkLogin state from localStorage on component mount
   * This persists the login session across page refreshes
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("zkLoginUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("zkLoginUser");
      }
    }

    // Handle OAuth callback
    handleOAuthCallback();
  }, []);

  /**
   * Generate a random nonce for zkLogin proof
   * Nonce is used to ensure uniqueness and prevent replay attacks
   */
  const generateNonce = (): string => {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  /**
   * Initiate Google OAuth login flow
   * Redirects user to Google's consent screen
   */
  const initiateGoogleLogin = () => {
    setIsLoading(true);

    // Generate and store nonce for verification
    const nonce = generateNonce();
    localStorage.setItem("zkLoginNonce", nonce);

    // Build OAuth URL with required parameters
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "id_token", // Request JWT ID token
      scope: "openid email profile", // Request user info permissions
      nonce: nonce,
    });

    // Redirect to Google OAuth
    window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  };

  /**
   * Handle OAuth callback after Google authentication
   * Extracts and validates the JWT token from URL hash
   */
  const handleOAuthCallback = () => {
    const hash = window.location.hash;
    if (!hash) return;

    try {
      // Extract id_token from URL hash
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get("id_token");

      if (!idToken) return;

      // Decode JWT to get user information
      const decoded = jwtDecode<{
        email: string;
        name: string;
        picture: string;
        sub: string;
        nonce: string;
      }>(idToken);

      // Verify nonce matches
      const storedNonce = localStorage.getItem("zkLoginNonce");
      if (decoded.nonce !== storedNonce) {
        console.error("Nonce mismatch - possible security issue");
        return;
      }

      // Create user object
      const zkLoginUser: ZkLoginUser = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub,
      };

      // Store user info
      setUser(zkLoginUser);
      localStorage.setItem("zkLoginUser", JSON.stringify(zkLoginUser));
      localStorage.setItem("zkLoginJWT", idToken);
      localStorage.removeItem("zkLoginNonce");

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Callback
      if (onLoginSuccess) {
        onLoginSuccess(zkLoginUser);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      setIsLoading(false);
    }
  };

  /**
   * Logout user and clear session
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("zkLoginUser");
    localStorage.removeItem("zkLoginJWT");
    
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Box>
      {user ? (
        // Logged in state
        <Flex align="center" gap="3">
          <img
            src={user.picture}
            alt={user.name}
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <Box>
            <Text size="2" weight="bold">
              {user.name}
            </Text>
            <Text size="1" color="gray">
              {user.email}
            </Text>
          </Box>
          <Button onClick={handleLogout} variant="soft" color="gray" size="1">
            Logout
          </Button>
        </Flex>
      ) : (
        // Logged out state
        <Button
          onClick={initiateGoogleLogin}
          disabled={isLoading}
          size="3"
        >
          {isLoading ? "Redirecting..." : "🔐 Login with Google (zkLogin)"}
        </Button>
      )}
    </Box>
  );
}

/**
 * Hook to access current zkLogin user
 */
export function useZkLoginUser(): ZkLoginUser | null {
  const [user, setUser] = useState<ZkLoginUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("zkLoginUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  return user;
}

/**
 * Get the current zkLogin JWT token
 */
export function getZkLoginJWT(): string | null {
  return localStorage.getItem("zkLoginJWT");
}
