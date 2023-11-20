import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ReadActivityPlanBook from '@/components/features/MasterData/activity-plan/read/common/sections/ReadActivityPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ReadActivityPlanPage = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [setBreadcrumbs] = useBreadcrumbs(
    (state) => [state.setBreadcrumbs],
    shallow
  );

  React.useEffect(() => {
    setBreadcrumbs([
      {
        label: t('commonTypography.activityPlan'),
        path: '/master-data/activity-plan',
      },
      {
        label: t('activityPlan.readActivityPlan'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper>
        <ReadActivityPlanBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ReadActivityPlanPage;
