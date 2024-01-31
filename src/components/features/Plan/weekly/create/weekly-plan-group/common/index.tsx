import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  GlobalTabs,
  InnerWrapper,
  MutationUnitCapacityPlanBook,
  RootWrapper,
} from '@/components/elements';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const CreateWeeklyPlanGroupPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('weeklyPlan.title'),
        path: '/plan/weekly',
      },
      {
        label: t('weeklyPlan.create'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    const url = `/plan/weekly/create/weekly-plan-group/${id}?tabs=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('weeklyPlan.formCreate'), mb: 'xs' }}
      >
        <GlobalTabs
          tabs={{
            value: router.query.tabs as string,
            onTabChange: (value) => handleChangeTab(value),
          }}
          tabsData={[
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
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default CreateWeeklyPlanGroupPage;
