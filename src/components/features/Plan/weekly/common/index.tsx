import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { InnerWrapper, RootWrapper } from '@/components/elements';
import WeeklyPlanBook from '@/components/features/Plan/weekly/common/sections/WeeklyPlanBook';

import { useBreadcrumbs } from '@/utils/store/useBreadcrumbs';

const WeeklyPlanPage = () => {
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
        path: router.asPath,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <RootWrapper>
      <InnerWrapper
        titleProps={{
          title: t('weeklyPlan.title'),
          mb: 'md',
        }}
      >
        <WeeklyPlanBook />
      </InnerWrapper>
    </RootWrapper>
  );
};

export default WeeklyPlanPage;
