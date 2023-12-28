import { Divider, Stack, Text, useMantineTheme } from '@mantine/core';
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
}

const DetailStockpileData: React.FC<IDetailStockpileDataProps> = ({
  monitoringStockpile,
  monitoringStockpileLoading,
}) => {
  const theme = useMantineTheme();
  const { t } = useTranslation('default');

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
      <Stack spacing="sm" mt="md">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.date'),
              value: formatDate(monitoringStockpile?.createdAt),
            },
          ]}
          type="grid"
          keyStyleText={{
            fw: 400,
            fz: 20,
          }}
          valueStyleText={{
            fw: 600,
            fz: 20,
          }}
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
          ]}
          type="grid"
          keyStyleText={{
            fw: 400,
            fz: 20,
          }}
          valueStyleText={{
            fw: 600,
            fz: 20,
          }}
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
              value: formatDate(monitoringStockpile?.openAt),
            },
            {
              dataKey: t('commonTypography.endOpen'),
              value: formatDate(monitoringStockpile?.closeAt),
            },
            {
              dataKey: t('commonTypography.openTime'),
              value: formatDate(monitoringStockpile?.openAt, 'hh:mm:ss A'),
            },
            {
              dataKey: t('commonTypography.closeTime'),
              value: formatDate(monitoringStockpile?.closeAt, 'hh:mm:ss A'),
            },
          ]}
          type="grid"
          keyStyleText={{
            fw: 400,
            fz: 20,
          }}
          valueStyleText={{
            fw: 600,
            fz: 20,
          }}
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.survey')}
        </Text>
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
                color: theme.colors.dark[5],
              },
              cellsStyle: {
                border: 'none',
                fontSize: 16,
                fontWeight: 400,
                color: theme.colors.dark[3],
              },
              noWrap: false,
            },
            columns: [
              {
                accessor: 'date',
                title: t('commonTypography.date'),
                render: ({ date }) => formatDate(date),
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
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.tonByRitage'),
              value: `${monitoringStockpile?.tonByRitage}` ?? '-',
            },
          ]}
          type="grid"
          keyStyleText={{
            fw: 400,
            fz: 20,
          }}
          valueStyleText={{
            fw: 600,
            fz: 20,
          }}
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.shipping')}
        </Text>
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.shippingStartDate'),
              value: formatDate(monitoringStockpile?.bargingStartAt),
            },
            {
              dataKey: t('commonTypography.shippingFinishDate'),
              value: formatDate(monitoringStockpile?.bargingFinishAt),
            },
            {
              dataKey: t('commonTypography.shippingStartTime'),
              value: formatDate(
                monitoringStockpile?.bargingStartAt,
                'hh:mm:ss A'
              ),
            },
            {
              dataKey: t('commonTypography.shippingFinishTime'),
              value: formatDate(
                monitoringStockpile?.bargingFinishAt,
                'hh:mm:ss A'
              ),
            },
          ]}
          type="grid"
          keyStyleText={{
            fw: 400,
            fz: 20,
          }}
          valueStyleText={{
            fw: 600,
            fz: 20,
          }}
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.moving')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: monitoringStockpile?.movings ?? [],
            defaultColumnProps: {
              textAlignment: 'left',
              titleStyle: {
                paddingTop: 0,
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: 18,
                fontWeight: 600,
                color: theme.colors.dark[5],
              },
              cellsStyle: {
                border: 'none',
                fontSize: 16,
                fontWeight: 400,
                color: theme.colors.dark[3],
              },
              noWrap: false,
            },
            columns: [
              {
                accessor: 'movingStartDate',
                title: t('commonTypography.movingStartDate'),
                render: ({ startAt }) => formatDate(startAt),
              },
              {
                accessor: 'movingFinishDate',
                title: t('commonTypography.movingFinishDate'),
                render: ({ finishAt }) => formatDate(finishAt),
              },
              {
                accessor: 'movingStartTime',
                title: t('commonTypography.movingStartTime'),
                render: ({ startAt }) => formatDate(startAt, 'hh:mm:ss A'),
              },
              {
                accessor: 'movingFinishTime',
                title: t('commonTypography.movingFinishTime'),
                render: ({ finishAt }) => formatDate(finishAt, 'hh:mm:ss A'),
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
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.reopen')}
        </Text>
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
                color: theme.colors.dark[5],
              },
              cellsStyle: {
                border: 'none',
                fontSize: 16,
                fontWeight: 400,
                color: theme.colors.dark[3],
              },
              noWrap: false,
            },
            columns: [
              {
                accessor: 'reopenStartDate',
                title: t('commonTypography.reopenStartDate'),
                render: ({ openAt }) => formatDate(openAt),
              },
              {
                accessor: 'reopenCloseDate',
                title: t('commonTypography.reopenCloseDate'),
                render: ({ closeAt }) => formatDate(closeAt),
              },
              {
                accessor: 'reopenStartTime',
                title: t('commonTypography.reopenStartTime'),
                render: ({ openAt }) => formatDate(openAt, 'hh:mm:ss A'),
              },
              {
                accessor: 'reopenCloseTime',
                title: t('commonTypography.reopenCloseTime'),
                render: ({ closeAt }) => formatDate(closeAt, 'hh:mm:ss A'),
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
      </Stack>
      <Divider my="md" />
    </>
  );
};

export default DetailStockpileData;
