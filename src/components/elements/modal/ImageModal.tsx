import {
  LoadingOverlay,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import NextImageFill from '@/components/elements/global/NextImageFill';

import { EmptyStateImage } from '@/utils/constants/image';

import { IFile } from '@/types/global';

export interface IImageModalProps {
  isOpenImageModal: boolean;
  actionImageModal: () => void;
  photos?: Omit<IFile, 'mime' | 'path'>[] | null;
  isLoading?: boolean;
}

const ImageModal: React.FC<IImageModalProps> = ({
  isOpenImageModal,
  actionImageModal,
  photos,
  isLoading,
}) => {
  const { t } = useTranslation('default');

  return (
    <Modal.Root
      opened={isOpenImageModal}
      onClose={actionImageModal}
      radius="md"
      size="xl"
    >
      <Modal.Overlay opacity={0.2} />
      <Modal.Content>
        <Modal.Header>
          <Text component="span" fz={22} fw={500}>
            Foto
          </Text>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body p="md">
          <LoadingOverlay
            visible={isLoading ?? false}
            overlayBlur={2}
            zIndex={5}
          />
          <ScrollArea h={260}>
            {isLoading ? null : photos?.length ? (
              <SimpleGrid
                cols={4}
                breakpoints={[
                  { maxWidth: 'sm', cols: 1 },
                  { maxWidth: 'md', cols: 2 },
                ]}
                p="xs"
              >
                {photos.map((val, i) => (
                  <NextImageFill
                    alt={val.fileName}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${val.url}`}
                    figureProps={{
                      w: '100%',
                      h: 160,
                      radius: 'sm',
                    }}
                    figureClassName="drop-shadow-xl"
                    key={i}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Stack align="center" spacing="xs" py="md" sx={{ zIndex: 10 }}>
                <NextImageFill
                  alt="EmptyState"
                  src={EmptyStateImage}
                  figureProps={{
                    w: 160,
                    h: 160,
                    radius: 'sm',
                  }}
                />
                <Text fw={700} fz={22} color="dark.4" align="center">
                  {t('commonTypography.fotoNotfound')}
                </Text>
              </Stack>
            )}
          </ScrollArea>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ImageModal;
