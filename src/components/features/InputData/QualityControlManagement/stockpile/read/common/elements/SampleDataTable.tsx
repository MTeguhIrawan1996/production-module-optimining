import { Stack, Text, useMantineTheme } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import {
  ISampleDataStockpileMonitoring,
  useReadOneStockpileMonitoringSample,
} from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoringSample';
import { formatDate } from '@/utils/helper/dateFormat';

import { IElementsData } from '@/types/global';

type IProps = {
  elementsData?: IElementsData[];
};

const SampleDataTable = ({ elementsData }: IProps) => {
  const router = useRouter();
  const id = router.query.id as string;
  const theme = useMantineTheme();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);

  const { monitoringStockpileSamples, monitoringStockpileSamplesLoading } =
    useReadOneStockpileMonitoringSample({
      variables: {
        id: id,
        limit: 10,
        orderBy: null,
        orderDir: null,
        page: page,
      },
      skip: !router.isReady,
    });

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<ISampleDataStockpileMonitoring> = {
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

  const renderOtherColumn = elementsData?.map(renderOtherColumnCallback);
  return (
    <Stack spacing="sm" mt="sm">
      <Text fz={24} fw={600} color="brand">
        {t('commonTypography.stockpileSample')}
      </Text>
      <MantineDataTable
        tableProps={{
          records: monitoringStockpileSamples?.data ?? [],
          fetching: monitoringStockpileSamplesLoading,
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
              render: ({ sampleType }) => sampleType.name ?? '-',
            },
            {
              accessor: 'sampleNumber',
              title: t('commonTypography.sampleNumber'),
              render: ({ sampleNumber }) => sampleNumber ?? '-',
            },
            {
              accessor: 'sampleDate',
              title: t('commonTypography.sampleDate'),
              render: ({ sampleDate }) => formatDate(sampleDate) ?? '-',
            },
            ...(renderOtherColumn ?? []),
          ],
          horizontalSpacing: 15,
          highlightOnHover: false,
          withBorder: false,
          shadow: 'none',
          minHeight:
            monitoringStockpileSamples?.data &&
            monitoringStockpileSamples?.data?.length > 0
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
          totalAllData: monitoringStockpileSamples?.meta.totalAllData || 0,
          totalData: monitoringStockpileSamples?.meta.totalData || 0,
          totalPage: monitoringStockpileSamples?.meta.totalPage || 0,
        }}
      />
    </Stack>
  );
};

export default SampleDataTable;
