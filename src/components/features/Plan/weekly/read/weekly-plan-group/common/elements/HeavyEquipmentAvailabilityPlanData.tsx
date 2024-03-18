import { Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, MantineDataTable } from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import { useReadOneHeavyEquipmentAvailabilityPlan } from '@/services/graphql/query/plan/weekly/heavy-equipment-availability-plan.ts/useReadOneHeavyEquipmentAvailabilityPlan';

const HeavyEquipmentAvailabilityPlanData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [tabs] = useQueryState('tabs');
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );

  const {
    weeklyHeavyEquipmentAvailabilityPlanData: data,
    weeklyHeavyEquipmentReqPlanMeta: meta,
    weeklyHeavyEquipmentAvailabilityPlanDataLoading,
  } = useReadOneHeavyEquipmentAvailabilityPlan({
    variables: {
      weeklyPlanId: id,
      limit: null,
    },
    skip: !router.isReady || tabs !== 'heavyEquipmentAvailabilityPlan',
  });

  const handleSetPage = (page: number) => {
    setPage(page, {
      shallow: true,
    });
  };

  return (
    <>
      <WeeklyPlanInformationData />
      <DashboardCard p={0}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.heavyEquipmentAvailabilityPlanInformation')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: data ?? [],
              fetching: weeklyHeavyEquipmentAvailabilityPlanDataLoading,
              columns: [
                {
                  accessor: 'heavyEquipmentClass',
                  title: t('commonTypography.heavyEquipmentClass'),
                  render: ({ class: classHeavyEquipment }) =>
                    classHeavyEquipment.name ?? '-',
                },
                {
                  accessor: 'totalCount',
                  title: t('commonTypography.totalAvailabilityHeavyEquipment'),
                },
                {
                  accessor: 'damagedCount',
                  title: t('commonTypography.breakdownCount'),
                },
                {
                  accessor: 'withoutOperatorCount',
                  title: t('commonTypography.withoutOperatorCount'),
                },
                {
                  accessor: 'readyCount',
                  title: t('commonTypography.quietNumber'),
                },
                {
                  accessor: 'desc',
                  title: t('commonTypography.desc'),
                },
              ],
              shadow: 'none',
            }}
            emptyStateProps={{
              title: t('commonTypography.dataNotfound'),
            }}
            paginationProps={{
              setPage: handleSetPage,
              currentPage: page,
              totalAllData: meta?.totalAllData ?? 0,
              totalData: meta?.totalData ?? 0,
              totalPage: meta?.totalPage ?? 0,
            }}
          />
        </Stack>
      </DashboardCard>
    </>
  );
};

export default HeavyEquipmentAvailabilityPlanData;
