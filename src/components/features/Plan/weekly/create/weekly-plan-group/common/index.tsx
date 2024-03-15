import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
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

import { useRouterReady } from '@/utils/hooks/useRouterReady';
import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateWeeklyPlanGroupPage = () => {
  const router = useRouter();
  const isRouterReady = useRouterReady();
  const [tabs, setTabs] = useQueryState(
    'tabs',
    queryTypes.string.withDefault('workTimePlan')
  );
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
          label: t(`commonTypography.${tabs}`),
          path: router.asPath,
        },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    setTabs(tabs);
  };

  return (
    <RootWrapper>
      {isRouterReady ? (
        <InnerWrapper
          titleProps={{ title: t('weeklyPlan.formCreate'), mb: 'xs' }}
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
                component: (
                  <MutationWorkTimePlanBook
                    mutationSuccessMassage={t(
                      'weeklyPlan.successCreateWorkTimePlanMessage'
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
                  <MutationUnitCapacityPlanBook
                    mutationSuccessMassage={t(
                      'weeklyPlan.successCreateUnitCapacityPlanMessage'
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
                  <MutationHeavyEquipmentReqPlanBook
                    mutationSuccessMassage={t(
                      'weeklyPlan.successCreateHeavyEquipmentReqPlanMessage'
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
                  <MutationHeavyEquipmentAvailabilityPlanBook
                    mutationSuccessMassage={t(
                      'weeklyPlan.successCreateHeavyEquipmentAvailabilityPlanMessage'
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
                  <MutationProductionTargetPlanBook
                    mutationSuccessMassage={t(
                      'weeklyPlan.successCreateProductionTargetPlanMessage'
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
                  <MutationMiningMapPlanBook
                    mutationSuccessMassage={t(
                      'weeklyPlan.successCreateMiningMapPlanMessage'
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
                  <MutationBargingTargetPlanBook
                    mutationSuccessMassage={t(
                      'weeklyPlan.successCreateBargingTargetPlanMessage'
                    )}
                    mutationType="create"
                  />
                ),
                isShowItem: true,
              },
            ]}
          />
        </InnerWrapper>
      ) : null}
    </RootWrapper>
  );
};

export default CreateWeeklyPlanGroupPage;
