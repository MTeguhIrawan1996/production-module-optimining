import { Divider, Stack, useMantineTheme } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IReadOneStockpileMonitoring,
  ISampleReadOneStockpileMonitoring,
} from '@/services/graphql/query/stockpile-monitoring/useReadOneStockpileMonitoring';

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
        render: ({ elements }) => {
          const value = elements?.find(
            (val) => val.element?.name === element.name
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

  return (
    <>
      <Stack spacing="sm" mt="md">
        <MantineDataTable
          tableProps={{
            records: monitoringStockpile?.samples ?? [],
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
                accessor: 'sampleType',
                title: t('commonTypography.sampleType'),
                render: ({ sampleType }) => sampleType.name ?? '-',
              },
              {
                accessor: 'sampleNumber',
                title: t('commonTypography.sampleNumber'),
                render: ({ sampleNumber }) => sampleNumber,
              },
              ...(renderOtherColumn ?? []),
            ],
            horizontalSpacing: 0,
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
    </>
  );
};

export default DetailSampleData;
