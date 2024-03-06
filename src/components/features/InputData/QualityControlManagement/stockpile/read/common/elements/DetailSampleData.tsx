import { Divider, Stack, Text, useMantineTheme } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IReadOneStockpileMonitoring,
  IRitageSampleReadOneStockpileMonitoring,
  ISampleReadOneStockpileMonitoring,
} from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoring';
import { formatDate } from '@/utils/helper/dateFormat';

import { IElementsData } from '@/types/global';

interface IDetailSampleDataProps {
  monitoringStockpile?: IReadOneStockpileMonitoring;
}

const DetailSampleData: React.FC<IDetailSampleDataProps> = ({
  monitoringStockpile,
}) => {
  const theme = useMantineTheme();
  const { t } = useTranslation('default');

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
  });

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<ISampleReadOneStockpileMonitoring> = {
        accessor: element.name,
        title: `${t('commonTypography.rate')} ${element.name}`,
        render: ({ sample }) => {
          const value = sample?.elements?.find(
            (val) => val.element?.id === element.id
          );
          return value?.value ?? '-';
        },
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderOtherColumn = elementsData?.map(renderOtherColumnCallback);

  const renderOtherColumnRitageSampleCallback = React.useCallback(
    (element: IElementsData) => {
      const averageValue =
        monitoringStockpile?.ritageSamples?.additional.averageSamples.find(
          (obj) => obj.element.id === element.id
        );
      const column: DataTableColumn<IRitageSampleReadOneStockpileMonitoring> = {
        accessor: element.name,
        title: `${t('commonTypography.rate')} ${element.name}`,
        render: ({ elements }) => {
          const value = elements?.find((val) => val.element?.id === element.id);
          return value?.value ?? '-';
        },
        footer: <Text>{averageValue?.value ?? '-'}</Text>,
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monitoringStockpile]
  );

  const renderOtherRitageSampleColumn = elementsData?.map(
    renderOtherColumnRitageSampleCallback
  );

  return (
    <>
      <Stack spacing="sm" mt="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.stockpileSample')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: monitoringStockpile?.samples ?? [],
            scrollAreaProps: {
              type: 'never',
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
                accessor: 'sampleType',
                title: t('commonTypography.sampleType'),
                width: 250,
                render: ({ sample }) => sample?.sampleType.name ?? '-',
              },
              {
                accessor: 'sampleNumber',
                title: t('commonTypography.sampleNumber'),
                render: ({ sample }) => sample?.sampleNumber ?? '-',
              },
              {
                accessor: 'sampleDate',
                title: t('commonTypography.sampleDate'),
                render: ({ sample }) => formatDate(sample?.sampleDate) ?? '-',
              },
              ...(renderOtherColumn ?? []),
            ],
            horizontalSpacing: 15,
            highlightOnHover: false,
            withBorder: false,
            shadow: 'none',
            minHeight:
              monitoringStockpile?.samples &&
              monitoringStockpile?.samples?.length > 0
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
      <Stack spacing="sm" mt="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.sampleByRitage')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: monitoringStockpile?.ritageSamples?.data ?? [],
            scrollAreaProps: {
              type: 'never',
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
              footerStyle: {
                visibility:
                  monitoringStockpile?.ritageSamples?.data &&
                  monitoringStockpile?.ritageSamples?.data.length > 0
                    ? 'unset'
                    : 'hidden',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: 16,
                fontWeight: 400,
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
                accessor: 'sampleType',
                title: t('commonTypography.sampleType'),
                width: 250,
                render: ({ sampleType }) => sampleType.name ?? '-',
                footer: <Text>Total Rata-Rata Kadar</Text>,
              },
              {
                accessor: 'sampleNumber',
                title: t('commonTypography.sampleNumber'),
                render: ({ sampleNumber }) => sampleNumber,
              },
              {
                accessor: 'sampleDate',
                title: t('commonTypography.sampleDate'),
                render: ({ sampleDate }) => formatDate(sampleDate) ?? '-',
              },
              ...(renderOtherRitageSampleColumn ?? []),
            ],
            horizontalSpacing: 15,
            highlightOnHover: false,
            withBorder: false,
            shadow: 'none',
            minHeight:
              monitoringStockpile?.ritageSamples?.data &&
              monitoringStockpile?.ritageSamples?.data.length > 0
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

export default DetailSampleData;
