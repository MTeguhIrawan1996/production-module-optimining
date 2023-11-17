import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import ActivityPlanBook from '@/components/features/MasterData/activity-plan/common/sections/ActivityPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const ActivityPlanMasterPage = () => {
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
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{ title: t('commonTypography.activityPlan'), mb: 'md' }}
      >
        <ActivityPlanBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default ActivityPlanMasterPage;
