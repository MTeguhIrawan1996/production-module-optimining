import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  GlobalTabs,
  InnerWrapper,
  MutationBargingTargetPlanBook,
  MutationHeavyEquipmentReqPlanBook,
  MutationMiningMapPlanBook,
  MutationProductionTargetPlanBook,
  MutationUnitCapacityPlanBook,
  MutationWorkTimePlanBook,
  RootWrapper,
} from '@/components/elements';
import MutationHeavyEquipmentAvailabilityPlanBook from '@/components/elements/book/weekly-plan/MutationHeavyEquipmentAvailabilityPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateWeeklyPlanGroupPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = (router.query.tabs as string) || '';
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    if (router.isReady)
      setBreadcrumbs([
        {
          label: t('weeklyPlan.title'),
          path: '/plan/weekly',
        },
        {
          label: t('weeklyPlan.update'),
          path: `/plan/weekly/update/${id}`,
        },
        {
          label: t(`commonTypography.${tabs}`),
          path: router.asPath,
        },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    const url = `/plan/weekly/update/weekly-plan-group/${id}?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('weeklyPlan.formCreate'), mb: 'xs' }}
      >
        <GlobalTabs
          tabs={{
            keepMounted: false,
            value: router.query.tabs as string,
            onTabChange: (value) => handleChangeTab(value),
          }}
          tabsData={[
            {
              label: t('commonTypography.workTimePlan'),
              value: 'workTimePlan',
              component: (
                <MutationWorkTimePlanBook
                  mutationSuccessMassage={t(
                    'weeklyPlan.successUpdateWorkTimePlanMessage'
                  )}
                  mutationType="update"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.unitCapacityPlan'),
              value: 'unitCapacityPlan',
              component: (
                <MutationUnitCapacityPlanBook
                  mutationSuccessMassage={t(
                    'weeklyPlan.successUpdateUnitCapacityPlanMessage'
                  )}
                  mutationType="update"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.heavyEquipmentReqPlan'),
              value: 'heavyEquipmentReqPlan',
              component: (
                <MutationHeavyEquipmentReqPlanBook
                  mutationSuccessMassage={t(
                    'weeklyPlan.successUpdateHeavyEquipmentReqPlanMessage'
                  )}
                  mutationType="update"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.heavyEquipmentAvailabilityPlan'),
              value: 'heavyEquipmentAvailabilityPlan',
              component: (
                <MutationHeavyEquipmentAvailabilityPlanBook
                  mutationSuccessMassage={t(
                    'weeklyPlan.successUpdateHeavyEquipmentAvailabilityPlanMessage'
                  )}
                  mutationType="update"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.productionTargetPlan'),
              value: 'productionTargetPlan',
              component: (
                <MutationProductionTargetPlanBook
                  mutationSuccessMassage={t(
                    'weeklyPlan.successUpdateProductionTargetPlanMessage'
                  )}
                  mutationType="update"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.miningMapPlan'),
              value: 'miningMapPlan',
              component: (
                <MutationMiningMapPlanBook
                  mutationSuccessMassage={t(
                    'weeklyPlan.successUpdateMiningMapPlanMessage'
                  )}
                  mutationType="update"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.bargingTargetPlan'),
              value: 'bargingTargetPlan',
              component: (
                <MutationBargingTargetPlanBook
                  mutationSuccessMassage={t(
                    'weeklyPlan.successUpdateBargingTargetPlanMessage'
                  )}
                  mutationType="update"
                />
              ),
              isShowItem: true,
            },
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateWeeklyPlanGroupPage;
