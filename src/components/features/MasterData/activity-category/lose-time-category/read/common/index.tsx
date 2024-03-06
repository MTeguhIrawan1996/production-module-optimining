import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadLoseTimeCategoryBook from '@/components/features/MasterData/activity-category/lose-time-category/read/common/sections/ReadLoseTimeCategoryBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadLoseTimeCategoryPage = () => {
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
        path: '/master-data/activity-category?tab=lose-time-category',
      },
      {
        label: t('activityCategory.readLoseTimeCategory'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadLoseTimeCategoryBook tab="lose-time-category" />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadLoseTimeCategoryPage;
