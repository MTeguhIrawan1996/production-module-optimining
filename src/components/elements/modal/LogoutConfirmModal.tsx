import { Modal, Stack, Text } from '@mantine/core';
import { signOut } from 'next-auth/react';
import * as React from 'react';

import { PrimaryButton } from '@/components/elements';

interface IModalProps {
  isOpenModalLogout: boolean;
  actionModalLogout: () => void;
}

const LogoutConfirmModal: React.FC<IModalProps> = ({
  isOpenModalLogout,
  actionModalLogout,
}) => {
  return (
    <Modal.Root
      opened={isOpenModalLogout}
      onClose={actionModalLogout}
      centered
      radius="xs"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fw={600} fz={16} w="100%" sx={{ textAlign: 'center' }}>
            Anda yakin keluar?
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Text fw={400} fz={12} align="center">
            Pastikan pekerjaan anda telah tersimpan
          </Text>
          <Stack spacing="xs" mt="sm">
            <PrimaryButton
              label="Ya lanjut keluar"
              onClick={() => {
                signOut({ redirect: true, callbackUrl: '/' });
              }}
            />
            <PrimaryButton
              label="Kembali"
              variant="subtle"
              size="xs"
              fz="xs"
              fw={400}
              onClick={actionModalLogout}
            />
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default LogoutConfirmModal;
