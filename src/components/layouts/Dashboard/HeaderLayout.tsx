import { ActionIcon, Box, Group, Menu, Stack, Text } from '@mantine/core';
import { IconMenu2, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { KeyValueList, PrimaryButton } from '@/components/elements';

import {
  IAuthUserData,
  useReadAuthUser,
} from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadPermissionUser } from '@/services/graphql/query/auth/useReadPermission';
import { usePermissions } from '@/utils/store/usePermissions';

import i18n from './../../../../i18n';

interface IHeaderlayoutProps {
  isExpand: boolean;
  onHandleExpand: () => void;
}

const HeaderLayout: React.FC<IHeaderlayoutProps> = ({ onHandleExpand }) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { setPermissions, permissions } = usePermissions();
  const [authUser, setAUthUser] = React.useState<IAuthUserData | null>(null);
  useReadAuthUser({
    skip: authUser !== null,
    onCompleted: (data) => {
      setAUthUser(data.authUser);
    },
  });
  useReadPermissionUser({
    skip: permissions && permissions.length > 0,
    onCompleted: (res) => {
      if (res) {
        const arrayOfString = res.authUser.role.permissions.data.map(
          (val) => val.slug
        );
        setPermissions(arrayOfString);
      }
    },
  });

  React.useEffect(() => {
    i18n.init();
    i18n.changeLanguage('id');
  }, []);

  const renderName = React.useMemo(() => {
    return (
      <Group spacing="xs">
        <Text component="span" fz={14}>
          {authUser?.name}
        </Text>
        <ActionIcon color="brand.6" variant="filled" radius={4} size="md">
          <IconUser size="1.2rem" />
        </ActionIcon>
      </Group>
    );
  }, [authUser?.name]);

  return (
    <Box top={0} p={0} pos="sticky" w="100%" sx={{ zIndex: 10 }}>
      <Group
        position="apart"
        h={64}
        pr={26}
        pl={12}
        bg="#FFFFFF"
        className="shadow"
      >
        <ActionIcon
          variant="light"
          color="brand.6"
          radius={4}
          onClick={onHandleExpand}
        >
          <IconMenu2 size="1rem" />
        </ActionIcon>
        <Menu shadow="md" width={350} position="bottom-end">
          <Menu.Target>{renderName}</Menu.Target>
          <Menu.Dropdown>
            <Stack p="xs" spacing="xs">
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
                justify="center"
                keyStyleText={{
                  sx: {
                    flex: 2,
                  },
                  fz: 14,
                }}
                valueStyleText={{
                  sx: {
                    flex: 10,
                  },
                  fz: 14,
                  fw: 600,
                  truncate: true,
                }}
              />
              <PrimaryButton
                label={t('commonTypography.edit')}
                variant="light"
                onClick={() => router.push('/profile')}
              />
              <PrimaryButton
                label="Logout"
                onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              />
            </Stack>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
};

export default HeaderLayout;
