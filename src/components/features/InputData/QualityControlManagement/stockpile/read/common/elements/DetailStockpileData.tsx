import {
  Divider,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Box } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  GlobalAlert,
  GlobalHeaderDetail,
  KeyValueList,
  MantineDataTable,
} from '@/components/elements';

import { IReadOneStockpileMonitoring } from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoring';
import { formatDate } from '@/utils/helper/dateFormat';

interface IDetailStockpileDataProps {
  monitoringStockpile?: IReadOneStockpileMonitoring;
  monitoringStockpileLoading?: boolean;
  ritageProps: {
    page: number;
    handleSetPage: (page: number) => void;
  };
}

const DetailStockpileData: React.FC<IDetailStockpileDataProps> = ({
  monitoringStockpile,
  monitoringStockpileLoading,
  ritageProps,
}) => {
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const { handleSetPage, page } = ritageProps;

  const photo = monitoringStockpile?.photo
    ? [
        {
          type: 'photo',
          alt: monitoringStockpile?.photo?.fileName,
          fileName: monitoringStockpile?.photo?.originalFileName,
          src: monitoringStockpile?.photo?.url,
        },
      ]
    : [];

  return (
    <>
      {monitoringStockpile?.status?.id ===
      'af06163a-2ba3-45ee-a724-ab3af0c97cc9' ? (
        <GlobalAlert
          description={monitoringStockpile?.statusMessage ?? ''}
          title={t('commonTypography.invalidData')}
          color="red"
          mt="xs"
        />
      ) : null}
      {monitoringStockpile?.status?.id ===
      '7848a063-ae40-4a80-af86-dfc532cbb688' ? (
        <GlobalAlert
          description={monitoringStockpile?.statusMessage ?? ''}
          title={t('commonTypography.rejectedData')}
          color="red"
          mt="xs"
        />
      ) : null}
      <Stack spacing="sm" mt="sm">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.date'),
              value: formatDate(monitoringStockpile?.createdAt) ?? '-',
            },
          ]}
          type="grid"
        />
      </Stack>
      {!monitoringStockpileLoading && monitoringStockpile ? (
        <>
          <GlobalHeaderDetail data={[...photo]} title="document" pt="md" />
          <Divider my="md" />
        </>
      ) : null}
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.stockpileInformation')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.stockpileName'),
              value: monitoringStockpile?.dome?.stockpile.name ?? '-',
            },
            {
              dataKey: t('commonTypography.domeId'),
              value: monitoringStockpile?.dome?.handBookId ?? '-',
            },
            {
              dataKey: t('commonTypography.domeName'),
              value: monitoringStockpile?.dome?.name ?? '-',
            },
            {
              dataKey: t('commonTypography.materialType'),
              value: monitoringStockpile?.material?.name ?? '-',
            },
            {
              dataKey: t('commonTypography.domeStatus'),
              value: monitoringStockpile?.domeStatus ?? '-',
            },
            {
              dataKey: t('commonTypography.stockMaterial'),
              value: '-',
            },
          ]}
          type="grid"
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.time')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.startOpen'),
              value: formatDate(monitoringStockpile?.openAt) ?? '-',
            },
            {
              dataKey: t('commonTypography.endOpen'),
              value: formatDate(monitoringStockpile?.closeAt) ?? '-',
            },
            {
              dataKey: t('commonTypography.openTime'),
              value:
                formatDate(monitoringStockpile?.openAt, 'hh:mm:ss A') ?? '-',
            },
            {
              dataKey: t('commonTypography.closeTime'),
              value:
                formatDate(monitoringStockpile?.closeAt, 'hh:mm:ss A') ?? '-',
            },
          ]}
          type="grid"
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.survey')}
        </Text>
        <ScrollArea.Autosize mah={340} offsetScrollbars type="always">
          <Box sx={{ height: 'fit-content' }}>
            <MantineDataTable
              tableProps={{
                records: monitoringStockpile?.tonSurveys ?? [],
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
                    render: ({ ton }) => ton,
                  },
                ],
                horizontalSpacing: 0,
                highlightOnHover: false,
                withBorder: false,
                shadow: 'none',
                minHeight:
                  monitoringStockpile?.tonSurveys &&
                  monitoringStockpile?.tonSurveys?.length > 0
                    ? 0
                    : 320,
                borderColor: 'none',
                rowBorderColor: 'none',
              }}
              emptyStateProps={{
                title: t('commonTypography.dataNotfound'),
              }}
            />
          </Box>
        </ScrollArea.Autosize>
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.listRitage')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: monitoringStockpile?.ritages?.data ?? [],
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
                render: () => '-',
              },
            ],
            horizontalSpacing: 0,
            highlightOnHover: false,
            withBorder: false,
            shadow: 'none',
            minHeight:
              monitoringStockpile?.ritages?.data &&
              monitoringStockpile?.ritages?.data.length > 0
                ? 0
                : 320,
            borderColor: 'none',
            rowBorderColor: 'none',
          }}
          emptyStateProps={{
            title: t('commonTypography.dataNotfound'),
          }}
          paginationProps={{
            setPage: handleSetPage,
            currentPage: page,
            totalAllData: monitoringStockpile?.ritages?.meta.totalAllData ?? 0,
            totalData: monitoringStockpile?.ritages?.meta.totalData ?? 0,
            totalPage: monitoringStockpile?.ritages?.meta.totalPage ?? 0,
          }}
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.tonByRitage'),
              value: `${monitoringStockpile?.tonByRitage || '-'}`,
            },
            {
              dataKey: t('commonTypography.totalRitage'),
              value: `${
                monitoringStockpile?.ritages?.meta.totalAllData || '-'
              }`,
            },
          ]}
          type="grid"
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.barging')}
        </Text>
        <ScrollArea.Autosize mah={340} offsetScrollbars type="always">
          <Box sx={{ height: 'fit-content' }}>
            <MantineDataTable
              tableProps={{
                records: monitoringStockpile?.bargings ?? [],
                idAccessor: (record) => {
                  const key =
                    monitoringStockpile?.bargings &&
                    monitoringStockpile?.bargings.indexOf(record) + 1;
                  return `${key}`;
                },
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
                    render: ({ startAt }) => formatDate(startAt) ?? '-',
                  },
                  {
                    accessor: 'bargingFinishDate',
                    title: t('commonTypography.bargingFinishDate'),
                    render: ({ finishAt }) => formatDate(finishAt) ?? '-',
                  },
                  {
                    accessor: 'bargingStartTime',
                    title: t('commonTypography.bargingStartTime'),
                    render: ({ startAt }) =>
                      formatDate(startAt, 'hh:mm:ss A') ?? '-',
                  },
                  {
                    accessor: 'bargingFinishTime',
                    title: t('commonTypography.bargingFinishTime'),
                    render: ({ finishAt }) =>
                      formatDate(finishAt, 'hh:mm:ss A') ?? '-',
                  },
                ],
                horizontalSpacing: 0,
                highlightOnHover: false,
                withBorder: false,
                shadow: 'none',
                minHeight:
                  monitoringStockpile?.bargings &&
                  monitoringStockpile?.bargings?.length > 0
                    ? 0
                    : 320,
                borderColor: 'none',
                rowBorderColor: 'none',
              }}
              emptyStateProps={{
                title: t('commonTypography.dataNotfound'),
              }}
            />
          </Box>
        </ScrollArea.Autosize>
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.moving')}
        </Text>
        <ScrollArea.Autosize mah={340} offsetScrollbars type="always">
          <Box sx={{ height: 'fit-content' }}>
            <MantineDataTable
              tableProps={{
                records: monitoringStockpile?.movings ?? [],
                idAccessor: (record) => {
                  const key =
                    monitoringStockpile?.movings &&
                    monitoringStockpile?.movings.indexOf(record) + 1;
                  return `${key}`;
                },
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
                    render: ({ startAt }) => formatDate(startAt) ?? '-',
                  },
                  {
                    accessor: 'movingFinishDate',
                    title: t('commonTypography.movingFinishDate'),
                    render: ({ finishAt }) => formatDate(finishAt) ?? '-',
                  },
                  {
                    accessor: 'movingStartTime',
                    title: t('commonTypography.movingStartTime'),
                    render: ({ startAt }) =>
                      formatDate(startAt, 'hh:mm:ss A') ?? '-',
                  },
                  {
                    accessor: 'movingFinishTime',
                    title: t('commonTypography.movingFinishTime'),
                    render: ({ finishAt }) =>
                      formatDate(finishAt, 'hh:mm:ss A') ?? '-',
                  },
                ],
                horizontalSpacing: 0,
                highlightOnHover: false,
                withBorder: false,
                shadow: 'none',
                minHeight:
                  monitoringStockpile?.movings &&
                  monitoringStockpile?.movings?.length > 0
                    ? 0
                    : 320,
                borderColor: 'none',
                rowBorderColor: 'none',
              }}
              emptyStateProps={{
                title: t('commonTypography.dataNotfound'),
              }}
            />
          </Box>
        </ScrollArea.Autosize>
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.reopen')}
        </Text>
        <ScrollArea.Autosize mah={340} offsetScrollbars type="always">
          <Box sx={{ height: 'fit-content' }}>
            <MantineDataTable
              tableProps={{
                records: monitoringStockpile?.reopens ?? [],
                idAccessor: (record) => {
                  const key =
                    monitoringStockpile?.reopens &&
                    monitoringStockpile?.reopens.indexOf(record) + 1;
                  return `${key}`;
                },
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
                    accessor: 'reopenCloseDate',
                    title: t('commonTypography.reopenCloseDate'),
                    render: ({ closeAt }) => formatDate(closeAt) ?? '-',
                  },
                  {
                    accessor: 'reopenStartTime',
                    title: t('commonTypography.reopenStartTime'),
                    render: ({ openAt }) =>
                      formatDate(openAt, 'hh:mm:ss A') ?? '-',
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
                  monitoringStockpile?.reopens &&
                  monitoringStockpile?.reopens?.length > 0
                    ? 0
                    : 320,
                borderColor: 'none',
                rowBorderColor: 'none',
              }}
              emptyStateProps={{
                title: t('commonTypography.dataNotfound'),
              }}
            />
          </Box>
        </ScrollArea.Autosize>
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.desc'),
              value: monitoringStockpile?.desc,
            },
          ]}
          type="grid"
        />
      </Stack>
    </>
  );
};

export default DetailStockpileData;
