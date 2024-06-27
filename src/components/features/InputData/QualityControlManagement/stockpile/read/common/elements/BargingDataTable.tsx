import { Stack, Text, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadOneStockpileMonitoringBarging } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringBarging';
import { formatDate } from '@/utils/helper/dateFormat';

const BargingDataTable = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);

  const {
    monitoringStockpileBargingRitage,
    monitoringStockpileBargingRitageLoading,
  } = useReadOneStockpileMonitoringBarging({
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
        {t('commonTypography.barging')}
      </Text>

      <MantineDataTable
        tableProps={{
          records: monitoringStockpileBargingRitage?.data || [],
          fetching: monitoringStockpileBargingRitageLoading,
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
              accessor: 'bargingStartDate',
              title: t('commonTypography.bargingStartDate'),
              render: ({ fromAt }) => formatDate(fromAt) ?? '-',
            },
            {
              accessor: 'bargingStartTime',
              title: t('commonTypography.bargingStartTime'),
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'bargingFinishDate',
              title: t('commonTypography.bargingFinishDate'),
              render: ({ arriveAt }) => formatDate(arriveAt) ?? '-',
            },
            {
              accessor: 'bargingFinishTime',
              title: t('commonTypography.bargingFinishTime'),
              render: ({ arriveAt }) =>
                formatDate(arriveAt, 'hh:mm:ss A') ?? '-',
            },
          ],
          horizontalSpacing: 0,
          highlightOnHover: false,
          withBorder: false,
          shadow: 'none',
          minHeight:
            monitoringStockpileBargingRitage?.data &&
            monitoringStockpileBargingRitage?.data?.length > 0
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
          totalAllData:
            monitoringStockpileBargingRitage?.meta.totalAllData || 0,
          totalData: monitoringStockpileBargingRitage?.meta.totalData || 0,
          totalPage: monitoringStockpileBargingRitage?.meta.totalPage || 0,
        }}
      />
    </Stack>
  );
};

export default BargingDataTable;
