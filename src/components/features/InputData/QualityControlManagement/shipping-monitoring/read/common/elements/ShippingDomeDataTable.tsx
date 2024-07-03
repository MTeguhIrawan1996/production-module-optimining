import { Box, Text } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import { Stack } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IShippingMonitoringDomeData,
  useReadOneShippingMonitoringDomeList,
} from '@/services/graphql/query/shipping-monitoring/useReadOneShippingMonitoringDomeList';

const ShippingDomeDataTable = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [otherElements, setOtherElements] = React.useState<
    DataTableColumn<IShippingMonitoringDomeData>[]
  >([]);

  const { monitoringBargingDome, monitoringBargingDomeLoading } =
    useReadOneShippingMonitoringDomeList({
      variables: {
        id,
      },
      skip: !router.isReady,
    });

  useReadAllElementMaster({
    variables: {
      limit: null,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: ({ elements }) => {
      const value = elements.data.map((element) => {
        const column: DataTableColumn<IShippingMonitoringDomeData> = {
          accessor: element.name,
          title: element.name,
          render: ({ monitoringStockpile }) => {
            const output =
              monitoringStockpile.ritageSamples.additional.averageSamples?.find(
                (val) => val.id === element.id
              );
            return output?.value || '-';
          },
        };
        return column;
      });
      setOtherElements(value);
    },
  });

  return (
    <Stack spacing="sm" sx={{ height: 'fit-content' }}>
      <Text fz={24} fw={600} color="brand">
        {t('commonTypography.listDome')} yang dibarging
      </Text>
      <ScrollArea.Autosize
        mah={540}
        offsetScrollbars
        type="always"
        sx={{
          zIndex: 1,
        }}
      >
        <Box sx={{ height: 'fit-content' }}>
          <MantineDataTable
            tableProps={{
              records: monitoringBargingDome ?? [],
              fetching: monitoringBargingDomeLoading,
              columns: [
                {
                  accessor: 'name',
                  title: t('commonTypography.domeName'),
                  textAlignment: 'left',
                },
                {
                  accessor: 'totalRitages',
                  title: 'Total Ritase Barging',
                  textAlignment: 'left',
                },
                {
                  accessor: 'tonRitages',
                  title: 'Ton Ritase Barging',
                  textAlignment: 'left',
                },
                ...(otherElements ?? []),
              ],
              shadow: 'none',
            }}
            emptyStateProps={{
              title: t('commonTypography.dataNotfound'),
            }}
          />
        </Box>
      </ScrollArea.Autosize>
    </Stack>
  );
};

export default ShippingDomeDataTable;
