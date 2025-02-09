import { Menu, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import useDashboardLayoutStyle from '@/styles/Layout/dashboard';

import { IMenuItem } from '@/types/layout';

const NavbarCollapseLinksGroupLevel2: React.FC<IMenuItem> = ({
  label,
  subMenu,
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { classes, cx } = useDashboardLayoutStyle();
  const cleanedPath2 = router.pathname.split('/').slice(0, 4).join('/');

  const renderItems = subMenu?.map((item, i) => {
    return (
      <Link
        href={item.href ?? ''}
        key={`${item.label} + ${i}`}
        prefetch={false}
      >
        <Menu.Item
          className={cx(classes.item, {
            [classes.linkActive]: item.href === cleanedPath2,
          })}
          py={8}
        >
          <Text component="span" fz="sm">
            {t(`sideBar.${item.label}`)}
          </Text>
        </Menu.Item>
      </Link>
    );
  });

  return (
    <Menu shadow="md" width={250} position="right-start" offset={-20}>
      <Menu.Target>
        <UnstyledButton
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            width: '100%',
            borderRadius: '16px',
            color: theme.colors.dark[6],
            '&:hover': {
              color: theme.colors.brand[4],
            },
          })}
          py={8}
          px={16}
          fz="sm"
          fw={500}
        >
          <Text component="span">{t(`sideBar.${label}`)}</Text>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t(`sideBar.${label}`)}</Menu.Label>
        {renderItems}
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarCollapseLinksGroupLevel2;
