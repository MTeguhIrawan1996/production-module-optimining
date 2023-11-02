import { Grid, Group, Pagination } from '@mantine/core';
import * as React from 'react';

import { PaginationSkeleton } from '@/components/elements';

export interface IPaginationProps {
  currentPage: number;
  totalPage: number;
  totalAllData: number;
  totalData: number;
  setPage: (page: number) => void;
  isFetching?: boolean;
}

const GlobalPagination: React.FC<IPaginationProps> = ({
  currentPage,
  totalPage,
  setPage,
  isFetching,
}) => {
  if (isFetching) {
    return <PaginationSkeleton />;
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <Pagination.Root
          total={totalPage === 0 ? 1 : totalPage}
          value={currentPage}
          onChange={setPage}
          size="sm"
          styles={(theme) => ({
            control: {
              fontSize: 12,
              fontWeight: 500,
              color: theme.colors.dark[4],
              borderRadius: 4,
              border: `1px solid ${theme.colors.gray[4]}`,
              boxShadow:
                '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            },
          })}
        >
          <Group spacing={5} position="right">
            <Pagination.First />
            <Pagination.Previous />
            <Pagination.Items />
            <Pagination.Next />
            <Pagination.Last />
          </Group>
        </Pagination.Root>
      </Grid.Col>
    </Grid>
  );
};

export default React.memo(GlobalPagination);
