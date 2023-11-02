/* eslint-disable no-console */
import * as React from 'react';

import { DashboardCard, MantineDataTable } from '@/components/elements';

const EmptyStateTable = () => {
  return (
    <DashboardCard shadow="md" withBorder title="Empty Table">
      <MantineDataTable
        tableProps={{
          records: [],
          columns: [
            { accessor: 'streetAddress' },
            { accessor: 'city' },
            { accessor: 'state' },
          ],
          // fetching: true,
        }}
        emptyStateProps={{
          title: 'Anda belum menambahkan perusahaan',
          actionButton: {
            label: 'Tambah Perusahaan',
            onClick: () => console.log('Empty Click'),
          },
        }}
        paginationProps={{
          setPage: () => {},
          currentPage: 1,
          totalAllData: 100,
          totalData: 10,
          totalPage: 20,
          // isFetching: true,
        }}
      />
    </DashboardCard>
  );
};

export default EmptyStateTable;
