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

import PrimaryLink from '@/components/elements/link/PrimaryLink';

import useDashboardLayoutStyle from '@/styles/Layout/dashboard';

import { IMenuItem } from '@/types/layout';

interface INavbarLinksGroupLevel2Props extends IMenuItem {
  initiallyOpened?: boolean;
}

const NavbarLinksGroupLevel2: React.FC<INavbarLinksGroupLevel2Props> = ({
  label,
  initiallyOpened,
  subMenu,
}) => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const { classes, cx } = useDashboardLayoutStyle();
  const [opened, setOpened] = React.useState(false);
  const cleanedPathSubMenuLevel2 = router.pathname
    .split('/')
    .slice(0, 4)
    .join('/');

  React.useEffect(() => {
    const currentOpen =
      subMenu?.some((val) => val.href === cleanedPathSubMenuLevel2) || false;
    setOpened(initiallyOpened || currentOpen);
  }, [initiallyOpened, subMenu, cleanedPathSubMenuLevel2]);

  return (
    <Box>
      <UnstyledButton onClick={() => setOpened((o) => !o)} component="div">
        <Group
          position="apart"
          spacing={0}
          className={classes.controlSubLinksGroup}
        >
          <Group spacing={0}>
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
          {subMenu?.map((item, i) => {
            return (
              <PrimaryLink
                className={cx(classes.subLinksGroup, {
                  [classes.linkActive]: item.href === cleanedPathSubMenuLevel2,
                })}
                href={item.href ?? ''}
                key={`${item.label} + ${i}`}
                label={t(`sideBar.${item.label}`)}
                fz="sm"
                nextLinkProps={{
                  prefetch: false,
                }}
              />
            );
          })}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default NavbarLinksGroupLevel2;
