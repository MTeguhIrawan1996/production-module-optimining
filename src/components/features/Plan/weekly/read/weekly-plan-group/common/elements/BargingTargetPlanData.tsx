import { Stack, Text } from '@mantine/core';
import { DataTableColumnGroup } from 'mantine-datatable';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, MantineDataTable } from '@/components/elements';
import WeeklyTableBrgingDome from '@/components/elements/book/weekly-plan/table/WeeklyTableBargingDome';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import { IWeeklyBargingTarget } from '@/services/graphql/mutation/plan/weekly/useCreateBargingTargetPlan';
import {
  IReadOneBargingtargetPlanData,
  useReadOneBargingTargetPlan,
} from '@/services/graphql/query/plan/weekly/barging-target-plan/useReadOneBargingTargetPlan';
import { bargingTarget } from '@/utils/constants/DefaultValues/barging-target-plan';
import dayjs from '@/utils/helper/dayjs.config';

const BargingTargetPlanData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [tabs] = useQueryState('tabs');

  const { weeklyBargingTargetPlanData, weeklyBargingTargetPlanDataLoading } =
    useReadOneBargingTargetPlan({
      variables: {
        weeklyPlanId: id,
      },
      skip: tabs !== 'bargingTargetPlan',
    });

  const renderOtherGroupCallback = React.useCallback(
    (obj: IWeeklyBargingTarget) => {
      const group: DataTableColumnGroup<IReadOneBargingtargetPlanData> = {
        id: `${obj['day']}`,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        style: { textAlign: 'center' },
        columns: [
          {
            accessor: `rate.${obj.day}`,
            title: 'Rate',
            width: 100,
            render: ({ weeklyBargingTargets }) => {
              return `${weeklyBargingTargets[obj.day].rate || '-'}`;
            },
          },
          {
            accessor: `ton.${obj.day}`,
            title: 'Ton',
            width: 100,
            render: ({ weeklyBargingTargets }) => {
              return `${weeklyBargingTargets[obj.day].ton || '-'}`;
            },
          },
        ],
      };
      return group;
    },
    []
  );

  const renderOtherGroup = bargingTarget.map(renderOtherGroupCallback);

  return (
    <>
      <WeeklyPlanInformationData />
      <DashboardCard p={0}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.bargingTargetPlan')}
          </Text>
          <MantineDataTable
            tableProps={{
              fetching: weeklyBargingTargetPlanDataLoading,
              groups: [
                {
                  id: 'material',
                  title: t('commonTypography.material'),
                  style: { textAlign: 'center' },
                  columns: [
                    {
                      accessor: 'material',
                      title: '',
                      width: 200,
                      render: ({ material }) => {
                        return material.name ?? '-';
                      },
                    },
                  ],
                },
                ...(renderOtherGroup ?? []),
              ],
              records: weeklyBargingTargetPlanData?.bargingTargetPlans || [],
              highlightOnHover: false,
              withColumnBorders: true,
            }}
            emptyStateProps={{
              title: t('commonTypography.dataNotfound'),
            }}
          />
        </Stack>
        <WeeklyTableBrgingDome
          labelProps={{
            color: 'brand',
          }}
        />
      </DashboardCard>
    </>
  );
};

export default BargingTargetPlanData;
