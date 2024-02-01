import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalTabs } from '@/components/elements';
import UnitCapacityPlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/UnitCapacityPlanData';

import { useReadOneUnitCapacityPlan } from '@/services/graphql/query/plan/weekly/useReadOneUnitCapacityPlan';

const ReadWeeklyPlanGroupBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;

  const {
    weeklyUnitCapacityPlanData,
    weeklyUnitCapacityPlanMeta,
    weeklyUnitCapacityPlanDataLoading,
  } = useReadOneUnitCapacityPlan({
    variables: {
      weeklyPlanId: id,
      limit: 10,
    },
    skip: tabs !== 'unitCapacityPlan',
  });

  const handleChangeTab = (tabs: TabsValue) => {
    const url = `/plan/weekly/read/weekly-plan-group/${id}?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <DashboardCard
      isLoading={weeklyUnitCapacityPlanDataLoading}
      title={t('weeklyPlan.title2')}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      paperStackProps={{
        spacing: 'sm',
      }}
      enebleBackBottomOuter={{
        onClick: () => router.push(`/plan/weekly/read/${id}`),
      }}
      updateButton={{
        label: 'Edit',
        onClick: () =>
          router.push(
            `/plan/weekly/update/weekly-plan-group/${id}?tabs=${tabs}`
          ),
      }}
    >
      <GlobalTabs
        tabs={{
          value: tabs,
          onTabChange: (value) => handleChangeTab(value),
        }}
        tabsData={[
          {
            label: t('commonTypography.unitCapacityPlan'),
            value: 'unitCapacityPlan',
            component: (
              <UnitCapacityPlanData
                data={weeklyUnitCapacityPlanData}
                id={id}
                tabs={tabs}
                meta={weeklyUnitCapacityPlanMeta}
              />
            ),
            isShowItem: true,
          },
        ]}
      />
    </DashboardCard>
  );
};

export default ReadWeeklyPlanGroupBook;
