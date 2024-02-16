import { Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumn, DataTableColumnGroup } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, MantineDataTable } from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IReadOneBargingDomePlanData,
  IReadOneBargingtargetPlanData,
  IReadOneWeeklyBargingTargetData,
  useReadOneBargingTargetPlan,
} from '@/services/graphql/query/plan/weekly/barging-target-plan/useReadOneBargingTargetPlan';

import { IElementsData } from '@/types/global';

dayjs.extend(isoWeek);

const BargingTargetPlanData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const page = Number(router.query.page) || 1;

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    skip: tabs !== 'bargingTargetPlan',
  });

  const { weeklyBargingTargetPlanData, weeklyBargingTargetPlanDataLoading } =
    useReadOneBargingTargetPlan({
      variables: {
        weeklyPlanId: id,
      },
      skip: !router.isReady || tabs !== 'bargingTargetPlan',
    });

  const renderOtherGroupCallback = React.useCallback(
    (obj: IReadOneWeeklyBargingTargetData) => {
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

  const renderOtherGroup =
    weeklyBargingTargetPlanData?.bargingTargetPlans[0].weeklyBargingTargets.map(
      renderOtherGroupCallback
    );

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
    const urlSet = `/plan/weekly/read/weekly-plan-group/${id}?tabs=${tabs}&page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  return (
    <>
      <WeeklyPlanInformationData />
      <DashboardCard p={0} isLoading={weeklyBargingTargetPlanDataLoading}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.bargingTargetPlan')}
          </Text>
          <MantineDataTable
            tableProps={{
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
          />
        </Stack>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.inputGroupDomeLabel')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: weeklyBargingTargetPlanData?.bargingDomePlans.data || [],
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
