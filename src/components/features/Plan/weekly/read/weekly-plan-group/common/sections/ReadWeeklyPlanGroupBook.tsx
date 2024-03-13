import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import { parseAsString, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalTabs } from '@/components/elements';
import BargingTargetPlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/BargingTargetPlanData';
import HeavyEquipmentAvailabilityPlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/HeavyEquipmentAvailabilityPlanData';
import HeavyEquipmentReqPlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/HeavyEquipmentReqPlanData';
import MiningMapPlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/MiningMapPlanData';
import ProductionTargetPlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/ProductionTargetPlanData';
import UnitCapacityPlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/UnitCapacityPlanData';
import WorkTimePlanData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WorkTimePlanData';

import { useRouterReady } from '@/utils/hooks/useRouterReady';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ReadWeeklyPlanGroupBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const id = router.query.id as string;
  const isRouterReady = useRouterReady();
  const [tabs, setTabs] = useQueryState(
    'tabs',
    parseAsString.withDefault('workTimePlan')
  );
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const isPermissionUpdate = permissions?.includes('update-weekly-plan');

  const handleChangeTab = (tabs: TabsValue) => {
    setTabs(tabs);
  };

  if (!isRouterReady) return null;

  return (
    <DashboardCard
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
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () =>
                router.push(
                  `/plan/weekly/update/weekly-plan-group/${id}?tabs=${tabs}`
                ),
            }
          : undefined
      }
    >
      <GlobalTabs
        tabs={{
          defaultValue: 'workTimePlan',
          keepMounted: false,
          value: tabs,
          onTabChange: (value) => handleChangeTab(value),
        }}
        tabsData={[
          {
            label: t('commonTypography.workTimePlan'),
            value: 'workTimePlan',
            component: <WorkTimePlanData />,
            isShowItem: true,
          },
          {
            label: t('commonTypography.unitCapacityPlan'),
            value: 'unitCapacityPlan',
            component: <UnitCapacityPlanData />,
            isShowItem: true,
          },
          {
            label: t('commonTypography.heavyEquipmentReqPlan'),
            value: 'heavyEquipmentReqPlan',
            component: <HeavyEquipmentReqPlanData />,
            isShowItem: true,
          },
          {
            label: t('commonTypography.heavyEquipmentAvailabilityPlan'),
            value: 'heavyEquipmentAvailabilityPlan',
            component: <HeavyEquipmentAvailabilityPlanData />,
            isShowItem: true,
          },
          {
            label: t('commonTypography.productionTargetPlan'),
            value: 'productionTargetPlan',
            component: <ProductionTargetPlanData />,
            isShowItem: true,
          },
          {
            label: t('commonTypography.miningMapPlan'),
            value: 'miningMapPlan',
            component: <MiningMapPlanData />,
            isShowItem: true,
          },
          {
            label: t('commonTypography.bargingTargetPlan'),
            value: 'bargingTargetPlan',
            component: <BargingTargetPlanData />,
            isShowItem: true,
          },
        ]}
      />
    </DashboardCard>
  );
};

export default ReadWeeklyPlanGroupBook;
