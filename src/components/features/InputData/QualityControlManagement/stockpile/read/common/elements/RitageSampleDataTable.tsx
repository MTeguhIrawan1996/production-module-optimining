import {
  Divider,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import {
  IRitageSampleDataStockpileMonitoring,
  useReadOneStockpileMonitoringRitageSample,
} from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringRItageSample';
import { formatDate } from '@/utils/helper/dateFormat';

import { IElementsData } from '@/types/global';

type IProps = {
  elementsData?: IElementsData[];
};

const RitageSampleDataTable = ({ elementsData }: IProps) => {
  const router = useRouter();
  const id = router.query.id as string;
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);

  const {
    monitoringStockpileSampleRitage,
    monitoringStockpileSampleRitageLoading,
  } = useReadOneStockpileMonitoringRitageSample({
    variables: {
      id: id,
      limit: 10,
      orderBy: null,
      orderDir: null,
      page: page,
    },
    skip: !router.isReady,
  });

  const renderOtherColumnRitageSampleCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IRitageSampleDataStockpileMonitoring> = {
        accessor: element.name,
        title: `${t('commonTypography.rate')} ${element.name}`,
        render: ({ elements }) => {
          const value = elements?.find((val) => val.element?.id === element.id);
          return value?.value ?? '-';
        },
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderOtherRitageSampleColumn = elementsData?.map(
    renderOtherColumnRitageSampleCallback
  );
  return (
    <>
      <Stack spacing="sm" mt="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.sampleByRitage')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: monitoringStockpileSampleRitage?.data ?? [],
            fetching: monitoringStockpileSampleRitageLoading,
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
                  monitoringStockpileSampleRitage?.data &&
                  monitoringStockpileSampleRitage?.data.length > 0
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
                // footer: <Text>Total Rata-Rata Kadar</Text>,
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
              monitoringStockpileSampleRitage?.data &&
              monitoringStockpileSampleRitage?.data.length > 0
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
              monitoringStockpileSampleRitage?.meta.totalAllData || 0,
            totalData: monitoringStockpileSampleRitage?.meta.totalData || 0,
            totalPage: monitoringStockpileSampleRitage?.meta.totalPage || 0,
          }}
        />
      </Stack>
      <Divider my="md" />
      <Stack spacing="sm" mt="sm">
        <Text fz={24} fw={600} color="brand">
          Total Rata-Rata Kadar Sampel Ritase
        </Text>

        <SimpleGrid
          spacing="xs"
          cols={
            monitoringStockpileSampleRitage?.additional.averageSamples.length ||
            5
          }
        >
          {monitoringStockpileSampleRitage?.additional.averageSamples.map(
            (val, index) => {
              return (
                <Stack
                  key={index}
                  spacing={4}
                  align="center"
                  py={4}
                  sx={(theme) => ({
                    border: `2px solid ${theme.colors.gray[3]}`,
                    borderRadius: theme.spacing.xs,
                  })}
                >
                  <Text component="span" fz={16} fw={400} color="gray.6">
                    {val.element.name}
                  </Text>
                  <Text component="span" fz={16} fw={500} color="dark.9">
                    {val.value || '-'}
                  </Text>
                </Stack>
              );
            }
          )}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default RitageSampleDataTable;
