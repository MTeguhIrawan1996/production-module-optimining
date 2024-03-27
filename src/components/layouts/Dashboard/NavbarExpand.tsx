import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Center,
  Group,
  Navbar as MantineNavbar,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { IconAB, IconMenu2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { NavbarLinksGroup } from '@/components/elements';

import useDashboardLayoutStyle from '@/styles/Layout/dashboard';

import { IMenuItem } from '@/types/layout';

interface IProps {
  styles: React.CSSProperties;
  menuItems: IMenuItem[];
  isExpand: boolean;
  onHandleExpand: () => void;
}

const NavbarExpand: React.FC<IProps> = ({
  styles,
  menuItems,
  onHandleExpand,
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { classes, cx } = useDashboardLayoutStyle();
  const cleanedPath = router.pathname.split('/').slice(0, 3).join('/');
  const cleanedPath2 = router.pathname.split('/').slice(0, 4).join('/');

  return (
    <MantineNavbar
      height="100%"
      pt={2}
      px={4}
      width={{ base: '100%', sm: 300 }}
      bg="white"
      style={styles}
      className="shadow-xl"
    >
      <MantineNavbar.Section p="xs">
        <Group spacing="xs">
          <IconAB style={{ height: '40px', width: '40px' }} />
          <Text component="span" fz="xl" fw={700} className="drop-shadow">
            Optimining
          </Text>
          <ActionIcon
            color="dark"
            size="lg"
            className="primaryHover"
            onClick={onHandleExpand}
            display={{ base: 'block', sm: 'none' }}
          >
            <Center>
              <IconMenu2 size="1.5rem" />
            </Center>
          </ActionIcon>
        </Group>
      </MantineNavbar.Section>
      <MantineNavbar.Section p="xs" pt={2} grow component={ScrollArea}>
        <Stack spacing={2}>
          {menuItems?.map((item: IMenuItem) => {
            return item.subMenu ? (
              <NavbarLinksGroup {...item} key={item.label} />
            ) : (
              <Link
                className={cx(classes.link, {
                  [classes.linkActive]:
                    item.href === cleanedPath || item.href === cleanedPath2,
                })}
                href={item.href ?? ''}
                key={item.label}
              >
                <Icon
                  icon={item.icon || ''}
                  className={classes.linkIcon}
                  style={{ fontSize: '18px' }}
                />
                <Text component="span" fz="sm">
                  {t(`sideBar.${item.label}`)}
                </Text>
              </Link>
            );
          })}
        </Stack>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default NavbarExpand;
