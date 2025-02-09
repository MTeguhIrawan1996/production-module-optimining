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

import useDashboardLayoutStyle from '@/styles/Layout/dashboard';

import PrimaryLink from '../link/PrimaryLink';

import { IMenuItem } from '@/types/layout';

interface INavbarLinksGroupProps extends IMenuItem {
  initiallyOpened?: boolean;
}

const NavbarLinksGroup: React.FC<INavbarLinksGroupProps> = ({
  icon,
  label,
  subMenu,
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { classes, cx } = useDashboardLayoutStyle();
  const [opened, setOpened] = React.useState(false);
  const cleanedPath = router.pathname.split('/').slice(0, 3).join('/');
  const cleanedPathSub = router.pathname.split('/').slice(0, 4).join('/');

  React.useEffect(() => {
    if (subMenu) {
      const flattenedArray = subMenu.flatMap((item) =>
        item.subMenu ? item.subMenu : []
      );
      const isOpen = subMenu.some((val) => {
        if (val.subMenu && val.subMenu?.length > 0) {
          const isOpenByFlatArray =
            flattenedArray?.some((val) => val.href === cleanedPathSub) ?? false;
          return isOpenByFlatArray;
        }
        return (
          (val.href === cleanedPath || val.href === cleanedPathSub) ?? false
        );
      });
      setOpened(isOpen);
    }
  }, [cleanedPath, cleanedPathSub, subMenu]);

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
        <Stack spacing={2}>
          {subMenu?.map((item: IMenuItem, i) => {
            return item.subMenu ? (
              <NavbarLinksGroupLevel2 key={i} {...item} />
            ) : (
              <PrimaryLink
                className={cx(classes.linkGroup, {
                  [classes.linkActive]:
                    item.href === cleanedPath || item.href === cleanedPathSub,
                })}
                nextLinkProps={{
                  prefetch: false,
                }}
                href={item.href ?? ''}
                key={`${item.label} + ${i}`}
                label={t(`sideBar.${item.label}`)}
                fz="sm"
              />
            );
          })}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default NavbarLinksGroup;
