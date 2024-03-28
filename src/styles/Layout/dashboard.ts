import { createStyles, rem } from '@mantine/core';

const useDashboardLayoutStyle = createStyles((theme) => ({
  // Component

  // Layout dashboard (Links/Menu)
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.colors.brand[4],
      color: '#FBFBFB',
    },
  },
  controlGroup: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.colors.brand[4],
      color: '#FBFBFB',
    },
  },
  linkGroup: {
    display: 'block',
    textDecoration: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 4,
    paddingLeft: rem(40),
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.colors.brand[4],
      color: '#FBFBFB',
    },
  },
  controlSubLinksGroup: {
    textDecoration: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 4,
    paddingLeft: rem(40),
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.colors.brand[4],
      color: '#FBFBFB',
    },
  },
  subLinksGroup: {
    display: 'block',
    textDecoration: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 4,
    paddingLeft: rem(55),
    borderRadius: theme.radius.sm,
    color: theme.colors.dark[7],
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.colors.brand[4],
      color: '#FBFBFB',
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
