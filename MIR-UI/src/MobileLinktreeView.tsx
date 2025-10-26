import { useState } from 'react';
import type { LinktreeNFT } from './types';

interface MobileLinktreeViewProps {
  nft: LinktreeNFT;
}

export function MobileLinktreeView({ nft }: MobileLinktreeViewProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleLinkClick = (url: string) => {
    if (!url) {
      console.warn('Link URL is undefined or empty');
      return;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      window.open(`https://${url}`, '_blank');
    }
  };

  const handleCopyAddress = (address: string, label: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Use profile's actual background color (no gradient)
  const bgColor = nft.backgroundColor || '#5a2b2b';
  
  return (
    <div 
      className="w-full flex flex-col items-center px-4 py-8 relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: bgColor,
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Header Area */}
        <div className="w-full flex flex-col items-center mb-4">
          {/* Avatar */}
          {nft.avatarUrl && (
            <div className="mb-3 relative">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
              <img
                src={nft.avatarUrl}
                alt={nft.title}
                className="relative w-20 h-20 rounded-full object-cover shadow-2xl ring-2 ring-white/30 hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Username/Title */}
          <h1 
            className="text-2xl font-bold mb-2 text-center"
            style={{ 
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)'
            }}
          >
            {nft.username || nft.title}
          </h1>

          {/* Bio */}
          {nft.bio && (
            <p 
              className="text-center text-sm leading-relaxed max-w-sm opacity-95 px-4"
              style={{ 
                color: '#ffffff',
                textShadow: '0 1px 5px rgba(0,0,0,0.5)'
              }}
            >
              {nft.bio}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="w-full space-y-2 mb-4">
          {nft.links && nft.links.length > 0 ? nft.links.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link.fields.url)}
              className="w-full bg-white/20 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2.5 
                       flex items-center gap-3 shadow-lg hover:shadow-xl
                       active:scale-95 transition-all duration-200 ease-out
                       hover:bg-white/30 hover:border-white/50 group"
            >
              {/* Icon */}
              <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                {link.fields.icon || '🔗'}
              </span>
              
              {/* Link Title */}
              <span 
                className="text-white font-bold text-base flex-grow text-left"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                {link.fields.title || 'Untitled Link'}
              </span>
              
              {/* Arrow */}
              <svg 
                className="w-4 h-4 text-white/60 group-hover:text-white/90 group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          )) : (
            <div className="text-center text-white/60 py-4">
              No links added yet
            </div>
          )}
        </div>

        {/* Web3 Wallet Section */}
        {nft.walletAddresses && nft.walletAddresses.length > 0 && (
          <div className="w-full mt-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-white/90 text-sm font-semibold mb-4 text-center uppercase tracking-widest">
                🔐 Web3 Wallets
              </h3>
              <div className="space-y-3">
                {nft.walletAddresses.map((wallet, index) => (
                  <div 
                    key={index}
                    className="bg-black/30 rounded-xl p-4 border border-white/20 hover:border-white/30 transition-colors"
                  >
                    {/* Wallet Label */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-white/70 uppercase tracking-wide font-medium">
                        {wallet.network}
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs text-white/90 font-semibold">
                        {wallet.label}
                      </span>
                    </div>
                    
                    {/* Address */}
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-white/95 font-mono flex-grow overflow-hidden text-ellipsis bg-black/20 px-2 py-1 rounded">
                        {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                      </code>
                      
                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyAddress(wallet.address, wallet.label)}
                        className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg 
                                 border border-white/30 text-white text-xs font-semibold
                                 active:scale-95 transition-all duration-150 whitespace-nowrap"
                      >
                        {copiedAddress === wallet.label ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
