import { ModalProps, Stack, Text } from '@mantine/core';
import { signOut } from 'next-auth/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '@/components/elements';
import { DefaultModal } from '@/components/elements/modal/DefaultModal';

const LogoutConfirmModal: React.FC<ModalProps> = ({
  onClose,
  opened,
  ...restModalProps
}) => {
  const { t } = useTranslation('default');
  return (
    <DefaultModal
      opened={opened}
      onClose={onClose}
      size="sm"
      title={t('auth.message.logoutConfirmationTitle')}
      withCloseButton={false}
      centeredTitle
      {...restModalProps}
    >
      <Text align="center">
        {t('auth.message.logoutConfirmationDescription')}
      </Text>
      <Stack spacing="xs" mt="sm">
        <PrimaryButton
          label={t('auth.message.confirmLogout')}
          onClick={() => {
            signOut({ redirect: true, callbackUrl: '/auth/signin' });
          }}
        />
        <PrimaryButton
          label={t('auth.message.cancelLogout')}
          variant="subtle"
          onClick={onClose}
        />
      </Stack>
    </DefaultModal>
  );
};

export default LogoutConfirmModal;
