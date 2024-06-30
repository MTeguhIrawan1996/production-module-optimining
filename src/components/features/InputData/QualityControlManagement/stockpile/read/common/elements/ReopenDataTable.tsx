import { Box, ScrollArea, Stack, Text, useMantineTheme } from '@mantine/core';
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

  const {
    monitoringStockpileReopenRitage,
    monitoringStockpileReopenRitageLoading,
  } = useReadOneStockpileMonitoringReopen({
    variables: {
      id: id,
    },
    skip: !router.isReady,
  });
  return (
    <ScrollArea.Autosize
      mah={340}
      offsetScrollbars
      type="always"
      sx={{
        zIndex: 1,
      }}
    >
      <Box sx={{ height: 'fit-content' }}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.reopen')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: monitoringStockpileReopenRitage ?? [],
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
                  render: ({ openAt }) =>
                    formatDate(openAt, 'hh:mm:ss A') ?? '-',
                },
                {
                  accessor: 'reopenCloseDate',
                  title: t('commonTypography.reopenCloseDate'),
                  render: ({ closeAt }) => formatDate(closeAt) ?? '-',
                },
                {
                  accessor: 'reopenCloseTime',
                  title: t('commonTypography.reopenCloseTime'),
                  render: ({ closeAt }) =>
                    formatDate(closeAt, 'hh:mm:ss A') ?? '-',
                },
              ],
              horizontalSpacing: 0,
              highlightOnHover: false,
              withBorder: false,
              shadow: 'none',
              minHeight:
                monitoringStockpileReopenRitage &&
                monitoringStockpileReopenRitage?.length > 0
                  ? 0
                  : 320,
              borderColor: 'none',
              rowBorderColor: 'none',
            }}
            emptyStateProps={{
              title: t('commonTypography.dataNotfound'),
            }}
          />
        </Stack>
      </Box>
    </ScrollArea.Autosize>
  );
};

export default ReopenDataTable;
