import {
  Breadcrumbs as MantineBreadcrumbs,
  createStyles,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import * as React from 'react';

type Breadcrumbs = {
  label: string;
  path: string;
};

interface IBreadcrumbProps {
  breadcrumbs: Breadcrumbs[];
}

const useStyles = createStyles((theme) => ({
  breadcrumbStyle: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.colors.dark[1],
    fontSize: 12,
    fontWeight: 400,
  },
}));

const Breadcrumb: React.FC<IBreadcrumbProps> = ({ breadcrumbs }) => {
  const { classes, cx } = useStyles();

  const breadCrumbCallback = React.useCallback(
    (value: Breadcrumbs, index: number) => {
      const { label, path } = value;
      return (
        <Link href={path} key={label} prefetch={false}>
          <Text
            fw={index === breadcrumbs.length - 1 ? 600 : 400}
            className={cx('textPrimaryHover', classes.breadcrumbStyle)}
          >
            {label}
          </Text>
        </Link>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [breadcrumbs]
  );

  const breadcrumbLinks = breadcrumbs.map(breadCrumbCallback);

  return (
    <MantineBreadcrumbs separator={<span> / </span>}>
      {breadcrumbLinks}
    </MantineBreadcrumbs>
  );
};

export default Breadcrumb;
