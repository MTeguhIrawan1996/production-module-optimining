import { Icon } from '@iconify/react';
import { ActionIcon, Menu, Text, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import NavbarCollapseLinksGroupLevel2 from '@/components/elements/global/NavbarCollapseLinksGroupLevel2';

import useDashboardLayoutStyle from '@/styles/Layout/dashboard';

import { IMenuItem } from '@/types/layout';

const NavbarCollapseLinksGroup: React.FC<IMenuItem> = ({
  label,
  icon,
  subMenu,
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { classes, cx } = useDashboardLayoutStyle();
  const cleanedPath = router.pathname.split('/').slice(0, 3).join('/');
  const cleanedPathSub2 = router.pathname.split('/').slice(0, 4).join('/');
  const isActive = subMenu?.some(
    (val) => val.href === cleanedPath || val.href === cleanedPathSub2
  );
  const isActiveSub2 = subMenu
    ?.flatMap((val) => val.subMenu)
    .some((o) => o?.href === cleanedPathSub2);

  const renderItems = subMenu?.map((item, i) => {
    return item.subMenu ? (
      <NavbarCollapseLinksGroupLevel2 {...item} key={i} />
    ) : (
      <Link href={item.href ?? ''} key={`${item.label}${i}`}>
        <Menu.Item
          className={cx(classes.item, {
            [classes.linkActive]:
              item.href === cleanedPath || item.href === cleanedPathSub2,
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
    <Menu shadow="md" width={250} position="right-start">
      <Tooltip label={t(`sideBar.${label}`)} position="right">
        <Menu.Target>
          <ActionIcon
            radius="md"
            w={40}
            h={40}
            className={cx(classes.link, {
              [classes.linkActive]: isActive || isActiveSub2,
            })}
          >
            <Icon icon={icon ?? ''} style={{ fontSize: '18px' }} />
          </ActionIcon>
        </Menu.Target>
      </Tooltip>
      <Menu.Dropdown>
        <Menu.Label>{t(`sideBar.${label}`)}</Menu.Label>
        {renderItems}
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarCollapseLinksGroup;
