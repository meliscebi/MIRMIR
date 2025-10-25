import { useState, useRef } from 'react';
import { Button, Flex, Text, Avatar, IconButton, Box } from '@radix-ui/themes';
import { Cross2Icon, UploadIcon } from '@radix-ui/react-icons';

interface CloudinaryImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  buttonText?: string;
  showPreview?: boolean;
}

export const CloudinaryImageUpload = ({
  currentImageUrl,
  onImageUploaded,
  buttonText = 'Upload Image',
  showPreview = true,
}: CloudinaryImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'linktree-avatars'); // Optional: organize uploads

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      setPreviewUrl(imageUrl);
      onImageUploaded(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (!cloudName || !uploadPreset) {
    return (
      <Text size="2" color="red">
        Cloudinary is not configured. Please add VITE_CLOUDINARY_CLOUD_NAME and
        VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.
      </Text>
    );
  }

  return (
    <Flex direction="column" gap="3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {showPreview && previewUrl && (
        <Flex align="center" gap="3">
          <Avatar
            src={previewUrl}
            fallback="?"
            size="5"
            radius="full"
          />
          <IconButton
            size="2"
            variant="soft"
            color="red"
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <Cross2Icon />
          </IconButton>
        </Flex>
      )}

      <Box>
        <Button
          onClick={handleButtonClick}
          disabled={uploading}
          variant="soft"
          style={{ cursor: 'pointer' }}
        >
          <UploadIcon />
          {uploading ? 'Uploading...' : buttonText}
        </Button>
      </Box>

      {error && (
        <Text size="2" color="red">
          {error}
        </Text>
      )}

      <Text size="1" color="gray">
        Accepted formats: JPG, PNG, GIF, WebP (Max 10MB)
      </Text>
    </Flex>
  );
};
