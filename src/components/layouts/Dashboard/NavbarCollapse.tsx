import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Navbar as MantineNavbar,
  Stack,
  Tooltip,
} from '@mantine/core';
import { IconAB } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { NavbarCollapseLinksGroup } from '@/components/elements';

import useDashboardLayoutStyle from '@/styles/Layout/dashboard';

import { IMenuItem } from '@/types/layout';

interface IProps {
  styles?: React.CSSProperties;
  menuItems: IMenuItem[];
}

const NavbarCollapse: React.FC<IProps> = ({ menuItems, styles }) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { classes, cx } = useDashboardLayoutStyle();
  const cleanedPath = router.pathname.split('/').slice(0, 3).join('/');

  const linksItem = React.useCallback(
    (item: IMenuItem, i) => {
      return item.subMenu ? (
        <NavbarCollapseLinksGroup {...item} key={i} />
      ) : (
        <Tooltip.Floating
          label={t(`sideBar.${item.label}`)}
          position="right"
          key={i}
        >
          <Link href={item.href ?? '/'}>
            <ActionIcon
              radius="md"
              w={40}
              h={40}
              className={cx(classes.link, {
                [classes.linkActive]: item.href === cleanedPath,
              })}
            >
              <Icon icon={item.icon ?? ''} style={{ fontSize: '18px' }} />
            </ActionIcon>
          </Link>
        </Tooltip.Floating>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  );

  const linkRender = menuItems?.map(linksItem);

  return (
    <MantineNavbar
      height="100%"
      width={{ base: 70 }}
      py="xs"
      px={0}
      style={styles}
      className="shadow-xl"
    >
      <MantineNavbar.Section
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconAB style={{ height: '40px', width: '40px' }} />
      </MantineNavbar.Section>
      <MantineNavbar.Section grow>
        <Stack justify="center" align="center" spacing={2}>
          {linkRender}
        </Stack>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default NavbarCollapse;
