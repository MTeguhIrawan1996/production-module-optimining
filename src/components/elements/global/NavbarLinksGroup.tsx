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
  const [opened, setOpened] = React.useState(initiallyOpened || false);
  const [openedSubLinks, setOpenedSubLinks] = React.useState<string>('');
  const cleanedPath = router.pathname.split('/').slice(0, 3).join('/');
  const initialOpen = subMenu?.some((val) => val.href === cleanedPath);

  React.useEffect(() => {
    if (!initialOpen) {
      setOpened(false);
    }
  }, [initialOpen]);

  const renderItems = subMenu?.map((item, i) => {
    return item.subMenu ? (
      <Box key={`${item.label} + ${i}`}>
        <UnstyledButton
          onClick={() =>
            setOpenedSubLinks(openedSubLinks === item.label ? '' : item.label)
          }
          component="div"
        >
          <Group spacing="sm" className={classes.controlSubLinksGroup}>
            <Text component="span">{t(`sideBar.${item.label}`)}</Text>
            <IconChevronRight
              className={classes.chevron}
              size="1rem"
              style={{
                transform:
                  openedSubLinks === item.label ? `rotate(90deg)` : 'none',
              }}
            />
          </Group>
        </UnstyledButton>
        <Collapse in={openedSubLinks === item.label}>
          <Stack spacing={0}>
            {item.subMenu?.map((item, i) => (
              <PrimaryLink
                className={cx(classes.subLinksGroup, {
                  [classes.linkActive]: item.href === cleanedPath,
                })}
                href={item.href ?? ''}
                key={`${item.label} + ${i}`}
                label={t(`sideBar.${item.label}`)}
              />
            ))}
          </Stack>
        </Collapse>
      </Box>
    ) : (
      <PrimaryLink
        className={cx(classes.linkGroup, {
          [classes.linkActive]: item.href === cleanedPath,
        })}
        href={item.href ?? ''}
        key={`${item.label} + ${i}`}
        label={t(`sideBar.${item.label}`)}
      />
    );
  });

  return (
    <Box>
      <UnstyledButton onClick={() => setOpened((o) => !o)} component="div">
        <Group position="apart" spacing={0} className={classes.controlGroup}>
          <Group spacing={0}>
            <Icon
              icon={icon || ''}
              className={cx(classes.linkIcon)}
              style={{ fontSize: '20px' }}
            />
            <Text component="span">{t(`sideBar.${label}`)}</Text>
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
        <Stack spacing={0}>{renderItems}</Stack>
      </Collapse>
    </Box>
  );
};

export default NavbarLinksGroup;
