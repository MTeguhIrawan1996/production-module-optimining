import {
  ActionIcon,
  Group,
  Menu,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  KeyValueList,
  LogoutConfirmModal,
  PrimaryButton,
} from '@/components/elements';

import {
  IAuthUserData,
  useReadAuthUser,
} from '@/services/graphql/query/auth/useReadAuthUser';

export function ProfileCard() {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [authUser, setAUthUser] = React.useState<IAuthUserData | null>(null);

  const { userAuthDataLoading } = useReadAuthUser({
    skip: authUser !== null,
    onCompleted: (data) => {
      setAUthUser(data.authUser);
    },
  });

  const [logoutModalOpened, { close, open }] = useDisclosure(false);

  return (
    <>
      <LogoutConfirmModal opened={logoutModalOpened} onClose={close} />
      <Menu shadow="md" width={350} radius="md" position="bottom-end">
        <Menu.Target>
          <UnstyledButton>
            <Group spacing="sm">
              {userAuthDataLoading ? (
                <Skeleton w={100} h={12} radius="xl" />
              ) : (
                <Text component="span" fz={14}>
                  {authUser?.name}
                </Text>
              )}
              <ActionIcon
                color="brand.5"
                variant="filled"
                radius={4}
                size="md"
                component="div"
              >
                <IconUser size="1.2rem" />
              </ActionIcon>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown p="md">
          <Stack spacing="md">
            <Stack spacing={10}>
              <KeyValueList
                data={[
                  {
                    dataKey: 'Nama',
                    value: authUser?.name,
                  },
                  {
                    dataKey: 'Email',
                    value: authUser?.email,
                  },
                  {
                    dataKey: 'Role',
                    value: authUser?.role.name,
                  },
                ]}
                type="flex"
                align="center"
                justify="start"
                keyStyleText={{
                  fz: 14,
                  sx: {
                    flex: 1,
                  },
                }}
                valueStyleText={{
                  fz: 14,
                  fw: 500,
                  truncate: true,
                  sx: {
                    flex: 2,
                  },
                }}
              />
            </Stack>

            <Stack spacing={10}>
              <PrimaryButton
                label={t('commonTypography.edit')}
                variant="light"
                onClick={() => router.push('/profile')}
              />
              <PrimaryButton label="Logout" onClick={open} />
            </Stack>
          </Stack>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
