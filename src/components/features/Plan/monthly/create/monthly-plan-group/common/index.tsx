import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  GlobalTabs,
  InnerWrapper,
  MutationMonthlyHeavyEquipmentAvailabilityPlanBook,
  MutationMonthlyHeavyEquipmentReqPlanBook,
  MutationMonthlyMiningMapPlanBook,
  MutationMonthlyProductionTargetPlanBook,
  MutationMonthlyUnitCapacityPlanBook,
  MutationMonthlyWorkTimePlanBook,
  RootWrapper,
} from '@/components/elements';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateMonthlyPlanGroupPage = () => {
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
          label: t('monthlyPlan.title'),
          path: '/plan/monthly',
        },
        {
          label: t(`commonTypography.${tabs}`),
          path: router.asPath,
        },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    const url = `/plan/monthly/create/monthly-plan-group/${id}?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('monthlyPlan.formCreate'), mb: 'xs' }}
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
                <MutationMonthlyWorkTimePlanBook
                  mutationSuccessMassage={t(
                    'monthlyPlan.successCreateWorkTimePlanMessage'
                  )}
                  mutationType="create"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.unitCapacityPlan'),
              value: 'unitCapacityPlan',
              component: (
                <MutationMonthlyUnitCapacityPlanBook
                  mutationSuccessMassage={t(
                    'monthlyPlan.successCreateUnitCapacityPlanMessage'
                  )}
                  mutationType="create"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.heavyEquipmentReqPlan'),
              value: 'heavyEquipmentReqPlan',
              component: (
                <MutationMonthlyHeavyEquipmentReqPlanBook
                  mutationSuccessMassage={t(
                    'monthlyPlan.successCreateHeavyEquipmentReqPlanMessage'
                  )}
                  mutationType="create"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.heavyEquipmentAvailabilityPlan'),
              value: 'heavyEquipmentAvailabilityPlan',
              component: (
                <MutationMonthlyHeavyEquipmentAvailabilityPlanBook
                  mutationSuccessMassage={t(
                    'monthlyPlan.successCreateHeavyEquipmentAvailabilityPlanMessage'
                  )}
                  mutationType="create"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.productionTargetPlan'),
              value: 'productionTargetPlan',
              component: (
                <MutationMonthlyProductionTargetPlanBook
                  mutationSuccessMassage={t(
                    'monthlyPlan.successCreateProductionTargetPlanMessage'
                  )}
                  mutationType="create"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.miningMapPlan'),
              value: 'miningMapPlan',
              component: (
                <MutationMonthlyMiningMapPlanBook
                  mutationSuccessMassage={t(
                    'monthlyPlan.successCreateMiningMapPlanMessage'
                  )}
                  mutationType="create"
                />
              ),
              isShowItem: true,
            },
            {
              label: t('commonTypography.bargingTargetPlan'),
              value: 'bargingTargetPlan',
              component: (
                // <MutationBargingTargetPlanBook
                //   mutationSuccessMassage={t(
                //     'monthlyPlan.successCreateBargingTargetPlanMessage'
                //   )}
                //   mutationType="create"
                // />
                <div className="">Barging Target Plan</div>
              ),
              isShowItem: true,
            },
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateMonthlyPlanGroupPage;
