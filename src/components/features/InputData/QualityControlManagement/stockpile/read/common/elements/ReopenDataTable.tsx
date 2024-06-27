import { Stack, Text, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadOneStockpileMonitoringReopen } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringReopen';
import { formatDate } from '@/utils/helper/dateFormat';

const ReopenDataTable = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);

  const {
    monitoringStockpileReopenRitage,
    monitoringStockpileReopenRitageLoading,
  } = useReadOneStockpileMonitoringReopen({
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
        {t('commonTypography.reopen')}
      </Text>
      <MantineDataTable
        tableProps={{
          records: monitoringStockpileReopenRitage?.data ?? [],
          fetching: monitoringStockpileReopenRitageLoading,
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
              accessor: 'reopenStartDate',
              title: t('commonTypography.reopenStartDate'),
              render: ({ openAt }) => formatDate(openAt) ?? '-',
            },
            {
              accessor: 'reopenStartTime',
              title: t('commonTypography.reopenStartTime'),
              render: ({ openAt }) => formatDate(openAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'reopenCloseDate',
              title: t('commonTypography.reopenCloseDate'),
              render: ({ closeAt }) => formatDate(closeAt) ?? '-',
            },
            {
              accessor: 'reopenCloseTime',
              title: t('commonTypography.reopenCloseTime'),
              render: ({ closeAt }) => formatDate(closeAt, 'hh:mm:ss A') ?? '-',
            },
          ],
          horizontalSpacing: 0,
          highlightOnHover: false,
          withBorder: false,
          shadow: 'none',
          minHeight:
            monitoringStockpileReopenRitage?.data &&
            monitoringStockpileReopenRitage?.data?.length > 0
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
          totalAllData: monitoringStockpileReopenRitage?.meta.totalAllData || 0,
          totalData: monitoringStockpileReopenRitage?.meta.totalData || 0,
          totalPage: monitoringStockpileReopenRitage?.meta.totalPage || 0,
        }}
      />
    </Stack>
  );
};

export default ReopenDataTable;
