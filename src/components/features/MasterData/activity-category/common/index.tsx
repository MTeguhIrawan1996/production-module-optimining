import { TabsValue } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { GlobalTabs, InnerWrapper, RootWrapper } from '@/components/elements';
import CalculationCategoryBook from '@/components/features/MasterData/activity-category/common/sections/CalculationCategoryBook';
import HeavyEquipmentFormulaBook from '@/components/features/MasterData/activity-category/common/sections/HeavyEquipmentFormulaBook';
import LoseTimeCategoryBook from '@/components/features/MasterData/activity-category/common/sections/LoseTimeCategoryBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ActivityCategoryMasterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  const isPremissionActivityCategory = permissions?.includes(
    'read-working-hour-plan-category'
  );
  const isPremissionHeavyEquipmentFormula = permissions?.includes(
    'read-heavy-equipment-data-formula'
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.activityCategory'),
        path: '/master-data/activity-category',
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleChangeTab = (tabs: TabsValue) => {
    const url = `/master-data/activity-category?tab=${tabs}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.activityCategory'), mb: 'md' }}
      >
        <GlobalTabs
          tabs={{
            keepMounted: false,
            value: router.query.tab as string,
            onTabChange: (value) => handleChangeTab(value),
          }}
          tabsData={[
            {
              label: t('commonTypography.loseTimeCategory'),
              value: 'lose-time-category',
              component: <LoseTimeCategoryBook tab="lose-time-category" />,
              isShowItem: isPremissionActivityCategory,
            },
            {
              label: t('commonTypography.calculationCategory'),
              value: 'calculation-category',
              component: <CalculationCategoryBook tab="calculation-category" />,
              isShowItem: isPremissionActivityCategory,
            },
            {
              label: t('commonTypography.heavyEquipmentFormula'),
              value: 'heavy-equipment-formula',
              component: (
                <HeavyEquipmentFormulaBook tab="heavy-equipment-formula" />
              ),
              isShowItem: isPremissionHeavyEquipmentFormula,
            },
          ]}
        />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ActivityCategoryMasterPage;
