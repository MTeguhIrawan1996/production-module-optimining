import { AppShell, Container, createStyles, Transition } from '@mantine/core';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Breadcrumb, LogoutConfirmModal } from '@/components/elements';
import HeaderLayout from '@/components/layouts/Dashboard/HeaderLayout';

import { linksDashboard } from '@/utils/constants/Links/linksDashboard';
import { filterMenuByPermission } from '@/utils/helper/filterMenuByPermission';
import { usePermissions } from '@/utils/store/usePermissions';

import NavbarCollapse from './NavbarCollapse';
import NavbarExpand from './NavbarExpand';

import { IMenuItem } from '@/types/layout';

const useStyles = createStyles(() => ({
  root: {
    background: '#FFFFFF',
    position: 'relative',
    overflow: 'clip',
  },
  main: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'start',
    flexDirection: 'column',
    overflow: 'clip',
    paddingRight: 'calc(var(--mantine-aside-width, 0px))',
    paddingLeft: 'calc(var(--mantine-navbar-width, 0px))',
    paddingTop: 'calc(var(--mantine-navbar-height, 0px))',
  },
}));

type LayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: LayoutProps) => {
  const { classes } = useStyles();
  const [isExpand, setIsExpand] = React.useState<boolean>(true);
  const [isConfirmLogout, setIsConfirmLogout] = React.useState<boolean>(false);
  const { permissions, setPermissions } = usePermissions(
    (state) => state,
    shallow
  );

  const [filteredMenu, setFilteredMenu] = React.useState<IMenuItem[]>([]);

  //

  React.useEffect(() => {
    if (permissions.length > 0 && filteredMenu.length === 0) {
      const filtered = filterMenuByPermission(
        linksDashboard,
        permissions ?? []
      );
      setFilteredMenu(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, setPermissions]);

  const onHandleExpand = () => {
    setIsExpand((prev) => !prev);
  };

  return (
    <AppShell
      padding="xs"
      classNames={classes}
      navbar={
        <>
          <Transition
            mounted={isExpand}
            transition="scale-x"
            duration={300}
            timingFunction="ease"
          >
            {(styles) => (
              <NavbarExpand
                menuItems={filteredMenu}
                styles={styles}
                isExpand={isExpand}
                onHandleExpand={onHandleExpand}
              />
            )}
          </Transition>
          <Transition
            mounted={!isExpand}
            transition="scale-x"
            duration={300}
            timingFunction="ease"
          >
            {(styles) => (
              <NavbarCollapse styles={styles} menuItems={filteredMenu} />
            )}
          </Transition>
        </>
      }
    >
      <HeaderLayout isExpand={isExpand} onHandleExpand={onHandleExpand} />
      <Container px="1.5rem" py="sm" maw="calc(1400px + 3rem)">
        <Breadcrumb />
      </Container>
      {children}
      <LogoutConfirmModal
        isOpenModalLogout={isConfirmLogout}
        actionModalLogout={() => setIsConfirmLogout((prev) => !prev)}
      />
    </AppShell>
  );
};

export default DashboardLayout;
