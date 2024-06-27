import { Badge, Divider, Stack, Text, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { KeyValueList, MantineDataTable } from '@/components/elements';

import { useReadOneStockpileMonitoringRitage } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringRitage';
import { formatDate } from '@/utils/helper/dateFormat';

const RitageDataTable = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);

  const { monitoringStockpileOreRitage, monitoringStockpileOreRitageLoading } =
    useReadOneStockpileMonitoringRitage({
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
          {t('commonTypography.listRitage')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: monitoringStockpileOreRitage?.data || [],
            fetching: monitoringStockpileOreRitageLoading,
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
                accessor: 'heavyEquipmentCode',
                title: t('commonTypography.heavyEquipmentCode'),
                render: ({ companyHeavyEquipment }) =>
                  companyHeavyEquipment?.hullNumber ?? '-',
              },
              {
                accessor: 'date',
                title: t('commonTypography.date'),
                render: ({ date }) => formatDate(date) ?? '-',
              },
              {
                accessor: 'shift',
                title: t('commonTypography.shift'),
                render: ({ shift }) => shift?.name ?? '-',
              },
              {
                accessor: 'operatorName',
                title: t('commonTypography.operatorName'),
                render: ({ operators }) => {
                  const arrOperator = operators?.map((val) => (
                    <Badge key={val.humanResource.id}>
                      {val.humanResource.name}
                    </Badge>
                  ));
                  return arrOperator && arrOperator.length > 0
                    ? arrOperator
                    : '-';
                },
              },
            ],
            horizontalSpacing: 0,
            highlightOnHover: false,
            withBorder: false,
            shadow: 'none',
            minHeight:
              monitoringStockpileOreRitage?.data &&
              monitoringStockpileOreRitage?.data.length > 0
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
            totalAllData: monitoringStockpileOreRitage?.meta.totalAllData || 0,
            totalData: monitoringStockpileOreRitage?.meta.totalData || 0,
            totalPage: monitoringStockpileOreRitage?.meta.totalPage || 0,
          }}
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.tonByRitage'),
              value: `${
                monitoringStockpileOreRitage?.additional?.tonByRitage || '-'
              }`,
            },
            {
              dataKey: t('commonTypography.totalRitage'),
              value: `${
                monitoringStockpileOreRitage?.additional?.totalRitage || '-'
              }`,
            },
          ]}
          type="grid"
        />
      </Stack>
    </>
  );
};

export default RitageDataTable;
