import { Dialog, Button, Flex, Box } from '@radix-ui/themes';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface QRCodeModalProps {
  url: string;
  title: string;
}

export function QRCodeModal({ url, title }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyQR = () => {
    // Get the SVG element
    const svg = document.querySelector('#qr-code-svg') as SVGSVGElement;
    if (!svg) return;

    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to blob and copy
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft" size="2">
          📱 Share QR or URL
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Share {title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Scan this QR code or copy the URL to share this linktree
        </Dialog.Description>

        <Flex direction="column" gap="4">
          {/* QR Code */}
          <Flex justify="center" align="center" style={{ padding: '20px', background: 'white', borderRadius: '12px' }}>
            <QRCodeSVG
              id="qr-code-svg"
              value={url}
              size={256}
              level="H"
              includeMargin={true}
              style={{ display: 'block' }}
            />
          </Flex>

          {/* URL Display */}
          <Box
            style={{
              padding: '12px',
              background: 'var(--gray-a2)',
              borderRadius: '8px',
              wordBreak: 'break-all',
              fontSize: '14px',
              fontFamily: 'monospace',
            }}
          >
            {url}
          </Box>

          {/* Actions */}
          <Flex gap="2" justify="end">
            <Button variant="soft" onClick={handleCopyUrl}>
              {copied ? '✅ Copied!' : '📋 Copy URL'}
            </Button>
            <Button variant="soft" onClick={handleCopyQR}>
              💾 Copy QR Code
            </Button>
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
