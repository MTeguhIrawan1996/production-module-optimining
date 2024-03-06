import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import UpdateWeeklyPlanBook from '@/components/features/Plan/weekly/update/common/sections/UpdateWeeklyPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const UpdateWeeklyPlanPage = () => {
  const router = useRouter();
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
        label: t('weeklyPlan.update'),
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper titleProps={{ title: t('weeklyPlan.title2'), mb: 'xs' }}>
        <UpdateWeeklyPlanBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default UpdateWeeklyPlanPage;
