import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadHeavyEquipmentFormulaBook from '@/components/features/MasterData/activity-category/heavy-equipment-formula/read/common/sections/ReadHeavyEquipmentFormulaBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadHeavyEquipmentFormulaPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.activityCategory'),
        path: '/master-data/activity-category?tab=heavy-equipment-formula',
      },
      {
        label: t('activityCategory.readHeavyEquipmentFormula'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadHeavyEquipmentFormulaBook tab="heavy-equipment-formula" />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadHeavyEquipmentFormulaPage;
