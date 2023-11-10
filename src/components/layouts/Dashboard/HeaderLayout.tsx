import { ActionIcon, Box, Group, Menu, Stack, Text } from '@mantine/core';
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconUser,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { KeyValueList, PrimaryButton } from '@/components/elements';

import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';

interface IHeaderlayoutProps {
  isExpand: boolean;
  onHandleExpand: () => void;
}

const HeaderLayout: React.FC<IHeaderlayoutProps> = ({
  isExpand,
  onHandleExpand,
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [name, setName] = React.useState<string>('');
  const { userAuthData } = useReadAuthUser({
    onCompleted: (data) => {
      setName(data.authUser.name);
    },
    skip: name !== '',
  });
  const renderName = React.useMemo(() => {
    return (
      <Group spacing="xs">
        <Text component="span">{name}</Text>
        <ActionIcon color="brand.5" variant="filled" radius={4} size="lg">
          <IconUser size="1.625rem" />
        </ActionIcon>
      </Group>
    );
  }, [name]);

  return (
    <Box top={0} p={0} pos="sticky" w="100%" sx={{ zIndex: 10 }}>
      <Group position="apart" h={64} px={26} bg="#FFFFFF" className="shadow">
        <ActionIcon
          color="dark"
          size="lg"
          className="primaryHover"
          onClick={onHandleExpand}
        >
          {isExpand ? (
            <IconArrowNarrowLeft size="2.125rem" />
          ) : (
            <IconArrowNarrowRight size="2.125rem" />
          )}
        </ActionIcon>
        <Menu shadow="md" width={350} position="bottom-end">
          <Menu.Target>{renderName}</Menu.Target>
          <Menu.Dropdown>
            <Stack p="xs" spacing="xs">
              <KeyValueList
                data={[
                  {
                    dataKey: 'Nama',
                    value: userAuthData?.name,
                  },
                  {
                    dataKey: 'Email',
                    value: userAuthData?.email,
                  },
                  {
                    dataKey: 'Role',
                    value: userAuthData?.role.name,
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
