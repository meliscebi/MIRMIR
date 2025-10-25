import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button, TextField, Flex, Card, Heading, Text } from '@radix-ui/themes';
import { LINKTREE_PACKAGE_ID, USERNAME_REGISTRY_ID } from './constants';

interface BindUsernameProps {
  nftId: string;
  currentUsername?: string;
  onSuccess?: () => void;
}

export function BindUsername({ nftId, currentUsername, onSuccess }: BindUsernameProps) {
  const [username, setUsername] = useState(currentUsername || '');
  const [isBinding, setIsBinding] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleBind = async () => {
    if (!username || username.length < 3) {
      alert('Username en az 3 karakter olmalıdır');
      return;
    }

    // Username validation: only alphanumeric and underscore
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert('Username sadece harf, rakam ve alt çizgi içerebilir');
      return;
    }

    setIsBinding(true);

    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::bind_username`,
        arguments: [
          tx.object(nftId),
          tx.object(USERNAME_REGISTRY_ID),
          tx.pure.string(username),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            alert(`Username "${username}" başarıyla bağlandı! 🎉\n\nNot: Production'da ${username} ile erişebileceksiniz.\nŞimdilik NFT ID ile erişim kullanın.`);
            onSuccess?.();
          },
          onError: (error) => {
            console.error('Username bağlama hatası:', error);
            const errorMsg = error?.message || String(error);
            if (errorMsg.includes('EUsernameAlreadyTaken') || errorMsg.includes('already')) {
              alert(`Username "${username}" zaten alınmış. Başka bir username deneyin.`);
            } else {
              alert('Username bağlanamadı: ' + errorMsg);
            }
          },
        }
      );
    } catch (error) {
      console.error('Error binding username:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsBinding(false);
    }
  };

  const handleUnbind = async () => {
    setIsBinding(true);

    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${LINKTREE_PACKAGE_ID}::linktree_nft::unbind_username`,
        arguments: [
          tx.object(nftId),
          tx.object(USERNAME_REGISTRY_ID),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            alert('Username bağlantısı kaldırıldı');
            setUsername('');
            onSuccess?.();
          },
          onError: (error) => {
            console.error('Username kaldırma hatası:', error);
            alert('Username kaldırılamadı');
          },
        }
      );
    } catch (error) {
      console.error('Error unbinding username:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsBinding(false);
    }
  };

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Heading size="4">🔗 Kısa Link (Username)</Heading>
        <Text size="2" color="gray">
          NFT ID yerine kısa ve akılda kalıcı bir username kullanın
        </Text>
        
        {currentUsername && (
          <Text size="3" weight="bold" style={{ color: 'green' }}>
            ✅ Mevcut username: <code>{currentUsername}</code>
            <br />
            <a href={`/${currentUsername}`} target="_blank" rel="noopener noreferrer">
              {window.location.origin}/{currentUsername}
            </a>
          </Text>
        )}

        <TextField.Root
          placeholder="örnek: alice"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          disabled={isBinding}
        />

        <Flex gap="2">
          <Button
            onClick={handleBind}
            disabled={!username || isBinding}
            style={{ flex: 1 }}
          >
            {isBinding ? 'Bağlanıyor...' : currentUsername ? 'Güncelle' : 'Bağla'}
          </Button>
          
          {currentUsername && (
            <Button
              onClick={handleUnbind}
              disabled={isBinding}
              color="red"
              variant="soft"
            >
              Kaldır
            </Button>
          )}
        </Flex>

        <Text size="1" color="gray">
          💡 İpucu: Username benzersiz olmalı ve sadece harf, rakam ve alt çizgi (_) içerebilir
        </Text>
      </Flex>
    </Card>
  );
}
