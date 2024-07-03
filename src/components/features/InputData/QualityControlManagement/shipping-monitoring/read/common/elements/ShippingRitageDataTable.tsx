import { Text } from '@mantine/core';
import { Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { MantineDataTable } from '@/components/elements';

import { useReadOneShippingMonitoringBargingRitageList } from '@/services/graphql/query/shipping-monitoring/useReadOneShippingMonitoringBargingRitageList';
import { formatDate } from '@/utils/helper/dateFormat';

const ShippingRitageDataTable = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [page, setPage] = React.useState<number>(1);

  const { monitoringBargingRitage, monitoringBargingRitageLoading } =
    useReadOneShippingMonitoringBargingRitageList({
      variables: {
        id,
        limit: 10,
        page,
        orderBy: null,
        orderDir: null,
      },
      skip: !router.isReady,
    });

  return (
    <Stack spacing="sm" sx={{ height: 'fit-content' }}>
      <Text fz={24} fw={600} color="brand">
        {t('commonTypography.listRitageBarging')}
      </Text>
      <MantineDataTable
        tableProps={{
          records: monitoringBargingRitage?.data || [],
          fetching: monitoringBargingRitageLoading,
          columns: [
            {
              accessor: 'heavyEquipmentCode',
              title: t('commonTypography.heavyEquipmentCode'),
              textAlignment: 'left',
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment.hullNumber || '-',
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              textAlignment: 'left',
              render: ({ date }) => formatDate(date) || '-',
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              textAlignment: 'left',
              render: ({ shift }) => shift.name || '-',
            },
            {
              accessor: 'ton',
              title: 'Ton',
              textAlignment: 'left',
              render: ({ tonByRitage }) => tonByRitage || '-',
            },
          ],
          shadow: 'none',
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
        }}
        paginationProps={{
          setPage: setPage,
          currentPage: page,
          totalAllData: monitoringBargingRitage?.meta.totalAllData || 0,
          totalData: monitoringBargingRitage?.meta.totalData || 0,
          totalPage: monitoringBargingRitage?.meta.totalPage || 0,
        }}
      />
    </Stack>
  );
};

export default ShippingRitageDataTable;
