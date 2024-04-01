import { Flex, Group, Pagination, Text } from '@mantine/core';
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

const GlobalPagination: React.FC<IPaginationProps> = (props) => {
  const totalAllData = props.totalAllData ?? 0;
  const totalData = props.totalData ?? 0;
  const totalPage = props.totalPage ?? 0;
  const currentPage = props.currentPage ?? 0;

  const paginationCalculation = React.useMemo(() => {
    const pageLength =
      currentPage === totalPage && totalPage !== 1
        ? (totalAllData - totalData) / (totalPage - 1)
        : (totalPage * totalData) / totalPage;

    const start = pageLength * (currentPage - 1) + 1;
    const end = start + totalData - 1;
    return {
      start,
      end,
    };
  }, [currentPage, totalAllData, totalData, totalPage]);

  if (props.isFetching) {
    return <PaginationSkeleton />;
  }

  if (totalPage < 1 || totalAllData < 1) {
    return null;
  }

  return (
    <Flex justify="space-between">
      <Group align="center">
        <Text
          fz="xs"
          c="gray.6"
        >{`${paginationCalculation.start} - ${paginationCalculation.end} dari ${totalAllData} data`}</Text>
        {/* FIXME: use i18n */}
      </Group>
      {/* <Group position="right" noWrap={false}> */}
      <Pagination.Root
        aria-label="pagination component"
        total={totalPage}
        value={currentPage}
        onChange={props.setPage}
        size="sm"
        styles={(theme) => ({
          control: {
            fontSize: 12,
            fontWeight: 500,
            color: theme.colors.dark[6],
            borderRadius: 4,
            border: `1px solid ${theme.colors.gray[4]}`,
            // boxShadow:
            //   '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
        })}
      >
        <Group spacing={5} position="right">
          <Pagination.First aria-label="first page" />
          <Pagination.Previous aria-label="previous page" />
          <Pagination.Items aria-label="list of pages" />
          <Pagination.Next aria-label="next page" />
          <Pagination.Last aria-label="last page" />
        </Group>
      </Pagination.Root>
      {/* </Group> */}
    </Flex>
  );
};

export default GlobalPagination;
