import {
  Breadcrumbs as MantineBreadcrumbs,
  createStyles,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import * as React from 'react';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const useStyles = createStyles((theme) => ({
  breadcrumbStyle: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.colors.dark[6],
    fontSize: 14,
    '&:hover': {
      color: theme.colors.brand[6],
    },
  },
}));

const Breadcrumb: React.FC = () => {
  const { classes } = useStyles();

  // const { breadcrumbs } = useBreadcrumbs((state) => state);

  const { breadcrumbs } = useBreadcrumbs((state) => state);

  return (
    <MantineBreadcrumbs separator={<span> / </span>}>
      {breadcrumbs?.map(({ label, path }) => {
        return (
          <Link href={path} key={label} prefetch={false}>
            <Text className={classes.breadcrumbStyle}>{label}</Text>
          </Link>
        );
      })}
    </MantineBreadcrumbs>
  );
};

export default Breadcrumb;

/**
 *
 */
