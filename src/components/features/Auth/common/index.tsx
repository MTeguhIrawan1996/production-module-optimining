import { Flex } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { AuthCard, AuthWrapper, NextImageFill } from '@/components/elements';
import AuthBook from '@/components/features/Auth/common/sections/AuthBook';

import { LoginImage } from '@/utils/constants/image';

const AuthPage = () => {
  const { t } = useTranslation('default');
  return (
    <AuthWrapper>
      <Flex gap="md" justify="center" align="center">
        <NextImageFill
          alt="login-image"
          src={LoginImage}
          figureProps={{
            w: 550,
            h: 450,
            radius: 'xs',
            sx: (theme) => ({
              display: 'none',
              [theme.fn.largerThan('lg')]: {
                display: 'unset',
              },
            }),
          }}
        />

        <AuthCard titleCard={t('auth.title')}>
          <AuthBook />
        </AuthCard>
      </Flex>
    </AuthWrapper>
  );
};

export default AuthPage;
