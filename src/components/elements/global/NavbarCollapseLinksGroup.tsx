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
  const itemLabel = React.useMemo(() => {
    const pathname = router.pathname.split('/');
    return pathname;
  }, [router]);
  const isActive = itemLabel.some(
    (items) => items.toLowerCase().replace(/-/g, '') === label.toLowerCase()
  );

  const renderItems = subMenu?.map((item, i) => {
    const isActiveSubMenu = itemLabel.some(
      (items) =>
        items.toLowerCase().replace(/-/g, '') === item.label.toLowerCase()
    );
    return item.subMenu ? (
      <NavbarCollapseLinksGroupLevel2 {...item} key={i} />
    ) : (
      <Link href={item.href ?? ''} key={`${item.label}${i}`}>
        <Menu.Item
          className={cx(classes.item, {
            [classes.linkActive]: isActiveSubMenu,
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
      <Tooltip.Floating label={t(`sideBar.${label}`)} position="right">
        <Menu.Target>
          <ActionIcon
            radius="md"
            w={40}
            h={40}
            className={cx(classes.link, {
              [classes.linkActive]: isActive,
            })}
          >
            <Icon icon={icon ?? ''} style={{ fontSize: '18px' }} />
          </ActionIcon>
        </Menu.Target>
      </Tooltip.Floating>
      <Menu.Dropdown>
        <Menu.Label>{t(`sideBar.${label}`)}</Menu.Label>
        {renderItems}
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarCollapseLinksGroup;
