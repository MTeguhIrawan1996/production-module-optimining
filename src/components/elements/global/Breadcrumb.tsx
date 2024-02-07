import {
  Breadcrumbs as MantineBreadcrumbs,
  createStyles,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import * as React from 'react';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

type Breadcrumbs = {
  label: string;
  path: string;
};

const useStyles = createStyles((theme) => ({
  breadcrumbStyle: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.colors.dark[1],
    fontSize: 12,
    fontWeight: 400,
  },
}));

const Breadcrumb: React.FC = () => {
  const { classes, cx } = useStyles();

  // const { breadcrumbs } = useBreadcrumbs((state) => state);

  const { breadcrumbs } = useBreadcrumbs((state) => state);
  const [data, setData] = React.useState<Breadcrumbs[]>([]);

  React.useEffect(() => {
    // Fetch data from local storage or perform any necessary logic
    // const localData = localStorage.getItem('yourDataKey');
    setData(breadcrumbs);
  }, [breadcrumbs]); // Empty dependency array ensures it runs only on mount

  return (
    <MantineBreadcrumbs separator={<span> / </span>}>
      {data?.map(({ label, path }) => {
        return (
          <Link href={path} key={label} prefetch={false}>
            <Text
              fw={100}
              className={cx('textPrimaryHover', classes.breadcrumbStyle)}
            >
              {label}
            </Text>
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
