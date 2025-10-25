import { useEnokiFlow } from '@mysten/enoki/react';
import { ENOKI_API_KEY } from './zkLoginSetup';

// Hook for sponsored transactions (optional feature)
export const useSponsoredTransaction = () => {
  const enoki = useEnokiFlow();

  // Note: Enoki sponsorship API is still being finalized
  // This hook is prepared for future use
  // For now, transactions use standard wallet signing

  return {
    isSponsored: false, // Disabled until Enoki API is stable
    enokiClient: enoki,
  };
};

// Check if Enoki is configured
export const isEnokiConfigured = () => {
  return Boolean(ENOKI_API_KEY);
};
