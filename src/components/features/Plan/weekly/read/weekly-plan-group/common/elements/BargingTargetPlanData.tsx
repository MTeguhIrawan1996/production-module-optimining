import { Stack, Text } from '@mantine/core';
import { DataTableColumn, DataTableColumnGroup } from 'mantine-datatable';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, MantineDataTable } from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import { IWeeklyBargingTarget } from '@/services/graphql/mutation/plan/weekly/useCreateBargingTargetPlan';
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IReadOneBargingDomePlanData,
  IReadOneBargingtargetPlanData,
  useReadOneBargingTargetPlan,
} from '@/services/graphql/query/plan/weekly/barging-target-plan/useReadOneBargingTargetPlan';
import { bargingTarget } from '@/utils/constants/DefaultValues/barging-target-plan';
import dayjs from '@/utils/helper/dayjs.config';

import { IElementsData } from '@/types/global';

const BargingTargetPlanData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [tabs] = useQueryState('tabs');
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    skip: tabs !== 'bargingTargetPlan',
    fetchPolicy: 'cache-and-network',
  });

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

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IReadOneBargingDomePlanData> = {
        accessor: element.name,
        title: element.name,
        render: ({ dome }) => {
          const value =
            dome.monitoringStockpile.ritageSamples.additional.averageSamples?.find(
              (val) => val.element?.id === element.id
            );
          return value?.value ?? '-';
        },
      };
      return column;
    },
    []
  );

  const renderOtherColumn = elementsData?.map(renderOtherColumnCallback);

  const handleSetPage = (page: number) => {
    setPage(page);
  };

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
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.inputGroupDomeLabel')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: weeklyBargingTargetPlanData?.bargingDomePlans.data || [],
              fetching: weeklyBargingTargetPlanDataLoading,
              columns: [
                {
                  accessor: 'index',
                  title: 'No',
                  render: (record) =>
                    weeklyBargingTargetPlanData?.bargingDomePlans.data &&
                    weeklyBargingTargetPlanData?.bargingDomePlans.data.indexOf(
                      record
                    ) + 1,
                  width: 60,
                },
                {
                  accessor: 'stockpile',
                  title: t('commonTypography.stockpile'),
                  render: ({ dome }) => {
                    return dome.stockpile.name ?? '-';
                  },
                },
                {
                  accessor: 'dome',
                  title: t('commonTypography.dome'),
                  render: ({ dome }) => {
                    return dome.name ?? '-';
                  },
                },
                {
                  accessor: 'tonByRitage',
                  title: t('commonTypography.tonByRitage'),
                  render: ({ dome }) => {
                    return dome.monitoringStockpile.tonByRitage ?? '-';
                  },
                },
                {
                  accessor: 'tonBySurvey',
                  title: t('commonTypography.tonBySurvey'),
                  render: ({ dome }) => {
                    return dome.monitoringStockpile.currentTonSurvey ?? '-';
                  },
                },
                ...(renderOtherColumn ?? []),
              ],
            }}
            emptyStateProps={{
              title: t('commonTypography.dataNotfound'),
            }}
            paginationProps={{
              setPage: handleSetPage,
              currentPage: page,
              totalAllData:
                weeklyBargingTargetPlanData?.bargingDomePlans.meta
                  ?.totalAllData ?? 0,
              totalData:
                weeklyBargingTargetPlanData?.bargingDomePlans.meta?.totalData ??
                0,
              totalPage:
                weeklyBargingTargetPlanData?.bargingDomePlans.meta?.totalPage ??
                0,
            }}
          />
        </Stack>
      </DashboardCard>
    </>
  );
};

export default BargingTargetPlanData;
