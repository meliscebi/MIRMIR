import { useState, memo } from "react";
import { Flex, Box, Card, Heading } from "@radix-ui/themes";
import { LinktreePage } from "./LinktreePage";
import { EditLinktreeForm } from "./EditLinktreeForm";
import { BindUsername } from "./BindUsername";
import type { LinktreeNFT } from "./types";

interface LinktreeEditorProps {
  nft: LinktreeNFT;
  nftId: string;
  isOwner: boolean;
  onUpdate: () => void;
}

const LinktreeEditorComponent = ({ nft, nftId, isOwner, onUpdate }: LinktreeEditorProps) => {
  // Live preview state
  const [previewData, setPreviewData] = useState({
    title: nft.title,
    titleColor: nft.titleColor,
    backgroundColor: nft.backgroundColor,
    bio: nft.bio,
    avatarUrl: nft.avatarUrl,
    links: nft.links,
  });

  return (
    <Flex gap="4" direction={{ initial: 'column', md: 'row' }} style={{ width: '100%' }}>
      {/* Left side - Live Preview / View Only */}
      <Box style={{ flex: '0 0 45%', minWidth: 0 }}>
        {isOwner ? (
          <Card>
            <Heading size="4" mb="4">Live Preview</Heading>
            <LinktreePage 
              nft={{
                ...nft,
                ...previewData,
              }} 
            />
          </Card>
        ) : (
          // Not owner - show full page view without card wrapper
          <LinktreePage nft={nft} />
        )}
      </Box>

      {/* Right side - Edit */}
      {isOwner && (
        <Box style={{ flex: '0 0 55%', minWidth: 0 }}>
          <Flex direction="column" gap="4">
            <BindUsername
              nftId={nftId}
              currentUsername={nft.username}
              onSuccess={onUpdate}
            />
            <EditLinktreeForm
              nftId={nftId}
              currentTitle={nft.title}
              currentTitleColor={nft.titleColor}
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
