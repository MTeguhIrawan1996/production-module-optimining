import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadCalculationCategoryBook from '@/components/features/MasterData/activity-category/calculation-category/read/common/sections/ReadCalculationCategoryBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadCalculationCategoryPage = () => {
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
        path: '/master-data/activity-category?tab=calculation-category',
      },
      {
        label: t('activityCategory.readCalculationCategory'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadCalculationCategoryBook tab="calculation-category" />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadCalculationCategoryPage;
