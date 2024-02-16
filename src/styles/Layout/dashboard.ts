import { createStyles, rem } from '@mantine/core';

const useDashboardLayoutStyle = createStyles((theme) => ({
  // Component

  // Layout dashboard (Links/Menu)
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} 0`,
    borderRadius: theme.radius.md,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      // backgroundColor: theme.colors.brand[3],
      color: theme.colors.brand[6],
    },
  },
  controlGroup: {
    padding: `${theme.spacing.xs} 0`,
    borderRadius: theme.radius.md,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      // backgroundColor: theme.colors.brand[3],
      color: theme.colors.brand[6],
    },
  },
  linkGroup: {
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(40),
    borderRadius: theme.radius.md,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      // backgroundColor: theme.colors.red[3],
      color: theme.colors.brand[6],
    },
  },
  controlSubLinksGroup: {
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    paddingLeft: rem(40),
    borderRadius: theme.radius.md,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      // backgroundColor: theme.colors.brand[3],
      color: theme.colors.brand[6],
    },
  },
  subLinksGroup: {
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(55),
    borderRadius: theme.radius.md,
    color: theme.colors.dark[7],
    fontWeight: 500,

    '&:hover': {
      // backgroundColor: theme.colors.brand[3],
      color: theme.colors.brand[6],
    },
  },

  linkIcon: {
    marginRight: theme.spacing.sm,
  },
  linkActive: {
    // backgroundColor: theme.colors.brand[6],
    color: theme.colors.brand[6],
    fontWeight: 500,
  },
  chevron: {
    transition: 'transform 200ms ease',
  },
  item: {
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&[data-hovered]': {
      backgroundColor: 'unset',
      color: theme.colors.brand[6],
    },
  },
}));

export default useDashboardLayoutStyle;
