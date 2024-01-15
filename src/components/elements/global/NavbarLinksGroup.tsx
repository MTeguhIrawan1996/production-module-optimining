import { Icon } from '@iconify/react';
import {
  Box,
  Collapse,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import NavbarLinksGroupLevel2 from '@/components/elements/global/NavbarLinksGroupLevel2';
import PrimaryLink from '@/components/elements/link/PrimaryLink';

import useDashboardLayoutStyle from '@/styles/Layout/dashboard';

import { IMenuItem } from '@/types/layout';

interface INavbarLinksGroupProps extends IMenuItem {
  initiallyOpened?: boolean;
}

const NavbarLinksGroup: React.FC<INavbarLinksGroupProps> = ({
  icon,
  label,
  initiallyOpened,
  subMenu,
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { classes, cx } = useDashboardLayoutStyle();
  const [opened, setOpened] = React.useState(false);
  const itemLabel = React.useMemo(() => {
    const pathname = router.pathname.split('/');
    return pathname;
  }, [router]);
  const cleanedPath = router.pathname.split('/').slice(0, 3).join('/');

  React.useEffect(() => {
    setOpened(initiallyOpened ?? false);
  }, [initiallyOpened]);

  const linksItem = React.useCallback(
    (item: IMenuItem, i) => {
      const initialOpen = itemLabel.some(
        (items) =>
          items.toLowerCase().replace(/-/g, '') === item.label.toLowerCase()
      );
      return item.subMenu ? (
        <NavbarLinksGroupLevel2
          key={i}
          initiallyOpened={initialOpen}
          {...item}
        />
      ) : (
        <PrimaryLink
          className={cx(classes.linkGroup, {
            [classes.linkActive]: item.href === cleanedPath,
          })}
          href={item.href ?? ''}
          key={`${item.label} + ${i}`}
          label={t(`sideBar.${item.label}`)}
          fz="sm"
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  );

  const linkRender = subMenu?.map(linksItem);

  return (
    <Box>
      <UnstyledButton onClick={() => setOpened((o) => !o)} component="div">
        <Group position="apart" spacing={0} className={classes.controlGroup}>
          <Group spacing={0}>
            <Icon
              icon={icon || ''}
              className={cx(classes.linkIcon)}
              style={{ fontSize: '18px' }}
            />
            <Text component="span" fz="sm">
              {t(`sideBar.${label}`)}
            </Text>
          </Group>
          <IconChevronRight
            className={classes.chevron}
            size="1rem"
            style={{
              transform: opened ? `rotate(90deg)` : 'none',
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        <Stack spacing={0}>{linkRender}</Stack>
      </Collapse>
    </Box>
  );
};

export default NavbarLinksGroup;
