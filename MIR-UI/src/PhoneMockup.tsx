import { ReactNode } from 'react';
import { Box } from '@radix-ui/themes';

interface PhoneMockupProps {
  children: ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '375px',
        margin: '0 auto',
        transform: 'scale(0.9)',
        transformOrigin: 'top center',
      }}
    >
      {/* Phone Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '375 / 700',
          background: '#1a1a1a',
          borderRadius: '32px',
          padding: '10px',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            height: '28px',
            backgroundColor: '#000',
            borderRadius: '0 0 20px 20px',
            zIndex: 10,
          }}
        >
          {/* Camera */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: '#1a1a2e',
              borderRadius: '50%',
              border: '1px solid #333',
            }}
          />
        </div>

        {/* Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Status Bar */}
          <div
            style={{
              height: '44px',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            <span>9:41</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Content */}
          <Box
            style={{
              height: 'calc(100% - 44px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {children}
          </Box>
        </div>

        {/* Home Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '134px',
            height: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '100px',
          }}
        />
      </div>
    </div>
  );
}
