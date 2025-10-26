import { useState, memo } from "react";
import { Flex, Box, Heading, Badge, Button } from "@radix-ui/themes";
import { LinktreePage } from "./LinktreePage";
import { EditLinktreeForm } from "./EditLinktreeForm";
import { BindUsername } from "./BindUsername";
import { PhoneMockup } from "./PhoneMockup";
import { QRCodeModal } from "./QRCodeModal";
import type { LinktreeNFT, LinkInput } from "./types";

interface LinktreeEditorProps {
  nft: LinktreeNFT;
  nftId: string;
  isOwner: boolean;
  onUpdate: () => void;
}

const LinktreeEditorComponent = ({ nft, nftId, isOwner, onUpdate }: LinktreeEditorProps) => {
  // Live preview state
  const [previewData, setPreviewData] = useState<{
    title: string;
    titleColor: string;
    textColor: string;
    backgroundColor: string;
    bio: string;
    avatarUrl: string;
    links: LinkInput[];
  }>({
    title: nft.title,
    titleColor: nft.titleColor,
    textColor: nft.textColor,
    backgroundColor: nft.backgroundColor,
    bio: nft.bio,
    avatarUrl: nft.avatarUrl,
    links: [],
  });

  // Construct the shareable URL
  const shareUrl = `${window.location.origin}${window.location.pathname}#${nftId}`;
  
  // Go back to home
  const handleGoHome = () => {
    window.location.hash = '';
  };

  return (
    <Flex gap="6" direction={{ initial: 'column', lg: 'row' }} style={{ width: '100%' }}>
      {/* Left side - Phone Preview */}
      <Box style={{ flex: isOwner ? '0 0 400px' : '1', minWidth: 0 }}>
        <Flex direction="column" gap="4" align="center">
          {isOwner && (
            <Flex justify="between" align="center" style={{ width: '100%', maxWidth: '400px' }}>
              <Flex gap="2" align="center">
                <Button 
                  variant="ghost" 
                  size="2"
                  onClick={handleGoHome}
                  style={{ cursor: 'pointer' }}
                >
                  ← Back
                </Button>
                <Heading size="5">📱 Live Preview</Heading>
                <Badge color="green" variant="soft">Auto-updating</Badge>
              </Flex>
              <QRCodeModal url={shareUrl} title={nft.title} />
            </Flex>
          )}
          
          {!isOwner && (
            <>
              <Flex justify="start" style={{ width: '100%', marginBottom: '1rem' }}>
                <Button 
                  variant="ghost" 
                  size="2"
                  onClick={handleGoHome}
                  style={{ cursor: 'pointer' }}
                >
                  ← Back to Home
                </Button>
              </Flex>
              <Flex justify="center" style={{ width: '100%', marginBottom: '1rem' }}>
                <QRCodeModal url={shareUrl} title={nft.title} />
              </Flex>
            </>
          )}

          <PhoneMockup>
            <LinktreePage 
              nft={{
                ...nft,
                ...(isOwner ? {
                  title: previewData.title,
                  titleColor: previewData.titleColor,
                  textColor: previewData.textColor,
                  backgroundColor: previewData.backgroundColor,
                  bio: previewData.bio,
                  avatarUrl: previewData.avatarUrl,
                  // Convert LinkInput[] to Link[] for preview
                  links: previewData.links.map(link => ({
                    fields: {
                      title: link.title,
                      url: link.url,
                      icon: link.icon,
                    }
                  }))
                } : {}),
              }} 
            />
          </PhoneMockup>
        </Flex>
      </Box>

      {/* Right side - Edit Form (only for owner) */}
      {isOwner && (
        <Box style={{ flex: '1', minWidth: 0 }}>
          <Flex direction="column" gap="4">
            <Heading size="5">⚙️ Settings</Heading>
            <BindUsername
              nftId={nftId}
              currentUsername={nft.username}
              onSuccess={onUpdate}
            />
            <EditLinktreeForm
              nftId={nftId}
              currentTitle={nft.title}
              currentTitleColor={nft.titleColor}
              currentTextColor={nft.textColor}
              currentBackgroundColor={nft.backgroundColor}
              currentBio={nft.bio}
              currentAvatarUrl={nft.avatarUrl}
              currentLinks={nft.links}
              onUpdate={onUpdate}
              onLivePreview={setPreviewData}
            />
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export const LinktreeEditor = memo(LinktreeEditorComponent);
