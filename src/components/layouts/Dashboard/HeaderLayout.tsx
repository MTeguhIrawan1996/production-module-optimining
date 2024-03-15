import { ActionIcon, Box, Group } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import i18n from 'i18n';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { ProfileCard } from '@/components/layouts/Dashboard/ProfileCard';

import { useReadPermissionUser } from '@/services/graphql/query/auth/useReadPermission';
import { usePermissions } from '@/utils/store/usePermissions';

interface IHeaderlayoutProps {
  isExpand: boolean;
  onHandleExpand: () => void;
}

const HeaderLayout: React.FC<IHeaderlayoutProps> = ({ onHandleExpand }) => {
  const [setPermissions, permissions] = usePermissions(
    (state) => [state.setPermissions, state.permissions],
    shallow
  );

  const { userPermission } = useReadPermissionUser({
    skip: permissions.length > 0,
  });

  React.useEffect(() => {
    if (
      (userPermission?.role.permissions.data.length ?? 0 > 0) &&
      permissions.length === 0
    ) {
      setPermissions(
        userPermission?.role.permissions.data.map((v) => v.slug) ?? []
      );
    }
  }, [userPermission, setPermissions, permissions]);

  React.useEffect(() => {
    i18n.changeLanguage('id');
  }, []);

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
        <ProfileCard />
      </Group>
    </Box>
  );
};

export default HeaderLayout;
