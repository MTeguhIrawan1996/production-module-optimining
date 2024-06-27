import { Stack, Text, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadOneStockpileMonitoringMoving } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringMoving';
import { formatDate } from '@/utils/helper/dateFormat';

const MovingDataTable = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);

  const {
    monitoringStockpileMovingRitage,
    monitoringStockpileMovingRitageLoading,
  } = useReadOneStockpileMonitoringMoving({
    variables: {
      id: id,
      limit: 10,
      orderBy: null,
      orderDir: null,
      page: page,
    },
    skip: !router.isReady,
  });
  return (
    <Stack spacing="sm">
      <Text fz={24} fw={600} color="brand">
        {t('commonTypography.moving')}
      </Text>
      <MantineDataTable
        tableProps={{
          records: monitoringStockpileMovingRitage?.data || [],
          fetching: monitoringStockpileMovingRitageLoading,
          defaultColumnProps: {
            textAlignment: 'left',
            titleStyle: {
              paddingTop: 0,
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: 18,
              fontWeight: 600,
              color: theme.colors.dark[6],
            },
            cellsStyle: {
              border: 'none',
              fontSize: 16,
              fontWeight: 400,
              color: theme.colors.dark[6],
            },
            noWrap: false,
          },
          columns: [
            {
              accessor: 'movingStartDate',
              title: t('commonTypography.movingStartDate'),
              render: ({ fromAt }) => formatDate(fromAt) ?? '-',
            },
            {
              accessor: 'movingStartTime',
              title: t('commonTypography.movingStartTime'),
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'movingFinishDate',
              title: t('commonTypography.movingFinishDate'),
              render: ({ arriveAt }) => formatDate(arriveAt) ?? '-',
            },

            {
              accessor: 'movingFinishTime',
              title: t('commonTypography.movingFinishTime'),
              render: ({ arriveAt }) =>
                formatDate(arriveAt, 'hh:mm:ss A') ?? '-',
            },
          ],
          horizontalSpacing: 0,
          highlightOnHover: false,
          withBorder: false,
          shadow: 'none',
          minHeight:
            monitoringStockpileMovingRitage?.data &&
            monitoringStockpileMovingRitage?.data?.length > 0
              ? 0
              : 320,
          borderColor: 'none',
          rowBorderColor: 'none',
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
        }}
        paginationProps={{
          setPage: setPage,
          currentPage: page,
          totalAllData: monitoringStockpileMovingRitage?.meta.totalAllData || 0,
          totalData: monitoringStockpileMovingRitage?.meta.totalData || 0,
          totalPage: monitoringStockpileMovingRitage?.meta.totalPage || 0,
        }}
      />
    </Stack>
  );
};

export default MovingDataTable;
