import { Stack, Text, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadOneStockpileMonitoringSurvey } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringSurvey';
import { formatDate } from '@/utils/helper/dateFormat';

const SurveyDataTable = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);

  const { monitoringStockpileSurvey, monitoringStockpileSurveyLoading } =
    useReadOneStockpileMonitoringSurvey({
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
    <>
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.survey')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: monitoringStockpileSurvey?.data || [],
            fetching: monitoringStockpileSurveyLoading,
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
                accessor: 'date',
                title: t('commonTypography.date'),
                render: ({ date }) => formatDate(date) ?? '-',
              },
              {
                accessor: 'tonBySurvey',
                title: t('commonTypography.tonBySurvey'),
                render: ({ ton }) => ton ?? '-',
              },
              {
                accessor: 'volumeBySurvey',
                title: t('commonTypography.volumeBySurvey'),
                render: ({ volume }) => volume ?? '-',
              },
            ],
            horizontalSpacing: 0,
            highlightOnHover: false,
            withBorder: false,
            shadow: 'none',
            minHeight:
              monitoringStockpileSurvey?.data &&
              monitoringStockpileSurvey?.data?.length > 0
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
            totalAllData: monitoringStockpileSurvey?.meta.totalAllData || 0,
            totalData: monitoringStockpileSurvey?.meta.totalData || 0,
            totalPage: monitoringStockpileSurvey?.meta.totalPage || 0,
          }}
        />
      </Stack>
    </>
  );
};

export default SurveyDataTable;
