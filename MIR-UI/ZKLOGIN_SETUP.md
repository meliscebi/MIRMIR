# zkLogin & Sponsored Transactions Setup

This guide explains how to enable zkLogin (Google OAuth) and Enoki sponsored transactions for your Sui Linktree app.

## Features

- **zkLogin**: Allow users to sign in with Google (no wallet extension needed)
- **Sponsored Transactions**: Your app pays the gas fees, users don't need SUI tokens

## Setup Steps

### 1. Google OAuth (for zkLogin)

#### Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:5173` (and your production URL)
   - **Authorized redirect URIs**: `http://localhost:5173/auth/callback` (and your production callback URL)
6. Copy the **Client ID**
7. Add to `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

### 2. Enoki API (for Sponsored Transactions)

#### Get Enoki API Key

1. Go to [Enoki Portal](https://enoki.mystenlabs.com/)
2. Sign up or log in with your Google account
3. Create a new app
4. Copy the **API Key**
5. Add to `.env`:
   ```env
   VITE_ENOKI_API_KEY=your_enoki_api_key_here
   ```

### 3. Current Status

The infrastructure is set up:

✅ **Packages installed**:
- `@mysten/enoki@0.3.17`
- `@mysten/zklogin@^0.7.6`
- `jwt-decode@^4.0.0`

✅ **Files created**:
- `src/zkLoginSetup.ts` - Google OAuth configuration
- `src/sponsoredTransactions.ts` - Enoki hooks (currently optional)

✅ **Provider added**:
- `EnokiFlowProvider` wrapped around the app in `main.tsx`

### 4. How to Enable

Once you add the API keys to your `.env` file:

1. **zkLogin will be available** - Users can sign in with Google
2. **Sponsored transactions** - App can optionally pay gas fees

### 5. Usage Example

```typescript
import { useSponsoredTransaction } from './sponsoredTransactions';

function MyComponent() {
  const { isSponsored, executeSponsoredTransaction } = useSponsoredTransaction();
  
  const handleCreate = async () => {
    const tx = new Transaction();
    // ... build transaction
    
    if (isSponsored) {
      // App pays gas
      await executeSponsoredTransaction(tx);
    } else {
      // User pays gas (current behavior)
      signAndExecute({ transaction: tx });
    }
  };
}
```

### 6. Benefits

**With zkLogin**:
- Users don't need to install wallet extensions
- Sign in with familiar Google account
- Lower barrier to entry

**With Sponsored Transactions**:
- Users don't need SUI tokens to get started
- Better onboarding experience
- You control gas budget

### 7. Cost Considerations

**Enoki Pricing** (as of 2025):
- Free tier: 10,000 transactions/month
- Beyond that: Pay per transaction

**Recommendation**:
- Start with free tier
- Monitor usage in Enoki dashboard
- Upgrade if needed

### 8. Testing

To test without API keys, the app will:
- Use standard wallet connection (current behavior)
- Users pay their own gas fees

No breaking changes - everything is backwards compatible!

## Need Help?

- [Sui zkLogin Docs](https://docs.sui.io/concepts/cryptography/zklogin)
- [Enoki Documentation](https://docs.enoki.mystenlabs.com/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
