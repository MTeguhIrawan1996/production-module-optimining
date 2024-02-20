import { Breadcrumbs as MantineBreadcrumbs } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const Breadcrumb: React.FC = () => {
  const { breadcrumbs } = useBreadcrumbs((state) => state, shallow);

  return (
    <MantineBreadcrumbs
      separator={<IconChevronRight size={16} />}
      styles={(theme) => ({
        separator: {
          color: theme.colors.dark[6],
          marginLeft: 8,
          marginRight: 8,
        },
        breadcrumb: {
          cursor: 'pointer',
          textDecoration: 'none',
          color: theme.colors.dark[6],
          fontSize: 14,
          '&:hover': {
            color: theme.colors.brand[6],
          },
          '&:last-of-type': {
            color: theme.colors.brand[6],
          },
        },
      })}
    >
      {breadcrumbs?.map(({ label, path }) => {
        return (
          <Link href={path} key={label} prefetch={false}>
            {label}
          </Link>
        );
      })}
    </MantineBreadcrumbs>
  );
};

export default Breadcrumb;
